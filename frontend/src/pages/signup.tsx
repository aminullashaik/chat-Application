import api from "../api/axiosInstance";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

export default function SignUp() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [mobile, setMobile] = useState("");
        const [password, setPassword] = useState("");
        const [role, setRole] = useState("");
    
        const [isLoading, setIsLoading] = useState(false);
        const [err, setErr] = useState("");
    
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setErr("");
            setIsLoading(true);

            try {
                await api.post("/users/signUp", {
                    name: name.trim(),
                    email: email.trim(),
                    mobile: mobile.trim(),
                    password: password,
                    role: role.trim(),
                });

                navigate("/login");
            } catch (error: any){
                if(error.response?.data?.message) {
                    setErr(error.response.data.message);
                } else{
                    setErr("Something went wrong");
                }
            }finally{
                setIsLoading(false);
            }
};
return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md border-slate-200/80 bg-white shadow-lg">
                <CardHeader className="space-y-2 text-center pb-2">
                    {/* Slack-like visual logo placeholder */}
                    <div className="mx-auto flex h-11 w-20 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md text-lg">
                        SignUp
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        Enter your details
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-xs">
                        We suggest using the <strong>email address you use at work</strong>.
                    </CardDescription>

                    {/* Error Banner */}
                    {err && (
                        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600 font-medium text-left">
                            {err}
                        </div>
                    )}
                </CardHeader>

                <CardContent className="grid gap-4 mt-2">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-slate-700 text-xs font-semibold">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder=""
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-10 border-slate-200 focus-visible:ring-indigo-600 text-slate-900"
                            />
                        </div>

                        {/* Work Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-slate-700 text-xs font-semibold">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-10 border-slate-200 focus-visible:ring-indigo-600 text-slate-900"
                            />
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-1.5">
                            <Label htmlFor="mobile" className="text-slate-700 text-xs font-semibold">
                                Mobile Number
                            </Label>
                            <Input
                                id="mobile"
                                type="tel"
                                placeholder=""
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                                className="h-10 border-slate-200 focus-visible:ring-indigo-600 text-slate-900"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-slate-700 text-xs font-semibold">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder=""
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-10 border-slate-200 focus-visible:ring-indigo-600 text-slate-900"
                            />
                            <p className="text-[11px] text-slate-400">Must be at least 6 characters</p>
                        </div>

                        
                        {/* Role / Job Title Dropdown */}
                        <div className="space-y-1.5">
                            <Label htmlFor="role" className="text-slate-700 text-xs font-semibold">
                            Your Role in the Organization
                            </Label>
                            <div className="relative">
                                <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all cursor-pointer shadow-xs"
                            >
                            <option value="Software Developer">Software Developer</option>
                            <option value="Associate Developer">Associate Developer</option>
                            <option value="Tester">Tester</option>
                            <option value="HR">HR</option>
                            <option value="Manager">Project Manager</option>
                            <option value="Marketing">Marketing Specialist</option>
                            <option value="Designer">UI / UX Designer</option>
                            </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 mt-2 hover:bg-indigo-700 text-white font-semibold h-10 shadow shadow-indigo-600/20 cursor-pointer"
                        >
                            {isLoading ? "Creating Account..." : "Continue with Email"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center border-t border-slate-100 p-5 mt-2">
                    <p className="text-xs text-slate-500">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}