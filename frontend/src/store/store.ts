import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth.slice";
import userReducer from "./slice/user.slice";
import chatReducer from "./slice/chat.slice";
import channelReducer from "./slice/channel.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        chat: chatReducer,
        channels: channelReducer,

    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;