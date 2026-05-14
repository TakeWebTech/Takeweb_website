"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    UserCog, Search, Plus, Mail, Edit, Trash2, Check, Ban,
    Building2, MapPin, Phone, Calendar, Filter, Download, Upload,
    X, ChevronDown, MoreVertical, UserPlus,
} from "lucide-react";

interface Employee {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
    employeeId?: string;
    workType: string;
    department?: string;
    location?: string;
    phone?: string;
    lifecycleStatus: string;
    joiningDate?: string;
    group?: { id: string; name: string } | null;
    team?: { id: string; name: string } | null;
    createdAt: string;
}

const statusConfig: Record<string, { label: string; class: string }> = {
    ACTIVE: { label: "Active", class: "badge-success" },
    ON_LEAVE: { label: "On Leave", class: "badge-warning" },
    EXITED: { label: "Exited", class: "badge-error" },
    BLOCKED: { label: "Blocked", class: "badge-error" },
};

const workTypeConfig: Record<string, { label: string; color: string }> = {
    ONSITE: { label: "Onsite", color: "text-blue-400 bg-blue-400/10" },
    REMOTE: { label: "Remote", color: "text-emerald-400 bg-emerald-400/10" },
    CONTRACT: { label: "Contract", color: "text-amber-400 bg-amber-400/10" },
    INTERN: { label: "Intern", color: "text-purple-400 bg-purple-400/10" },
};

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterWorkType, setFilterWorkType] = useState("all");
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetchEmployees();
        fetchStats();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/v1/employees`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setEmployees(data);
            }
        } catch (err) {
            console.error("Failed to fetch employees:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/v1/employees/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setStats(await res.json());
        } catch (err) { console.error(err); }
    };

    const updateLifecycle = async (id: string, lifecycleStatus: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            await fetch(`${base}/api/v1/employees/${id}/lifecycle`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ lifecycleStatus }),
            });
            fetchEmployees();
            fetchStats();
        } catch (err) { console.error(err); }
    };

    const deleteEmployee = async (id: string) => {
        if (!confirm("Are you sure you want to remove this employee?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            await fetch(`${base}/api/v1/employees/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEmployees();
            fetchStats();
        } catch (err) { console.error(err); }
    };

    const filtered = employees.filter((e) => {
        const matchesSearch = `${e.firstName} ${e.lastName} ${e.email} ${e.employeeId || ""}`.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === "all" || e.lifecycleStatus === filterStatus;
        const matchesWorkType = filterWorkType === "all" || e.workType === filterWorkType;
        return matchesSearch && matchesStatus && matchesWorkType;
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="page-header"><div className="skeleton h-8 w-48" /><div className="skeleton h-4 w-72 mt-2" /></div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="skeleton h-20 rounded-xl" />))}</div>
                <div className="skeleton h-96 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Employee Management</h1>
                    <p>Manage employees, roles, departments, and lifecycle</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/employees/new" className="btn-primary">
                        <UserPlus size={16} /> Add Employee
                    </Link>
                </div>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 stagger-children">
                    {[
                        { label: "Total", value: stats.total, color: "text-blue-400", bg: "bg-blue-500/10" },
                        { label: "Active", value: stats.active, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { label: "On Leave", value: stats.onLeave, color: "text-amber-400", bg: "bg-amber-500/10" },
                        { label: "Exited", value: stats.exited, color: "text-neutral-400", bg: "bg-neutral-500/10" },
                        { label: "Blocked", value: stats.blocked, color: "text-error-400", bg: "bg-error-500/10" },
                    ].map(s => (
                        <div key={s.label} className="card p-4">
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-neutral-400 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 text-sm"
                    />
                </div>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-sm bg-dark-900 border border-dark-700 rounded-lg px-3 py-2">
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="EXITED">Exited</option>
                    <option value="BLOCKED">Blocked</option>
                </select>
                <select value={filterWorkType} onChange={(e) => setFilterWorkType(e.target.value)} className="text-sm bg-dark-900 border border-dark-700 rounded-lg px-3 py-2">
                    <option value="all">All Types</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="REMOTE">Remote</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERN">Intern</option>
                </select>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dark-700">
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Employee</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium hidden md:table-cell">ID</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium hidden sm:table-cell">Department</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium hidden lg:table-cell">Work Type</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Status</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium hidden lg:table-cell">Group / Team</th>
                                <th className="text-right py-3 px-4 text-neutral-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((emp) => {
                                const sc = statusConfig[emp.lifecycleStatus] ?? { label: "Active", class: "badge-success" };
                                const wt = workTypeConfig[emp.workType] ?? { label: emp.workType, color: "text-neutral-400 bg-neutral-400/10" };
                                return (
                                    <tr key={emp.id} className="border-b border-dark-700/50 hover:bg-dark-850 transition-colors">
                                        <td className="py-3 px-4">
                                            <Link href={`/dashboard/employees/${emp.id}`} className="flex items-center gap-3 group">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                                    {emp.firstName[0]}{emp.lastName[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-white truncate group-hover:text-primary-400 transition-colors">{emp.firstName} {emp.lastName}</p>
                                                    <p className="text-xs text-neutral-500 truncate">{emp.email}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="py-3 px-4 hidden md:table-cell">
                                            <span className="text-xs text-neutral-500 font-mono">{emp.employeeId || "—"}</span>
                                        </td>
                                        <td className="py-3 px-4 hidden sm:table-cell">
                                            <span className="text-sm text-neutral-300">{emp.department || "—"}</span>
                                        </td>
                                        <td className="py-3 px-4 hidden lg:table-cell">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${wt.color}`}>
                                                {wt.label}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`badge ${sc.class}`}>{sc.label}</span>
                                        </td>
                                        <td className="py-3 px-4 hidden lg:table-cell">
                                            <div className="text-xs text-neutral-400">
                                                {emp.group?.name || "—"}{emp.team ? ` / ${emp.team.name}` : ""}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/dashboard/employees/${emp.id}`} className="btn-icon" title="View">
                                                    <Edit size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => updateLifecycle(emp.id, emp.lifecycleStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE")}
                                                    className="btn-icon"
                                                    title={emp.lifecycleStatus === "ACTIVE" ? "Block" : "Activate"}
                                                >
                                                    {emp.lifecycleStatus === "ACTIVE" ? <Ban size={14} /> : <Check size={14} />}
                                                </button>
                                                <button onClick={() => deleteEmployee(emp.id)} className="btn-icon hover:text-error-400" title="Remove">
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
                        <UserCog size={40} className="empty-state-icon" />
                        <p className="text-neutral-400">{employees.length === 0 ? "No employees yet" : "No employees match filters"}</p>
                        {employees.length === 0 && (
                            <Link href="/dashboard/employees/new" className="btn-primary mt-4">
                                <Plus size={16} /> Add First Employee
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
