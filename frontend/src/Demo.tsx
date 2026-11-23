import api from "@/api/axiosInstance";
import type { 
  Channel, 
  ChannelMessage, 
  CreateChannelPayload 
} from "@/types/channelTypes";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ChannelState {
  channels: Channel[];
  selectedChannel: Channel | null;
  messages: ChannelMessage[];
  loadingChannels: boolean;
  loadingMessages: boolean;
  error: string | null;
}

const initialState: ChannelState = {
  channels: [],
  selectedChannel: null,
  messages: [],
  loadingChannels: false,
  loadingMessages: false,
  error: null,
};

// 1. Fetch all channels
export const fetchChannels = createAsyncThunk(
  "channels/fetchChannels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/channels");
      const list = response.data?.data?.channels || response.data?.data || response.data || [];
      return list as Channel[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch channels");
    }
  }
);

// 2. Create a new channel
export const createChannelThunk = createAsyncThunk(
  "channels/createChannel",
  async (payload: CreateChannelPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/channels", payload);
      const newChannel = response.data?.data?.channel || response.data?.data || response.data;
      return newChannel as Channel;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create channel");
    }
  }
);

// 3. Fetch messages for a specific channel
export const fetchChannelMessages = createAsyncThunk(
  "channels/fetchChannelMessages",
  async (channelId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/channels/${channelId}/messages`);
      const msgList = response.data?.data?.messages || response.data?.data || response.data || [];
      return msgList as ChannelMessage[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch channel messages");
    }
  }
);

export const channelSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    // Select an active channel
    setSelectedChannel: (state, action: PayloadAction<Channel | null>) => {
      state.selectedChannel = action.payload;
      state.messages = []; // Clear previous channel's messages
      state.error = null;
    },

    // Receive incoming real-time socket message
    appendChannelMessage: (state, action: PayloadAction<ChannelMessage>) => {
      // Guard against duplicate messages
      const exists = state.messages.some((m) => m.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // --- Fetch Channels ---
      .addCase(fetchChannels.pending, (state) => {
        state.loadingChannels = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loadingChannels = false;
        state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loadingChannels = false;
        state.error = action.payload as string;
      })

      // --- Create Channel ---
      .addCase(createChannelThunk.fulfilled, (state, action) => {
        state.channels.push(action.payload);
        state.selectedChannel = action.payload; // Automatically select newly created channel
      })

      // --- Fetch Messages ---
      .addCase(fetchChannelMessages.pending, (state) => {
        state.loadingMessages = true;
      })
      .addCase(fetchChannelMessages.fulfilled, (state, action) => {
        state.loadingMessages = false;
        state.messages = action.payload;
      })
      .addCase(fetchChannelMessages.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedChannel, appendChannelMessage } = channelSlice.actions;
export default channelSlice.reducer;