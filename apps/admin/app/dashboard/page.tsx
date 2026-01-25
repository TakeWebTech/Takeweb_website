"use client";

import { useEffect, useState } from "react";
import {
    FileText,
    Users,
    MessageSquare,
    Briefcase,
    TrendingUp,
    Clock,
} from "lucide-react";

interface DashboardStats {
    totalPosts: number;
    totalTeamMembers: number;
    totalContacts: number;
    totalCareers: number;
}

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<DashboardStats>({
        totalPosts: 0,
        totalTeamMembers: 0,
        totalContacts: 0,
        totalCareers: 0,
    });
    const [recentContacts, setRecentContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${token}` };
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

            // Fetch all data in parallel
            const [postsRes, teamRes, contactsRes, careersRes] = await Promise.all([
                fetch(`${apiUrl}/api/v1/blog/admin/posts`, { headers }).catch(() => null),
                fetch(`${apiUrl}/api/v1/team/admin/all`, { headers }).catch(() => null),
                fetch(`${apiUrl}/api/v1/contact/admin`, { headers }).catch(() => null),
                fetch(`${apiUrl}/api/v1/careers/admin/all`, { headers }).catch(() => null),
            ]);

            const postsData = postsRes?.ok ? await postsRes.json() : { posts: [] };
            const teamData = teamRes?.ok ? await teamRes.json() : [];
            const contactsData = contactsRes?.ok ? await contactsRes.json() : [];
            const careersData = careersRes?.ok ? await careersRes.json() : [];

            setStats({
                totalPosts: postsData.posts?.length || postsData.length || 0,
                totalTeamMembers: teamData.length || 0,
                totalContacts: contactsData.length || 0,
                totalCareers: careersData.length || 0,
            });

            // Get recent contacts for activity feed
            setRecentContacts(contactsData.slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        { name: "Total Posts", value: stats.totalPosts, icon: FileText, color: "text-primary-400" },
        { name: "Team Members", value: stats.totalTeamMembers, icon: Users, color: "text-accent-400" },
        { name: "Contact Forms", value: stats.totalContacts, icon: MessageSquare, color: "text-success-400" },
        { name: "Active Jobs", value: stats.totalCareers, icon: Briefcase, color: "text-warning-400" },
    ];

    const quickActions = [
        { name: "New Blog Post", href: "/dashboard/posts/new", color: "bg-primary-500" },
        { name: "Add Project", href: "/dashboard/projects/new", color: "bg-accent-500" },
        { name: "View Messages", href: "/dashboard/contact", color: "bg-success-500" },
        { name: "Add Job", href: "/dashboard/careers/new", color: "bg-warning-500" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-neutral-400 mt-1">
                    Welcome back, {user?.firstName}! Here&apos;s what&apos;s happening.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat) => (
                    <div key={stat.name} className="stat-card">
                        <div className="flex items-center justify-between">
                            <stat.icon className={stat.color} size={24} />
                            <TrendingUp className="text-success-500" size={16} />
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.name}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 card">
                    <h2 className="text-lg font-semibold text-white mb-4">Recent Contact Submissions</h2>
                    {recentContacts.length === 0 ? (
                        <p className="text-neutral-500">No recent contact submissions.</p>
                    ) : (
                        <div className="space-y-4">
                            {recentContacts.map((contact, index) => (
                                <div
                                    key={contact.id || index}
                                    className="flex items-start gap-4 pb-4 border-b border-neutral-800 last:border-0 last:pb-0"
                                >
                                    <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-neutral-200">
                                            New message from {contact.firstName} {contact.lastName}
                                        </p>
                                        <p className="text-sm text-neutral-500 truncate">{contact.message}</p>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                                            <Clock size={14} />
                                            <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{contact.email}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickActions.map((action) => (
                            <a
                                key={action.name}
                                href={action.href}
                                className="flex items-center gap-3 p-3 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
                            >
                                <div className={`w-2 h-8 rounded-full ${action.color}`} />
                                <span className="text-neutral-200">{action.name}</span>
                            </a>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-neutral-800">
                        <h3 className="text-sm font-medium text-neutral-400 mb-3">System Status</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">API Status</span>
                                <span className="text-success-500">Operational</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Database</span>
                                <span className="text-success-500">Connected</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">CDN</span>
                                <span className="text-success-500">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
