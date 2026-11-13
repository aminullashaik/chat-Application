import { useState } from "react";
// Mock imports for shadcn/ui components
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

// Mock Data for the sidebar channels list
const CHANNELS = [
  { id: "c1", name: "general" },
  { id: "c2", name: "announcements" },
  { id: "c3", name: "project-chat-app" },
  { id: "c4", name: "design-system" },
  { id: "c5", name: "random" },
];

// Mock Data for Direct Messages list
const DIRECT_MESSAGES = [
  { id: "dm1", name: "Jane Doe", initials: "JD", online: true, isMe: true },
  { id: "dm2", name: "Alex Rivera", initials: "AR", online: true },
  { id: "dm3", name: "Sarah Chen", initials: "SC", online: false },
  { id: "dm4", name: "Mike Peters", initials: "MP", online: true },
];

export default function ChannelSidebar() {
  const [activeItem, setActiveItem] = useState("c1");
  const [isChannelsOpen, setIsChannelsOpen] = useState(true);
  const [isDmsOpen, setIsDmsOpen] = useState(true);

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-800 text-slate-300 border-r border-slate-700 dark:bg-slate-900 dark:border-slate-800">
      
      {/* Header: Workspace Title Dropdown */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors">
        <div className="flex flex-col min-w-0">
          <h1 className="text-[15px] font-bold text-white truncate flex items-center gap-1.5">
            Acme Corporation
            <ChevronDown className="h-3.5 w-3.5 opacity-80 shrink-0" />
          </h1>
          <span className="text-xs text-slate-400 truncate flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Jane Doe
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Body: Scrollable Navigation items */}
      <ScrollArea className="flex-1 px-2 pt-3">
        
        {/* Core Navigation Tools Section */}
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

        {/* Channels Collapsible Accordion Header */}
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

          {/* Render Channels List if open */}
          {isChannelsOpen && (
            <div className="space-y-0.5">
              {CHANNELS.map((channel) => {
                const isActive = activeItem === channel.id;
                return (
                  <button
                    key={channel.id}
                    onClick={() => setActiveItem(channel.id)}
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
              
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-slate-700/40 hover:text-white transition-colors">
                <Plus className="h-4 w-4 shrink-0" />
                <span>Add channels</span>
              </button>
            </div>
          )}
        </div>

        {/* Direct Messages Collapsible Accordion Header */}
        <div className="mb-6">
          <div className="group flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <button 
              onClick={() => setIsDmsOpen(!isDmsOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors text-[11px]"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${!isDmsOpen ? "-rotate-90" : ""}`} />
              <span>Direct Messages</span>
            </button>
            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white hover:bg-slate-700 rounded p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Render Direct Messages List if open */}
          {isDmsOpen && (
            <div className="space-y-0.5">
              {DIRECT_MESSAGES.map((dm) => {
                const isActive = activeItem === dm.id;
                return (
                  <button
                    key={dm.id}
                    onClick={() => setActiveItem(dm.id)}
                    className={`group/item flex w-full items-center justify-between rounded-md px-2 py-1 text-sm font-medium transition-colors
                      ${isActive 
                        ? "bg-indigo-600 text-white font-semibold" 
                        : "hover:bg-slate-700/40 text-slate-300 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Custom Presence Dot Overlay on Initials/Avatar container */}
                      <div className="relative flex h-5 w-5 items-center justify-center rounded bg-slate-600 text-[10px] font-bold text-white shrink-0">
                        {dm.initials}
                        <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-slate-800
                          ${dm.online ? "bg-emerald-500" : "bg-slate-500"}`} 
                        />
                      </div>
                      <span className="truncate">
                        {dm.name} {dm.isMe && <span className="text-[11px] opacity-60">(you)</span>}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </ScrollArea>
    </div>
  );
}
