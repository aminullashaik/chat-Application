import express from "express";
import cors from "cors";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import { AppDataSource } from "./dataSource";
import { Conversation } from "./entities/Conversation";
import { Message } from "./entities/Message";
import { JWT_SECRET, AuthUser } from "./middleware/auth.middleware";

import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import conversationRoutes from "./routes/conversation.routes";
import messageRoutes from "./routes/message.routes";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

const PORT = 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/conversations", messageRoutes);

// Socket Authentication
io.use((socket, next) => {
  try {
    const authHeader = socket.handshake.headers.authorization;
    const rawToken = socket.handshake.auth?.token || authHeader;

    if (!rawToken) return next(new Error("Unauthorized"));

    // Strip "Bearer " if present, whether sent via auth or headers
    const token = rawToken.startsWith("Bearer ")
      ? rawToken.split(" ")[1]
      : rawToken;

    socket.data.user = jwt.verify(token, JWT_SECRET) as AuthUser;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

// Socket Events
io.on("connection", (socket) => {
  const userId = socket.data.user.id;
  console.log(`User ${userId} connected`);

  // Join Conversation
  socket.on("join_conversation", async (conversationId) => {
    try {
      const id = Number(typeof conversationId === 'object' ? conversationId.conversationId : conversationId);
      const conversation = await AppDataSource
        .getRepository(Conversation)
        .findOne({ where: { id } });

      console.log("convo id:", id);
      console.log("Loggied-in-user:", userId);
      console.log("conversation:", conversation);

      if (conversation) {
        console.log("User One Id:", conversation?.userOneId);
        console.log("User two id: ", conversation?.userTwoId);
      
      }

      if (
        !conversation ||
        (conversation.userOneId !== userId &&
          conversation.userTwoId !== userId)
      ) {
        return socket.emit("error_message", {
          message: "Invalid conversation or unauthorized",
        });
      }

      await socket.join(`conversation_${id}`);
      socket.emit("joined_conversation", { conversationId: id });
    } catch {
      socket.emit("error_message", { message: "Failed to join" });
    }
  });

  // Send Message
  socket.on("send_message", async (data) => {
    try {
      const conversationId = Number(data?.conversationId);
      const content = typeof data?.content === "string"
        ? data.content.trim()
        : "";

      if (!Number.isInteger(conversationId) || conversationId <= 0 || !content) {
        return socket.emit("error_message", {
          message: "Invalid message data",
        });
      }

      const conversation = await AppDataSource
        .getRepository(Conversation)
        .findOne({ where: { id: conversationId } });

      if (
        !conversation ||
        (conversation.userOneId !== userId &&
          conversation.userTwoId !== userId)
      ) {
        return socket.emit("error_message", {
          message: "Unauthorized conversation",
        });
      }

      const messageRepo = AppDataSource.getRepository(Message);
      const saved = await messageRepo.save(
        messageRepo.create({
          content,
          conversation: { id: conversationId },
          user: { id: userId },
        })
      );

      io.to(`conversation_${conversationId}`).emit("receive_message", {
        id: saved.id,
        conversationId,
        senderId: userId,
        content: saved.content,
        createdAt: saved.createdAt,
      });
    } catch {
      socket.emit("error_message", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
  });
});

// Start Server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    server.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(console.error);