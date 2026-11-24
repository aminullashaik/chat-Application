import { createChannel, getChannelMessages, getChannels } from "@/services/channelServices";
import type { Channel, ChannelMessage, CreateChannelPayload } from "@/types/channelTypes";
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

export const fetchChannels = createAsyncThunk(
    "channels/fetchChannels",
    async(_, {rejectWithValue}) => {
        try {
            const data = await getChannels();
            return data;
        } catch (err: any){
            return rejectWithValue(err.response?.data?.message || "Failed to fetch");
        }
    }
);

export const createChannelThunk = createAsyncThunk(
    "channels/createChannel",
    async (payload: CreateChannelPayload, {rejectWithValue}) => {
        try {
            const newChannel = await createChannel(payload);
            return newChannel;
        } catch (err: any){
            return rejectWithValue(err.response?.data?.message || "Failed to create channel");
        }
    }
);

export const fetchChannelMessages = createAsyncThunk(
    "channels/fetchChannelMessages",
    async (channelId: number, {rejectWithValue}) => {
        try {
            const messages = await getChannelMessages(channelId);
            return messages;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch channel msgs");
        }
    }
);

export const channelSlice = createSlice({
    name: "channels",
    initialState,
    reducers: {
    setSelectedChannel: (state, action: PayloadAction<Channel | null>) => {
      state.selectedChannel = action.payload;
      state.messages = [];
      state.error = null;
    },

    //message receiver for Sockets
    appendChannelMessage: (state, action: PayloadAction<ChannelMessage>) => {
      const exists = state.messages.some((m) => m.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
  },

extraReducers: (builder) => {
    builder
    .addCase(fetchChannels.pending, (state) => {
        state.loadingChannels = true;
        state.error = null;
    })
    .addCase(fetchChannels.fulfilled,(state,action) => {
        state.loadingChannels = false;
        state.channels = action.payload;
    })
    .addCase(fetchChannels.rejected,(state, action) =>{
        state.loadingChannels = false;
        state.error = action.payload as string;
    })
    .addCase(createChannelThunk.fulfilled,(state, action) => {
        state.channels.push(action.payload);
        state.selectedChannel = action.payload;
    })
    .addCase(fetchChannelMessages.pending, (state) => {
        state.loadingMessages = true;
        state.error = null;
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