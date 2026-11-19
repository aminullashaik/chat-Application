import { sendMessage, appendMessage } from "@/store/slice/chat.slice";
import type { AppDispatch, RootState } from "@/store/store";
import { MessageSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "@/components/ui/button";
import {Input } from "@/components/ui/input";
import type { Message } from "@/types/chatTypes";
import { connectSocket, getSocket } from "@/services/socketServices";

export default function ChatArea() {
    const dispatch = useDispatch<AppDispatch>();

    //logged in user for authslice
    const currentUser = useSelector((state: RootState) =>
    state.auth.user
    );

    //active chat
    const { selectedUser,conversationId, messages, loadingMessages } = useSelector(
        (state: RootState) => state.chat
    );

    const [text, setText] = useState("");

    
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!currentUser?.id || !conversationId) return;
        const socket = connectSocket();

        socket.emit("join_conversation", conversationId);

        const handleReceiveMessage = (incomingMsg: Message) => {
            if(Number(incomingMsg.conversationId) === Number(conversationId)){
                const senderId = incomingMsg.senderId ?? (incomingMsg as any).user?.id;
                
                
                if (Number(senderId) !== Number(currentUser?.id)) {
                    dispatch(appendMessage(incomingMsg));
                }
            }
        };

        socket.on("receive_message", handleReceiveMessage);

        console.log("Active listeners count:", socket.listeners("receive_message").length);

        return () =>{
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [conversationId, currentUser?.id, dispatch]);
    //auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth"});
    }, [messages]);

    //Send message
    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const trimmed = text.trim();
        if(!trimmed || !selectedUser || !conversationId) return;

        const newMsg: Message = {
        id: Date.now(),
        content: trimmed,
        senderId: Number(currentUser?.id),
        conversationId: conversationId,
        createdAt: new Date().toISOString(),
    };
    dispatch(appendMessage(newMsg));

        const socket = getSocket();
        if (socket && socket.connected) {
            socket.emit("send_message", {
                conversationId: conversationId,
                content: trimmed,
            });
        } else {
            dispatch(
                sendMessage({
                    conversationId: conversationId,
                    content: trimmed,
                })
            );
        }
        setText("");
    };

    if(!selectedUser){
        return (
            <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 text-slate-400 dark:bg-slate-950">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-500 mb-4">
                    <MessageSquare className="h-8 w-8"/>
                </div>
                <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    No Conversation Selected
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-xs text-center">
                    Choose a person to start your Conversation.
                </p>
            </div>
        );
    }

    return(
        <div className="flex flex-1 flex-col h-full min-h-0 overflow-hidden bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">

            {/* Top info */}
            <div className="flex h-14 shrink-0 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 backdrop:backdrop-blur-2xl dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white text-xs">
                    {selectedUser.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                        {selectedUser.name}
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {selectedUser.email}
                    </p>
                </div>
            </div>
            </div>

            {/* Message Area */}
            <ScrollArea className="flex-1 min-h-0">
                <div className="px-6 py-4">
            {loadingMessages ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-400 py-20">
                Loading messages...
                </div>
            ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-xs text-slate-400 py-20">
                    <p> No messages yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Say hello to {selectedUser.name}</p>
                    </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => {
                        const isMe = Number(msg.senderId ?? (msg as any).user?.id)  === Number(currentUser?.id);
                        return(
                            <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? "items-end" : "items-start"}`} >
                                <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-xs leading-relaxed shadow-xs
                                ${
                                    isMe
                                    ? "bg-indigo-600 text-white rounded-br-xs"
                                    : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-bl-xs"
                                }`}
                                >
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 px-1">
                                    {msg.createdAt
                                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                : ""}
                                </span>
                            </div>
                        );
                    })}

                    {/* auto scroll */}
                    <div ref = {messagesEndRef}/>
                </div>
            )}
            </div>
            </ScrollArea>

            {/* msg and send bar */}
            <div className="p-3 shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Message ${selectedUser.name}...`}
                    className="flex text-xs h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"/>
                    <Button
                    type="submit"
                    disabled={!text.trim()}
                    className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer disabled:opacity-40">
                        <span>Send</span>
                        <Send className="h-3.5 w-3.5"/>
                    </Button>
                </form>
            </div>
        </div>
    );
}