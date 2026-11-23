import { appendMessage } from "@/store/slice/chat.slice";
import type { AppDispatch, RootState } from "@/store/store";
import { MessageSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Message } from "@/types/chatTypes";
import { getSocket } from "@/services/socketServices";

export default function ChatArea() {
    const dispatch = useDispatch<AppDispatch>();
    const isTypingRef = useRef(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    //logged in user for authslice for left right bubble
    const currentUser = useSelector((state: RootState) =>
        state.auth.user
    );

    //active chat 
    const { selectedUser, conversationId, messages, loadingMessages } = useSelector(
        (state: RootState) => state.chat
    );

    const [text, setText] = useState("");


    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    //move to other char
    useEffect(() => {
        if (!currentUser?.id || !conversationId) return;
        const socket = getSocket();
        if(!socket) return;

        socket.emit("join_conversation", conversationId);

        const handleReceiveMessage = (incomingMsg: Message) => {
            if (Number(incomingMsg.conversationId) === Number(conversationId)) {
                    dispatch(appendMessage(incomingMsg));
            }
        };

        const handleTyping =(data: {conversationId: number}) => {
            if(Number(data.conversationId) === Number(conversationId)){
                setIsTyping(true);
            }
        };

        const handleStopTyping = (data : { conversationId : number}) => {
            if(Number(data.conversationId) === Number(conversationId)){
                setIsTyping(false);
            }
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("user_typing", handleTyping);
        socket.on("user_stop_typing", handleStopTyping);

        console.log("Active listeners count:", socket.listeners("receive_message").length);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("user_typing", handleTyping);
            socket.off("user_stop_typing", handleStopTyping);
            setIsTyping(false); //rest when chat changes
        };
    }, [conversationId, currentUser?.id, dispatch]);
    //auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setText(value);

        const socket = getSocket();
        if(!socket || !conversationId) return;

        if(!value.trim()){ //if empty
            if(typingTimeoutRef.current)
                clearTimeout(typingTimeoutRef.current);
            isTypingRef.current = false;
            socket.emit("stop_typing", { conversationId });
            return;
        }
        if(!isTypingRef.current){
            isTypingRef.current = true;
            socket.emit("typing", {conversationId});
        }
        if(typingTimeoutRef.current){
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            isTypingRef.current = false;
            socket.emit("stop_typing", { conversationId});
        }, 2000);

    };


    //Send message
    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const trimmed = text.trim();
        if (!trimmed || !selectedUser || !conversationId) return;

        const socket = getSocket();
        if (socket && socket.connected) {
            socket.emit("send_message", {
                conversationId: conversationId,
                content: trimmed,
            });
            if(typingTimeoutRef.current){
                clearTimeout(typingTimeoutRef.current);
            }
            isTypingRef.current = false;
            socket.emit("stop_typing",{conversationId});
        }
        setText("");
    };

    if (!selectedUser) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 text-slate-400 dark:bg-slate-950">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-500 mb-4">
                    <MessageSquare className="h-8 w-8" />
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

    return (
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
                            {isTyping ? (
                                <span className="text-indigo-500 dark:text-indigo-400 font-medium animate-pulse">
                                    typing...
                                </span>
                            ) : (
                                selectedUser.email
                            )}
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
                                const isMe = Number(msg.senderId ?? (msg as any).user?.id) === Number(currentUser?.id);
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`} >
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-xs leading-relaxed shadow-xs
                                ${isMe
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
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* msg and send bar */}
            <div className="p-3 shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {isTyping && (
                    <div className="px-1 pb-1.5 text-[11px] text-slate-400 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <span className="italic font-medium text-indigo-500 dark:text-indigo-400 animate-bounce">
                            {selectedUser.name} is typing...
                        </span>
                        <span className="flex items-center gap-0.5 pt-0.5">
                            <span className="h-1 w-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-1 w-1 rounded-full bg-indigo-500 animate-bounce"></span>
                        </span>
                        </div>
                )}
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <Input
                        value={text}
                        onChange={handleInputChange}
                        placeholder={`Message ${selectedUser.name}...`}
                        className="flex text-xs h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                    <Button
                        type="submit"
                        disabled={!text.trim()}
                        className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer disabled:opacity-40">
                        <span>Send</span>
                        <Send className="h-3.5 w-3.5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}