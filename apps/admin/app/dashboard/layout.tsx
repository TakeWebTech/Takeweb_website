"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    FolderOpen,
    MessageSquare,
    Image,
    Settings,
    LogOut,
    Menu,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    Bell,
    Globe,
    FileStack,
    Quote,
    X,
    ChevronDown,
    ExternalLink,
    Activity,
    Shield,
    SearchCheck,
    Building2,
    Key,
    Gavel,
    UserCog,
    Palette,
    User,
    Star,
    CalendarDays,
    Clock,
    Monitor,
} from "lucide-react";

/* ─── Role hierarchy ─── */
const ROLE_HIERARCHY: Record<string, number> = { VIEWER: 0, AUTHOR: 1, EDITOR: 2, ADMIN: 3 };
function hasRole(userRole: string, minRole: string): boolean {
    return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
}

/* ─── Nav data — collapsible dropdown sections ─── */
interface NavItem { name: string; href: string; icon: any; minRole?: string; }
interface NavSection { label: string; icon: any; minRole?: string; items: NavItem[]; }
const navSections: NavSection[] = [
    {
        label: "Main",
        icon: LayoutDashboard,
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
        ],
    },
    {
        label: "Profile",
        icon: User,
        items: [
            { name: "My Profile", href: "/dashboard/profile", icon: User },
            { name: "Rating", href: "/dashboard/profile/rating", icon: Star },
            { name: "Attendance", href: "/dashboard/profile/attendance", icon: Clock },
            { name: "Calendar", href: "/dashboard/profile/calendar", icon: CalendarDays },
        ],
    },
    {
        label: "Website",
        icon: Globe,
        minRole: "AUTHOR",
        items: [
            { name: "Pages", href: "/dashboard/pages", icon: FileStack, minRole: "EDITOR" },
            { name: "Blog Posts", href: "/dashboard/posts", icon: FileText },
            { name: "Services", href: "/dashboard/services", icon: Briefcase, minRole: "EDITOR" },
            { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
            { name: "Testimonials", href: "/dashboard/testimonials", icon: Quote, minRole: "EDITOR" },
            { name: "SEO Engine", href: "/dashboard/seo", icon: SearchCheck, minRole: "ADMIN" },
        ],
    },
    {
        label: "Management",
        icon: UserCog,
        minRole: "EDITOR",
        items: [
            { name: "Employees", href: "/dashboard/employees", icon: UserCog, minRole: "ADMIN" },
            { name: "Overtime Requests", href: "/dashboard/attendance/overtime-requests", icon: Clock, minRole: "ADMIN" },
            { name: "Careers", href: "/dashboard/careers", icon: UserPlus },
            { name: "Contact", href: "/dashboard/contact", icon: MessageSquare },
            { name: "Media", href: "/dashboard/media", icon: Image },
            { name: "Activity Log", href: "/dashboard/activity", icon: Activity, minRole: "ADMIN" },
        ],
    },
    {
        label: "TWadmin",
        icon: Shield,
        minRole: "ADMIN",
        items: [
            { name: "Overview", href: "/dashboard/twadmin", icon: Shield },
            { name: "Groups", href: "/dashboard/twadmin/groups", icon: Building2 },
            { name: "Roles", href: "/dashboard/twadmin/roles", icon: Key },
            { name: "Rules", href: "/dashboard/twadmin/rules", icon: Gavel },
            { name: "Dashboard Config", href: "/dashboard/twadmin/dashboard-config", icon: Palette },
            { name: "Sessions", href: "/dashboard/sessions", icon: Monitor },
            { name: "Settings", href: "/dashboard/settings", icon: Settings },
        ],
    },
];

/* ─── breadcrumb helper ─── */
function getBreadcrumbs(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((seg, i) => ({
        label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
        href: "/" + segments.slice(0, i + 1).join("/"),
        isLast: i === segments.length - 1,
    }));
}

/* ═══════════════════════════════════════ */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    /* sidebar state */
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    /* Collapsible section state */
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(["Main"]));

    /* user & UI */
    const [user, setUser] = useState<any>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    /* hydrate */
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");
        if (!token) { router.push("/"); return; }
        if (userData) setUser(JSON.parse(userData));
        const saved = localStorage.getItem("sidebarCollapsed");
        if (saved === "true") setCollapsed(true);
    }, [router]);

    // Fetch Notifications
    useEffect(() => {
        if (!user) return;
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const fetchNotifs = async () => {
            try {
                const res = await fetch(`${base}/api/v1/notifications`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" }
                });
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data);
                }
            } catch (err) {}
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 60000); // refresh every minute
        return () => clearInterval(interval);
    }, [user]);

    const handleMarkAsRead = async (id: string) => {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        try {
            await fetch(`${base}/api/v1/notifications/${id}/read`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {}
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    /* Auto-expand active section */
    useEffect(() => {
        const activeSection = navSections.find(section =>
            section.items.some(item => pathname === item.href || pathname.startsWith(item.href + "/"))
        );
        if (activeSection) {
            setOpenSections(prev => {
                const next = new Set(prev);
                next.add(activeSection.label);
                return next;
            });
        }
    }, [pathname]);

    const toggleSection = (label: string) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            next.has(label) ? next.delete(label) : next.add(label);
            return next;
        });
    };

    const toggleCollapsed = useCallback(() => {
        setCollapsed((prev) => {
            localStorage.setItem("sidebarCollapsed", String(!prev));
            return !prev;
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        router.push("/");
    };

    // Close mobile nav on route change
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = () => { setUserMenuOpen(false); setNotifOpen(false); };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const breadcrumbs = getBreadcrumbs(pathname);
    const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

    return (
        <div className="flex h-screen overflow-hidden bg-dark-950">
            {/* ──── Mobile backdrop ──── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ════════════ SIDEBAR ════════════ */}
            <aside
                className={`
                    sidebar fixed lg:static inset-y-0 left-0 z-50 flex flex-col
                    ${collapsed ? "w-[4.5rem]" : "w-64"}
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
                `}
            >
                {/* Logo row */}
                <div className={`flex items-center h-16 px-4 border-b border-dark-750 ${collapsed ? "justify-center" : "justify-between"}`}>
                    {!collapsed ? (
                        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                TW
                            </span>
                            <span className="text-white">Admin</span>
                        </Link>
                    ) : (
                        <Link href="/dashboard">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                TW
                            </span>
                        </Link>
                    )}

                    {/* Mobile close */}
                    <button onClick={() => setMobileOpen(false)} className="lg:hidden btn-icon">
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation — Collapsible Dropdown Sections */}
                <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
                    {navSections
                        .filter((section) => !section.minRole || hasRole(user?.role || "VIEWER", section.minRole))
                        .map((section) => {
                            const isOpen = openSections.has(section.label);
                            const hasActiveItem = section.items.some(
                                item => pathname === item.href || pathname.startsWith(item.href + "/")
                            );
                            const visibleItems = section.items.filter(
                                (item) => !item.minRole || hasRole(user?.role || "VIEWER", item.minRole)
                            );

                            return (
                                <div key={section.label}>
                                    {/* Section Toggle Header */}
                                    {!collapsed ? (
                                        <button
                                            onClick={() => toggleSection(section.label)}
                                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                hasActiveItem
                                                    ? "text-primary-400 bg-primary-500/5"
                                                    : "text-neutral-400 hover:text-neutral-200 hover:bg-dark-800"
                                            }`}
                                        >
                                            <section.icon size={16} className={hasActiveItem ? "text-primary-400" : "text-neutral-500"} />
                                            <span className="flex-1 text-left">{section.label}</span>
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${hasActiveItem ? "text-primary-400" : "text-neutral-600"}`}
                                            />
                                        </button>
                                    ) : (
                                        <div className="h-px bg-dark-750 mx-2 my-1.5" />
                                    )}

                                    {/* Section Items (collapsible) */}
                                    {(collapsed || isOpen) && (
                                        <div className={`${collapsed ? "" : "mt-0.5 ml-2 pl-3 border-l border-dark-700/50"} space-y-0.5`}>
                                            {visibleItems.map((item) => {
                                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                                return collapsed ? (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className={`sidebar-link justify-center tooltip ${isActive ? "active" : ""}`}
                                                        data-tip={item.name}
                                                    >
                                                        <item.icon size={20} />
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className={`sidebar-link text-[13px] ${isActive ? "active" : ""}`}
                                                    >
                                                        <item.icon size={16} />
                                                        <span>{item.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </nav>

                {/* Collapse toggle (desktop) */}
                <div className="hidden lg:block px-3 py-2 border-t border-dark-750">
                    <button onClick={toggleCollapsed} className="sidebar-link w-full justify-center">
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        {!collapsed && <span className="text-sm">Collapse</span>}
                    </button>
                </div>

                {/* User section */}
                <div className={`px-3 py-3 border-t border-dark-750 ${collapsed ? "px-2" : ""}`}>
                    {collapsed ? (
                        <button
                            onClick={handleLogout}
                            className="sidebar-link w-full justify-center text-error-400 hover:text-error-400"
                        >
                            <LogOut size={18} />
                        </button>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-2 px-1">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-[0.7rem] text-neutral-500 truncate">{user?.role || "Admin"}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="sidebar-link w-full text-error-400 hover:text-error-400"
                            >
                                <LogOut size={16} />
                                <span className="text-sm">Sign out</span>
                            </button>
                        </>
                    )}
                </div>
            </aside>

            {/* ════════════ MAIN ════════════ */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* ──── Top bar ──── */}
                <header className="h-14 bg-dark-900 border-b border-dark-750 flex items-center px-4 lg:px-6 gap-3 flex-shrink-0 relative z-10">
                    {/* Mobile menu */}
                    <button onClick={() => setMobileOpen(true)} className="lg:hidden btn-icon">
                        <Menu size={20} />
                    </button>

                    {/* Breadcrumb */}
                    <nav className="hidden md:flex items-center gap-1.5 text-sm">
                        {breadcrumbs.map((crumb, i) => (
                            <span key={crumb.href} className="flex items-center gap-1.5">
                                {i > 0 && <span className="text-dark-600">/</span>}
                                {crumb.isLast ? (
                                    <span className="text-neutral-200 font-medium">{crumb.label}</span>
                                ) : (
                                    <Link href={crumb.href} className="text-neutral-500 hover:text-neutral-300 transition-colors">
                                        {crumb.label}
                                    </Link>
                                )}
                            </span>
                        ))}
                    </nav>

                    <div className="flex-1" />

                    {/* Visit website */}
                    <a
                        href="https://takeweb.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-400 transition-colors"
                    >
                        <Globe size={14} />
                        Visit Site
                        <ExternalLink size={12} />
                    </a>

                    {/* Notification bell */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
                            className="btn-icon relative"
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-dark-900" />}
                        </button>
                        {notifOpen && (
                            <div className="dropdown right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto">
                                <div className="sticky top-0 bg-dark-800/95 backdrop-blur-sm px-3 py-2 border-b border-dark-700 z-10 flex justify-between items-center">
                                    <span className="text-sm font-semibold text-white">Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                                    )}
                                </div>
                                <div className="p-1">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-sm text-neutral-500 text-center">No new notifications</div>
                                    ) : (
                                        notifications.map(n => (
                                            <div 
                                                key={n.id} 
                                                className={`p-3 border-b border-dark-700/50 last:border-0 hover:bg-dark-700/30 transition-colors ${!n.isRead ? 'bg-primary-500/5' : ''}`}
                                                onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                                            >
                                                <div className="flex items-start gap-3 cursor-pointer">
                                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                                                        n.type === 'ORGANIZATION' ? 'bg-purple-500/20 text-purple-400' :
                                                        n.type === 'DEPARTMENT' ? 'bg-blue-500/20 text-blue-400' :
                                                        n.type === 'TEAM' ? 'bg-emerald-500/20 text-emerald-400' :
                                                        'bg-amber-500/20 text-amber-400'
                                                    }`}>
                                                        {n.type.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white mb-0.5">{n.title}</p>
                                                        <p className="text-xs text-neutral-400 line-clamp-2">{n.message}</p>
                                                        <p className="text-[10px] text-neutral-500 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1" />}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ─── User Profile Dropdown ─── */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
                            className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            {initials}
                        </button>
                        {userMenuOpen && (
                            <div className="dropdown right-0 top-full mt-2 w-56">
                                <div className="px-3 py-2.5 border-b border-dark-700">
                                    <p className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-xs text-neutral-500">{user?.email || "admin@takeweb.in"}</p>
                                </div>
                                <div className="py-1">
                                    <Link href="/dashboard/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                        <User size={15} /> My Profile
                                    </Link>
                                    <Link href="/dashboard/profile/rating" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                        <Star size={15} /> Rating
                                    </Link>
                                    <Link href="/dashboard/profile/attendance" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                        <Clock size={15} /> Attendance
                                    </Link>
                                    <Link href="/dashboard/profile/calendar" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                        <CalendarDays size={15} /> Calendar
                                    </Link>
                                    <div className="dropdown-divider" />
                                    <button onClick={handleLogout} className="dropdown-item text-error-400 hover:text-error-400">
                                        <LogOut size={15} /> Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* ──── Page content ──── */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
