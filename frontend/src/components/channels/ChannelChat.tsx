import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Channel, ChannelMessage } from "@/types/channelTypes";
import ChannelMessages from "@/components/channels/ChannelMessages";
import { Hash, Send, Users } from "lucide-react";

interface ChannelChatProps {
  channel: Channel;
  messages?: ChannelMessage[];
  onSendMessage?: (content: string) => void;
  onOpenDetails?: () => void;
}

export default function ChannelChat({
  channel,
  messages = [],
  onSendMessage,
  onOpenDetails,
}: ChannelChatProps) {
  // Current logged in user
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onSendMessage?.(trimmed);
    setInputText("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-white overflow-hidden">
      
      {/* CHANNEL HEADER*/}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/90 backdrop-blur-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Hash className="h-5 w-5 text-indigo-400 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base text-white truncate">
              {channel.name}
            </span>
            {channel.description && (
              <span className="text-xs text-slate-400 truncate">
                {channel.description}
              </span>
            )}
          </div>
        </div>

        {/* Members Button */}
        {onOpenDetails && (
          <button
            type="button"
            onClick={onOpenDetails}
            title="Channel Members"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer border border-slate-800"
          >
            <Users className="h-3.5 w-3.5 text-indigo-400" />
            <span>Members</span>
          </button>
        )}
      </div>

      {/* MESSAGES FEED */}
      <ChannelMessages 
        messages={messages} 
        currentUserId={currentUser?.id} 
      />

      {/* INPUT BOX */}
      <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 focus-within:border-indigo-500 transition-colors"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message #${channel.name}...`}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-hidden"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-8 w-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}