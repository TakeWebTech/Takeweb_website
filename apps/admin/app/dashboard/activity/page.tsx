"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Activity, Search, Calendar, UserCircle, FileText, Trash2,
    Edit, Plus, LogIn, Eye, ToggleLeft, Upload, Settings,
    RefreshCw, ChevronLeft, ChevronRight, Download, Shield,
    Clock, Filter, BarChart3, Users, Zap, AlertTriangle,
} from "lucide-react";

interface AuditEntry {
    id: string;
    userId: string;
    userEmail: string;
    userRole: string;
    action: string;
    module: string;
    entityType?: string;
    entityId?: string;
    description?: string;
    changes?: any;
    metadata?: any;
    createdAt: string;
    user?: { id: string; firstName: string; lastName: string; avatar?: string };
}

interface AuditStats {
    totalToday: number;
    totalAll: number;
    byModule: { module: string; _count: number }[];
    byAction: { action: string; _count: number }[];
}

const actionIcons: Record<string, { icon: any; color: string }> = {
    CREATE: { icon: Plus, color: "text-emerald-400 bg-emerald-500/10" },
    UPDATE: { icon: Edit, color: "text-blue-400 bg-blue-500/10" },
    DELETE: { icon: Trash2, color: "text-red-400 bg-red-500/10" },
    LOGIN: { icon: LogIn, color: "text-primary-400 bg-primary-500/10" },
    LOGOUT: { icon: LogIn, color: "text-neutral-400 bg-neutral-500/10" },
    VIEW: { icon: Eye, color: "text-cyan-400 bg-cyan-500/10" },
    STATUS_CHANGE: { icon: ToggleLeft, color: "text-amber-400 bg-amber-500/10" },
    UPLOAD: { icon: Upload, color: "text-purple-400 bg-purple-500/10" },
    SETTINGS: { icon: Settings, color: "text-neutral-400 bg-neutral-500/10" },
    PERMISSION_CHANGE: { icon: Shield, color: "text-rose-400 bg-rose-500/10" },
};

const base = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") : "";
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

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

function groupByDay(items: AuditEntry[]): Record<string, AuditEntry[]> {
    const groups: Record<string, AuditEntry[]> = {};
    items.forEach((item) => {
        const date = new Date(item.createdAt);
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
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const [stats, setStats] = useState<AuditStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterModule, setFilterModule] = useState("all");
    const [filterAction, setFilterAction] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

    const fetchLogs = useCallback(async () => {
        try {
            const params = new URLSearchParams({ page: String(page), limit: "30" });
            if (filterModule !== "all") params.set("module", filterModule);
            if (filterAction !== "all") params.set("action", filterAction);

            const res = await fetch(`${base}/api/v1/audit?${params}`, { headers: getHeaders() });
            if (res.ok) {
                const data = await res.json();
                setEntries(data.items || []);
                setTotalPages(data.totalPages || 1);
                setTotal(data.total || 0);
            }
        } catch (err) {
            console.error("Failed to fetch audit logs:", err);
        } finally {
            setLoading(false);
        }
    }, [page, filterModule, filterAction]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${base}/api/v1/audit/stats`, { headers: getHeaders() });
            if (res.ok) setStats(await res.json());
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchLogs(); fetchStats(); }, [fetchLogs]);

    const filtered = entries.filter(e => {
        if (!search) return true;
        const term = search.toLowerCase();
        return (e.description || "").toLowerCase().includes(term) ||
            e.module.toLowerCase().includes(term) ||
            e.action.toLowerCase().includes(term) ||
            e.userEmail.toLowerCase().includes(term) ||
            (e.entityType || "").toLowerCase().includes(term);
    });

    const grouped = groupByDay(filtered);

    const exportCSV = () => {
        const headers = ["Timestamp", "User", "Role", "Action", "Module", "Entity", "Description"];
        const rows = filtered.map(e => [
            new Date(e.createdAt).toISOString(),
            e.userEmail,
            e.userRole,
            e.action,
            e.module,
            e.entityType || "",
            (e.description || "").replace(/,/g, ";"),
        ]);
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="page-header"><div className="skeleton h-8 w-48" /><div className="skeleton h-4 w-72 mt-2" /></div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
                <div className="skeleton h-96 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1 className="flex items-center gap-2">
                        <Activity size={22} className="text-primary-400" />
                        Audit Log
                    </h1>
                    <p>Complete trail of all actions and changes across the system</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={exportCSV} className="btn-secondary text-sm"><Download size={14} /> Export CSV</button>
                    <button onClick={() => { setLoading(true); fetchLogs(); fetchStats(); }} className="btn-icon"><RefreshCw size={16} /></button>
                </div>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
                    <div className="card p-4">
                        <p className="text-2xl font-bold text-primary-400">{stats.totalToday}</p>
                        <p className="text-xs text-neutral-500 mt-1">Events Today</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-2xl font-bold text-blue-400">{stats.totalAll}</p>
                        <p className="text-xs text-neutral-500 mt-1">Total Events</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-2xl font-bold text-emerald-400">{stats.byModule.length}</p>
                        <p className="text-xs text-neutral-500 mt-1">Active Modules</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-2xl font-bold text-amber-400">{stats.byAction.length}</p>
                        <p className="text-xs text-neutral-500 mt-1">Action Types</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input type="text" placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 text-sm" />
                </div>
                <select value={filterModule} onChange={e => { setFilterModule(e.target.value); setPage(1); }} className="text-sm bg-dark-900 border border-dark-700 rounded-lg px-3 py-2">
                    <option value="all">All Modules</option>
                    {(stats?.byModule || []).map(m => <option key={m.module} value={m.module}>{m.module}</option>)}
                </select>
                <select value={filterAction} onChange={e => { setFilterAction(e.target.value); setPage(1); }} className="text-sm bg-dark-900 border border-dark-700 rounded-lg px-3 py-2">
                    <option value="all">All Actions</option>
                    {(stats?.byAction || []).map(a => <option key={a.action} value={a.action}>{a.action}</option>)}
                </select>
            </div>

            {/* Timeline */}
            {Object.entries(grouped).map(([day, items]) => (
                <div key={day}>
                    <div className="flex items-center gap-3 mb-3">
                        <Calendar size={14} className="text-neutral-500" />
                        <span className="text-sm font-semibold text-neutral-300">{day}</span>
                        <div className="flex-1 h-px bg-dark-700" />
                        <span className="text-xs text-neutral-600">{items.length} events</span>
                    </div>
                    <div className="space-y-1 ml-2">
                        {items.map((entry) => {
                            const cfg = actionIcons[entry.action] ?? { icon: Activity, color: "text-neutral-400 bg-neutral-500/10" };
                            const Icon = cfg.icon;
                            return (
                                <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-dark-850 transition-colors group cursor-pointer" onClick={() => setSelectedEntry(entry)}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                                        <Icon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-neutral-200">
                                            <span className="font-medium text-white">{entry.user ? `${entry.user.firstName} ${entry.user.lastName}` : entry.userEmail}</span>
                                            {" "}
                                            <span className="text-neutral-500">{entry.action.toLowerCase().replace(/_/g, " ")}</span>
                                            {entry.entityType && <> <span className="text-neutral-400">{entry.entityType}</span></>}
                                        </p>
                                        {entry.description && <p className="text-xs text-neutral-500 mt-0.5 truncate">{entry.description}</p>}
                                        {entry.metadata && typeof entry.metadata === "object" && entry.metadata.ip && (
                                            <p className="text-[10px] text-neutral-600 mt-0.5">IP: {entry.metadata.ip} · {entry.metadata.userAgent?.slice(0, 40)}...</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="badge badge-default text-[9px]">{entry.module}</span>
                                        <span className="text-xs text-neutral-600 flex-shrink-0">{timeAgo(entry.createdAt)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {filtered.length === 0 && (
                <div className="card py-16 text-center">
                    <Activity size={48} className="mx-auto text-neutral-700 mb-4" />
                    <p className="text-neutral-400">{entries.length === 0 ? "No audit logs yet. Actions will appear here as they occur." : "No logs match your filters."}</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-500">Showing page {page} of {totalPages} ({total} total)</p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn-icon disabled:opacity-30"><ChevronLeft size={16} /></button>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn-icon disabled:opacity-30"><ChevronRight size={16} /></button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedEntry && (
                <div className="modal-overlay" onClick={() => setSelectedEntry(null)}>
                    <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Audit Entry Detail</h2>
                            <button onClick={() => setSelectedEntry(null)} className="btn-icon"><span className="text-lg">×</span></button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: "Action", value: selectedEntry.action },
                                { label: "Module", value: selectedEntry.module },
                                { label: "User", value: `${selectedEntry.user?.firstName || ""} ${selectedEntry.user?.lastName || ""} (${selectedEntry.userEmail})` },
                                { label: "Role", value: selectedEntry.userRole },
                                { label: "Entity", value: `${selectedEntry.entityType || "—"} / ${selectedEntry.entityId || "—"}` },
                                { label: "Description", value: selectedEntry.description || "—" },
                                { label: "Timestamp", value: new Date(selectedEntry.createdAt).toLocaleString() },
                            ].map(row => (
                                <div key={row.label} className="flex items-start gap-3">
                                    <span className="text-xs text-neutral-500 w-20 flex-shrink-0 pt-0.5">{row.label}</span>
                                    <span className="text-sm text-neutral-200">{row.value}</span>
                                </div>
                            ))}
                            {selectedEntry.metadata && (
                                <div>
                                    <span className="text-xs text-neutral-500">Metadata</span>
                                    <pre className="text-xs text-neutral-400 bg-dark-800 rounded-lg p-3 mt-1 overflow-x-auto">{JSON.stringify(selectedEntry.metadata, null, 2)}</pre>
                                </div>
                            )}
                            {selectedEntry.changes && (
                                <div>
                                    <span className="text-xs text-neutral-500">Changes</span>
                                    <pre className="text-xs text-neutral-400 bg-dark-800 rounded-lg p-3 mt-1 overflow-x-auto">{JSON.stringify(selectedEntry.changes, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
