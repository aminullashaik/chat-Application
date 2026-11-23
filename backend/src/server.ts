import express from "express";
import cors from "cors";
import http from "http";

import { AppDataSource } from "./dataSource";
import { config } from "./config/env";
import { initSocketServer } from "./sockets";

import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import conversationRoutes from "./routes/conversation.routes";
import messageRoutes from "./routes/message.routes";

const app = express();
const server = http.createServer(app); //wraps the express app with http server

app.use(express.json());
app.use(cors({ origin: config.clientUrl , credentials: true })); //telling express to accept requests only from specfic frontend

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/conversations", messageRoutes);

initSocketServer(server)

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    server.listen(config.port, () => console.log(`Server running on ${config.port}`));
  })
  .catch(console.error);