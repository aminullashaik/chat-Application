import { deleteUser, fetchUsers } from "@/store/slice/user.slice";
import type { AppDispatch, RootState } from "@/store/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Trash2, Users, Loader2, AlertCircle } from "lucide-react";


export function UserPage() {
    const dispatch = useDispatch<AppDispatch>();

    const {users = [],
        loading = false,
        error = null
    } = useSelector((state: RootState) => state.users || {});

    const [searchTerms, setSearchTerm] = useState("");
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const searchUsers = useMemo(() => {
        const term = searchTerms.toLowerCase().trim();
        if(!term) return users;
        return users.filter((user) => {
            return (
                user.name?.toLowerCase().includes(term) ||
                user.email?.toLowerCase().includes(term) ||
                user.mobile?.includes(term)
            );
        });
    }, [users, searchTerms]);


    const handleDeleteUsers = async(id: number, name: string) => {
        if(!window.confirm(`Confim to delete ${name}?`)) return;
        try{
            await dispatch(deleteUser(id)).unwrap();
        } catch (error: any) {
            alert(error || "Failed to load");
        }
    };
    return(

    <div className="min-h-screen bg-slate-50/60 p-6 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Team</h1>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600 border border-slate-200">
                                {users.length} Colleagues
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Manage team members, roles, and contacts.</p>
                    </div>

                    {/* SEARCH INPUT */}
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchTerms}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search colleagues..."
                            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                        />
                    </div>
                </div>

                {/* --- ERROR BANNER --- */}
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs shadow-xs">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* --- LOADING SPINNER --- */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                        <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
                        <p className="text-xs font-medium">Loading team members...</p>
                    </div>
                )}

                {/* --- USERS TABLE --- */}
                {!loading && (
                    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3.5 px-4">Member</th>
                                        <th className="py-3.5 px-4">Contact</th>
                                        <th className="py-3.5 px-4">Role</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                    {searchUsers.length > 0 ? (
                                        searchUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                                {/* MEMBER INFO */}
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                                                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{user.name}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* CONTACT */}
                                                <td className="py-3 px-4">
                                                    <p className="text-slate-700">{user.email}</p>
                                                    <p className="text-[11px] text-slate-400">{user.mobile || "No mobile"}</p>
                                                </td>

                                                {/* ROLE */}
                                                <td className="py-3 px-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                        {user.role || "Member"}
                                                    </span>
                                                </td>

                                                {/* ACTIONS */}
                                                <td className="py-3 px-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUsers(user.id, user.name)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-slate-400 text-xs">
                                                No members found matching &quot;{searchTerms}&quot;.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}