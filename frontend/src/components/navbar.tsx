import React, { useState } from "react";
import { Search, LogOut, MessageSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store/store";
import { logout } from "@/store/slice/auth.slice";
import { disconnectSocket } from "@/services/socketServices";
import { Button } from "@/components/ui/button";

export const Navbar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const currentUser = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        disconnectSocket();
        navigate("/login");
    };

    return (
        <header className="h-12 border-b border-slate-700/60 bg-slate-900 px-4 flex items-center justify-between sticky top-0 z-30 text-slate-200">
            <div className="flex items-center gap-2 min-w-48">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                    <MessageSquare className="h-4 w-4" />
                </div>
                <span className="font-bold text-sm tracking-tight text-white">ChatApp</span>
            </div>

            <div className="w-full max-w-md relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages, teammates..."
                    className="w-full h-8 pl-8 pr-3 text-xs bg-slate-800 hover:bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-400 focus:outline-none focus:bg-slate-800 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
            </div>

            <div className="flex items-center gap-3 min-w-48 justify-end">
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
                        {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-xs font-medium text-slate-300 hidden sm:inline">
                        {currentUser?.name || "User"}
                    </span>
                </div>

                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2.5 text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800 gap-1.5 cursor-pointer"
                    title="Log out"
                >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                </Button>
            </div>
        </header>
    );
};