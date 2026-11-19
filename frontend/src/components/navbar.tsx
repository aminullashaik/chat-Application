import React, { useEffect, useRef, useState } from "react";
import { Search, LogOut, MessageSquare, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store/store";
import { logout } from "@/store/slice/auth.slice";
import { disconnectSocket } from "@/services/socketServices";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/userTypes";
import { fetchMessages, setSelectedUser } from "@/store/slice/chat.slice";

export const Navbar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const currentUser = useSelector((state: RootState) => state.auth.user);
    const { users = []} = useSelector((state: RootState) => state.users || {});

    const filterUser = users.filter((u) => {
        if(u.id === currentUser?.id) return false;
        const q = searchQuery.toLowerCase().trim();
        if(!q) return false;
        return (
            u.name?.toLowerCase().includes(q)
        );
    });

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[]);

    const handleSelectUser = (user: User)=> {
        dispatch(setSelectedUser(user));
        dispatch(fetchMessages(user.id));
        setSearchQuery("");
        setIsOpen(false);
    };

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

            <div ref={searchRef} className="w-full max-w-md relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    placeholder="Search users..."
                    className="w-full h-8 pl-8 pr-3 text-xs bg-slate-800 hover:bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-400 focus:outline-none focus:bg-slate-800 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                {searchQuery && (
                    <button
                    onClick={() => {
                        setSearchQuery("");
                        setIsOpen(false);
                    }}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-200">
                        <X className="h-3 w-3"/>
                    </button>
                )}

                {isOpen && searchQuery.trim() && (
                    <div className="absolute top-10 left-0 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-700/50">
                        Users ({filterUser.length})
                        </div>

                        <div className="max-h-60 overflow-y-auto divide-y divide-slate-700/30">
                        {filterUser.length === 0 ? (
                            <div className="px-4 py-6 text-center text-xs text-slate-400">
                                Match not found "{searchQuery}"
                            </div>
                        ) :(
                            filterUser.map((user) => (
                                <button
                                key={user.id}
                                onClick={() => handleSelectUser(user)}
                                className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-slate-700/60 transition-colors text-left cursor-pointer group"
                                >
                                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 font-bold text-white text-[11px] shrink-0">
                                            {user.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                                            {user.name}
                                        </span>
                                    </button>
                                ))
                        )}
                        </div>
                    </div>
                )}
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