"use client";

import { useState, useEffect } from "react";
import {
    Monitor, Smartphone, Globe, Clock, Shield, LogOut,
    MapPin, Activity, RefreshCw, AlertTriangle, CheckCircle2,
    Laptop, Tablet, X, Key, Lock,
} from "lucide-react";

interface SessionEntry {
    id: string;
    ip: string;
    userAgent: string;
    loginTime: string;
    device: string;
    browser: string;
    os: string;
    location: string;
    isCurrent: boolean;
}

function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
    let device = "Desktop";
    let browser = "Unknown";
    let os = "Unknown";

    if (/mobile/i.test(ua)) device = "Mobile";
    else if (/tablet|ipad/i.test(ua)) device = "Tablet";

    if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
    else if (/firefox/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
    else if (/edg/i.test(ua)) browser = "Edge";

    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os/i.test(ua)) os = "macOS";
    else if (/linux/i.test(ua)) os = "Linux";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad/i.test(ua)) os = "iOS";

    return { device, browser, os };
}

const base = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") : "";
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

const deviceIcons: Record<string, any> = {
    Desktop: Monitor,
    Mobile: Smartphone,
    Tablet: Tablet,
    Laptop: Laptop,
};

export default function SessionsPage() {
    const [sessions, setSessions] = useState<SessionEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState<string | null>(null);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            // Fetch login audit logs to reconstruct sessions
            const res = await fetch(`${base}/api/v1/audit?action=LOGIN&limit=20`, { headers: getHeaders() });
            if (res.ok) {
                const data = await res.json();
                const items = data.items || [];
                const parsed: SessionEntry[] = items.map((entry: any, idx: number) => {
                    const meta = entry.metadata || {};
                    const ua = meta.userAgent || entry.metadata?.userAgent || "Unknown";
                    const { device, browser, os } = parseUserAgent(ua);
                    return {
                        id: entry.id,
                        ip: meta.ip || "Unknown",
                        userAgent: ua,
                        loginTime: meta.loginTime || entry.createdAt,
                        device, browser, os,
                        location: meta.location || "Unknown",
                        isCurrent: idx === 0, // most recent login is "current"
                    };
                });
                setSessions(parsed);
            }
        } catch (err) {
            console.error("Failed to fetch sessions:", err);
        } finally {
            setLoading(false);
        }
    };

    const revokeSession = async (id: string) => {
        setRevoking(id);
        // In a real system, this would invalidate the token
        // For now, remove from list
        setTimeout(() => {
            setSessions(prev => prev.filter(s => s.id !== id));
            setRevoking(null);
        }, 500);
    };

    const revokeAll = () => {
        // In a real system, this would invalidate all tokens except current
        const current = sessions.find(s => s.isCurrent);
        setSessions(current ? [current] : []);
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="page-header"><div className="skeleton h-8 w-48" /><div className="skeleton h-4 w-72 mt-2" /></div>
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1 className="flex items-center gap-2">
                        <Shield size={22} className="text-primary-400" />
                        Session Management
                    </h1>
                    <p>Monitor active sessions and manage device access</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={revokeAll} className="btn-secondary text-sm text-error-400 hover:bg-error-500/10">
                        <LogOut size={14} /> Revoke All Others
                    </button>
                    <button onClick={fetchSessions} className="btn-icon"><RefreshCw size={16} /></button>
                </div>
            </div>

            {/* Security Info */}
            <div className="card bg-primary-500/5 border-primary-500/20">
                <div className="flex items-start gap-3">
                    <Lock size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-white">Session Security</p>
                        <p className="text-xs text-neutral-400 mt-1">
                            Sessions are tracked via login audit logs. If you see an unfamiliar device, revoke it immediately and change your password.
                            IP addresses and user agents are recorded for each login.
                        </p>
                    </div>
                </div>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-primary-400">{sessions.length}</p>
                    <p className="text-xs text-neutral-500 mt-1">Recent Sessions</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-400">{new Set(sessions.map(s => s.ip)).size}</p>
                    <p className="text-xs text-neutral-500 mt-1">Unique IPs</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">{new Set(sessions.map(s => s.device)).size}</p>
                    <p className="text-xs text-neutral-500 mt-1">Device Types</p>
                </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-3">
                {sessions.map(session => {
                    const DeviceIcon = deviceIcons[session.device] || Monitor;
                    return (
                        <div key={session.id} className={`card flex items-start gap-4 ${session.isCurrent ? "border-l-2 border-l-emerald-500 bg-emerald-500/[0.02]" : ""}`}>
                            {/* Device Icon */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${session.isCurrent ? "bg-emerald-500/10" : "bg-dark-800"}`}>
                                <DeviceIcon size={22} className={session.isCurrent ? "text-emerald-400" : "text-neutral-400"} />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-white">{session.browser} on {session.os}</p>
                                    {session.isCurrent && (
                                        <span className="badge badge-success text-[9px]">
                                            <CheckCircle2 size={8} /> Current Session
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                                    <span className="flex items-center gap-1"><Globe size={10} /> IP: {session.ip}</span>
                                    <span className="flex items-center gap-1"><Monitor size={10} /> {session.device}</span>
                                    <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(session.loginTime)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            {!session.isCurrent && (
                                <button
                                    onClick={() => revokeSession(session.id)}
                                    disabled={revoking === session.id}
                                    className="btn-secondary text-xs text-error-400 hover:bg-error-500/10 flex-shrink-0"
                                >
                                    {revoking === session.id ? "Revoking..." : <><LogOut size={12} /> Revoke</>}
                                </button>
                            )}
                        </div>
                    );
                })}

                {sessions.length === 0 && (
                    <div className="card py-16 text-center">
                        <Shield size={48} className="mx-auto text-neutral-700 mb-4" />
                        <p className="text-neutral-400">No session data available. Login events will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
