"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    X,
    UserPlus,
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Blog Posts", href: "/dashboard/posts", icon: FileText },
    { name: "Services", href: "/dashboard/services", icon: Briefcase },
    { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
    { name: "Team", href: "/dashboard/team", icon: Users },
    { name: "Careers", href: "/dashboard/careers", icon: UserPlus },
    { name: "Contact", href: "/dashboard/contact", icon: MessageSquare },
    { name: "Media", href: "/dashboard/media", icon: Image },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check auth
        const token = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");

        if (!token) {
            router.push("/");
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        router.push("/");
    };

    return (
        <div className="flex h-screen">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-neutral-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-800">
                        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                TW
                            </span>
                            <span className="text-white">Admin</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-neutral-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`sidebar-link ${isActive ? "active" : ""}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User */}
                    <div className="p-4 border-t border-neutral-800">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-semibold">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-neutral-500 truncate">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="sidebar-link w-full text-error-500 hover:text-error-500"
                        >
                            <LogOut size={20} />
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="h-16 bg-dark-800 border-b border-neutral-800 flex items-center px-4 lg:px-6 gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-neutral-400 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex-1" />
                    <div className="text-sm text-neutral-400">
                        Welcome back, <span className="text-white">{user?.firstName}</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-dark-900 p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
