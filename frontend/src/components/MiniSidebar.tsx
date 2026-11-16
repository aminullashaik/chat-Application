import { useState } from "react";
// Imports for shadcn/ui components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Icons used for the bottom utility layout actions
import { Plus, Compass, Settings, Bell, Grid } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

// Mock list of workspace channels
const WORKSPACES = [
    { id: "w1", name: "DTE AGRITECH", initials: "DTE", color: "bg-indigo-600 text-white" },
];

export default function WorkspaceSidebar() {
    const [activeWorkspace, setActiveWorkspace] = useState("w1");
    const currentUser = useSelector((state: RootState) => state.auth.user);

    return (
        <TooltipProvider>
            <div className="flex h-full w-17 flex-col items-center justify-between border-r border-slate-200 bg-slate-900 py-3 dark:border-slate-800 dark:bg-slate-950">

                {/* Top Section: Workspace Switching Group */}
                <div className="flex w-full flex-col items-center gap-4">

                    {/* Main App Launcher Icon */}
                    <Tooltip>
                        {/* The TooltipTrigger is now configured to act as our button element */}
                        <TooltipTrigger className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
                            <Grid className="h-5 w-5" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p className="text-xs font-medium">All Workspaces</p>
                        </TooltipContent>
                    </Tooltip>

                    <div className="h-px w-8 bg-slate-800" />

                    {/* Active Workspaces Render Rack */}
                    <div className="flex w-full flex-col items-center gap-3">
                        {WORKSPACES.map((workspace) => {
                            const isActive = activeWorkspace === workspace.id;
                            return (
                                <Tooltip key={workspace.id}>
                                    {/* TooltipTrigger handles click events and workspace color state directly */}
                                    <TooltipTrigger
                                        onClick={() => setActiveWorkspace(workspace.id)}
                                        className={`group relative flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm transition-all duration-200 focus-visible:outline-none
                      ${workspace.color} 
                      ${isActive ? "rounded-lg ring-2 ring-white ring-offset-2 ring-offset-slate-900" : "opacity-75 hover:opacity-100 hover:rounded-lg"}
                    `}
                                    >
                                        {/* Active Indicator Bar on the left edge inside layout bounds */}
                                        {isActive && (
                                            <div className="absolute -left-3.5 h-8 w-1 rounded-r-md bg-white" />
                                        )}
                                        {workspace.initials}
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p className="text-xs font-semibold">{workspace.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}

                        {/* Create / Add New Workspace Utility Button */}
                        <Tooltip>
                            <TooltipTrigger className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-800/40 text-slate-400 transition-all hover:rounded-lg hover:border-slate-500 hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none">
                                <Plus className="h-5 w-5" />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p className="text-xs font-medium">Add a workspace</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Bottom Section: User Tools, Alerts & Configuration Action Tray */}
                <div className="flex flex-col items-center gap-3">
                    {/* Discover Channels */}
                    <Tooltip>
                        <TooltipTrigger className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors focus-visible:outline-none">
                            <Compass className="h-5 w-5" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p className="text-xs font-medium">Discover</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Activity Alerts / Notifications */}
                    <Tooltip>
                        <TooltipTrigger className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors focus-visible:outline-none">
                            <Bell className="h-5 w-5" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p className="text-xs font-medium">Notifications</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Settings Trigger */}
                    <Tooltip>
                        <TooltipTrigger className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors focus-visible:outline-none">
                            <Settings className="h-5 w-5" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p className="text-xs font-medium">Preferences</p>
                        </TooltipContent>
                    </Tooltip>

                    <div className="h-px w-8 bg-slate-800 my-1" />

                    {/* Active Profile Avatar Node */}
                    <Tooltip>
                        <TooltipTrigger className="relative h-9 w-9 shrink-0 rounded-xl bg-slate-700 font-medium text-xs text-white shadow ring-slate-900 transition-transform active:scale-95 hover:scale-105 focus-visible:outline-none">
                           <div className="h-full w-full rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
                        {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p className="text-xs font-semibold">{currentUser.name} (You)</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

            </div>
        </TooltipProvider>
    );
}