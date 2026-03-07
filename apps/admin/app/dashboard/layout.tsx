"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    FolderOpen,
    Users,
    MessageSquare,
    Image,
    Settings,
    LogOut,
    Menu,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    Bell,
    Search,
    Globe,
    FileStack,
    Quote,
    X,
    ChevronDown,
    ExternalLink,
    Activity,
    Shield,
    SearchCheck,
} from "lucide-react";

/* ─── nav data ─── */
const navSections = [
    {
        label: "Main",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        label: "Content",
        items: [
            { name: "Pages", href: "/dashboard/pages", icon: FileStack },
            { name: "Blog Posts", href: "/dashboard/posts", icon: FileText },
            { name: "Services", href: "/dashboard/services", icon: Briefcase },
            { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
            { name: "Testimonials", href: "/dashboard/testimonials", icon: Quote },
            { name: "SEO Engine", href: "/dashboard/seo", icon: SearchCheck },
        ],
    },
    {
        label: "Management",
        items: [
            { name: "Team", href: "/dashboard/team", icon: Users },
            { name: "Careers", href: "/dashboard/careers", icon: UserPlus },
            { name: "Contact", href: "/dashboard/contact", icon: MessageSquare },
            { name: "Media", href: "/dashboard/media", icon: Image },
            { name: "Activity Log", href: "/dashboard/activity", icon: Activity },
        ],
    },
    {
        label: "System",
        items: [
            { name: "Users", href: "/dashboard/users", icon: Shield },
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

    /* user & UI */
    const [user, setUser] = useState<any>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    /* hydrate */
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");
        if (!token) { router.push("/"); return; }
        if (userData) setUser(JSON.parse(userData));
        const saved = localStorage.getItem("sidebarCollapsed");
        if (saved === "true") setCollapsed(true);
    }, [router]);

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

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
                    {navSections.map((section) => (
                        <div key={section.label}>
                            {!collapsed && (
                                <div className="sidebar-section-label">{section.label}</div>
                            )}
                            {collapsed && <div className="h-px bg-dark-750 mx-2 my-1" />}
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
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
                                            className={`sidebar-link ${isActive ? "active" : ""}`}
                                        >
                                            <item.icon size={18} />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
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
                <header className="h-14 bg-dark-900 border-b border-dark-750 flex items-center px-4 lg:px-6 gap-3 flex-shrink-0">
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
                            <span className="notification-dot" />
                        </button>
                        {notifOpen && (
                            <div className="dropdown right-0 top-full mt-2 w-72">
                                <div className="px-3 py-2 border-b border-dark-700">
                                    <span className="text-sm font-semibold text-white">Notifications</span>
                                </div>
                                <div className="p-3 text-sm text-neutral-500 text-center">
                                    No new notifications
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User avatar */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
                            className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            {initials}
                        </button>
                        {userMenuOpen && (
                            <div className="dropdown right-0 top-full mt-2">
                                <div className="px-3 py-2 border-b border-dark-700">
                                    <p className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-xs text-neutral-500">{user?.email || "admin@takeweb.in"}</p>
                                </div>
                                <div className="py-1">
                                    <Link href="/dashboard/settings" className="dropdown-item">
                                        <Settings size={16} /> Settings
                                    </Link>
                                    <div className="dropdown-divider" />
                                    <button onClick={handleLogout} className="dropdown-item text-error-400 hover:text-error-400">
                                        <LogOut size={16} /> Sign out
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
