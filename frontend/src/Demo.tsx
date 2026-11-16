import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";
import type { ChatState, Message, SendMessagePayload } from "@/types/chatTypes";
import type { User } from "@/types/userTypes";

const initialState: ChatState = {
  selectedUser: null,
  messages: [],
  loadingMessages: false,
  sendingMessage: false,
  onlineUserIds: [],
  error: null,
};

// 1. Fetch chat history
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/messages/${userId}`);
      return res.data.messages ?? res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load messages");
    }
  }
);

// 2. Send message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ receiverId, content }: SendMessagePayload, { rejectWithValue }) => {
    try {
      const res = await api.post(`/messages/send/${receiverId}`, { content });
      return res.data.message ?? res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to send message");
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
      state.messages = [];
    },
    appendMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setOnlineUsers: (state, action: PayloadAction<number[]>) => {
      state.onlineUserIds = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loadingMessages = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.loadingMessages = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.messages.push(action.payload);
      });
  },
});

export const { setSelectedUser, appendMessage, setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;