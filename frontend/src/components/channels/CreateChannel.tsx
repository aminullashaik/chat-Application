import type { RootState } from "@/store/store";
import type { CreateChannelPayload } from "@/types/channelTypes";
import { Check, Hash, Users, X } from "lucide-react";
import {  useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

//creating channel
interface CreateChannelProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (payload: CreateChannelPayload) => void;
}

export default function CreateChannel({ isOpen, onClose, onCreate} : CreateChannelProps) {
    const [name, setName] = useState("");
    const[description, setDescription] = useState("");
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
    const [error, setError] = useState("");

    const { users = []} =useSelector((state: RootState) => state.users || {});
    const currentUser = useSelector((state: RootState) => state.auth.user);

    const availableUsers = users.filter((u) => u.id !== currentUser?.id);//who is creating channel

    if(!isOpen) return null;

    //seeing memb in that array or not
    const toggleMember = (userId: number) => {
        if (selectedMemberIds.includes(userId)){
            setSelectedMemberIds(selectedMemberIds.filter((id) => id !== userId));// check the id not matches the prev ids
        } else {
            setSelectedMemberIds([...selectedMemberIds, userId]); //add id and give new array
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        //channel name formate - if space -> -
        const formattedName = name.trim().toLowerCase().replace(/\s+/g, "-");

        if(!formattedName){
            setError("Channel name is required");
            toast.error("Channel name is required");
            return;
        }
        if(formattedName.length < 3) {
            setError("Channel name must be atleaste c char");
            toast.error("Channel name must be atleaste c char");
            return;
        }

        onCreate({
            name: formattedName,
            description: description.trim(),
            memberIds: selectedMemberIds,
        });
        toast.message("Channel created Successfully");

        setName("");
        setDescription("");
        setSelectedMemberIds([]);
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        onClick={onClose} >
            <div 
        className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create a channel</h2>
              <p className="text-xs text-slate-400">Channels are where your team communicates</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4 flex-1 overflow-hidden">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="channel-name" className="text-xs font-semibold text-slate-300">
              Channel Name <span className="text-rose-500">*</span>
            </Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-500 font-bold text-sm">#</span>
              <Input
                id="channel-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder=""
                className="pl-7 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
              />
            </div>
            {error && <span className="text-xs text-rose-500">{error}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="channel-desc" className="text-xs font-semibold text-slate-300">
              Description <span className="text-xs text-slate-500 font-normal">(optional)</span>
            </Label>
            <Input
              id="channel-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this channel about?"
              className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-h-35 overflow-hidden">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-indigo-400" />
                Add Members
              </Label>
              <span className="text-[11px] text-slate-400">
                {selectedMemberIds.length} selected
              </span>
            </div>

            <ScrollArea className="h-44 w-full rounded-lg border border-slate-800 bg-slate-950 p-2">
              {availableUsers.length === 0 ? (
                <p className="text-xs text-slate-500 p-2 text-center">No other teammates found</p>
              ) : (
                <div className="flex flex-col gap-1 pr-2">
                  {availableUsers.map((user) => {
                    const isSelected = selectedMemberIds.includes(user.id);
                    return (
                      <div
                        key={user.id}
                        onClick={() => toggleMember(user.id)}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-xs transition-colors ${
                          isSelected 
                            ? "bg-indigo-600/20 text-white border border-indigo-500/30" 
                            : "hover:bg-slate-800/60 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-indigo-300">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-200">{user.name}</span>
                            <span className="text-[10px] text-slate-500">{user.email}</span>
                          </div>
                        </div>

                        <div className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected 
                            ? "bg-indigo-600 border-indigo-600 text-white" 
                            : "border-slate-700"
                        }`}>
                          {isSelected && <Check className="h-3 w-3 stroke-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700 text-slate-600 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
            >
              Create Channel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}