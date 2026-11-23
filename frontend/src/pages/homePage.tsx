import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import ChannelSidebar from "@/components/ChannelSidebar";

import WorkspaceSidebar from "@/components/MiniSidebar";
import ChatArea from "@/components/ChatArea";
import { connectSocket } from "@/services/socketServices";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setOnlineUsers, updateUserStatus } from "@/store/slice/chat.slice";

export default function HomePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const token = sessionStorage.getItem("token");
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        const socket = connectSocket();
        const handleInitialOnlineUsers = (userIds: number[]) => {
            dispatch(setOnlineUsers(userIds));
        };

        const handleUserStatusChange = (data: { userId: number; isOnline: boolean }) => {
            dispatch(updateUserStatus(data));
        };
        socket.on("initial_online_users", handleInitialOnlineUsers);
        socket.on("user_status_change", handleUserStatusChange);
        return () => {
            socket.off("initial_online_users", handleInitialOnlineUsers);
            socket.off("user_status_change", handleUserStatusChange);
        };
    }, [token, navigate, dispatch]);

    if (!token) return null;

    return (
        <div className="flex h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <Navbar />

            <div className="flex flex-1 overflow-hidden">
            <div className="flex w-fit overflow-hidden">
            <WorkspaceSidebar />
            <ChannelSidebar />
            </div>
            <ChatArea/>
        </div>
        </div>
    );
}