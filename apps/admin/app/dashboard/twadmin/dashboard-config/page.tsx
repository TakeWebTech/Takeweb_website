"use client";

import { useState, useEffect } from "react";
import {
    LayoutDashboard, Save, RotateCcw, Lock, Unlock, Eye, EyeOff,
    ChevronDown, ChevronRight, Shield, Users, UserCog, Edit3,
    CheckCircle2, GripVertical, Plus, X, Settings, Palette,
} from "lucide-react";

/* ─── Widget Registry (must match main dashboard) ─── */
const ALL_WIDGETS = [
    { id: "stats-overview", name: "Stats Overview", description: "Key metrics at a glance" },
    { id: "quick-actions", name: "Quick Actions", description: "Shortcuts to common tasks" },
    { id: "notifications", name: "Notifications", description: "Alerts & reminders" },
    { id: "recent-activity", name: "Recent Activity", description: "Latest system activity" },
    { id: "announcements", name: "Announcements", description: "Company & team notes" },
    { id: "attendance-summary", name: "Attendance Summary", description: "Monthly attendance" },
    { id: "company-holidays", name: "Company Holidays", description: "Upcoming holidays" },
    { id: "content-overview", name: "Content Overview", description: "Content progress bars" },
    { id: "website-pages", name: "Website Pages", description: "Live pages status" },
];

const ROLES = ["ADMIN", "EDITOR", "AUTHOR", "VIEWER"];

const DEFAULT_LAYOUTS: Record<string, { widgets: string[]; locked: string[] }> = {
    ADMIN: {
        widgets: ["stats-overview", "quick-actions", "notifications", "recent-activity", "announcements", "attendance-summary", "company-holidays", "content-overview", "website-pages"],
        locked: ["stats-overview"],
    },
    EDITOR: {
        widgets: ["stats-overview", "quick-actions", "recent-activity", "content-overview", "announcements"],
        locked: ["stats-overview"],
    },
    AUTHOR: {
        widgets: ["stats-overview", "quick-actions", "announcements", "company-holidays", "attendance-summary"],
        locked: ["stats-overview", "attendance-summary"],
    },
    VIEWER: {
        widgets: ["stats-overview", "announcements", "company-holidays", "website-pages"],
        locked: ["stats-overview"],
    },
};

const base = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") : "";
const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json",
});

export default function DashboardConfigPage() {
    const [selectedRole, setSelectedRole] = useState("ADMIN");
    const [layouts, setLayouts] = useState(DEFAULT_LAYOUTS);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [expandedRole, setExpandedRole] = useState<string | null>("ADMIN");

    const toggleWidget = (role: string, widgetId: string) => {
        setLayouts(prev => {
            const current = prev[role] ?? { widgets: [], locked: [] };
            const widgets = current.widgets.includes(widgetId)
                ? current.widgets.filter(w => w !== widgetId)
                : [...current.widgets, widgetId];
            return { ...prev, [role]: { ...current, widgets } };
        });
    };

    const toggleLock = (role: string, widgetId: string) => {
        setLayouts(prev => {
            const current = prev[role] ?? { widgets: [], locked: [] };
            const locked = current.locked.includes(widgetId)
                ? current.locked.filter(w => w !== widgetId)
                : [...current.locked, widgetId];
            return { ...prev, [role]: { ...current, locked } };
        });
    };

    const moveWidget = (role: string, index: number, direction: "up" | "down") => {
        setLayouts(prev => {
            const current = prev[role] ?? { widgets: [], locked: [] };
            const arr = [...current.widgets];
            const target = direction === "up" ? index - 1 : index + 1;
            if (target < 0 || target >= arr.length) return prev;
            [arr[index], arr[target]] = [arr[target]!, arr[index]!];
            return { ...prev, [role]: { ...current, widgets: arr } };
        });
    };

    const saveAll = async () => {
        setSaving(true);
        try {
            await fetch(`${base}/api/v1/dashboard-config/layout`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({
                    name: "AdminDefaults",
                    widgets: Object.entries(layouts).map(([role, cfg]) => ({
                        widgetId: `role-defaults-${role}`,
                        x: 0, y: 0, w: 12, h: 1,
                        locked: false,
                        metadata: JSON.stringify(cfg),
                    })),
                    isDefault: true,
                }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Save error:", err);
        } finally {
            setSaving(false);
        }
    };

    const resetRole = (role: string) => {
        setLayouts(prev => ({ ...prev, [role]: DEFAULT_LAYOUTS[role] ?? { widgets: [], locked: [] } }));
    };

    const roleColors: Record<string, { bg: string; text: string; border: string }> = {
        ADMIN: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
        EDITOR: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
        AUTHOR: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
        VIEWER: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1 className="flex items-center gap-2">
                        <Palette size={22} className="text-primary-400" />
                        Dashboard Configuration
                    </h1>
                    <p>Configure default dashboard layouts for each role. Lock widgets to prevent removal.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={saveAll} disabled={saving} className="btn-primary text-sm">
                        {saving ? <span className="animate-spin">⟳</span> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                        {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="card bg-primary-500/5 border-primary-500/20">
                <div className="flex items-start gap-3">
                    <Shield size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-white">Admin Dashboard Control</p>
                        <p className="text-xs text-neutral-400 mt-1">
                            Set which widgets appear by default for each role. <strong>Locked</strong> widgets cannot be removed by users.
                            Users can still add unlocked widgets and reorder their layout.
                        </p>
                    </div>
                </div>
            </div>

            {/* Role Configs */}
            <div className="space-y-3">
                {ROLES.map(role => {
                    const cfg = layouts[role] ?? { widgets: [], locked: [] };
                    const colors = roleColors[role] ?? roleColors.VIEWER!;
                    const isExpanded = expandedRole === role;

                    return (
                        <div key={role} className="card overflow-hidden">
                            {/* Role Header */}
                            <button
                                onClick={() => setExpandedRole(isExpanded ? null : role)}
                                className="w-full flex items-center justify-between py-1"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                                        <Shield size={18} className={colors.text} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-white">{role}</p>
                                        <p className="text-xs text-neutral-500">{cfg.widgets.length} widgets · {cfg.locked.length} locked</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); resetRole(role); }}
                                        className="btn-icon text-xs"
                                        title="Reset to defaults"
                                    >
                                        <RotateCcw size={14} />
                                    </button>
                                    {isExpanded ? <ChevronDown size={16} className="text-neutral-500" /> : <ChevronRight size={16} className="text-neutral-500" />}
                                </div>
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="mt-4 space-y-4 border-t border-dark-700 pt-4">
                                    {/* Active Widgets (ordered) */}
                                    <div>
                                        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Active Widgets (drag to reorder)</h3>
                                        <div className="space-y-1.5">
                                            {cfg.widgets.map((wid, idx) => {
                                                const wDef = ALL_WIDGETS.find(w => w.id === wid);
                                                if (!wDef) return null;
                                                const isLocked = cfg.locked.includes(wid);
                                                return (
                                                    <div key={wid} className={`flex items-center justify-between p-2.5 rounded-lg border ${isLocked ? `${colors.bg} ${colors.border}` : "bg-dark-800 border-dark-700"}`}>
                                                        <div className="flex items-center gap-2.5">
                                                            <GripVertical size={14} className="text-neutral-600" />
                                                            <div>
                                                                <p className="text-sm text-white">{wDef.name}</p>
                                                                <p className="text-[10px] text-neutral-500">{wDef.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button onClick={() => moveWidget(role, idx, "up")} disabled={idx === 0} className="btn-icon text-xs disabled:opacity-20">↑</button>
                                                            <button onClick={() => moveWidget(role, idx, "down")} disabled={idx === cfg.widgets.length - 1} className="btn-icon text-xs disabled:opacity-20">↓</button>
                                                            <button onClick={() => toggleLock(role, wid)} className={`btn-icon ${isLocked ? colors.text : "text-neutral-500"}`} title={isLocked ? "Unlock" : "Lock"}>
                                                                {isLocked ? <Lock size={13} /> : <Unlock size={13} />}
                                                            </button>
                                                            <button onClick={() => toggleWidget(role, wid)} className="btn-icon hover:text-error-400" title="Remove">
                                                                <X size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Available Widgets */}
                                    {ALL_WIDGETS.filter(w => !cfg.widgets.includes(w.id)).length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Available Widgets</h3>
                                            <div className="grid sm:grid-cols-2 gap-1.5">
                                                {ALL_WIDGETS.filter(w => !cfg.widgets.includes(w.id)).map(w => (
                                                    <button
                                                        key={w.id}
                                                        onClick={() => toggleWidget(role, w.id)}
                                                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-dark-850 border border-dark-700/50 hover:border-primary-500/30 transition-colors text-left"
                                                    >
                                                        <Plus size={14} className="text-primary-400 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-sm text-neutral-300">{w.name}</p>
                                                            <p className="text-[10px] text-neutral-600">{w.description}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
