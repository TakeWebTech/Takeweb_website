"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    ArrowRight,
    Shield,
    Zap,
    BarChart3,
    Users,
} from "lucide-react";

const infoSlides = [
    {
        title: "Manage Your Content",
        description: "Create, edit, and publish content with our intuitive dashboard.",
        icon: Zap,
    },
    {
        title: "Real-time Analytics",
        description: "Track visitor engagement and user behavior with live analytics.",
        icon: BarChart3,
    },
    {
        title: "Team Collaboration",
        description: "Work together with role-based access and activity tracking.",
        icon: Users,
    },
    {
        title: "Enterprise Security",
        description: "99.9% uptime with enterprise-grade security and encryption.",
        icon: Shield,
    },
];

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score, label: "Fair", color: "bg-orange-500" };
    if (score <= 3) return { score, label: "Good", color: "bg-yellow-500" };
    if (score <= 4) return { score, label: "Strong", color: "bg-emerald-400" };
    return { score, label: "Excellent", color: "bg-emerald-500" };
}

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % infoSlides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!isLogin && password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }

            const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";
            const body = isLogin
                ? { email, password }
                : { email, password, firstName, lastName };

            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, '');

            const res = await fetch(`${apiUrl}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || (isLogin ? "Invalid credentials" : "Registration failed"));
            }

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const pwStrength = getPasswordStrength(password);
    const SlideIcon = infoSlides[currentSlide]?.icon || Zap;

    return (
        <div className="min-h-screen flex bg-dark-950 overflow-hidden">
            {/* ═══ Left — Form ═══ */}
            <div className="w-full lg:w-[48%] flex items-center justify-center p-6 sm:p-10 relative z-10">
                {/* Glow blob */}
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary-500/8 rounded-full blur-[120px] pointer-events-none" />

                <div className="w-full max-w-[420px] relative">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <Zap size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            Take<span className="text-primary-400">Web</span>
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white mb-1">
                        {isLogin ? "Welcome back" : "Create account"}
                    </h1>
                    <p className="text-sm text-neutral-500 mb-8">
                        {isLogin
                            ? "Sign in to your admin dashboard"
                            : "Get started with your account"}
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-400 text-sm flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-error-500/20 flex items-center justify-center text-xs flex-shrink-0">!</span>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">First Name</label>
                                    <div className="relative">
                                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                            required={!isLogin}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Last Name</label>
                                    <div className="relative">
                                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                            required={!isLogin}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@takeweb.in"
                                    required
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {/* Password Strength */}
                            {password.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-colors ${i < pwStrength.score ? pwStrength.color : "bg-dark-700"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[0.65rem] text-neutral-500 mt-1">{pwStrength.label}</p>
                                </div>
                            )}
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required={!isLogin}
                                        className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Remember me / Forgot */}
                        {isLogin && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded bg-dark-800 border-dark-700 text-primary-500 focus:ring-primary-500/50"
                                    />
                                    <span className="text-xs text-neutral-500">Remember me</span>
                                </label>
                                <button type="button" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? "Sign In" : "Create Account"}
                                    <ArrowRight size={15} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <p className="text-center text-sm text-neutral-500 mt-6">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setError(""); }}
                            className="text-primary-400 font-medium hover:text-primary-300 transition-colors"
                        >
                            {isLogin ? "Sign Up" : "Sign In"}
                        </button>
                    </p>

                    {/* Demo Creds */}
                    {isLogin && (
                        <div className="mt-4 p-3 rounded-lg bg-primary-500/5 border border-primary-500/10 text-center">
                            <p className="text-xs text-neutral-500">
                                <span className="text-primary-400/70 font-medium">Demo:</span> admin@takeweb.in / password123
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ Right — Visual ═══ */}
            <div className="hidden lg:flex w-[52%] relative items-center justify-center overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-dark-900 to-accent-500/10" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "linear-gradient(var(--color-neutral-400) 1px, transparent 1px), linear-gradient(90deg, var(--color-neutral-400) 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                />

                {/* Floating orbs */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />

                {/* Content */}
                <div className="relative z-10 max-w-md px-12">
                    {/* Feature card */}
                    <div className="p-8 rounded-2xl bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 mb-8">
                        <div
                            key={currentSlide}
                            className="animate-fade-in"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-5">
                                <SlideIcon size={22} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {infoSlides[currentSlide]?.title}
                            </h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                {infoSlides[currentSlide]?.description}
                            </p>
                        </div>

                        {/* Dots */}
                        <div className="flex gap-1.5 mt-6">
                            {infoSlides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-6 bg-primary-400" : "w-1.5 bg-dark-600"}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: "99.9%", label: "Uptime" },
                            { value: "15K+", label: "Users" },
                            { value: "4.9★", label: "Rating" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="p-3 rounded-xl bg-dark-800/30 border border-dark-700/30 text-center"
                            >
                                <p className="text-lg font-bold text-white">{stat.value}</p>
                                <p className="text-[0.65rem] text-neutral-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
