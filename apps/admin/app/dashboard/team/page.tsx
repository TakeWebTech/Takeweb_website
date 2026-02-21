"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    Mail,
    Linkedin,
    MoreVertical,
    UserCheck,
    UserX,
} from "lucide-react";

interface TeamMember {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    department: string;
    email: string;
    photo?: string;
    isActive: boolean;
    linkedin?: string;
    createdAt: string;
}

export default function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/team/admin/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) setMembers(await res.json());
        } catch (e) {
            console.error("Failed to fetch team:", e);
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (id: string, current: boolean) => {
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/team/admin/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ isActive: !current }),
                }
            );
            fetchMembers();
        } catch (e) {
            console.error("Toggle failed:", e);
        }
    };

    const deleteMember = async (id: string) => {
        if (!confirm("Delete this team member?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/team/admin/${id}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            fetchMembers();
        } catch (e) {
            console.error("Delete failed:", e);
        }
    };

    const filtered = members.filter((m) =>
        `${m.firstName} ${m.lastName} ${m.position} ${m.department}`.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = members.filter((m) => m.isActive).length;

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-8 w-48" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="skeleton h-48 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Team Members</h1>
                    <p>Manage your team displayed on the website</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="badge badge-success">
                        <UserCheck size={10} /> {activeCount} Active
                    </span>
                    <Link href="/dashboard/team/new" className="btn-primary">
                        <Plus size={16} />
                        Add Member
                    </Link>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input
                    type="text"
                    placeholder="Search by name, position, or department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 text-sm"
                />
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="empty-state card">
                    <Users size={40} className="empty-state-icon" />
                    <p className="text-neutral-400 mb-2">No team members found</p>
                    <p className="text-sm text-neutral-600 mb-4">Add your first team member to get started</p>
                    <Link href="/dashboard/team/new" className="btn-primary">
                        <Plus size={16} /> Add Member
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
                    {filtered.map((member) => (
                        <div
                            key={member.id}
                            className={`card group hover:border-dark-600 transition-all ${!member.isActive ? "opacity-50" : ""}`}
                        >
                            {/* Avatar */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                                    {member.firstName?.[0]}{member.lastName?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate">{member.firstName} {member.lastName}</h3>
                                    <p className="text-xs text-neutral-500 truncate">{member.position}</p>
                                </div>
                            </div>

                            {/* Details */}
                            {member.department && (
                                <div className="mb-3">
                                    <span className="badge badge-neutral text-xs">{member.department}</span>
                                </div>
                            )}

                            {member.email && (
                                <p className="text-xs text-neutral-500 truncate mb-3 flex items-center gap-1.5">
                                    <Mail size={12} /> {member.email}
                                </p>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                                <button
                                    onClick={() => toggleActive(member.id, member.isActive)}
                                    className={`toggle ${member.isActive ? "active" : ""}`}
                                />
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/dashboard/team/${member.id}`} className="btn-icon">
                                        <Edit size={14} />
                                    </Link>
                                    <button onClick={() => deleteMember(member.id)} className="btn-icon hover:text-error-400">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
