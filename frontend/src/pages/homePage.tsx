import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/navbar";
import ChannelSidebar from "@/components/ChannelSidebar";
import WorkspaceSidebar from "@/components/MiniSidebar";
import ChatArea from "@/components/ChatArea";

export default function HomePage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

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