"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Invalid credentials");
            }

            // Store token
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-20"
                    style={{
                        background: "linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))",
                        top: "-200px",
                        right: "-100px",
                    }}
                />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 text-2xl font-bold">
                        <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                            TW
                        </span>
                        <span className="text-white">TakeWeb</span>
                    </div>
                    <p className="text-neutral-400 mt-2">Admin Dashboard</p>
                </div>

                {/* Login Form */}
                <div className="card">
                    <h1 className="text-xl font-semibold text-white mb-6">Sign in to your account</h1>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1.5">
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@takeweb.in"
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
                        <p className="text-sm text-neutral-500">
                            Demo credentials: admin@takeweb.in / password123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
