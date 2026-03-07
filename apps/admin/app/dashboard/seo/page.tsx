"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search, TrendingUp, FileX, Link2, Map, Code2,
    Settings, Play, AlertTriangle, CheckCircle2, XCircle,
    ArrowUp, ArrowDown, Minus, BarChart3, RefreshCw,
} from "lucide-react";

interface DashboardStats {
    overview: {
        totalContent: number;
        totalPosts: number;
        totalServices: number;
        totalProjects: number;
        seoScore: number;
    };
    issues: {
        contentMissingSeo: number;
        unresolved404s: number;
        totalRedirects: number;
    };
    keywords: {
        tracked: number;
    };
    lastAudit: {
        score: number;
        date: string;
        criticalIssues: number;
    } | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function SeoDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [runningAudit, setRunningAudit] = useState(false);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_URL}/api/v1/seo/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setStats(await res.json());
        } catch (e) {
            console.error("Failed:", e);
        } finally {
            setLoading(false);
        }
    };

    const runAudit = async () => {
        setRunningAudit(true);
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_URL}/api/v1/seo/audit`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ includePages: true }),
            });
            if (res.ok) {
                fetchStats();
            }
        } catch (e) {
            console.error("Audit failed:", e);
        } finally {
            setRunningAudit(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-success";
        if (score >= 60) return "text-warning";
        return "text-error";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-success/10 border-success/20";
        if (score >= 60) return "bg-warning/10 border-warning/20";
        return "bg-error/10 border-error/20";
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="skeleton h-32 rounded-xl" />
                    ))}
                </div>
                <div className="skeleton h-96 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>SEO Dashboard</h1>
                    <p>Manage and optimize your website's search engine visibility</p>
                </div>
                <button
                    onClick={runAudit}
                    disabled={runningAudit}
                    className="btn-primary"
                >
                    {runningAudit ? (
                        <>
                            <RefreshCw size={16} className="animate-spin" />
                            Running Audit...
                        </>
                    ) : (
                        <>
                            <Play size={16} />
                            Run SEO Audit
                        </>
                    )}
                </button>
            </div>

            {/* SEO Score Card */}
            <div className={`card-container p-6 border-2 ${stats ? getScoreBg(stats.overview.seoScore) : ""}`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="none"
                                    className="text-base-300"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${(stats?.overview.seoScore || 0) * 3.52} 352`}
                                    strokeLinecap="round"
                                    className={getScoreColor(stats?.overview.seoScore || 0)}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-3xl font-bold ${getScoreColor(stats?.overview.seoScore || 0)}`}>
                                    {stats?.overview.seoScore || 0}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Overall SEO Score</h2>
                            <p className="text-neutral-500">
                                {stats?.overview.seoScore >= 80
                                    ? "Great! Your site is well optimized"
                                    : stats?.overview.seoScore >= 60
                                        ? "Good, but there's room for improvement"
                                        : "Needs work to improve search visibility"}
                            </p>
                        </div>
                    </div>
                    {stats?.lastAudit && (
                        <div className="text-right">
                            <p className="text-sm text-neutral-500">Last Audit</p>
                            <p className="font-medium">
                                {new Date(stats.lastAudit.date).toLocaleDateString()}
                            </p>
                            {stats.lastAudit.criticalIssues > 0 && (
                                <p className="text-error text-sm mt-1">
                                    <AlertTriangle size={12} className="inline mr-1" />
                                    {stats.lastAudit.criticalIssues} critical issues
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-container p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Content Pages</p>
                            <p className="text-2xl font-bold">{stats?.overview.totalContent || 0}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BarChart3 className="text-primary" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                        {stats?.overview.totalPosts} posts, {stats?.overview.totalServices} services, {stats?.overview.totalProjects} projects
                    </p>
                </div>

                <div className="card-container p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Missing SEO</p>
                            <p className="text-2xl font-bold text-warning">{stats?.issues.contentMissingSeo || 0}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                            <AlertTriangle className="text-warning" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">Pages missing meta titles or descriptions</p>
                </div>

                <div className="card-container p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">404 Errors</p>
                            <p className="text-2xl font-bold text-error">{stats?.issues.unresolved404s || 0}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center">
                            <FileX className="text-error" size={24} />
                        </div>
                    </div>
                    <Link href="/dashboard/seo/404-monitor" className="text-xs text-primary hover:underline mt-2 block">
                        View & fix errors →
                    </Link>
                </div>

                <div className="card-container p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Active Redirects</p>
                            <p className="text-2xl font-bold">{stats?.issues.totalRedirects || 0}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
                            <Link2 className="text-info" size={24} />
                        </div>
                    </div>
                    <Link href="/dashboard/seo/redirects" className="text-xs text-primary hover:underline mt-2 block">
                        Manage redirects →
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/dashboard/seo/analyzer" className="card-container p-6 hover:border-primary/50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <Search size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold">Content Analyzer</h3>
                            <p className="text-sm text-neutral-500">Analyze and improve content SEO</p>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/seo/keywords" className="card-container p-6 hover:border-primary/50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold">Keyword Tracking</h3>
                            <p className="text-sm text-neutral-500">Monitor keyword rankings</p>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/seo/sitemap" className="card-container p-6 hover:border-primary/50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <Map size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold">Sitemap Manager</h3>
                            <p className="text-sm text-neutral-500">Configure XML sitemap</p>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/seo/redirects" className="card-container p-6 hover:border-primary/50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <Link2 size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold">Redirects</h3>
                            <p className="text-sm text-neutral-500">Manage URL redirections</p>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/seo/schemas" className="card-container p-6 hover:border-primary/50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <Code2 size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold">Schema Markup</h3>
                            <p className="text-sm text-neutral-500">Rich snippets & structured data</p>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/seo/settings" className="card-container p-6 hover:border-primary/50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold">SEO Settings</h3>
                            <p className="text-sm text-neutral-500">Global SEO configuration</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Tracked Keywords Preview */}
            {stats?.keywords.tracked > 0 && (
                <div className="card-container p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Tracked Keywords</h3>
                        <Link href="/dashboard/seo/keywords" className="text-sm text-primary hover:underline">
                            View all →
                        </Link>
                    </div>
                    <p className="text-neutral-500">
                        You are tracking <strong>{stats.keywords.tracked}</strong> keywords.
                    </p>
                </div>
            )}
        </div>
    );
}
