"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, User } from "lucide-react";

interface TeamMember {
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    photo: string;
    isActive: boolean;
    sortOrder: number;
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
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
        } catch (error) {
            console.error("Failed to fetch team members:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMember = async (id: string) => {
        if (!confirm("Are you sure you want to delete this team member?")) return;

        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/team/admin/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchMembers();
        } catch (error) {
            console.error("Failed to delete team member:", error);
        }
    };

    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.position.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Team Members</h1>
                    <p className="text-neutral-400 mt-1">Manage your team profiles</p>
                </div>
                <Link href="/dashboard/team/new" className="btn-primary">
                    <Plus size={20} />
                    Add Member
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                    type="text"
                    placeholder="Search team members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10"
                />
            </div>

            {/* Grid */}
            {filteredMembers.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-neutral-400">No team members found. Add your first team member!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredMembers.map((member) => (
                        <div key={member.id} className="card text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center overflow-hidden">
                                {member.photo ? (
                                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} className="text-neutral-500" />
                                )}
                            </div>
                            <h3 className="font-semibold text-white">{member.name}</h3>
                            <p className="text-sm text-primary-400">{member.position}</p>
                            {member.department && (
                                <p className="text-xs text-neutral-500 mt-1">{member.department}</p>
                            )}
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <Link
                                    href={`/dashboard/team/${member.id}`}
                                    className="p-2 rounded hover:bg-dark-700 text-neutral-400 hover:text-white"
                                >
                                    <Edit size={16} />
                                </Link>
                                <button
                                    onClick={() => deleteMember(member.id)}
                                    className="p-2 rounded hover:bg-dark-700 text-neutral-400 hover:text-error-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
