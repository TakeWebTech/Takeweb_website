"use client";

import { useState, useEffect } from "react";
import {
    Activity,
    Search,
    Filter,
    Calendar,
    UserCircle,
    FileText,
    Trash2,
    Edit,
    Plus,
    LogIn,
    Eye,
    ToggleLeft,
    Upload,
    Settings,
    ChevronDown,
    RefreshCw,
} from "lucide-react";

interface ActivityItem {
    id: string;
    action: "created" | "updated" | "deleted" | "login" | "status_change" | "uploaded" | "settings";
    entity: string;
    entityName: string;
    user: string;
    timestamp: string;
    details?: string;
}

const actionConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    created: { icon: Plus, color: "text-success-400 bg-success-400/10", label: "Created" },
    updated: { icon: Edit, color: "text-info-400 bg-info-400/10", label: "Updated" },
    deleted: { icon: Trash2, color: "text-error-400 bg-error-400/10", label: "Deleted" },
    login: { icon: LogIn, color: "text-primary-400 bg-primary-400/10", label: "Logged in" },
    status_change: { icon: ToggleLeft, color: "text-warning-400 bg-warning-400/10", label: "Status changed" },
    uploaded: { icon: Upload, color: "text-accent-400 bg-accent-400/10", label: "Uploaded" },
    settings: { icon: Settings, color: "text-neutral-400 bg-neutral-400/10", label: "Settings" },
};

const demoActivities: ActivityItem[] = [
    { id: "1", action: "login", entity: "Auth", entityName: "Admin Dashboard", user: "Admin", timestamp: new Date().toISOString(), details: "Logged in from 192.168.1.1" },
    { id: "2", action: "updated", entity: "Post", entityName: "Getting Started with AI", user: "Admin", timestamp: new Date(Date.now() - 15 * 60000).toISOString(), details: "Updated content and meta description" },
    { id: "3", action: "created", entity: "Service", entityName: "Cloud Consulting", user: "Admin", timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
    { id: "4", action: "uploaded", entity: "Media", entityName: "hero-banner.webp", user: "Admin", timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), details: "2.4 MB image uploaded" },
    { id: "5", action: "status_change", entity: "Post", entityName: "Next.js Best Practices", user: "Editor", timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), details: "Changed from Draft to Published" },
    { id: "6", action: "deleted", entity: "Team", entityName: "John Doe", user: "Admin", timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: "7", action: "settings", entity: "Settings", entityName: "SEO Configuration", user: "Admin", timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), details: "Updated meta tags and sitemap settings" },
    { id: "8", action: "created", entity: "Project", entityName: "E-Commerce Platform", user: "Admin", timestamp: new Date(Date.now() - 24 * 3600000).toISOString() },
    { id: "9", action: "updated", entity: "Career", entityName: "Senior Developer", user: "Editor", timestamp: new Date(Date.now() - 25 * 3600000).toISOString(), details: "Updated job description and requirements" },
    { id: "10", action: "login", entity: "Auth", entityName: "Admin Dashboard", user: "Editor", timestamp: new Date(Date.now() - 26 * 3600000).toISOString(), details: "Logged in from 10.0.0.5" },
    { id: "11", action: "created", entity: "Post", entityName: "Building Scalable Systems", user: "Admin", timestamp: new Date(Date.now() - 48 * 3600000).toISOString() },
    { id: "12", action: "uploaded", entity: "Media", entityName: "team-photo.jpg", user: "Editor", timestamp: new Date(Date.now() - 50 * 3600000).toISOString(), details: "3.1 MB image uploaded" },
    { id: "13", action: "status_change", entity: "Service", entityName: "UI/UX Design", user: "Admin", timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), details: "Changed from Active to Inactive" },
    { id: "14", action: "deleted", entity: "Contact", entityName: "Spam message", user: "Admin", timestamp: new Date(Date.now() - 96 * 3600000).toISOString() },
    { id: "15", action: "created", entity: "Testimonial", entityName: "Great company!", user: "Admin", timestamp: new Date(Date.now() - 120 * 3600000).toISOString() },
];

const actionTypes = ["All", "created", "updated", "deleted", "login", "status_change", "uploaded", "settings"];
const userOptions = ["All Users", "Admin", "Editor"];

function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
}

function groupByDay(items: ActivityItem[]): Record<string, ActivityItem[]> {
    const groups: Record<string, ActivityItem[]> = {};
    items.forEach((item) => {
        const date = new Date(item.timestamp);
        const today = new Date();
        const yesterday = new Date(Date.now() - 86400000);

        let key: string;
        if (date.toDateString() === today.toDateString()) key = "Today";
        else if (date.toDateString() === yesterday.toDateString()) key = "Yesterday";
        else key = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

        if (!groups[key]) groups[key] = [];
        groups[key]!.push(item);
    });
    return groups;
}

export default function ActivityPage() {
    const [activities] = useState<ActivityItem[]>(demoActivities);
    const [search, setSearch] = useState("");
    const [filterAction, setFilterAction] = useState("All");
    const [filterUser, setFilterUser] = useState("All Users");

    const filtered = activities.filter((a) => {
        const matchesSearch = a.entityName.toLowerCase().includes(search.toLowerCase()) ||
            a.entity.toLowerCase().includes(search.toLowerCase()) ||
            (a.details || "").toLowerCase().includes(search.toLowerCase());
        const matchesAction = filterAction === "All" || a.action === filterAction;
        const matchesUser = filterUser === "All Users" || a.user === filterUser;
        return matchesSearch && matchesAction && matchesUser;
    });

    const grouped = groupByDay(filtered);
    const totalCount = filtered.length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Activity Log</h1>
                    <p>Track all actions and changes across the admin panel</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">{totalCount} events</span>
                    <button className="btn-icon" title="Refresh">
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search activity..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 text-sm"
                    />
                </div>
                <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="text-sm"
                >
                    {actionTypes.map((type) => (
                        <option key={type} value={type}>
                            {type === "All" ? "All Actions" : actionConfig[type]?.label || type}
                        </option>
                    ))}
                </select>
                <select
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    className="text-sm"
                >
                    {userOptions.map((user) => (
                        <option key={user} value={user}>{user}</option>
                    ))}
                </select>
            </div>

            {/* Timeline */}
            {Object.entries(grouped).map(([day, items]) => (
                <div key={day}>
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar size={14} className="text-neutral-500" />
                        <span className="text-sm font-semibold text-neutral-300">{day}</span>
                        <div className="flex-1 h-px bg-dark-700" />
                        <span className="text-xs text-neutral-600">{items.length} events</span>
                    </div>

                    <div className="space-y-1 ml-2">
                        {items.map((item, idx) => {
                            const config = actionConfig[item.action];
                            const Icon = config?.icon || Activity;
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-dark-850 transition-colors group"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    {/* Icon */}
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config?.color || ""}`}>
                                        <Icon size={16} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-neutral-200">
                                            <span className="font-medium text-white">{item.user}</span>
                                            {" "}
                                            <span className="text-neutral-500">{config?.label?.toLowerCase() || item.action}</span>
                                            {" "}
                                            <span className="text-neutral-400">{item.entity} ›</span>
                                            {" "}
                                            <span className="font-medium text-neutral-200">{item.entityName}</span>
                                        </p>
                                        {item.details && (
                                            <p className="text-xs text-neutral-500 mt-0.5">{item.details}</p>
                                        )}
                                    </div>

                                    {/* Time */}
                                    <span className="text-xs text-neutral-600 flex-shrink-0 mt-0.5">
                                        {timeAgo(item.timestamp)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {filtered.length === 0 && (
                <div className="empty-state card">
                    <Activity size={40} className="empty-state-icon" />
                    <p className="text-neutral-400 mb-2">No activity found</p>
                    <p className="text-sm text-neutral-600">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
}
