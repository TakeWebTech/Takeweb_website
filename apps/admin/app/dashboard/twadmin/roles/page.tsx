"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Key, Plus, Edit, Trash2, Users, X, Loader2, ArrowLeft, Check, Shield, Crown, Eye, Pencil, UserCheck, ChevronDown, Search, Building2 } from "lucide-react";

interface Permission { id: string; module: string; accessType: string; description?: string; }

interface CustomRole {
    id: string; name: string; slug: string; description?: string; isSystem: boolean; isActive: boolean;
    permissions: { permission: Permission }[];
    _count: { users: number };
}

/* ─── Built-in System Roles ─── */
const BUILT_IN_ROLES = [
    {
        name: "ADMIN",
        icon: Crown,
        color: "from-amber-500 to-orange-600",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        textColor: "text-amber-400",
        description: "Full system access — can manage all modules, users, roles, rules, and system settings.",
        permissions: ["All Modules", "User Management", "Role Management", "System Settings", "Audit Logs", "Dashboard Config"],
    },
    {
        name: "EDITOR",
        icon: Pencil,
        color: "from-blue-500 to-indigo-600",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
        textColor: "text-blue-400",
        description: "Content management — can create, edit, and publish all content types plus manage media.",
        permissions: ["Pages", "Blog Posts", "Services", "Projects", "Testimonials", "Media", "Careers", "Contact"],
    },
    {
        name: "AUTHOR",
        icon: UserCheck,
        color: "from-emerald-500 to-teal-600",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
        textColor: "text-emerald-400",
        description: "Content creation — can create blog posts and projects, view announcements and holidays.",
        permissions: ["Blog Posts (Create/Edit)", "Projects (Create/Edit)", "View Dashboard", "Announcements"],
    },
    {
        name: "VIEWER",
        icon: Eye,
        color: "from-purple-500 to-violet-600",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
        textColor: "text-purple-400",
        description: "Read-only access — can view dashboard, announcements, company holidays, and website pages.",
        permissions: ["View Dashboard", "Announcements", "Company Holidays", "Website Pages"],
    },
];

const MODULE_DEFINITIONS = [
    { key: "dashboard", label: "Dashboard", actions: ["VIEW"] },
    { key: "employees", label: "Employees", actions: ["VIEW", "CREATE", "EDIT", "DELETE", "APPROVE", "ASSIGN", "EXPORT"] },
    { key: "salary", label: "Salary", actions: ["VIEW", "EDIT", "ASSIGN", "APPROVE", "EXPORT"] },
    { key: "attendance", label: "Attendance", actions: ["VIEW", "EDIT", "APPROVE", "EXPORT"] },
    { key: "reviews", label: "Reviews", actions: ["VIEW", "EDIT", "APPROVE", "EXPORT"] },
    { key: "projects", label: "Projects", actions: ["VIEW", "CREATE", "EDIT", "DELETE"] },
    { key: "services", label: "Services", actions: ["VIEW", "CREATE", "EDIT", "DELETE"] },
    { key: "blog", label: "Blog", actions: ["VIEW", "CREATE", "EDIT", "DELETE"] },
    { key: "careers", label: "Careers", actions: ["VIEW", "CREATE", "EDIT", "DELETE"] },
    { key: "contact", label: "Contact", actions: ["VIEW", "EDIT", "EXPORT"] },
    { key: "media", label: "Media", actions: ["VIEW", "CREATE", "EDIT", "DELETE"] },
    { key: "team", label: "Teams", actions: ["VIEW", "CREATE", "EDIT", "DELETE"] },
    { key: "settings", label: "Settings", actions: ["VIEW", "EDIT"] },
    { key: "seo", label: "SEO", actions: ["VIEW", "EDIT", "EXPORT"] },
    { key: "reports", label: "Reports", actions: ["VIEW", "EXPORT"] },
    { key: "twadmin", label: "TWAdmin", actions: ["VIEW", "CREATE", "EDIT", "DELETE"] },
];

export default function RolesPage() {
    const [roles, setRoles] = useState<CustomRole[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editRole, setEditRole] = useState<CustomRole | null>(null);
    const [form, setForm] = useState({ name: "", description: "" });
    const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(MODULE_DEFINITIONS.map(m => m.key)));
    const [assignment, setAssignment] = useState({ scopeType: "ORGANIZATION", scopeId: "", userId: "" });
    const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
    const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
    const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);

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

    const fetchAssignmentOptions = async () => {
        try {
            const [groupsRes, teamsRes, usersRes] = await Promise.all([
                fetch(`${base}/api/v1/groups`, { headers: getHeaders() }),
                fetch(`${base}/api/v1/teams`, { headers: getHeaders() }),
                fetch(`${base}/api/v1/employees`, { headers: getHeaders() }),
            ]);
            if (groupsRes.ok) setGroups(await groupsRes.json());
            if (teamsRes.ok) setTeams(await teamsRes.json());
            if (usersRes.ok) {
                const data = await usersRes.json();
                setUsers(data.map((u: any) => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email })));
            }
        } catch (err) { console.error(err); }
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
            const res = await fetch(url, {
                method: editRole ? "PATCH" : "POST",
                headers: getHeaders(),
                body: JSON.stringify({ ...form, permissionIds: Array.from(selectedPerms) }),
            });
            if (res.ok) {
                const roleData = await res.json();
                if (assignment.scopeType !== "ORGANIZATION") {
                    const payload = {
                        roleId: roleData.id,
                        scopeType: assignment.scopeType,
                        scopeId: assignment.scopeType === "USER" ? assignment.userId : assignment.scopeId,
                        userId: assignment.scopeType === "USER" ? assignment.userId : undefined,
                    };
                    await fetch(`${base}/api/v1/roles/assignments`, {
                        method: "POST",
                        headers: getHeaders(),
                        body: JSON.stringify(payload),
                    });
                }
                setShowModal(false);
                setEditRole(null);
                setAssignment({ scopeType: "ORGANIZATION", scopeId: "", userId: "" });
                fetchData();
            }
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
        fetchAssignmentOptions();
    };

    const openNew = () => {
        setEditRole(null);
        setForm({ name: "", description: "" });
        setSelectedPerms(new Set());
        setShowModal(true);
        fetchAssignmentOptions();
    };

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

    const toggleExpand = (module: string) => {
        const next = new Set(expandedModules);
        next.has(module) ? next.delete(module) : next.add(module);
        setExpandedModules(next);
    };

    const setModulePreset = (module: string, preset: "READ" | "FULL") => {
        const modPerms = permissions.filter(p => p.module === module);
        const next = new Set(selectedPerms);
        if (preset === "READ") {
            modPerms.forEach(p => p.accessType === "VIEW" ? next.add(p.id) : next.delete(p.id));
        } else {
            modPerms.forEach(p => next.add(p.id));
        }
        setSelectedPerms(next);
    };

    if (loading) return <div className="space-y-4"><div className="skeleton h-8 w-48" /><div className="skeleton h-64 rounded-xl" /></div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-3">
                <Link href="/dashboard/twadmin" className="btn-icon"><ArrowLeft size={18} /></Link>
                <div className="page-header flex-1"><h1>Roles & Permissions</h1><p>System roles and custom role management</p></div>
                <div className="flex gap-2">
                    {permissions.length === 0 && <button onClick={seedPermissions} className="btn-secondary">Seed Permissions</button>}
                    <button onClick={openNew} className="btn-primary"><Plus size={16} /> New Custom Role</button>
                </div>
            </div>

            {/* ═══ Built-in System Roles ═══ */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Shield size={18} className="text-primary-400" />
                    <h2 className="text-lg font-semibold text-white">System Roles</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">Built-in</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {BUILT_IN_ROLES.map((role) => (
                        <div key={role.name} className={`relative overflow-hidden rounded-xl border ${role.borderColor} bg-dark-850 p-5 transition-all hover:shadow-lg hover:shadow-${role.textColor}/5`}>
                            {/* Gradient accent */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.color}`} />

                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg`}>
                                    <role.icon size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{role.name}</h3>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-700 text-neutral-400">System Role</span>
                                </div>
                            </div>

                            <p className="text-xs text-neutral-400 leading-relaxed mb-4">{role.description}</p>

                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Permissions</p>
                                <div className="flex flex-wrap gap-1">
                                    {role.permissions.map((perm) => (
                                        <span key={perm} className={`text-[9px] px-1.5 py-0.5 rounded ${role.bgColor} ${role.textColor}`}>
                                            {perm}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══ Custom Roles ═══ */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Key size={18} className="text-amber-400" />
                    <h2 className="text-lg font-semibold text-white">Custom Roles</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{roles.length} roles</span>
                </div>

                {roles.length === 0 ? (
                    <div className="card py-12 text-center">
                        <Key size={40} className="mx-auto text-neutral-700 mb-3" />
                        <p className="text-neutral-400 mb-1">No custom roles yet</p>
                        <p className="text-xs text-neutral-600 mb-4">Create custom roles with specific permissions for your team</p>
                        <button onClick={openNew} className="btn-primary"><Plus size={14} /> Create First Role</button>
                    </div>
                ) : (
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
                )}
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

                        {/* Permission Builder */}
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-white">Permissions</h3>
                            <div className="relative w-64">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9"
                                    placeholder="Search modules or actions..."
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {MODULE_DEFINITIONS.filter(mod => {
                                if (!search.trim()) return true;
                                const q = search.toLowerCase();
                                return mod.label.toLowerCase().includes(q) || mod.actions.some(a => a.toLowerCase().includes(q));
                            }).map(mod => {
                                const modPerms = permissions.filter(p => p.module === mod.key);
                                const allSelected = modPerms.length > 0 && modPerms.every(p => selectedPerms.has(p.id));
                                const isExpanded = expandedModules.has(mod.key);
                                return (
                                    <div key={mod.key} className="card border border-dark-700">
                                        <div className="flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => toggleExpand(mod.key)}
                                                className="flex items-center gap-2 text-left"
                                            >
                                                <ChevronDown size={16} className={`text-neutral-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{mod.label}</p>
                                                    <p className="text-xs text-neutral-500">{mod.key}</p>
                                                </div>
                                            </button>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => setModulePreset(mod.key, "READ")} className="btn-secondary text-xs">Read Only</button>
                                                <button type="button" onClick={() => setModulePreset(mod.key, "FULL")} className="btn-secondary text-xs">Full Access</button>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleModule(mod.key)}
                                                    className={`btn-secondary text-xs ${allSelected ? "text-emerald-400" : ""}`}
                                                >
                                                    {allSelected ? "Clear" : "Select All"}
                                                </button>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                {mod.actions.map(action => {
                                                    const perm = modPerms.find(p => p.accessType === action);
                                                    const enabled = perm ? selectedPerms.has(perm.id) : false;
                                                    return (
                                                        <button
                                                            key={action}
                                                            type="button"
                                                            onClick={() => perm && togglePerm(perm.id)}
                                                            className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${
                                                                perm
                                                                    ? enabled
                                                                        ? "border-primary-500 bg-primary-500/10 text-primary-400"
                                                                        : "border-dark-700 text-neutral-400 hover:border-dark-600"
                                                                    : "border-dark-800 text-neutral-600 cursor-not-allowed"
                                                            }`}
                                                        >
                                                            <span className="font-medium">{action}</span>
                                                            {perm && enabled && <Check size={14} />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Assignment */}
                        <div className="mt-8">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield size={16} className="text-emerald-400" />
                                <h3 className="text-sm font-semibold text-white">Role Assignment</h3>
                                <span className="text-xs text-neutral-500">(Optional)</span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-neutral-300 mb-1.5">Assign To</label>
                                    <select
                                        value={assignment.scopeType}
                                        onChange={e => setAssignment({ scopeType: e.target.value, scopeId: "", userId: "" })}
                                        className="w-full"
                                    >
                                        <option value="ORGANIZATION">Organization (All)</option>
                                        <option value="GROUP">Group</option>
                                        <option value="TEAM">Team</option>
                                        <option value="USER">Individual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-300 mb-1.5">Target</label>
                                    {assignment.scopeType === "GROUP" && (
                                        <select
                                            value={assignment.scopeId}
                                            onChange={e => setAssignment({ ...assignment, scopeId: e.target.value })}
                                            className="w-full"
                                        >
                                            <option value="">Select group</option>
                                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                        </select>
                                    )}
                                    {assignment.scopeType === "TEAM" && (
                                        <select
                                            value={assignment.scopeId}
                                            onChange={e => setAssignment({ ...assignment, scopeId: e.target.value })}
                                            className="w-full"
                                        >
                                            <option value="">Select team</option>
                                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    )}
                                    {assignment.scopeType === "USER" && (
                                        <select
                                            value={assignment.userId}
                                            onChange={e => setAssignment({ ...assignment, userId: e.target.value })}
                                            className="w-full"
                                        >
                                            <option value="">Select user</option>
                                            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                                        </select>
                                    )}
                                    {assignment.scopeType === "ORGANIZATION" && (
                                        <div className="flex items-center gap-2 text-xs text-neutral-500 h-10">
                                            <Building2 size={14} /> Applies to entire organization
                                        </div>
                                    )}
                                </div>
                            </div>
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
