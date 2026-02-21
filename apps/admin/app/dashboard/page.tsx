"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText,
    Users,
    MessageSquare,
    Briefcase,
    TrendingUp,
    TrendingDown,
    Eye,
    Plus,
    ArrowRight,
    Activity,
    Globe,
    FileStack,
    Clock,
    CheckCircle2,
    AlertCircle,
    UserPlus,
    FolderOpen,
    BarChart3,
} from "lucide-react";

interface Stats {
    totalPosts: number;
    totalTeamMembers: number;
    totalContacts: number;
    totalCareers: number;
    totalProjects?: number;
    totalServices?: number;
}

const quickActions = [
    { name: "New Post", href: "/dashboard/posts/new", icon: FileText, color: "from-blue-500 to-blue-600" },
    { name: "Add Project", href: "/dashboard/projects/new", icon: FolderOpen, color: "from-purple-500 to-purple-600" },
    { name: "Add Service", href: "/dashboard/services/new", icon: Briefcase, color: "from-emerald-500 to-emerald-600" },
    { name: "Add Team", href: "/dashboard/team/new", icon: Users, color: "from-amber-500 to-amber-600" },
    { name: "Add Job", href: "/dashboard/careers/new", icon: UserPlus, color: "from-rose-500 to-rose-600" },
    { name: "Manage Pages", href: "/dashboard/pages", icon: FileStack, color: "from-cyan-500 to-cyan-600" },
];

const recentActivities = [
    { type: "contact", icon: MessageSquare, message: "New contact form submission", time: "2 minutes ago", color: "text-blue-400" },
    { type: "post", icon: FileText, message: "Blog post draft saved", time: "1 hour ago", color: "text-emerald-400" },
    { type: "team", icon: Users, message: "Team member profile updated", time: "3 hours ago", color: "text-amber-400" },
    { type: "project", icon: FolderOpen, message: "New project marked as featured", time: "5 hours ago", color: "text-purple-400" },
    { type: "career", icon: Briefcase, message: "New job posting published", time: "1 day ago", color: "text-rose-400" },
];

const websitePages = [
    { name: "Home", path: "/", status: "live" },
    { name: "About", path: "/about", status: "live" },
    { name: "Services", path: "/services", status: "live" },
    { name: "Projects", path: "/projects", status: "live" },
    { name: "Contact", path: "/contact", status: "live" },
    { name: "Blog", path: "/blog", status: "live" },
    { name: "Careers", path: "/careers", status: "live" },
    { name: "Privacy Policy", path: "/privacy", status: "live" },
    { name: "Terms of Service", path: "/terms", status: "live" },
];

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalPosts: 0,
        totalTeamMembers: 0,
        totalContacts: 0,
        totalCareers: 0,
        totalProjects: 0,
        totalServices: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const headers = { Authorization: `Bearer ${token}` };
                const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

                const [posts, team, contacts, careers, projects, services] = await Promise.allSettled([
                    fetch(`${base}/api/v1/blog/admin/all`, { headers }).then((r) => r.ok ? r.json() : []),
                    fetch(`${base}/api/v1/team/admin/all`, { headers }).then((r) => r.ok ? r.json() : []),
                    fetch(`${base}/api/v1/contact/admin/all`, { headers }).then((r) => r.ok ? r.json() : []),
                    fetch(`${base}/api/v1/careers/admin/all`, { headers }).then((r) => r.ok ? r.json() : []),
                    fetch(`${base}/api/v1/projects/admin/all`, { headers }).then((r) => r.ok ? r.json() : []),
                    fetch(`${base}/api/v1/services/admin/all`, { headers }).then((r) => r.ok ? r.json() : []),
                ]);

                setStats({
                    totalPosts: posts.status === "fulfilled" ? (Array.isArray(posts.value) ? posts.value.length : 0) : 0,
                    totalTeamMembers: team.status === "fulfilled" ? (Array.isArray(team.value) ? team.value.length : 0) : 0,
                    totalContacts: contacts.status === "fulfilled" ? (Array.isArray(contacts.value) ? contacts.value.length : 0) : 0,
                    totalCareers: careers.status === "fulfilled" ? (Array.isArray(careers.value) ? careers.value.length : 0) : 0,
                    totalProjects: projects.status === "fulfilled" ? (Array.isArray(projects.value) ? projects.value.length : 0) : 0,
                    totalServices: services.status === "fulfilled" ? (Array.isArray(services.value) ? services.value.length : 0) : 0,
                });
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statsCards = [
        { name: "Total Posts", value: stats.totalPosts, icon: FileText, trend: "+12%", up: true, color: "text-blue-400", bg: "bg-blue-500/10" },
        { name: "Team Members", value: stats.totalTeamMembers, icon: Users, trend: "+3", up: true, color: "text-amber-400", bg: "bg-amber-500/10" },
        { name: "Contacts", value: stats.totalContacts, icon: MessageSquare, trend: "+8%", up: true, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { name: "Active Jobs", value: stats.totalCareers, icon: Briefcase, trend: "–", up: false, color: "text-rose-400", bg: "bg-rose-500/10" },
        { name: "Projects", value: stats.totalProjects || 0, icon: FolderOpen, trend: "+5", up: true, color: "text-purple-400", bg: "bg-purple-500/10" },
        { name: "Services", value: stats.totalServices || 0, icon: BarChart3, trend: "–", up: false, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="page-header">
                    <div className="skeleton h-8 w-48" />
                    <div className="skeleton h-4 w-72 mt-2" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="skeleton h-28 rounded-xl" />
                    ))}
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 skeleton h-64 rounded-xl" />
                    <div className="skeleton h-64 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here&apos;s what&apos;s happening with your website.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/posts/new" className="btn-primary">
                        <Plus size={16} />
                        New Post
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {statsCards.map((card) => (
                    <div key={card.name} className="stat-card group">
                        <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                                <card.icon size={20} className={card.color} />
                            </div>
                            {card.trend !== "–" && (
                                <span className={`flex items-center gap-0.5 text-xs font-medium ${card.up ? "text-success-400" : "text-error-400"}`}>
                                    {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {card.trend}
                                </span>
                            )}
                        </div>
                        <div>
                            <div className="stat-value animate-count-up">{card.value}</div>
                            <div className="stat-label">{card.name}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle section */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {quickActions.map((action) => (
                            <Link
                                key={action.name}
                                href={action.href}
                                className="flex items-center gap-3 p-3 rounded-lg bg-dark-800 border border-dark-700 hover:border-dark-600 transition-all hover:-translate-y-0.5 group"
                            >
                                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                                    <action.icon size={16} className="text-white" />
                                </div>
                                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                                    {action.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Activity */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                        <Activity size={16} className="text-neutral-500" />
                    </div>
                    <div className="space-y-3">
                        {recentActivities.map((activity, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={`mt-0.5 ${activity.color}`}>
                                    <activity.icon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-neutral-300">{activity.message}</p>
                                    <p className="text-xs text-neutral-600 flex items-center gap-1 mt-0.5">
                                        <Clock size={10} /> {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Website Pages Overview */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Globe size={18} className="text-primary-400" />
                            Website Pages
                        </h2>
                        <Link href="/dashboard/pages" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                            Manage <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-1.5">
                        {websitePages.map((page) => (
                            <div key={page.path} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-dark-800 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <FileStack size={14} className="text-neutral-500" />
                                    <span className="text-sm text-neutral-300">{page.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <code className="text-xs text-neutral-600 hidden sm:block">{page.path}</code>
                                    <span className="badge badge-success">
                                        <CheckCircle2 size={10} /> Live
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Overview */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <BarChart3 size={18} className="text-primary-400" />
                            Content Overview
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: "Blog Posts", value: stats.totalPosts, max: 50, color: "bg-blue-500" },
                            { label: "Projects", value: stats.totalProjects || 0, max: 30, color: "bg-purple-500" },
                            { label: "Services", value: stats.totalServices || 0, max: 20, color: "bg-emerald-500" },
                            { label: "Team Members", value: stats.totalTeamMembers, max: 30, color: "bg-amber-500" },
                            { label: "Open Positions", value: stats.totalCareers, max: 15, color: "bg-rose-500" },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm text-neutral-400">{item.label}</span>
                                    <span className="text-sm font-medium text-white">{item.value}</span>
                                </div>
                                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                                        style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
