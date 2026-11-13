import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChannelSidebar from "@/components/ChannelSidebar";
import WorkspaceSidebar from "@/components/MiniSidebar";

export default function HomePage() {
    const navigate = useNavigate();

    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const user = savedUser ? JSON.parse(savedUser) : null;

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

            <div className="bg-white border w-265 border-slate-200/90 p-30 text-center shadow-lg ">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 shadow-xs">
                    <MessageSquare className="w-7 h-7" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100/80">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Ready to Connect
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                    Welcome, {user?.name || "Darling"}!
                </h1>

                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    You are signed in as a <strong className="text-indigo-600">{user?.role || "Member"}</strong>.
                    Now you can start your conversation with your team.
                </p>

                <Button
                    onClick={() => navigate("/users")}
                    className="w-fit h-10 ml-80 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                    <span>Start Conversation</span>
                    <Link to="/users" className="font-semibold text-indigo-600 hover:underline">
                    </Link>
                    <ArrowRight className="w-4 h-4" />

                </Button>

            </div>
        </div>
        </div>
    );
}