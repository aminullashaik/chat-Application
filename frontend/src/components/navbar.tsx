import React, { useState } from "react";
import { Search } from "lucide-react";

export const Navbar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="h-11 border-b border-slate-200/80 bg-white px-4 flex items-center justify-center sticky top-0 z-30">
            {/* ONLY Thin Search Bar */}
            <div className="w-full max-w-lg relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search names, messages...."
                    className="w-full h-7 pl-8 pr-3 text-xs bg-slate-100 hover:bg-slate-100/90 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>
        </header>
    );
};