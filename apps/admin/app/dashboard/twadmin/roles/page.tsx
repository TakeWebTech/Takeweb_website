"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Key, Plus, Edit, Trash2, Users, X, Loader2, ArrowLeft, Check, Shield } from "lucide-react";

interface Permission { id: string; module: string; accessType: string; description?: string; }

interface CustomRole {
    id: string; name: string; slug: string; description?: string; isSystem: boolean; isActive: boolean;
    permissions: { permission: Permission }[];
    _count: { users: number };
}

const MODULES = ["dashboard", "employees", "projects", "services", "blog", "careers", "contact", "media", "team", "settings", "seo", "reports", "reviews", "twadmin"];
const ACCESS_TYPES = ["VIEW", "CREATE", "EDIT", "DELETE"];

export default function RolesPage() {
    const [roles, setRoles] = useState<CustomRole[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editRole, setEditRole] = useState<CustomRole | null>(null);
    const [form, setForm] = useState({ name: "", description: "" });
    const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [rolesRes, permsRes] = await Promise.all([
                fetch(`${base}/api/v1/roles`, { headers: getHeaders() }),
                fetch(`${base}/api/v1/roles/permissions`, { headers: getHeaders() }),
            ]);
            if (rolesRes.ok) setRoles(await rolesRes.json());
            if (permsRes.ok) setPermissions(await permsRes.json());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const seedPermissions = async () => {
        try {
            await fetch(`${base}/api/v1/roles/permissions/seed`, { method: "POST", headers: getHeaders() });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const saveRole = async () => {
        setSaving(true);
        try {
            const url = editRole ? `${base}/api/v1/roles/${editRole.id}` : `${base}/api/v1/roles`;
            await fetch(url, {
                method: editRole ? "PATCH" : "POST",
                headers: getHeaders(),
                body: JSON.stringify({ ...form, permissionIds: Array.from(selectedPerms) }),
            });
            setShowModal(false); setEditRole(null); fetchData();
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const deleteRole = async (id: string) => {
        if (!confirm("Delete this role?")) return;
        try { await fetch(`${base}/api/v1/roles/${id}`, { method: "DELETE", headers: getHeaders() }); fetchData(); }
        catch (err) { console.error(err); }
    };

    const openEdit = (r: CustomRole) => {
        setEditRole(r); setForm({ name: r.name, description: r.description || "" });
        setSelectedPerms(new Set(r.permissions.map(p => p.permission.id)));
        setShowModal(true);
    };

    const openNew = () => { setEditRole(null); setForm({ name: "", description: "" }); setSelectedPerms(new Set()); setShowModal(true); };

    const togglePerm = (id: string) => {
        const next = new Set(selectedPerms);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedPerms(next);
    };

    const toggleModule = (module: string) => {
        const modPerms = permissions.filter(p => p.module === module);
        const allSelected = modPerms.every(p => selectedPerms.has(p.id));
        const next = new Set(selectedPerms);
        modPerms.forEach(p => allSelected ? next.delete(p.id) : next.add(p.id));
        setSelectedPerms(next);
    };

    if (loading) return <div className="space-y-4"><div className="skeleton h-8 w-48" /><div className="skeleton h-64 rounded-xl" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <Link href="/dashboard/twadmin" className="btn-icon"><ArrowLeft size={18} /></Link>
                <div className="page-header flex-1"><h1>Roles & Permissions</h1><p>Define custom roles with granular access</p></div>
                <div className="flex gap-2">
                    {permissions.length === 0 && <button onClick={seedPermissions} className="btn-secondary">Seed Permissions</button>}
                    <button onClick={openNew} className="btn-primary"><Plus size={16} /> New Role</button>
                </div>
            </div>

            {/* Roles List */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {roles.map((r) => (
                    <div key={r.id} className="card hover:border-dark-600 transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                    <Key size={20} className="text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white flex items-center gap-2">
                                        {r.name}
                                        {r.isSystem && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-400">System</span>}
                                    </h3>
                                    {r.description && <p className="text-xs text-neutral-500 mt-0.5">{r.description}</p>}
                                </div>
                            </div>
                            {!r.isSystem && (
                                <div className="flex gap-1">
                                    <button onClick={() => openEdit(r)} className="btn-icon"><Edit size={14} /></button>
                                    <button onClick={() => deleteRole(r.id)} className="btn-icon hover:text-error-400"><Trash2 size={14} /></button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3">
                            <span className="flex items-center gap-1"><Users size={12} /> {r._count.users} users</span>
                            <span className="flex items-center gap-1"><Shield size={12} /> {r.permissions.length} perms</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {[...new Set(r.permissions.map(p => p.permission.module))].slice(0, 6).map(mod => (
                                <span key={mod} className="text-[10px] px-1.5 py-0.5 rounded bg-dark-700 text-neutral-400">{mod}</span>
                            ))}
                            {[...new Set(r.permissions.map(p => p.permission.module))].length > 6 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-700 text-neutral-500">+more</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Permission Matrix Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content max-w-4xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6 sticky top-0 bg-dark-900 pb-4 z-10">
                            <h2 className="text-lg font-semibold text-white">{editRole ? "Edit Role" : "New Role"}</h2>
                            <button onClick={() => setShowModal(false)} className="btn-icon"><X size={18} /></button>
                        </div>
                        <div className="space-y-4 mb-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm text-neutral-300 mb-1.5">Name <span className="text-red-400">*</span></label>
                                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full" placeholder="Content Manager" /></div>
                                <div><label className="block text-sm text-neutral-300 mb-1.5">Description</label>
                                    <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full" placeholder="Can manage all content" /></div>
                            </div>
                        </div>

                        {/* Permission Matrix */}
                        <h3 className="text-sm font-semibold text-white mb-3">Permission Matrix</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-dark-700">
                                        <th className="text-left py-2 px-3 text-neutral-400 font-medium">Module</th>
                                        {ACCESS_TYPES.map(at => (
                                            <th key={at} className="text-center py-2 px-3 text-neutral-400 font-medium text-xs">{at}</th>
                                        ))}
                                        <th className="text-center py-2 px-3 text-neutral-400 font-medium text-xs">All</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MODULES.map(mod => {
                                        const modPerms = permissions.filter(p => p.module === mod);
                                        const allSelected = modPerms.every(p => selectedPerms.has(p.id));
                                        return (
                                            <tr key={mod} className="border-b border-dark-700/50 hover:bg-dark-850">
                                                <td className="py-2 px-3 text-neutral-300 capitalize">{mod}</td>
                                                {ACCESS_TYPES.map(at => {
                                                    const perm = modPerms.find(p => p.accessType === at);
                                                    return (
                                                        <td key={at} className="text-center py-2 px-3">
                                                            {perm ? (
                                                                <button
                                                                    onClick={() => togglePerm(perm.id)}
                                                                    className={`w-6 h-6 rounded-md border transition-colors flex items-center justify-center mx-auto ${selectedPerms.has(perm.id) ? "bg-primary-500 border-primary-500 text-white" : "border-dark-600 hover:border-dark-500"}`}
                                                                >
                                                                    {selectedPerms.has(perm.id) && <Check size={14} />}
                                                                </button>
                                                            ) : <span className="text-neutral-700">—</span>}
                                                        </td>
                                                    );
                                                })}
                                                <td className="text-center py-2 px-3">
                                                    <button
                                                        onClick={() => toggleModule(mod)}
                                                        className={`w-6 h-6 rounded-md border transition-colors flex items-center justify-center mx-auto ${allSelected ? "bg-emerald-500 border-emerald-500 text-white" : "border-dark-600 hover:border-dark-500"}`}
                                                    >
                                                        {allSelected && <Check size={14} />}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-dark-900 pt-4">
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={saveRole} disabled={!form.name || saving} className="btn-primary disabled:opacity-50">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : null} {editRole ? "Update Role" : "Create Role"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
