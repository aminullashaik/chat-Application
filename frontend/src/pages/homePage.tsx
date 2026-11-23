import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import ChannelSidebar from "@/components/ChannelSidebar";
import WorkspaceSidebar from "@/components/MiniSidebar";
import ChatArea from "@/components/ChatArea";
import { connectSocket } from "@/services/socketServices";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setOnlineUsers, updateUserStatus } from "@/store/slice/chat.slice";
import type { Channel } from "@/types/channelTypes";

export default function HomePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const token = sessionStorage.getItem("token");

    const selectedUser = useSelector((state: RootState) => state.chat.selectedUser);    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
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
            <ChannelSidebar
            selectedChannel={selectedChannel}
            onSelectChannel={(ch) => {
              setSelectedChannel(ch);
            }}
          />
            </div>
            
            <ChatArea/>
        </div>
        </div>
    );
}