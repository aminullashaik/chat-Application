import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import type { Channel, ChannelMessage } from "@/types/channelTypes";
import ChannelMessages from "@/components/channels/ChannelMessages";
import { Hash, LogIn, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appendChannelMessage, fetchChannelMessages } from "@/store/slice/channel.slice";
import { getSocket } from "@/services/socketServices";
import { joinChannel } from "@/services/channelServices";

export default function ChannelChat({channel}: {channel: Channel} ) {
  const dispatch = useDispatch<AppDispatch>();
    //user nd msgs from store
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const {messages = [], error} = useSelector((state: RootState) => state.channels);
  const [inputText, setInputText] = useState("");
  const isNotMember = error === "You are not a member of this channel";

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

  const handleJoin = async () => {
    await joinChannel(channel.id);
    dispatch(fetchChannelMessages(channel.id)); // Reloads messages now that you're a member
    const socket = getSocket();
    if (socket) socket.emit("join_channel", { channelId: channel.id });
  };


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
    <div className="flex flex-1 flex-col h-full bg-white border-l border-slate-200">
      {/* Header */}
      <div className="flex h-14 items-center px-6 border-b border-slate-200">
        <Hash className="h-5 w-5 text-indigo-600 mr-2" />
        <div>
          <h2 className="text-sm font-bold text-slate-800">{channel.name}</h2>
          <p className="text-[11px] text-slate-400">{channel.description}</p>
        </div>
      </div>
      {/* If Not Member -> Show Join Button */}
      {isNotMember ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-sm text-slate-600">You haven't joined #{channel.name} yet.</p>
          <Button onClick={handleJoin} className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-xl">
            <LogIn className="h-4 w-4 mr-1.5" /> Join Channel
          </Button>
        </div>
      ) : (
        /* If Member -> Show Chat */
        <>
          <div className="flex-1 overflow-y-auto">
            <ChannelMessages messages={messages} currentUserId={currentUser?.id} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${channel.name}...`}
              className="text-xs rounded-xl"
            />
            <Button type="submit" className="bg-indigo-600 text-white rounded-xl">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </>
      )}
    </div>
  );
}