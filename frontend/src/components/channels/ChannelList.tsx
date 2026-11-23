import { useState } from "react";
import type { Channel } from "@/types/channelTypes";
import { Hash, Plus, ChevronDown, ChevronRight } from "lucide-react";

interface ChannelListProps {
  channels: Channel[];
  selectedChannelId?: number | null;
  onSelectChannel: (channel: Channel) => void;
  onOpenCreateModal: () => void;
}

export default function ChannelList({
  channels,
  selectedChannelId,
  onSelectChannel,
  onOpenCreateModal,
}: ChannelListProps) {
  // allows user to fold or unfold the channels list
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col mb-4">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between px-2 py-1 text-slate-400 hover:text-slate-200 transition-colors group">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider focus:outline-hidden cursor-pointer"
        >
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
          <span>Channels</span>
          <span className="text-[10px] text-slate-500 font-normal">
            ({channels.length})
          </span>
        </button>

        {/* Plus button to open CreateChannel modal */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          title="Create Channel"
          className="rounded p-1 text-slate-400 hover:bg-slate-700/60 hover:text-white transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* --- CHANNELS LIST --- */}
      {isOpen && (
        <div className="flex flex-col gap-0.5 mt-1">
          {channels.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-500 italic">
              No channels yet. Click + to create one.
            </div>
          ) : (
            channels.map((channel) => {
              const isSelected = selectedChannelId === channel.id;

              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => onSelectChannel(channel)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors text-left w-full cursor-pointer group ${
                    isSelected
                      ? "bg-indigo-600 text-white font-semibold shadow-xs"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <Hash
                    className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                      isSelected
                        ? "text-white"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span className="truncate flex-1">{channel.name}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}