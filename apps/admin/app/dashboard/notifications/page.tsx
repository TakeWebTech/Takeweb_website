"use client";

import { useState, useEffect } from "react";
import {
    Bell, BellOff, Check, CheckCheck, Trash2, Filter,
    Clock, MessageSquare, UserCog, Shield, AlertTriangle,
    Info, Zap, Calendar, Eye, MailOpen, X, Settings,
    ChevronDown, RefreshCw,
} from "lucide-react";

interface Notification {
    id: string;
    type: "info" | "warning" | "success" | "mention" | "deadline" | "system";
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    action?: { label: string; href: string };
}

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: "1", type: "mention", title: "Mentioned in comment", message: "John mentioned you in the Q2 review discussion thread.", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), action: { label: "View", href: "#" } },
    { id: "2", type: "deadline", title: "Review deadline approaching", message: "Employee quarterly reviews are due in 3 days. 5 reviews pending.", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), action: { label: "Start Review", href: "/dashboard/employees" } },
    { id: "3", type: "warning", title: "Attendance alert", message: "3 employees have been absent for 3+ consecutive days without approval.", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: "4", type: "system", title: "System update complete", message: "The HR Management System has been updated to v2.4. Check the changelog.", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: "5", type: "success", title: "New employee onboarded", message: "Sarah Johnson has been successfully onboarded to the Engineering team.", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
    { id: "6", type: "info", title: "Policy update", message: "Remote work policy has been updated. All employees should review the changes.", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: "7", type: "mention", title: "Tagged in task", message: "You were assigned to review the new benefits enrollment workflow.", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), action: { label: "View Task", href: "#" } },
    { id: "8", type: "deadline", title: "Project milestone due", message: "Phase 4 dashboard deployment milestone is due tomorrow.", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
];

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
    info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10" },
    warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
    success: { icon: Check, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    mention: { icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-500/10" },
    deadline: { icon: Calendar, color: "text-rose-400", bg: "bg-rose-500/10" },
    system: { icon: Zap, color: "text-cyan-400", bg: "bg-cyan-500/10" },
};

const FILTER_OPTIONS = ["all", "unread", "mention", "deadline", "warning", "system"] as const;

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState<string>("all");
    const [showSettings, setShowSettings] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const filtered = notifications.filter(n => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.read;
        return n.type === filter;
    });

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
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

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1 className="flex items-center gap-2">
                        <Bell size={22} className="text-primary-400" />
                        Notification Center
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary-500 text-white">{unreadCount}</span>
                        )}
                    </h1>
                    <p>Mentions, deadlines, alerts, and system notifications</p>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="btn-secondary text-sm"><CheckCheck size={14} /> Mark All Read</button>
                    )}
                    <button onClick={clearAll} className="btn-secondary text-sm"><Trash2 size={14} /> Clear All</button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                {FILTER_OPTIONS.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filter === f
                            ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                            : "bg-dark-800 text-neutral-400 border border-dark-700 hover:border-dark-600"
                            }`}
                    >
                        {f === "all" ? `All (${notifications.length})` : f === "unread" ? `Unread (${unreadCount})` : f}
                    </button>
                ))}
            </div>

            {/* Notification List */}
            <div className="space-y-2">
                {filtered.map(notification => {
                    const cfg = typeConfig[notification.type] ?? typeConfig.info!;
                    const Icon = cfg.icon;
                    return (
                        <div
                            key={notification.id}
                            className={`card flex items-start gap-3 group transition-all ${!notification.read ? "border-l-2 border-l-primary-500 bg-primary-500/[0.02]" : "opacity-75 hover:opacity-100"}`}
                        >
                            {/* Icon */}
                            <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                <Icon size={16} className={cfg.color} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className={`text-sm font-medium ${!notification.read ? "text-white" : "text-neutral-300"}`}>
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-0.5">{notification.message}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        {!notification.read && (
                                            <button onClick={() => markAsRead(notification.id)} className="btn-icon" title="Mark as read">
                                                <Eye size={13} />
                                            </button>
                                        )}
                                        <button onClick={() => deleteNotification(notification.id)} className="btn-icon hover:text-error-400" title="Delete">
                                            <X size={13} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[10px] text-neutral-600 flex items-center gap-1">
                                        <Clock size={9} /> {timeAgo(notification.createdAt)}
                                    </span>
                                    {!notification.read && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                    )}
                                    {notification.action && (
                                        <a href={notification.action.href} className="text-[10px] text-primary-400 hover:text-primary-300 font-medium">
                                            {notification.action.label} →
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="card py-16 text-center">
                        <BellOff size={48} className="mx-auto text-neutral-700 mb-4" />
                        <p className="text-neutral-400">
                            {notifications.length === 0 ? "All caught up! No notifications." : "No notifications match this filter."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
