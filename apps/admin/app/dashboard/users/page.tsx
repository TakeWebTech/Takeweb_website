"use client";

import { useState } from "react";
import {
    Users,
    Search,
    Plus,
    Shield,
    ShieldCheck,
    ShieldAlert,
    Mail,
    MoreVertical,
    X,
    UserPlus,
    Calendar,
    Edit,
    Trash2,
    Check,
    Ban,
} from "lucide-react";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "admin" | "editor" | "viewer";
    status: "active" | "inactive" | "invited";
    avatar?: string;
    lastLogin?: string;
    createdAt: string;
}

const roleConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    admin: { icon: ShieldAlert, color: "text-error-400", bg: "bg-error-400/10" },
    editor: { icon: ShieldCheck, color: "text-primary-400", bg: "bg-primary-400/10" },
    viewer: { icon: Shield, color: "text-neutral-400", bg: "bg-neutral-400/10" },
};

const statusColors: Record<string, string> = {
    active: "badge-success",
    inactive: "badge-warning",
    invited: "badge-info",
};

const demoUsers: User[] = [
    { id: "1", firstName: "Admin", lastName: "User", email: "admin@takeweb.in", role: "admin", status: "active", lastLogin: new Date().toISOString(), createdAt: "2024-01-01" },
    { id: "2", firstName: "Sarah", lastName: "Johnson", email: "sarah@takeweb.in", role: "editor", status: "active", lastLogin: new Date(Date.now() - 3600000).toISOString(), createdAt: "2024-03-15" },
    { id: "3", firstName: "Mike", lastName: "Chen", email: "mike@takeweb.in", role: "editor", status: "active", lastLogin: new Date(Date.now() - 86400000).toISOString(), createdAt: "2024-06-01" },
    { id: "4", firstName: "Emily", lastName: "Davis", email: "emily@takeweb.in", role: "viewer", status: "invited", createdAt: "2024-11-20" },
    { id: "5", firstName: "James", lastName: "Wilson", email: "james@takeweb.in", role: "viewer", status: "inactive", lastLogin: new Date(Date.now() - 30 * 86400000).toISOString(), createdAt: "2024-08-10" },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(demoUsers);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [showInvite, setShowInvite] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [inviteForm, setInviteForm] = useState({ email: "", firstName: "", lastName: "", role: "editor" as User["role"] });

    const filtered = users.filter((u) => {
        const matchesSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === "all" || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const inviteUser = () => {
        if (!inviteForm.email) return;
        const newUser: User = {
            id: Date.now().toString(),
            ...inviteForm,
            status: "invited",
            createdAt: new Date().toISOString(),
        };
        setUsers([newUser, ...users]);
        setShowInvite(false);
        setInviteForm({ email: "", firstName: "", lastName: "", role: "editor" });
    };

    const toggleStatus = (id: string) => {
        setUsers(users.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
    };

    const updateRole = (id: string, role: User["role"]) => {
        setUsers(users.map((u) => u.id === id ? { ...u, role } : u));
        setEditingUser(null);
    };

    const deleteUser = (id: string) => {
        if (confirm("Remove this user?")) setUsers(users.filter((u) => u.id !== id));
    };

    const roleCounts = {
        all: users.length,
        admin: users.filter((u) => u.role === "admin").length,
        editor: users.filter((u) => u.role === "editor").length,
        viewer: users.filter((u) => u.role === "viewer").length,
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>User Management</h1>
                    <p>Manage team members, roles, and access permissions</p>
                </div>
                <button onClick={() => setShowInvite(true)} className="btn-primary">
                    <UserPlus size={16} /> Invite User
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["all", "admin", "editor", "viewer"] as const).map((role) => (
                    <button
                        key={role}
                        onClick={() => setFilterRole(role)}
                        className={`card p-4 text-left transition-all ${filterRole === role ? "ring-1 ring-primary-500" : ""}`}
                    >
                        <p className="text-2xl font-bold text-white">{roleCounts[role]}</p>
                        <p className="text-xs text-neutral-400 capitalize">{role === "all" ? "Total Users" : `${role}s`}</p>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 text-sm"
                />
            </div>

            {/* Users Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dark-700">
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">User</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Role</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium hidden sm:table-cell">Status</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium hidden md:table-cell">Last Login</th>
                                <th className="text-right py-3 px-4 text-neutral-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user) => {
                                const rc = roleConfig[user.role];
                                const RoleIcon = rc?.icon || Shield;
                                return (
                                    <tr key={user.id} className="border-b border-dark-700/50 hover:bg-dark-850 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-white truncate">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${rc?.color} ${rc?.bg}`}>
                                                <RoleIcon size={12} />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 hidden sm:table-cell">
                                            <span className={`badge ${statusColors[user.status] || "badge-warning"}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 hidden md:table-cell text-neutral-500 text-xs">
                                            {user.lastLogin
                                                ? new Date(user.lastLogin).toLocaleDateString()
                                                : "Never"}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setEditingUser(user)}
                                                    className="btn-icon"
                                                    title="Edit role"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(user.id)}
                                                    className="btn-icon"
                                                    title={user.status === "active" ? "Deactivate" : "Activate"}
                                                >
                                                    {user.status === "active" ? <Ban size={14} /> : <Check size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="btn-icon hover:text-error-400"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="empty-state py-12">
                        <Users size={40} className="empty-state-icon" />
                        <p className="text-neutral-400">No users found</p>
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {showInvite && (
                <div className="modal-overlay" onClick={() => setShowInvite(false)}>
                    <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white">Invite User</h2>
                            <button onClick={() => setShowInvite(false)} className="btn-icon"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-neutral-300 mb-1.5">First Name</label>
                                    <input type="text" value={inviteForm.firstName} onChange={(e) => setInviteForm({ ...inviteForm, firstName: e.target.value })} placeholder="John" className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-300 mb-1.5">Last Name</label>
                                    <input type="text" value={inviteForm.lastName} onChange={(e) => setInviteForm({ ...inviteForm, lastName: e.target.value })} placeholder="Doe" className="w-full" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-300 mb-1.5">Email <span className="text-red-400">*</span></label>
                                <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} placeholder="john@example.com" className="w-full" required />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-300 mb-1.5">Role</label>
                                <select value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as User["role"] })} className="w-full">
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowInvite(false)} className="btn-secondary">Cancel</button>
                            <button onClick={inviteUser} disabled={!inviteForm.email} className="btn-primary disabled:opacity-50">
                                <Mail size={16} /> Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Role Modal */}
            {editingUser && (
                <div className="modal-overlay" onClick={() => setEditingUser(null)}>
                    <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white">Change Role</h2>
                            <button onClick={() => setEditingUser(null)} className="btn-icon"><X size={18} /></button>
                        </div>
                        <p className="text-sm text-neutral-400 mb-4">
                            {editingUser.firstName} {editingUser.lastName} ({editingUser.email})
                        </p>
                        <div className="space-y-2">
                            {(["admin", "editor", "viewer"] as const).map((role) => {
                                const rc = roleConfig[role];
                                const Icon = rc?.icon || Shield;
                                return (
                                    <button
                                        key={role}
                                        onClick={() => updateRole(editingUser.id, role)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${editingUser.role === role ? "border-primary-500 bg-primary-500/10" : "border-dark-700 hover:border-dark-600"}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${rc?.color} ${rc?.bg}`}>
                                            <Icon size={16} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-white capitalize">{role}</p>
                                            <p className="text-xs text-neutral-500">
                                                {role === "admin" ? "Full access" : role === "editor" ? "Create & edit content" : "Read-only access"}
                                            </p>
                                        </div>
                                        {editingUser.role === role && <Check size={16} className="ml-auto text-primary-400" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
