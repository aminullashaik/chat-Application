import { useState } from "react";
// Imports for shadcn/ui components
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Icons used for the bottom utility layout actions
import { Plus, Compass, Settings, Bell, Grid } from "lucide-react";

// Mock list of workspace channels
const WORKSPACES = [
    { id: "w1", name: "Acme Corporation", initials: "AC", color: "bg-indigo-600 text-white" },
    { id: "w2", name: "Design System Hub", initials: "DS", color: "bg-emerald-600 text-white" },
    { id: "w3", name: "Side Hustle Devs", initials: "SH", color: "bg-amber-500 text-slate-900" },
    { id: "w4", name: "Marketing Team", initials: "MK", color: "bg-rose-500 text-white" },
];

export default function WorkspaceSidebar() {
    const [activeWorkspace, setActiveWorkspace] = useState("w1");

    return (
        <TooltipProvider>
            <div className="flex h-screen w-[68px] flex-col items-center justify-between border-r border-slate-200 bg-slate-900 py-3 dark:border-slate-800 dark:bg-slate-950">

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

                    <div className="h-[1px] w-8 bg-slate-800" />

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
                                            <div className="absolute -left-[14px] h-8 w-1 rounded-r-md bg-white" />
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

                    <div className="h-[1px] w-8 bg-slate-800 my-1" />

                    {/* Active Profile Avatar Node */}
                    <Tooltip>
                        <TooltipTrigger className="relative h-9 w-9 shrink-0 rounded-xl bg-slate-700 font-medium text-xs text-white shadow ring-slate-900 transition-transform active:scale-95 hover:scale-105 focus-visible:outline-none">
                            <img
                                src="https://unsplash.com"
                                alt="Profile"
                                className="h-full w-full rounded-xl object-cover"
                            />
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-500" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p className="text-xs font-semibold">Jane Doe (You)</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

            </div>
        </TooltipProvider>
    );
}