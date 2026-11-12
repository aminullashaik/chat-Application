import { useState } from "react";
// Mock imports for shadcn/ui components
import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
// Import icons for the toggle visibility functionality
import { Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPage() {
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // State managers for tracking visibility options separately
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Quick frontend validation
        if (newPassword === oldPassword) {
            setError("New Password and old password must be different.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);

        {/*imp*/}
        try {
            await api.put('/auth/change-password', {
                oldPassword,
                newPassword
            });

            setSuccess("Password changed successfully.");
            setOldPassword('');
            setNewPassword('');

            // Turn off loading states upon successful resolution
            setIsLoading(false);

            setTimeout(() => {
                navigate('/login');
            }, 1200);

        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update password.");
            setIsLoading(false);
        }
        {/*imp*/}
        
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
            <Card className="w-full max-w-md border-slate-200/80 shadow-lg dark:border-slate-800">
                <CardHeader className="space-y-1.5 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        Change Password
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Choose a strong password to keep your account secure.
                    </CardDescription>
                </CardHeader>

                <CardContent className="mt-5 mb-2">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Status Messages */}
                        {error && (
                            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive dark:bg-destructive/20">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                {success}
                            </div>
                        )}

                        {/* Current Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="oldPassword" className="text-slate-700 dark:text-slate-300">
                                Old Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="oldPassword"
                                    type={showOldPassword ? "text" : "password"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                    className="border-slate-200 pr-10 dark:border-slate-800 focus-visible:ring-indigo-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    aria-label={showOldPassword ? "Hide password" : "Show password"}
                                >
                                    {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="newPassword" className="text-slate-700 dark:text-slate-300">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="border-slate-200 pr-10 dark:border-slate-800 focus-visible:ring-indigo-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 mt-4 hover:bg-indigo-700 text-white font-semibold shadow shadow-indigo-600/20"
                        >
                            {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center border-t border-slate-100 p-4 dark:border-slate-900">
                    <a href="#back" className="text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                        Cancel and return to Home
                    </a>
                </CardFooter>
            </Card>
        </div>
    );
}