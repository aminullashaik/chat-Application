import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchUsers } from "@/store/slice/user.slice";
import { setSelectedUser, fetchMessages } from "@/store/slice/chat.slice";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";

// 1. IMPORT YOUR CHANNELS COMPONENTS & TYPES
import CreateChannel from "@/components/channels/CreateChannel";
import type { Channel, CreateChannelPayload } from "@/types/channelTypes";
import ChannelList from "./channels/ChannelList";

interface ChannelSidebarProps {
  selectedChannel?: Channel | null;
  onSelectChannel?: (channel: Channel) => void;
}

export default function ChannelSidebar({
  selectedChannel,
  onSelectChannel,
}: ChannelSidebarProps) {
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { users = [] } = useSelector((state: RootState) => state.users || {});
  const { selectedUser, onlineUserIds = [] } = useSelector(
    (state: RootState) => state.chat
  );

  const [isDmsOpen, setIsDmsOpen] = useState(true);

  // 2. MODAL STATE TO OPEN / CLOSE "CREATE CHANNEL"
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [channels, setChannels] = useState<Channel[]>([
  {
    id: 1,
    name: "task-manager",
    description: "day to day update",
    createdBy: "Ameen",
    createdAt: new Date().toISOString(),
  },
]);


  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  // Handler when user submits CreateChannel form
  const handleCreateChannel = (payload: CreateChannelPayload) => {
    const newChan: Channel = {
      id: Date.now(),
      name: payload.name,
      description: payload.description,
      createdBy: currentUser?.name || "You",
      createdAt: new Date().toISOString(),
    };
    setChannels((prev) => [...prev, newChan]); // Adds new channel to list!
  onSelectChannel?.(newChan);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-slate-800 text-slate-300 border-r border-slate-700 dark:bg-slate-900 dark:border-slate-800">
      
      {/* --- WORKSPACE TITLE HEADER --- */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors">
        <div className="flex flex-col min-w-0">
          <h1 className="text-[15px] font-bold text-white truncate flex items-center gap-1.5">
            DET_Team
            <ChevronDown className="h-3.5 w-3.5 opacity-80 shrink-0" />
          </h1>
          <span className="text-xs text-slate-400 truncate flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {currentUser?.name || "Member"} (You)
          </span>
        </div>
      </div>

      {/* MAIN SCROLLABLE BODY */}
      <ScrollArea className="flex-1 px-2 pt-3">

         <ChannelList
            channels={channels}
            selectedChannelId={selectedChannel?.id}
            onSelectChannel={(channel) => {
            dispatch(setSelectedUser(null));
            onSelectChannel?.(channel);
            }}
            onOpenCreateModal={() => setIsCreateOpen(true)}
          />

        {/*DIRECT MESSAGES SECTION*/}
        <div className="mb-6">
          <div className="group flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <button 
              onClick={() => setIsDmsOpen(!isDmsOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors text-[11px] cursor-pointer"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${!isDmsOpen ? "-rotate-90" : ""}`} />
              <span>Direct Messages</span>
            </button>
          </div>

          {isDmsOpen && (
            <div className="space-y-0.5">
              {users
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
                        {/* Avatar */}
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

      {/*CREATE CHANNEL MODAL*/}
      <CreateChannel
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateChannel}
      />
    </div>
  );
}