"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Network, Plus, Edit, Trash2, Users, X, Loader2, ArrowLeft, UserPlus, UserMinus } from "lucide-react";

interface Team {
    id: string; name: string; slug: string; description?: string; isActive: boolean;
    group: { id: string; name: string };
    manager?: { id: string; firstName: string; lastName: string; email: string } | null;
    lead?: { id: string; firstName: string; lastName: string; email: string } | null;
    _count: { members: number };
}

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTeam, setEditTeam] = useState<Team | null>(null);
    const [form, setForm] = useState({ name: "", description: "", groupId: "" });
    const [saving, setSaving] = useState(false);

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" });

    useEffect(() => { fetchTeams(); fetchGroups(); }, []);

    const fetchTeams = async () => {
        try {
            const res = await fetch(`${base}/api/v1/teams`, { headers: getHeaders() });
            if (res.ok) setTeams(await res.json());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchGroups = async () => {
        try {
            const res = await fetch(`${base}/api/v1/groups`, { headers: getHeaders() });
            if (res.ok) {
                const data = await res.json();
                setGroups(data.map((g: any) => ({ id: g.id, name: g.name })));
            }
        } catch (err) { console.error(err); }
    };

    const saveTeam = async () => {
        setSaving(true);
        try {
            const url = editTeam ? `${base}/api/v1/teams/${editTeam.id}` : `${base}/api/v1/teams`;
            const res = await fetch(url, {
                method: editTeam ? "PATCH" : "POST",
                headers: getHeaders(),
                body: JSON.stringify(form),
            });
            if (res.ok) { setShowModal(false); setEditTeam(null); setForm({ name: "", description: "", groupId: "" }); fetchTeams(); }
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const deleteTeam = async (id: string) => {
        if (!confirm("Delete this team?")) return;
        try { await fetch(`${base}/api/v1/teams/${id}`, { method: "DELETE", headers: getHeaders() }); fetchTeams(); }
        catch (err) { console.error(err); }
    };

    const openEdit = (t: Team) => { setEditTeam(t); setForm({ name: t.name, description: t.description || "", groupId: t.group.id }); setShowModal(true); };
    const openNew = () => { setEditTeam(null); setForm({ name: "", description: "", groupId: groups[0]?.id || "" }); setShowModal(true); };

    if (loading) return <div className="space-y-4"><div className="skeleton h-8 w-48" /><div className="skeleton h-64 rounded-xl" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <Link href="/dashboard/twadmin" className="btn-icon"><ArrowLeft size={18} /></Link>
                <div className="page-header flex-1"><h1>Teams</h1><p>Manage teams within groups</p></div>
                <button onClick={openNew} className="btn-primary" disabled={groups.length === 0}>
                    <Plus size={16} /> New Team
                </button>
            </div>

            {groups.length === 0 && (
                <div className="card p-6 text-center">
                    <p className="text-neutral-400 mb-3">Create a group first before adding teams</p>
                    <Link href="/dashboard/twadmin/groups" className="btn-primary inline-flex">Go to Groups</Link>
                </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {teams.map((t) => (
                    <div key={t.id} className="card hover:border-dark-600 transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <Network size={20} className="text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{t.name}</h3>
                                    <p className="text-xs text-neutral-500">{t.group.name}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => openEdit(t)} className="btn-icon"><Edit size={14} /></button>
                                <button onClick={() => deleteTeam(t.id)} className="btn-icon hover:text-error-400"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        {t.description && <p className="text-xs text-neutral-500 mb-3">{t.description}</p>}
                        <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3">
                            <span className="flex items-center gap-1"><Users size={12} /> {t._count.members} members</span>
                        </div>
                        <div className="border-t border-dark-700 pt-3 space-y-2">
                            {t.manager && (
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-neutral-500">Manager</span>
                                    <span className="text-neutral-300">{t.manager.firstName} {t.manager.lastName}</span>
                                </div>
                            )}
                            {t.lead && (
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-neutral-500">Lead</span>
                                    <span className="text-neutral-300">{t.lead.firstName} {t.lead.lastName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white">{editTeam ? "Edit Team" : "New Team"}</h2>
                            <button onClick={() => setShowModal(false)} className="btn-icon"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-300 mb-1.5">Group <span className="text-red-400">*</span></label>
                                <select value={form.groupId} onChange={e => setForm({ ...form, groupId: e.target.value })} className="w-full">
                                    <option value="">Select group...</option>
                                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-300 mb-1.5">Team Name <span className="text-red-400">*</span></label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full" placeholder="Frontend Team" />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-300 mb-1.5">Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full" rows={3} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={saveTeam} disabled={!form.name || !form.groupId || saving} className="btn-primary disabled:opacity-50">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : null} {editTeam ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
