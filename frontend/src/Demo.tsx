import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchUsers } from "@/store/slice/user.slice";
import { setSelectedUser, fetchMessages } from "@/store/slice/chat.slice";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Hash, 
  ChevronDown, 
  MessageSquare, 
  Plus, 
  Search, 
  AtSign,
  Bookmark,
  FileText
} from "lucide-react";

// Mock public channels (for UI display)
const CHANNELS = [
  { id: "c1", name: "general" },
  { id: "c2", name: "announcements" },
  { id: "c3", name: "project-chat-app" },
  { id: "c4", name: "random" },
];

export default function ChannelSidebar() {
  const dispatch = useDispatch<AppDispatch>();

  // 1. Get logged-in user from auth slice
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // 2. Get list of all team members from user slice
  const { users = [] } = useSelector((state: RootState) => state.users || {});

  // 3. Get currently selected user and online user IDs from chat slice
  const { selectedUser, onlineUserIds = [] } = useSelector(
    (state: RootState) => state.chat
  );

  // Accordion state
  const [isChannelsOpen, setIsChannelsOpen] = useState(true);
  const [isDmsOpen, setIsDmsOpen] = useState(true);
  const [activeChannelId, setActiveChannelId] = useState("c1");

  // Fetch team members on mount if not already loaded
  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-800 text-slate-300 border-r border-slate-700 dark:bg-slate-900 dark:border-slate-800">
      
      {/* --- WORKSPACE TITLE HEADER --- */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors">
        <div className="flex flex-col min-w-0">
          <h1 className="text-[15px] font-bold text-white truncate flex items-center gap-1.5">
            Acme Corporation
            <ChevronDown className="h-3.5 w-3.5 opacity-80 shrink-0" />
          </h1>
          <span className="text-xs text-slate-400 truncate flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {currentUser?.name || "Member"} (You)
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* --- MAIN SCROLLABLE BODY --- */}
      <ScrollArea className="flex-1 px-2 pt-3">
        
        {/* Navigation Quick Links */}
        <div className="space-y-0.5 mb-5">
          <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-slate-700/50 hover:text-white transition-colors">
            <MessageSquare className="h-4 w-4 text-slate-400" />
            <span>Threads</span>
          </button>
          <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-slate-700/50 hover:text-white transition-colors">
            <AtSign className="h-4 w-4 text-slate-400" />
            <span>Mentions & reactions</span>
          </button>
          <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-slate-700/50 hover:text-white transition-colors">
            <Bookmark className="h-4 w-4 text-slate-400" />
            <span>Saved items</span>
          </button>
          <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-slate-700/50 hover:text-white transition-colors">
            <FileText className="h-4 w-4 text-slate-400" />
            <span>Files</span>
          </button>
        </div>

        {/* --- CHANNELS SECTION --- */}
        <div className="mb-4">
          <div className="group flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <button 
              onClick={() => setIsChannelsOpen(!isChannelsOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors text-[11px]"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${!isChannelsOpen ? "-rotate-90" : ""}`} />
              <span>Channels</span>
            </button>
            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white hover:bg-slate-700 rounded p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {isChannelsOpen && (
            <div className="space-y-0.5">
              {CHANNELS.map((channel) => {
                const isActive = activeChannelId === channel.id && !selectedUser;
                return (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setActiveChannelId(channel.id);
                      dispatch(setSelectedUser(null)); // Deselect 1-to-1 chat when clicking channel
                    }}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors
                      ${isActive 
                        ? "bg-indigo-600 text-white font-semibold" 
                        : "hover:bg-slate-700/40 text-slate-300 hover:text-white"
                      }
                    `}
                  >
                    <Hash className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span className="truncate">{channel.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* --- DIRECT MESSAGES (1-to-1) SECTION --- */}
        <div className="mb-6">
          <div className="group flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <button 
              onClick={() => setIsDmsOpen(!isDmsOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors text-[11px]"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${!isDmsOpen ? "-rotate-90" : ""}`} />
              <span>Direct Messages</span>
            </button>
          </div>

          {isDmsOpen && (
            <div className="space-y-0.5">
              {users
                // Filter out yourself so you don't DM yourself
                .filter((user) => user.id !== currentUser?.id)
                .map((user) => {
                  const isSelected = selectedUser?.id === user.id;
                  const isOnline = onlineUserIds.includes(user.id);

                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        dispatch(setSelectedUser(user));
                        dispatch(fetchMessages(user.id));
                      }}
                      className={`group/item flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors cursor-pointer
                        ${
                          isSelected 
                            ? "bg-indigo-600 text-white font-semibold" 
                            : "hover:bg-slate-700/40 text-slate-300 hover:text-white"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Avatar initials with Presence Dot */}
                        <div className="relative flex h-6 w-6 items-center justify-center rounded bg-slate-600 text-[11px] font-bold text-white shrink-0">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                          <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-slate-800
                            ${isOnline ? "bg-emerald-500" : "bg-slate-500"}`} 
                          />
                        </div>
                        <span className="truncate">{user.name}</span>
                      </div>
                    </button>
                  );
                })}

              {users.length <= 1 && (
                <p className="text-[11px] text-slate-400 px-2 py-1">No other teammates yet.</p>
              )}
            </div>
          )}
        </div>

      </ScrollArea>
    </div>
  );
}