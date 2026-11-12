import { useState } from "react";
import api from "../api/axiosInstance";

import { useDispatch } from 'react-redux'

// Mock imports for shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppDispatch } from "../store/store" 
import { login } from "../store/slice/authSlice";
import { useNavigate, Link } from "react-router-dom";
// Import icons for the toggle visibility functionality
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState("");
    
    // State tracker for password visibility toggling
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setErr(""); // Clear previous errors on a new attempt
        setIsLoading(true);

        {/*imp*/}

        try {
            const response = await api.post('/auth/login', {
                email, password
            })

            const data = response.data
            const loggedInUser = data.user

            dispatch(
                login({
                    user: loggedInUser,
                    token: data.token
                })
            )

            navigate('/home')

        } catch (err: any) {
            setErr(
                err.response?.data?.message ||
                "Invalid email or password"
            )
        } finally {
            setIsLoading(false); // Instantly releases state when your real API finishes
        }

        {/*imp*/}
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
            <Card className="w-full max-w-md border-slate-200/80 shadow-lg dark:border-slate-800">
                <CardHeader className="space-y-2 text-center">
                    {/* Custom Slack-like visual logo placeholder */}
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-md">
                        C
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        Sign in to ChatApp
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        We suggest using the **email address you use at work**.
                    </CardDescription>

                    {err && (
                        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-600">
                            {err}
                        </div>
                    )}

                </CardHeader>

                <CardContent className="grid gap-4 mt-5">

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@work-email.com"
                                value={email}
                                onChange={(e: any) => setEmail(e.target.value)}
                                required
                                className="border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-600"
                            />
                        </div>

                        <div className="space-y-1.5 mb-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e: any) => setPassword(e.target.value)}
                                    required
                                    className="border-slate-200 pr-10 dark:border-slate-800 focus-visible:ring-indigo-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 mt-4 hover:bg-indigo-700 text-white font-semibold shadow shadow-indigo-600/20">
                            {isLoading ? "Signing in..." : "Sign In with Email"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center border-t border-slate-100 p-6 dark:border-slate-900">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        New to ChatApp?{" "}
                    <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
                        Create an account
                    </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}