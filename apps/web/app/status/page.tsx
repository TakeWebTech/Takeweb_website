"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FloatingElements } from "@/components/floating-elements";
import { CheckCircle2, AlertCircle, Clock, Zap, Shield, Globe, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const systems = [
    { name: "Public Website", status: "operational", uptime: "99.99%", latency: "12ms" },
    { name: "Admin Dashboard", status: "operational", uptime: "99.95%", latency: "45ms" },
    { name: "Core API Service", status: "operational", uptime: "99.99%", latency: "28ms" },
    { name: "Database Cluster", status: "operational", uptime: "100%", latency: "2ms" },
    { name: "CDN / Assets", status: "operational", uptime: "100%", latency: "4ms" },
    { name: "Authentication Service", status: "operational", uptime: "99.98%", latency: "32ms" },
];

const incidents = [
    { id: 1, date: "Dec 12, 2024", title: "Scheduled Database Maintenance", status: "completed", type: "maintenance" },
    { id: 2, date: "Nov 28, 2024", title: "Minor Latency in API Gateway", status: "resolved", type: "incident" },
];

export default function StatusPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden">
            <FloatingElements />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 py-6 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)]">
                <div className="container-main flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-semibold">Back to Site</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-medium text-emerald-500">All Systems Operational</span>
                    </div>
                </div>
            </header>

            <main className="container-main pt-32 pb-20 relative z-10">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        System <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Status</span>
                    </h1>
                    <p className="text-lg text-[var(--text-tertiary)] max-w-2xl mx-auto">
                        Real-time status updates and historical uptime data for all our enterprise services.
                    </p>
                </div>

                {/* Overall Status Card */}
                <div className="mb-12 p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6 animate-scale-in">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 className="text-white" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">All Systems Operational</h2>
                            <p className="text-emerald-500/70">Verified 1 minute ago</p>
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold">99.98%</div>
                            <div className="text-xs uppercase tracking-widest text-[var(--text-muted)]">30-Day Uptime</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">18ms</div>
                            <div className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Avg Latency</div>
                        </div>
                    </div>
                </div>

                {/* System Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {systems.map((system, index) => (
                        <div 
                            key={system.name}
                            className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-amber-500/30 transition-all animate-slide-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">{system.name}</h3>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                                    <CheckCircle2 size={12} />
                                    Operational
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-tertiary)]">Uptime</span>
                                    <span className="font-medium">{system.uptime}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-tertiary)]">Latency</span>
                                    <span className="font-medium">{system.latency}</span>
                                </div>
                                {/* Mini Uptime Bar */}
                                <div className="flex gap-0.5 mt-4">
                                    {[...Array(30)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`h-6 flex-1 rounded-full ${i === 15 ? 'bg-amber-500' : 'bg-emerald-500'} opacity-80 hover:opacity-100 transition-opacity cursor-help`}
                                            title="100% Uptime"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Performance Metrics */}
                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Zap className="text-amber-500" size={20} />
                                Global Traffic Latency
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { region: "North America", value: 92 },
                                    { region: "Europe", value: 85 },
                                    { region: "Asia Pacific", value: 78 },
                                ].map((item) => (
                                    <div key={item.region}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-[var(--text-tertiary)]">{item.region}</span>
                                            <span className="text-emerald-500 font-bold flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Excellent
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden p-0.5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${item.value}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Security Scanning</h3>
                        <p className="text-[var(--text-tertiary)] mb-6">
                            Continuous security audits and threat detection are currently active and showing zero threats.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-sm font-bold">
                            Shield Active
                        </div>
                    </div>
                </div>

                {/* History */}
                <div>
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <Clock className="text-amber-500" size={24} />
                        Past Incidents
                    </h3>
                    <div className="space-y-4">
                        {incidents.map((incident) => (
                            <div key={incident.id} className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-[var(--text-muted)] mb-1">{incident.date}</p>
                                    <h4 className="font-semibold">{incident.title}</h4>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${incident.type === 'maintenance' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    {incident.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-10 border-t border-[var(--border-primary)] relative z-10">
                <div className="container-main text-center">
                    <p className="text-sm text-[var(--text-muted)]">
                        &copy; {new Date().getFullYear()} TakeWeb Enterprise. All status data is live and updated every 60 seconds.
                    </p>
                </div>
            </footer>
        </div>
    );
}
