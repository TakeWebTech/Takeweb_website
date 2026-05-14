"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Gavel, Plus, Edit, Trash2, X, Loader2, ArrowLeft, Shield, Building2, Network, User } from "lucide-react";

interface Rule {
    id: string; name: string; description?: string; isActive: boolean; priority: number;
    level: string; module: string; accessType: string; effect: string; conditions?: any;
    group?: { id: string; name: string } | null;
    team?: { id: string; name: string } | null;
    user?: { id: string; firstName: string; lastName: string } | null;
}

const MODULES = ["dashboard", "employees", "projects", "services", "blog", "careers", "contact", "media", "team", "settings", "seo", "reports", "reviews", "twadmin"];
const ACCESS_TYPES = ["VIEW", "CREATE", "EDIT", "DELETE"];

export default function RulesPage() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editRule, setEditRule] = useState<Rule | null>(null);
    const [form, setForm] = useState({ name: "", description: "", level: "GROUP", groupId: "", teamId: "", userId: "", module: "dashboard", accessType: "VIEW", effect: "DENY", priority: 0 });
    const [saving, setSaving] = useState(false);

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" });

    useEffect(() => { fetchRules(); }, []);

    const fetchRules = async () => {
        try { const res = await fetch(`${base}/api/v1/rules`, { headers: getHeaders() }); if (res.ok) setRules(await res.json()); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const saveRule = async () => {
        setSaving(true);
        try {
            const url = editRule ? `${base}/api/v1/rules/${editRule.id}` : `${base}/api/v1/rules`;
            await fetch(url, { method: editRule ? "PATCH" : "POST", headers: getHeaders(), body: JSON.stringify(form) });
            setShowModal(false); setEditRule(null); fetchRules();
        } catch (err) { console.error(err); } finally { setSaving(false); }
    };

    const deleteRule = async (id: string) => {
        if (!confirm("Delete this rule?")) return;
        try { await fetch(`${base}/api/v1/rules/${id}`, { method: "DELETE", headers: getHeaders() }); fetchRules(); }
        catch (err) { console.error(err); }
    };

    const toggleActive = async (rule: Rule) => {
        try { await fetch(`${base}/api/v1/rules/${rule.id}`, { method: "PATCH", headers: getHeaders(), body: JSON.stringify({ isActive: !rule.isActive }) }); fetchRules(); }
        catch (err) { console.error(err); }
    };

    const openEdit = (r: Rule) => {
        setEditRule(r);
        setForm({ name: r.name, description: r.description || "", level: r.level, groupId: r.group?.id || "", teamId: r.team?.id || "", userId: r.user?.id || "", module: r.module, accessType: r.accessType, effect: r.effect, priority: r.priority });
        setShowModal(true);
    };
    const openNew = () => { setEditRule(null); setForm({ name: "", description: "", level: "GROUP", groupId: "", teamId: "", userId: "", module: "dashboard", accessType: "VIEW", effect: "DENY", priority: 0 }); setShowModal(true); };

    const levelIcon = (level: string) => level === "GROUP" ? <Building2 size={14} /> : level === "TEAM" ? <Network size={14} /> : <User size={14} />;
    const levelColor = (level: string) => level === "GROUP" ? "text-blue-400 bg-blue-400/10" : level === "TEAM" ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10";

    if (loading) return <div className="space-y-4"><div className="skeleton h-8 w-48" /><div className="skeleton h-64 rounded-xl" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <Link href="/dashboard/twadmin" className="btn-icon"><ArrowLeft size={18} /></Link>
                <div className="page-header flex-1"><h1>Rules Engine</h1><p>Dynamic access rules per group, team, or individual</p></div>
                <button onClick={openNew} className="btn-primary"><Plus size={16} /> New Rule</button>
            </div>

            {/* Rules Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dark-700">
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Rule</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Level</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium hidden sm:table-cell">Scope</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium hidden md:table-cell">Module</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Effect</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium hidden lg:table-cell">Priority</th>
                                <th className="text-right py-3 px-4 text-neutral-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map((r) => (
                                <tr key={r.id} className={`border-b border-dark-700/50 hover:bg-dark-850 transition-colors ${!r.isActive ? "opacity-50" : ""}`}>
                                    <td className="py-3 px-4">
                                        <p className="font-medium text-white">{r.name}</p>
                                        {r.description && <p className="text-xs text-neutral-500 mt-0.5">{r.description}</p>}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${levelColor(r.level)}`}>
                                            {levelIcon(r.level)} {r.level}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 hidden sm:table-cell text-xs text-neutral-400">
                                        {r.group?.name || r.team?.name || (r.user ? `${r.user.firstName} ${r.user.lastName}` : "—")}
                                    </td>
                                    <td className="py-3 px-4 hidden md:table-cell">
                                        <span className="text-xs text-neutral-300 capitalize">{r.module}</span>
                                        <span className="text-xs text-neutral-500 ml-1">({r.accessType})</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`badge ${r.effect === "ALLOW" ? "badge-success" : "badge-error"}`}>{r.effect}</span>
                                    </td>
                                    <td className="py-3 px-4 hidden lg:table-cell text-xs text-neutral-400">{r.priority}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => toggleActive(r)} className="btn-icon" title={r.isActive ? "Disable" : "Enable"}>
                                                <Shield size={14} className={r.isActive ? "text-emerald-400" : ""} />
                                            </button>
                                            <button onClick={() => openEdit(r)} className="btn-icon"><Edit size={14} /></button>
                                            <button onClick={() => deleteRule(r.id)} className="btn-icon hover:text-error-400"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {rules.length === 0 && (
                    <div className="empty-state py-12">
                        <Gavel size={40} className="empty-state-icon" />
                        <p className="text-neutral-400">No rules defined</p>
                        <button onClick={openNew} className="btn-primary mt-4"><Plus size={16} /> Create First Rule</button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white">{editRule ? "Edit Rule" : "New Rule"}</h2>
                            <button onClick={() => setShowModal(false)} className="btn-icon"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-sm text-neutral-300 mb-1.5">Name <span className="text-red-400">*</span></label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full" placeholder="Block interns from settings" /></div>
                            <div><label className="block text-sm text-neutral-300 mb-1.5">Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full" rows={2} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm text-neutral-300 mb-1.5">Level</label>
                                    <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="w-full">
                                        <option value="GROUP">Group</option><option value="TEAM">Team</option><option value="INDIVIDUAL">Individual</option>
                                    </select></div>
                                <div><label className="block text-sm text-neutral-300 mb-1.5">Effect</label>
                                    <select value={form.effect} onChange={e => setForm({ ...form, effect: e.target.value })} className="w-full">
                                        <option value="DENY">DENY</option><option value="ALLOW">ALLOW</option>
                                    </select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm text-neutral-300 mb-1.5">Module</label>
                                    <select value={form.module} onChange={e => setForm({ ...form, module: e.target.value })} className="w-full">
                                        {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select></div>
                                <div><label className="block text-sm text-neutral-300 mb-1.5">Access Type</label>
                                    <select value={form.accessType} onChange={e => setForm({ ...form, accessType: e.target.value })} className="w-full">
                                        {ACCESS_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select></div>
                            </div>
                            <div><label className="block text-sm text-neutral-300 mb-1.5">Priority</label>
                                <input type="number" value={form.priority} onChange={e => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} className="w-full" /></div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={saveRule} disabled={!form.name || saving} className="btn-primary disabled:opacity-50">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : null} {editRule ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
