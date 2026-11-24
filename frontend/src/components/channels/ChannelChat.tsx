import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import type { Channel, ChannelMessage } from "@/types/channelTypes";
import ChannelMessages from "@/components/channels/ChannelMessages";
import { Hash, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appendChannelMessage, fetchChannelMessages } from "@/store/slice/channel.slice";
import { getSocket } from "@/services/socketServices";

interface ChannelChatProps {
  channel: Channel;
  onOpenDetails?: () => void;
}

export default function ChannelChat({
  channel,
  onOpenDetails,
}: ChannelChatProps) {
    const dispatch = useDispatch<AppDispatch>();
    //user nd msgs from store
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const {messages = []} = useSelector((state: RootState) => state.channels);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if(!channel?.id) return;

    dispatch(fetchChannelMessages(channel.id));

    const socket = getSocket();
    if(socket){
        socket.emit("join_channel", { channelId: channel.id});

        const handleReceiveChannelMessage = (newMsg: ChannelMessage) => {
            if(Number(newMsg.channelId) === Number(channel.id)){
                dispatch(appendChannelMessage(newMsg));
            }
        };
        socket.on("receive_channel_message", handleReceiveChannelMessage);

        return () => {
            socket.emit("leave_channel", {channelId: channel.id});
            socket.off("receive_channel_message", handleReceiveChannelMessage);
        };
    }
  }, [channel?.id, dispatch]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const socket = getSocket();
    if(socket){

        //help to save in pg
        socket.emit("send_channel_message", {
            channelId: channel.id,
            content: trimmed,
        });
    }
    setInputText("");
  };

  return (
    <div className="flex flex-1 flex-col h-full min-h-0 overflow-hidden bg-white border-l border-slate-200">
      
      {/* CHANNEL HEADER*/}
      <div className="flex h-14 shrink-0 items-center justify-between px-6 border-b border-slate-200 bg-white/50 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-sm">
            <Hash className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 leading-tight">
              {channel.name}
            </h2>
            <p className="text-[11px] text-slate-500">
              {channel.description || "Channel discussions"}
            </p>
          </div>
        </div>

        {/* Members Button */}
        {onOpenDetails && (
          <Button
            type="button"
            variant="outline"
            onClick={onOpenDetails}
            className="h-8 px-3 rounded-xl text-xs font-medium text-slate-700 border-slate-200 bg-slate-50 hover:bg-slate-100 gap-1.5 cursor-pointer"
          >
            <Users className="h-3.5 w-3.5 text-indigo-600" />
            <span>Members</span>
          </Button>
        )}
      </div>

      {/*MESSAGES FEED */}
      <ChannelMessages 
        messages={messages} 
        currentUserId={currentUser?.id} 
      />

      {/* INPUT BAR  */}
      <div className="p-3 shrink-0 border-t border-slate-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message #${channel.name}...`}
            className="flex-1 text-xs h-10 rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-600"
          />

          <Button
            type="submit"
            disabled={!inputText.trim()}
            className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>

    </div>
  );
}