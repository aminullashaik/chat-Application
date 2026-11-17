import api from "@/api/axiosInstance";
import type {User} from "@/types/userTypes";
import type { ChatState, Message, SendMessagePayload } from "@/types/chatTypes";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: ChatState = {
    selectedUser: null,
    conversationId: null,
    messages: [],
    loadingMessages: false,
    sendingMessage: false,
    onlineUserIds: [],
    error: null,

};

export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async(receiverId: number, {rejectWithValue}) => {
        try{
            const newConv = await api.post(`/conversations/direct/${receiverId}`);
            const convId = newConv.data.data.conversation.id;

            const msgResponse = await api.get(`/conversations/${convId}/messages`);
            const msgList = msgResponse.data.data || [];
            return {
                conversationId: convId,
                messages: msgList,
            }
        } catch (err: any){
            return rejectWithValue(err.response?.data?.message || "Faled to fecth the messages");
        }
    }
);

export const sendMessage = createAsyncThunk(
    "chat/sendMessages",
    async ({ conversationId, content} : SendMessagePayload, {rejectWithValue}) => {
        try{
            const res = await api.post(`/conversations/${conversationId}/messages`, { content});
            return res.data.data;
        } catch (err: any){
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
            state.conversationId = null;
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
    .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loadingMessages = false;
        state.conversationId = action.payload.conversationId;
        state.messages = action.payload.messages;
    })
    .addCase(fetchMessages.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload as string;
    })
    .addCase(sendMessage.fulfilled, (_state, _action) => {
    });
},
});

export const { setSelectedUser, appendMessage, setOnlineUsers} = chatSlice.actions;
export default chatSlice.reducer;