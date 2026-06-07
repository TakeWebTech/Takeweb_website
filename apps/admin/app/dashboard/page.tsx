"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
    FileText, Users, MessageSquare, Briefcase, TrendingUp, TrendingDown,
    Plus, ArrowRight, Activity, Globe, FileStack, Clock,
    CheckCircle2, UserPlus, FolderOpen, BarChart3, CalendarDays,
    Megaphone, Zap, ListTodo, Star, Settings, GripVertical,
    X, LayoutDashboard, UserCog, Bell, MapPin, Eye, EyeOff,
    LogIn, LogOut, Building2, User,
} from "lucide-react";

/* ─── Types ─── */
interface WidgetConfig {
    widgetId: string;
    x: number; y: number; w: number; h: number;
    locked?: boolean;
}

interface WidgetDef {
    id: string; name: string; description: string;
    component: React.FC<{ stats: any; user: any }>;
    defaultSize: { w: number; h: number };
    minRole?: string;
}

/* ─── Shared helpers ─── */
const base = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") : "";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
const headers = () => ({ Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" });

/* ═══════════════════════════════════════════════ */
/*          PERMANENT WIDGETS (Non-removable)       */
/* ═══════════════════════════════════════════════ */

/* ─── 1. Profile Card Widget ─── */
function ProfileCardWidget({ user }: { user: any }) {
    const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;
    return (
        <div className="flex items-center gap-5 flex-wrap">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-primary-500/20 flex-shrink-0">
                {initials || "?"}
            </div>
            <div className="flex-1 min-w-[200px]">
                <h3 className="text-lg font-bold text-white">{user?.firstName} {user?.lastName}</h3>
                <p className="text-xs text-neutral-500">{user?.email}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
                {[
                    { label: "Employee ID", value: user?.id?.slice(0, 8)?.toUpperCase() || "—", icon: User, color: "text-blue-400" },
                    { label: "Department", value: user?.department || "General", icon: Building2, color: "text-emerald-400" },
                    { label: "Role", value: user?.role || "—", icon: Star, color: "text-amber-400" },
                    { label: "Manager", value: "Admin", icon: UserCog, color: "text-purple-400" },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800/60 border border-dark-700/50 min-w-[140px]">
                        <item.icon size={14} className={item.color} />
                        <div>
                            <p className="text-[10px] text-neutral-600">{item.label}</p>
                            <p className="text-neutral-300 font-medium">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── 2. Review & Rating Widget ─── */
function ReviewRatingWidget(_: { user: any }) {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetch(`${base}/api/v1/reviews/stats`, { headers: headers() })
            .then(res => res.ok ? res.json() : null)
            .then(data => setStats(data));
    }, []);

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-dark-800/50 border border-dark-700/50 text-center h-full">
                <Star size={32} className="text-dark-600 mb-3 animate-pulse" />
                <h3 className="text-neutral-300 font-medium">Loading Ratings...</h3>
            </div>
        );
    }

    const ratings = [
        { label: "This Week", value: stats.currentWeek?.rating || 0, prev: stats.lastWeek?.rating || 0 },
        { label: "This Month", value: stats.currentMonth?.rating || 0, prev: stats.lastMonth?.rating || 0 },
        { label: "Last Week", value: stats.lastWeek?.rating || 0, prev: 0 },
        { label: "Last Month", value: stats.lastMonth?.rating || 0, prev: 0 },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ratings.map((r) => {
                const trend = r.value - r.prev;
                const isUp = trend >= 0;
                return (
                    <div key={r.label} className="p-3 rounded-xl bg-dark-800/50 border border-dark-700/50 text-center flex flex-col justify-between">
                        <p className="text-[10px] text-neutral-500 mb-1.5">{r.label}</p>
                        <div className="flex items-center justify-center gap-1 mb-1.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={14} className={s <= Math.round(r.value) ? "text-amber-400 fill-amber-400" : "text-dark-600"} />
                            ))}
                        </div>
                        <p className="text-lg font-bold text-white">{r.value.toFixed(1)}</p>
                        {r.prev > 0 ? (
                            <div className={`flex items-center justify-center gap-0.5 text-[10px] mt-1 ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                                {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                <span>{isUp ? "+" : ""}{trend.toFixed(1)} vs prev</span>
                            </div>
                        ) : (
                            <div className="h-4" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ─── 3. Attendance Clock Widget ─── */
function AttendanceClockWidget(_: { user: any }) {
    const [mounted, setMounted] = useState(false);
    const [now, setNow] = useState(new Date());
    const [checkedIn, setCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<Date | null>(null);
    const [elapsed, setElapsed] = useState("00:00:00");
    const [loading, setLoading] = useState(true);
    const [verifyingLocation, setVerifyingLocation] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Initial Fetch + Polling
    useEffect(() => {
        const fetchStatus = () => {
            fetch(`${base}/api/v1/attendance/status`, { headers: headers() })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && data.status === "ACTIVE" && data.checkinTime) {
                        setCheckedIn(true);
                        setCheckInTime(new Date(data.checkinTime));
                    } else {
                        setCheckedIn(false);
                        setCheckInTime(null);
                    }
                })
                .catch(() => {
                    setCheckedIn(false);
                    setCheckInTime(null);
                })
                .finally(() => setLoading(false));
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    // Real-time clock
    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Working time counter
    useEffect(() => {
        if (checkedIn && checkInTime) {
            timerRef.current = setInterval(() => {
                const diff = Date.now() - checkInTime.getTime();
                const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
                setElapsed(`${h}:${m}:${s}`);
            }, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [checkedIn, checkInTime]);

    const handlePunchIn = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        if (verifyingLocation || submitting || checkedIn) return;

        setVerifyingLocation(true);
        setActionMessage("Verifying Location...");
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            try {
                setVerifyingLocation(false);
                setSubmitting(true);
                setActionMessage("Punching In...");
                const res = await fetch(`${base}/api/v1/attendance/punch-in`, {
                    method: "POST",
                    headers: headers(),
                    body: JSON.stringify({ latitude, longitude, accuracy }),
                });
                if (!res.ok) {
                    const errData = await res.json().catch(() => null);
                    throw new Error(errData?.message || "Unable to punch in");
                }
                const data = await res.json();
                setCheckedIn(true); setCheckInTime(new Date(data.checkinTime)); setElapsed("00:00:00");
                setActionMessage("Punch-In Successful");
                toast.success("Punch-In successful");
                setTimeout(() => setActionMessage(null), 2000);
            } catch (err: any) {
                toast.error("Failed to punch in: " + err.message);
                setActionMessage(null);
            } finally {
                setSubmitting(false);
            }
        }, (error) => {
            setVerifyingLocation(false);
            setActionMessage(null);
            toast.error("Location access denied. Cannot punch in.");
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    };

    const handlePunchOut = async () => {
        if (checkInTime) {
            const diffHours = (Date.now() - checkInTime.getTime()) / 3600000;
            if (diffHours < 8) {
                if (!window.confirm("You are punching out early. Your hours will be marked incomplete. Are you sure you want to proceed?")) {
                    return;
                }
            }
        }

        if (verifyingLocation || submitting || !checkedIn) return;
        setSubmitting(true);
        setActionMessage("Punching Out...");
        try {
            const res = await fetch(`${base}/api/v1/attendance/punch-out`, {
                method: "POST", headers: headers()
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.message || "Unable to punch out");
            }
            setCheckedIn(false); if (timerRef.current) clearInterval(timerRef.current);
            toast.success("Punch-Out successful");
            setActionMessage(null);
        } catch (err: any) {
            toast.error("Failed to punch out: " + err.message);
            setActionMessage(null);
        } finally {
            setSubmitting(false);
        }
    };

    const timeStr = mounted ? now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }) : "--:--:--";
    const dateStr = mounted ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "Loading...";

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Live Clock */}
            <div className="text-center sm:text-left flex-shrink-0">
                <p className="text-3xl font-mono font-bold text-white tracking-wider">{timeStr}</p>
                <p className="text-xs text-neutral-500 mt-1">{dateStr}</p>
            </div>

            <div className="h-12 w-px bg-dark-700 hidden sm:block" />

            {/* Punch-In / Punch-Out */}
            <div className="flex items-center gap-3">
                {loading ? (
                    <div className="h-10 w-32 rounded-xl bg-dark-700 animate-pulse" />
                ) : !checkedIn ? (
                    <button
                        onClick={handlePunchIn}
                        disabled={verifyingLocation || submitting}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <LogIn size={16} /> {verifyingLocation ? "Verifying Location..." : submitting ? "Punching In..." : "Punch In"}
                    </button>
                ) : (
                    <button
                        onClick={handlePunchOut}
                        disabled={submitting}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <LogOut size={16} /> {submitting ? "Punching Out..." : "Punch Out"}
                    </button>
                )}
                {actionMessage && (
                    <span className="text-xs text-neutral-400">{actionMessage}</span>
                )}
            </div>

            <div className="h-12 w-px bg-dark-700 hidden sm:block" />

            {/* Status & Working Time */}
            <div className="flex items-center gap-4">
                <div className="text-center">
                    <p className="text-[10px] text-neutral-500 mb-0.5">Status</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${checkedIn ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${checkedIn ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"}`} />
                        {checkedIn ? "Punched In" : "Not Punched In"}
                    </span>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-neutral-500 mb-0.5">Working Time</p>
                    <p className="text-lg font-mono font-bold text-primary-400">{elapsed}</p>
                </div>
                {checkInTime && (
                    <div className="text-center">
                        <p className="text-[10px] text-neutral-500 mb-0.5">Punch-In At</p>
                        <p className="text-xs font-mono text-neutral-300">{checkInTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                    </div>
                )}
            </div>
        </div>
    );
}


/* ─── Widget: Stats Overview ─── */
function StatsOverviewWidget({ stats }: { stats: any; user: any }) {
    const cards = [
        { name: "Employees", value: stats.employees?.total ?? 0, color: "text-blue-400", bg: "bg-blue-500/10", icon: UserCog },
        { name: "Active", value: stats.employees?.active ?? 0, color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
        { name: "Posts", value: stats.totalPosts ?? 0, color: "text-purple-400", bg: "bg-purple-500/10", icon: FileText },
        { name: "Projects", value: stats.totalProjects ?? 0, color: "text-amber-400", bg: "bg-amber-500/10", icon: FolderOpen },
        { name: "Services", value: stats.totalServices ?? 0, color: "text-cyan-400", bg: "bg-cyan-500/10", icon: BarChart3 },
        { name: "Contacts", value: stats.totalContacts ?? 0, color: "text-rose-400", bg: "bg-rose-500/10", icon: MessageSquare },
    ];
    return (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {cards.map(c => (
                <div key={c.name} className="text-center p-3 rounded-lg bg-dark-800/50 border border-dark-700/50">
                    <c.icon size={18} className={`${c.color} mx-auto mb-1.5`} />
                    <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{c.name}</p>
                </div>
            ))}
        </div>
    );
}

/* ─── Widget: Quick Actions ─── */
function QuickActionsWidget(_: { stats: any; user: any }) {
    const actions = [
        { name: "New Post", href: "/dashboard/posts/new", icon: FileText, color: "from-blue-500 to-blue-600" },
        { name: "Add Project", href: "/dashboard/projects/new", icon: FolderOpen, color: "from-purple-500 to-purple-600" },
        { name: "Add Employee", href: "/dashboard/employees/new", icon: UserPlus, color: "from-emerald-500 to-emerald-600" },
        { name: "Add Service", href: "/dashboard/services/new", icon: Briefcase, color: "from-amber-500 to-amber-600" },
        { name: "Add Job", href: "/dashboard/careers/new", icon: UserPlus, color: "from-rose-500 to-rose-600" },
        { name: "Manage Pages", href: "/dashboard/pages", icon: FileStack, color: "from-cyan-500 to-cyan-600" },
    ];
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {actions.map(a => (
                <Link key={a.name} href={a.href} className="flex items-center gap-3 p-2.5 rounded-lg bg-dark-800 border border-dark-700 hover:border-dark-600 transition-all hover:-translate-y-0.5 group">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center flex-shrink-0`}>
                        <a.icon size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{a.name}</span>
                </Link>
            ))}
        </div>
    );
}

/* ─── Widget: Recent Activity ─── */
function RecentActivityWidget(_: { stats: any; user: any }) {
    const [activities, setActivities] = useState<any[]>([]);
    useEffect(() => {
        fetch(`${base}/api/v1/audit?limit=6`, { headers: headers() })
            .then(r => r.ok ? r.json() : { items: [] })
            .then(d => setActivities(d.items || []))
            .catch(() => {});
    }, []);

    const fallback = [
        { action: "login", module: "auth", description: "User logged in", createdAt: new Date().toISOString() },
    ];
    const items = activities.length > 0 ? activities : fallback;

    return (
        <div className="space-y-2.5 max-h-64 overflow-y-auto scrollbar-thin">
            {items.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5">
                    <Activity size={14} className="text-primary-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-300 truncate">{a.description || `${a.action} on ${a.module}`}</p>
                        <p className="text-[10px] text-neutral-600 flex items-center gap-1 mt-0.5">
                            <Clock size={9} /> {new Date(a.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ─── Widget: Announcements ─── */
function AnnouncementsWidget(_: { stats: any; user: any }) {
    return (
        <div className="space-y-3">
            <div className="p-3 rounded-lg bg-primary-500/5 border border-primary-500/20">
                <div className="flex items-center gap-2 mb-1">
                    <Megaphone size={14} className="text-primary-400" />
                    <span className="text-xs font-semibold text-primary-400">Company Update</span>
                </div>
                <p className="text-sm text-neutral-300">Welcome to the new HR Management System! All employees can now customize their dashboard layout.</p>
                <p className="text-[10px] text-neutral-600 mt-1.5">Posted today</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-1">
                    <Bell size={14} className="text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400">Reminder</span>
                </div>
                <p className="text-sm text-neutral-300">Please update your profile information in the Employees section.</p>
                <p className="text-[10px] text-neutral-600 mt-1.5">Posted today</p>
            </div>
        </div>
    );
}

/* ─── Widget: Company Holidays ─── */
function CompanyHolidaysWidget(_: { stats: any; user: any }) {
    const holidays = [
        { name: "New Year's Day", date: "Jan 1", upcoming: false },
        { name: "Republic Day", date: "Jan 26", upcoming: false },
        { name: "Holi", date: "Mar 14", upcoming: false },
        { name: "Good Friday", date: "Apr 18", upcoming: true },
        { name: "May Day", date: "May 1", upcoming: true },
        { name: "Independence Day", date: "Aug 15", upcoming: true },
        { name: "Diwali", date: "Oct 20", upcoming: true },
        { name: "Christmas", date: "Dec 25", upcoming: true },
    ];
    const upcoming = holidays.filter(h => h.upcoming);
    return (
        <div className="space-y-2">
            {upcoming.map(h => (
                <div key={h.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-dark-800/50 hover:bg-dark-800 transition-colors">
                    <div className="flex items-center gap-2.5">
                        <CalendarDays size={14} className="text-amber-400" />
                        <span className="text-sm text-neutral-300">{h.name}</span>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">{h.date}</span>
                </div>
            ))}
        </div>
    );
}

/* ─── Widget: Attendance Summary ─── */
function AttendanceSummaryWidget(_: { stats: any; user: any }) {
    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        fetch(`${base}/api/v1/attendance/analytics`, { headers: headers() })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => setAnalytics(data))
            .catch(() => setAnalytics(null));
    }, []);

    const present = analytics?.presentDays ?? 0;
    const late = analytics?.lateCount ?? 0;
    const absent = analytics?.absentDays ?? 0;
    const total = analytics?.totalWorkingDays ?? Math.max(1, present + late + absent);
    const presentPct = Math.min(100, Math.round((present / total) * 100));
    const latePct = Math.min(100, Math.round((late / total) * 100));
    const absentPct = Math.max(0, 100 - presentPct - latePct);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
                {[
                    { label: "Present", val: present.toString(), color: "text-emerald-400" },
                    { label: "Late", val: late.toString(), color: "text-amber-400" },
                    { label: "Absent", val: absent.toString(), color: "text-red-400" },
                ].map(s => (
                    <div key={s.label} className="p-2.5 rounded-lg bg-dark-800/50">
                        <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                        <p className="text-[10px] text-neutral-500">{s.label}</p>
                    </div>
                ))}
            </div>
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${presentPct}%` }} />
                <div className="bg-amber-500 h-full" style={{ width: `${latePct}%` }} />
                <div className="bg-red-500 h-full" style={{ width: `${absentPct}%` }} />
            </div>
            <p className="text-xs text-neutral-500 text-center">This Month — {total} working days</p>
        </div>
    );
}

/* ─── Widget: Content Overview ─── */
function ContentOverviewWidget({ stats }: { stats: any; user: any }) {
    const items = [
        { label: "Blog Posts", value: stats.totalPosts ?? 0, max: 50, color: "bg-blue-500" },
        { label: "Projects", value: stats.totalProjects ?? 0, max: 30, color: "bg-purple-500" },
        { label: "Services", value: stats.totalServices ?? 0, max: 20, color: "bg-emerald-500" },
        { label: "Team", value: stats.totalTeamMembers ?? 0, max: 30, color: "bg-amber-500" },
        { label: "Open Jobs", value: stats.totalCareers ?? 0, max: 15, color: "bg-rose-500" },
    ];
    return (
        <div className="space-y-3">
            {items.map(item => (
                <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-neutral-400">{item.label}</span>
                        <span className="text-xs font-medium text-white">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ─── Widget: Website Pages ─── */
function WebsitePagesWidget(_: { stats: any; user: any }) {
    const pages = [
        { name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: "Services", path: "/services" },
        { name: "Projects", path: "/projects" }, { name: "Contact", path: "/contact" }, { name: "Blog", path: "/blog" },
        { name: "Careers", path: "/careers" },
    ];
    return (
        <div className="space-y-1">
            {pages.map(p => (
                <div key={p.path} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-dark-800 transition-colors">
                    <div className="flex items-center gap-2">
                        <Globe size={12} className="text-neutral-500" />
                        <span className="text-sm text-neutral-300">{p.name}</span>
                    </div>
                    <span className="badge badge-success text-[9px]"><CheckCircle2 size={8} /> Live</span>
                </div>
            ))}
        </div>
    );
}

/* ─── Widget: Notifications ─── */
function NotificationsWidget(_: { stats: any; user: any }) {
    return (
        <div className="space-y-2.5">
            {[
                { msg: "3 new contact form submissions", type: "info", icon: MessageSquare },
                { msg: "Employee review deadline in 5 days", type: "warn", icon: Clock },
                { msg: "System update scheduled tonight", type: "info", icon: Zap },
            ].map((n, i) => (
                <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg ${n.type === "warn" ? "bg-amber-500/5 border border-amber-500/20" : "bg-dark-800/50 border border-dark-700/50"}`}>
                    <n.icon size={14} className={n.type === "warn" ? "text-amber-400 mt-0.5" : "text-primary-400 mt-0.5"} />
                    <p className="text-sm text-neutral-300">{n.msg}</p>
                </div>
            ))}
        </div>
    );
}

/* ─── Widget Registry ─── */
const WIDGET_REGISTRY: WidgetDef[] = [
    { id: "stats-overview", name: "Stats Overview", description: "Key metrics at a glance", component: StatsOverviewWidget, defaultSize: { w: 12, h: 2 } },
    { id: "quick-actions", name: "Quick Actions", description: "Shortcuts to common tasks", component: QuickActionsWidget, defaultSize: { w: 8, h: 3 } },
    { id: "notifications", name: "Notifications", description: "Alerts & reminders", component: NotificationsWidget, defaultSize: { w: 4, h: 3 } },
    { id: "recent-activity", name: "Recent Activity", description: "Latest system activity", component: RecentActivityWidget, defaultSize: { w: 6, h: 3 } },
    { id: "announcements", name: "Announcements", description: "Company & team notes", component: AnnouncementsWidget, defaultSize: { w: 6, h: 3 } },
    { id: "attendance-summary", name: "Attendance Summary", description: "Monthly attendance", component: AttendanceSummaryWidget, defaultSize: { w: 4, h: 3 } },
    { id: "company-holidays", name: "Company Holidays", description: "Upcoming holidays", component: CompanyHolidaysWidget, defaultSize: { w: 4, h: 3 } },
    { id: "content-overview", name: "Content Overview", description: "Content progress bars", component: ContentOverviewWidget, defaultSize: { w: 6, h: 3 } },
    { id: "website-pages", name: "Website Pages", description: "Live pages status", component: WebsitePagesWidget, defaultSize: { w: 6, h: 3 } },
];

/* ─── Default Layouts by Role ─── */
const DEFAULT_LAYOUTS: Record<string, string[]> = {
    ADMIN: ["stats-overview", "quick-actions", "notifications", "recent-activity", "announcements", "attendance-summary", "company-holidays", "content-overview", "website-pages"],
    EDITOR: ["stats-overview", "quick-actions", "recent-activity", "content-overview", "announcements"],
    AUTHOR: ["stats-overview", "quick-actions", "announcements", "company-holidays", "attendance-summary"],
    VIEWER: ["stats-overview", "announcements", "company-holidays", "website-pages"],
};

/* ─── Main Dashboard ─── */
export default function DashboardPage() {
    const [stats, setStats] = useState<any>({});
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
    const [showAddWidget, setShowAddWidget] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const token = getToken();
                const h = { Authorization: `Bearer ${token}` };

                // Fetch user info
                const profileRes = await fetch(`${base}/api/v1/auth/profile`, { headers: h });
                const userData = profileRes.ok ? await profileRes.json() : null;
                setUser(userData);

                // Fetch all stats
                const [posts, team, contacts, careers, projects, services, empStats] = await Promise.allSettled([
                    fetch(`${base}/api/v1/blog/admin/all`, { headers: h }).then(r => r.ok ? r.json() : []),
                    fetch(`${base}/api/v1/team/admin/all`, { headers: h }).then(r => r.ok ? r.json() : []),
                    fetch(`${base}/api/v1/contact/admin/all`, { headers: h }).then(r => r.ok ? r.json() : []),
                    fetch(`${base}/api/v1/careers/admin/all`, { headers: h }).then(r => r.ok ? r.json() : []),
                    fetch(`${base}/api/v1/projects/admin/all`, { headers: h }).then(r => r.ok ? r.json() : []),
                    fetch(`${base}/api/v1/services/admin/all`, { headers: h }).then(r => r.ok ? r.json() : []),
                    fetch(`${base}/api/v1/employees/stats`, { headers: h }).then(r => r.ok ? r.json() : {}),
                ]);

                setStats({
                    totalPosts: posts.status === "fulfilled" && Array.isArray(posts.value) ? posts.value.length : 0,
                    totalTeamMembers: team.status === "fulfilled" && Array.isArray(team.value) ? team.value.length : 0,
                    totalContacts: contacts.status === "fulfilled" && Array.isArray(contacts.value) ? contacts.value.length : 0,
                    totalCareers: careers.status === "fulfilled" && Array.isArray(careers.value) ? careers.value.length : 0,
                    totalProjects: projects.status === "fulfilled" && Array.isArray(projects.value) ? projects.value.length : 0,
                    totalServices: services.status === "fulfilled" && Array.isArray(services.value) ? services.value.length : 0,
                    employees: empStats.status === "fulfilled" ? empStats.value : {},
                });

                // Load saved layout or use role defaults
                const layoutRes = await fetch(`${base}/api/v1/dashboard-config/layout`, { headers: h });
                if (layoutRes.ok) {
                    const layout = await layoutRes.json();
                    if (layout.widgets && Array.isArray(layout.widgets) && layout.widgets.length > 0) {
                        setActiveWidgets(layout.widgets.map((w: any) => w.widgetId));
                    } else {
                        setActiveWidgets(DEFAULT_LAYOUTS[userData?.role || "VIEWER"] ?? []);
                    }
                } else {
                    setActiveWidgets(DEFAULT_LAYOUTS[userData?.role || "VIEWER"] ?? []);
                }
            } catch (err) {
                console.error("Dashboard init error:", err);
                setActiveWidgets(DEFAULT_LAYOUTS.ADMIN ?? []);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const addWidget = (id: string) => {
        if (!activeWidgets.includes(id)) {
            setActiveWidgets([...activeWidgets, id]);
        }
        setShowAddWidget(false);
    };

    const removeWidget = (id: string) => {
        setActiveWidgets(activeWidgets.filter(w => w !== id));
    };

    const moveWidget = (index: number, direction: "up" | "down") => {
        const arr = [...activeWidgets];
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= arr.length) return;
        [arr[index], arr[target]] = [arr[target]!, arr[index]!];
        setActiveWidgets(arr);
    };

    const saveLayout = async () => {
        try {
            const widgets = activeWidgets.map((id, i) => ({ widgetId: id, x: 0, y: i, w: 12, h: 2 }));
            await fetch(`${base}/api/v1/dashboard-config/layout`, {
                method: "POST",
                headers: headers(),
                body: JSON.stringify({ name: "Default", widgets, isDefault: true }),
            });
            setEditMode(false);
        } catch (err) { console.error(err); }
    };

    const resetDefaults = () => {
        setActiveWidgets(DEFAULT_LAYOUTS[user?.role || "ADMIN"] ?? []);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="page-header"><div className="skeleton h-8 w-48" /><div className="skeleton h-4 w-72 mt-2" /></div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
                <div className="grid lg:grid-cols-2 gap-6">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-48 rounded-xl" />)}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1 className="flex items-center gap-2">
                        <LayoutDashboard size={22} className="text-primary-400" />
                        {user ? `Welcome, ${user.firstName}` : "Dashboard"}
                    </h1>
                    <p>{user?.role === "ADMIN" ? "Enterprise overview — customize your workspace" : "Your personalized workspace"}</p>
                </div>
                <div className="flex items-center gap-2">
                    {editMode ? (
                        <>
                            <button onClick={() => setShowAddWidget(true)} className="btn-secondary text-sm"><Plus size={14} /> Add Widget</button>
                            <button onClick={resetDefaults} className="btn-secondary text-sm">Reset</button>
                            <button onClick={() => setEditMode(false)} className="btn-secondary text-sm"><X size={14} /> Cancel</button>
                            <button onClick={saveLayout} className="btn-primary text-sm"><CheckCircle2 size={14} /> Save</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setEditMode(true)} className="btn-secondary text-sm"><Settings size={14} /> Customize</button>
                            <Link href="/dashboard/posts/new" className="btn-primary text-sm"><Plus size={14} /> New Post</Link>
                        </>
                    )}
                </div>
            </div>

            {/* ═══ Permanent Widgets (Cannot be removed) ═══ */}
            <div className="space-y-4">
                <div className="card border-primary-500/10 bg-gradient-to-r from-dark-850 to-dark-900">
                    <div className="flex items-center gap-2 mb-3">
                        <User size={16} className="text-primary-400" />
                        <h2 className="text-sm font-semibold text-white">My Profile</h2>
                    </div>
                    <ProfileCardWidget user={user} />
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                    <div className="card">
                        <div className="flex items-center gap-2 mb-3">
                            <Star size={16} className="text-amber-400" />
                            <h2 className="text-sm font-semibold text-white">Review & Rating</h2>
                        </div>
                        <ReviewRatingWidget user={user} />
                    </div>
                    <div className="card">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock size={16} className="text-emerald-400" />
                            <h2 className="text-sm font-semibold text-white">Attendance</h2>
                        </div>
                        <AttendanceClockWidget user={user} />
                    </div>
                </div>
            </div>

            {/* Widgets */}
            <div className="space-y-4">
                {activeWidgets.map((widgetId, index) => {
                    const def = WIDGET_REGISTRY.find(w => w.id === widgetId);
                    if (!def) return null;
                    const Comp = def.component;
                    return (
                        <div key={widgetId} className={`card relative ${editMode ? "ring-1 ring-primary-500/30 ring-offset-1 ring-offset-dark-900" : ""}`}>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                                    {editMode && <GripVertical size={14} className="text-neutral-600 cursor-grab" />}
                                    {def.name}
                                </h2>
                                {editMode && (
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => moveWidget(index, "up")} disabled={index === 0} className="btn-icon disabled:opacity-30" title="Move up">↑</button>
                                        <button onClick={() => moveWidget(index, "down")} disabled={index === activeWidgets.length - 1} className="btn-icon disabled:opacity-30" title="Move down">↓</button>
                                        <button onClick={() => removeWidget(widgetId)} className="btn-icon hover:text-error-400" title="Remove"><X size={14} /></button>
                                    </div>
                                )}
                            </div>
                            <Comp stats={stats} user={user} />
                        </div>
                    );
                })}
            </div>

            {activeWidgets.length === 0 && (
                <div className="card py-16 text-center">
                    <LayoutDashboard size={48} className="mx-auto text-neutral-700 mb-4" />
                    <p className="text-neutral-400 mb-4">Your dashboard is empty</p>
                    <button onClick={() => setShowAddWidget(true)} className="btn-primary"><Plus size={16} /> Add Widgets</button>
                </div>
            )}

            {/* Add Widget Modal */}
            {showAddWidget && (
                <div className="modal-overlay" onClick={() => setShowAddWidget(false)}>
                    <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white">Add Widget</h2>
                            <button onClick={() => setShowAddWidget(false)} className="btn-icon"><X size={18} /></button>
                        </div>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                            {WIDGET_REGISTRY.map(w => {
                                const isActive = activeWidgets.includes(w.id);
                                return (
                                    <div key={w.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isActive ? "bg-primary-500/5 border-primary-500/30" : "bg-dark-800 border-dark-700 hover:border-dark-600"}`}>
                                        <div>
                                            <p className="text-sm font-medium text-white">{w.name}</p>
                                            <p className="text-xs text-neutral-500">{w.description}</p>
                                        </div>
                                        {isActive ? (
                                            <span className="text-xs text-primary-400 flex items-center gap-1"><Eye size={12} /> Active</span>
                                        ) : (
                                            <button onClick={() => addWidget(w.id)} className="btn-primary text-xs px-3 py-1"><Plus size={12} /> Add</button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
