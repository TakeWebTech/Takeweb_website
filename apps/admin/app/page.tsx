"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Rotating testimonials/info for the right panel
const infoSlides = [
    {
        title: "Manage Your Content",
        description: "Create, edit, and publish content with our intuitive dashboard. Full control at your fingertips.",
        icon: "📝",
    },
    {
        title: "Real-time Analytics",
        description: "Track visitor engagement, page views, and user behavior with live analytics.",
        icon: "📊",
    },
    {
        title: "Team Collaboration",
        description: "Work together seamlessly with role-based access and activity tracking.",
        icon: "👥",
    },
    {
        title: "Secure & Reliable",
        description: "Enterprise-grade security with 99.9% uptime guarantee for peace of mind.",
        icon: "🔒",
    },
];

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
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-rotate info slides
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

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${endpoint}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || (isLogin ? "Invalid credentials" : "Registration failed"));
            }

            // Store token
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to dashboard
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

    // Password visibility toggle component
    const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
        <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
            {show ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )}
        </button>
    );

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative z-10">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                            <Image
                                src="/logo.png"
                                alt="TakeWeb"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-2xl font-bold" style={{ color: '#b39b5e' }}>
                            TakeWeb
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isLogin ? "LOGIN" : "SIGN UP"}
                    </h1>
                    <p className="text-gray-500 mb-8">
                        {isLogin
                            ? "Welcome back! Please sign in to your account."
                            : "Create an account to get started."}
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Sign Up Fields */}
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            👤
                                        </span>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                            required={!isLogin}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': '#b39b5e' } as React.CSSProperties}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            👤
                                        </span>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                            required={!isLogin}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': '#b39b5e' } as React.CSSProperties}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                {isLogin ? "Username" : "Email"}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    👤
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@takeweb.in"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                    style={{ '--tw-ring-color': '#b39b5e' } as React.CSSProperties}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔒
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                    style={{ '--tw-ring-color': '#b39b5e' } as React.CSSProperties}
                                />
                                <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                            </div>
                        </div>

                        {/* Confirm Password (Sign Up only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        🔒
                                    </span>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required={!isLogin}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                        style={{ '--tw-ring-color': '#b39b5e' } as React.CSSProperties}
                                    />
                                    <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #b39b5e 0%, #d4b86a 50%, #b39b5e 100%)',
                                boxShadow: '0 10px 30px -10px rgba(179, 155, 94, 0.4)'
                            }}
                        >
                            {loading ? "Please wait..." : isLogin ? "Login Now" : "Create Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-sm text-gray-400">
                            {isLogin ? "Login with Others" : "Or sign up with"}
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Login with Google
                        </button>

                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                        >
                            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Login with Facebook
                        </button>
                    </div>

                    {/* Toggle Login/Signup */}
                    <p className="text-center text-gray-500 mt-8">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError("");
                            }}
                            className="font-semibold transition-colors"
                            style={{ color: '#b39b5e' }}
                        >
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </p>

                    {/* Demo Credentials */}
                    {isLogin && (
                        <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(179, 155, 94, 0.1)', borderColor: 'rgba(179, 155, 94, 0.2)' }}>
                            <p className="text-sm text-center" style={{ color: '#8a7a4a' }}>
                                <strong>Demo:</strong> admin@takeweb.in / password123
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #b39b5e 0%, #d4b86a 30%, #c9a85c 60%, #a08a50 100%)' }}>
                {/* Animated Background Balls */}
                <div className="absolute inset-0">
                    {/* Large Ball - Top Left */}
                    <div
                        className="absolute w-64 h-64 rounded-full animate-float"
                        style={{
                            top: "-5%",
                            left: "-5%",
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(2px)',
                            animationDuration: "8s",
                        }}
                    />
                    {/* Medium Ball - Bottom Right */}
                    <div
                        className="absolute w-48 h-48 rounded-full animate-float-reverse"
                        style={{
                            bottom: "-10%",
                            right: "-5%",
                            background: 'rgba(255, 255, 255, 0.1)',
                            animationDuration: "10s",
                        }}
                    />
                    {/* Small Ball - Center Left */}
                    <div
                        className="absolute w-20 h-20 rounded-full animate-pulse-slow"
                        style={{
                            top: "40%",
                            left: "15%",
                            background: 'rgba(255, 255, 255, 0.2)',
                        }}
                    />
                    {/* Extra Small Ball - Right */}
                    <div
                        className="absolute w-12 h-12 rounded-full animate-float"
                        style={{
                            top: "25%",
                            right: "20%",
                            background: 'rgba(255, 255, 255, 0.25)',
                            animationDuration: "6s",
                        }}
                    />
                    {/* Another Small Ball */}
                    <div
                        className="absolute w-16 h-16 rounded-full animate-float-reverse"
                        style={{
                            bottom: "30%",
                            left: "25%",
                            background: 'rgba(255, 255, 255, 0.15)',
                            animationDuration: "7s",
                        }}
                    />
                    {/* Wavy Lines Background Pattern */}
                    <svg
                        className="absolute inset-0 w-full h-full opacity-10"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,50 Q25,30 50,50 T100,50"
                            fill="none"
                            stroke="white"
                            strokeWidth="0.5"
                        />
                        <path
                            d="M0,60 Q25,40 50,60 T100,60"
                            fill="none"
                            stroke="white"
                            strokeWidth="0.3"
                        />
                        <path
                            d="M0,40 Q25,20 50,40 T100,40"
                            fill="none"
                            stroke="white"
                            strokeWidth="0.3"
                        />
                    </svg>
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
                    {/* Illustration Area with Glass Card */}
                    <div className="relative mb-8">
                        {/* Glass Card Behind - More transparent for readability */}
                        <div
                            className="absolute -inset-8 rounded-3xl border border-white/30"
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                            }}
                        />

                        {/* Image Placeholder - Woman with Tablet */}
                        <div className="relative w-72 h-80 flex items-center justify-center">
                            <div
                                className="w-full h-full rounded-2xl flex items-center justify-center"
                                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                <div className="text-center">
                                    <div className="text-6xl mb-4">👩‍💼</div>
                                    <p className="text-white/90 text-sm font-medium">Admin Dashboard</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full p-3 shadow-xl">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg" style={{ background: 'linear-gradient(135deg, #b39b5e, #d4b86a)' }}>
                                ⚡
                            </div>
                        </div>
                    </div>

                    {/* Rotating Info with Transparent Card */}
                    <div
                        className="text-center max-w-md mt-8 p-8 rounded-2xl border border-white/20"
                        style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <div
                            key={currentSlide}
                            className="animate-fade-in-up"
                        >
                            <div className="text-4xl mb-4">{infoSlides[currentSlide]?.icon}</div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {infoSlides[currentSlide]?.title}
                            </h3>
                            <p className="text-white/90 leading-relaxed">
                                {infoSlides[currentSlide]?.description}
                            </p>
                        </div>

                        {/* Slide Indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {infoSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: index === currentSlide ? '2rem' : '0.5rem',
                                        background: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.4)',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    25% {
                        transform: translateY(-20px) translateX(10px);
                    }
                    50% {
                        transform: translateY(0) translateX(20px);
                    }
                    75% {
                        transform: translateY(20px) translateX(10px);
                    }
                }

                @keyframes float-reverse {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    25% {
                        transform: translateY(20px) translateX(-10px);
                    }
                    50% {
                        transform: translateY(0) translateX(-20px);
                    }
                    75% {
                        transform: translateY(-20px) translateX(-10px);
                    }
                }

                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.6;
                        transform: scale(1.1);
                    }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }

                .animate-float-reverse {
                    animation: float-reverse 10s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}
