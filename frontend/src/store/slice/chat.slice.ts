import api from "@/api/axiosInstance";
import type {User} from "@/types/userTypes";
import type { ChatState, Message } from "@/types/chatTypes";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: ChatState = {
    selectedUser: null,
    conversationId: null,
    messages: [],
    loadingMessages: false,
    onlineUserIds: [],
    error: null,

};

export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async(receiverId: number, {rejectWithValue}) => {
        try{
            const newConv = await api.post(`/conversations/direct/${receiverId}`);
            const convId = newConv.data?.data?.conversation.id;

            const msgResponse = await api.get(`/conversations/${convId}/messages`);
            const msgList = msgResponse.data?.data || [];
            return {
                conversationId: convId,
                messages: msgList,
            }
        } catch (err: any){
            return rejectWithValue(err.response?.data?.message || "Faled to fecth the messages");
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
            const exists = state.messages.some((m) => m.id === action.payload.id);
            if (!exists) {
                state.messages.push(action.payload);
            }
        },
        setOnlineUsers: (state, action: PayloadAction<number[]>) => {
            state.onlineUserIds = action.payload;
        },
        updateUserStatus: (state, action: PayloadAction<{ userId: number; isOnline: boolean }>) => {
            const { userId, isOnline } = action.payload;
            const targetId = Number(userId);
            if (isOnline) {
                if (!state.onlineUserIds.includes(userId)) {
                    state.onlineUserIds.push(targetId);
                }
            } else {
                state.onlineUserIds = state.onlineUserIds.filter((id) => Number(id) !== userId);
            }
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
},
});

export const { setSelectedUser, appendMessage, setOnlineUsers, updateUserStatus} = chatSlice.actions;
export default chatSlice.reducer;