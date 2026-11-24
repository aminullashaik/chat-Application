import type { ChannelMessage } from "@/types/channelTypes";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash } from "lucide-react";

interface ChannelMsgsProps {
  messages: ChannelMessage[];
  currentUserId?: number;
}

export default function ChannelMessages({
  messages,
  currentUserId,
}: ChannelMsgsProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean Empty State (Matches ChatArea's empty state)
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 text-slate-400 py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-500 mb-3">
          <Hash className="h-7 w-7" />
        </div>
        <h2 className="text-sm font-semibold text-slate-700">
          This is the start of the channel
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs text-center">
          Send a message to start the conversation with your team.
        </p>
      </div>
    );
  }

  // Messages List
  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-4 space-y-4">
        {messages.map((msg) => {
          const isMe = Number(msg.senderId) === Number(currentUserId);

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isMe ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Sender Avatar */}
              <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                {msg.sender?.name?.charAt(0).toUpperCase() || (msg as any).user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              {/* Message Bubble + Header */}
              <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-semibold text-slate-700">
                    {isMe ? "You" : (msg.sender?.name || (msg as any).user?.name || "Member")}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>

                {/* Bubble (Matches ChatArea) */}
                <div
                  className={`rounded-2xl px-4 py-2 text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-br-xs"
                      : "bg-slate-100 text-slate-800 rounded-bl-xs"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}