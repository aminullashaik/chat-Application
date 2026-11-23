import type { ChannelMessage } from "@/types/channelTypes";
import { useEffect, useRef } from "react";

interface ChannelMsgsProps{
    messages: ChannelMessage[];
    currentUserId?: number;
}

export default function ChannelMessages({
    messages, currentUserId
} : ChannelMsgsProps){
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth"});
    }, [messages]);

    if (messages.length === 0) {
        return(
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-500">
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-xl text-indigo-400 font-bold">
                    #
                </div>
                <p className="text-sm font-medium text-slate-300">This is the start of the channel.</p>
                <p className="text-xs text-slate-500 mt-1">Send a message to start the conversation!</p>

            </div>
        );
    }
    return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => {
        const isMe = msg.senderId === currentUserId;

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 group ${
              isMe ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Sender Avatar */}
            <div className="h-8 w-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0">
              {msg.sender.name.charAt(0).toUpperCase()}
            </div>

            {/* Message Bubble + Sender Name */}
            <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
              {/* Header: Name and Time */}
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-xs font-semibold text-slate-300">
                  {isMe ? "You" : msg.sender.name}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Text Bubble */}
              <div
                className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? "bg-indigo-600 text-white rounded-tr-xs"
                    : "bg-slate-800 text-slate-100 rounded-tl-xs border border-slate-700/50"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        );
      })}

      {/* Invisible anchor to scroll down to */}
      <div ref={bottomRef} />
    </div>
  );
}