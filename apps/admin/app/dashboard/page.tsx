"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText, Users, MessageSquare, Briefcase, TrendingUp,
    Plus, ArrowRight, Activity, Globe, FileStack, Clock,
    CheckCircle2, UserPlus, FolderOpen, BarChart3, CalendarDays,
    Megaphone, Zap, ListTodo, Star, Settings, GripVertical,
    X, LayoutDashboard, UserCog, Bell, MapPin, Eye, EyeOff,
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
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
                {[
                    { label: "Present", val: "22", color: "text-emerald-400" },
                    { label: "Leave", val: "2", color: "text-amber-400" },
                    { label: "Absent", val: "1", color: "text-red-400" },
                ].map(s => (
                    <div key={s.label} className="p-2.5 rounded-lg bg-dark-800/50">
                        <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                        <p className="text-[10px] text-neutral-500">{s.label}</p>
                    </div>
                ))}
            </div>
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: "88%" }} />
                <div className="bg-amber-500 h-full" style={{ width: "8%" }} />
                <div className="bg-red-500 h-full" style={{ width: "4%" }} />
            </div>
            <p className="text-xs text-neutral-500 text-center">This Month — 25 working days</p>
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
                        setActiveWidgets(DEFAULT_LAYOUTS[userData?.role || "VIEWER"]);
                    }
                } else {
                    setActiveWidgets(DEFAULT_LAYOUTS[userData?.role || "VIEWER"]);
                }
            } catch (err) {
                console.error("Dashboard init error:", err);
                setActiveWidgets(DEFAULT_LAYOUTS.ADMIN);
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
        setActiveWidgets(DEFAULT_LAYOUTS[user?.role || "ADMIN"]);
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
