"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, Plus, Edit, Trash2, Users, X, Loader2, ArrowLeft } from "lucide-react";

interface Group {
    id: string; name: string; slug: string; description?: string; isActive: boolean;
    _count: { members: number; teams: number };
    teams: { id: string; name: string; _count: { members: number } }[];
}

export default function GroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editGroup, setEditGroup] = useState<Group | null>(null);
    const [form, setForm] = useState({ name: "", description: "" });
    const [saving, setSaving] = useState(false);

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" });

    useEffect(() => { fetchGroups(); }, []);

    const fetchGroups = async () => {
        try {
            const res = await fetch(`${base}/api/v1/groups`, { headers: getHeaders() });
            if (res.ok) setGroups(await res.json());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const saveGroup = async () => {
        setSaving(true);
        try {
            const url = editGroup ? `${base}/api/v1/groups/${editGroup.id}` : `${base}/api/v1/groups`;
            const res = await fetch(url, {
                method: editGroup ? "PATCH" : "POST",
                headers: getHeaders(),
                body: JSON.stringify(form),
            });
            if (res.ok) { setShowModal(false); setEditGroup(null); setForm({ name: "", description: "" }); fetchGroups(); }
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const deleteGroup = async (id: string) => {
        if (!confirm("Delete this group and all its teams?")) return;
        try {
            await fetch(`${base}/api/v1/groups/${id}`, { method: "DELETE", headers: getHeaders() });
            fetchGroups();
        } catch (err) { console.error(err); }
    };

    const openEdit = (g: Group) => { setEditGroup(g); setForm({ name: g.name, description: g.description || "" }); setShowModal(true); };
    const openNew = () => { setEditGroup(null); setForm({ name: "", description: "" }); setShowModal(true); };

    if (loading) return <div className="space-y-4"><div className="skeleton h-8 w-48" /><div className="skeleton h-64 rounded-xl" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <Link href="/dashboard/twadmin" className="btn-icon"><ArrowLeft size={18} /></Link>
                <div className="page-header flex-1"><h1>Groups (Departments)</h1><p>Manage organizational departments</p></div>
                <button onClick={openNew} className="btn-primary"><Plus size={16} /> New Group</button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {groups.map((g) => (
                    <div key={g.id} className="card group hover:border-dark-600 transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Building2 size={20} className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{g.name}</h3>
                                    {g.description && <p className="text-xs text-neutral-500 mt-0.5">{g.description}</p>}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => openEdit(g)} className="btn-icon"><Edit size={14} /></button>
                                <button onClick={() => deleteGroup(g.id)} className="btn-icon hover:text-error-400"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-neutral-400">
                            <span className="flex items-center gap-1"><Users size={12} /> {g._count.members} members</span>
                            <span>{g._count.teams} teams</span>
                        </div>
                        {g.teams.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-dark-700 space-y-1.5">
                                {g.teams.slice(0, 3).map(t => (
                                    <div key={t.id} className="flex items-center justify-between text-xs">
                                        <span className="text-neutral-300">{t.name}</span>
                                        <span className="text-neutral-500">{t._count.members} members</span>
                                    </div>
                                ))}
                                {g.teams.length > 3 && <p className="text-xs text-neutral-600">+{g.teams.length - 3} more</p>}
                            </div>
                        )}
                    </div>
                ))}

                {groups.length === 0 && (
                    <div className="sm:col-span-2 lg:col-span-3 empty-state py-12">
                        <Building2 size={40} className="empty-state-icon" />
                        <p className="text-neutral-400">No groups yet</p>
                        <button onClick={openNew} className="btn-primary mt-4"><Plus size={16} /> Create First Group</button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white">{editGroup ? "Edit Group" : "New Group"}</h2>
                            <button onClick={() => setShowModal(false)} className="btn-icon"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-300 mb-1.5">Name <span className="text-red-400">*</span></label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full" placeholder="Engineering" />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-300 mb-1.5">Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full" rows={3} placeholder="Optional description..." />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={saveGroup} disabled={!form.name || saving} className="btn-primary disabled:opacity-50">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} {editGroup ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
