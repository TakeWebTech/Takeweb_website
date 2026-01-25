"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Briefcase, MapPin, Users, Clock } from "lucide-react";

interface Career {
    id: string;
    title: string;
    slug: string;
    department: string;
    location: string;
    type: string;
    isRemote: boolean;
    isActive: boolean;
    deadline: string | null;
    createdAt: string;
    _count?: { applications: number };
}

export default function CareersPage() {
    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCareers();
    }, []);

    const fetchCareers = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/careers/admin/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.ok) {
                const data = await res.json();
                setCareers(data);
            }
        } catch (error) {
            console.error("Failed to fetch careers:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCareer = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job posting?")) return;

        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/careers/admin/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchCareers();
        } catch (error) {
            console.error("Failed to delete career:", error);
        }
    };

    const filteredCareers = careers.filter((career) =>
        career.title.toLowerCase().includes(search.toLowerCase()) ||
        career.department.toLowerCase().includes(search.toLowerCase())
    );

    const getJobTypeBadge = (type: string) => {
        const types: Record<string, string> = {
            FULL_TIME: "Full-time",
            PART_TIME: "Part-time",
            CONTRACT: "Contract",
            INTERNSHIP: "Internship",
        };
        return types[type] || type;
    };

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
                    <h1 className="text-2xl font-bold text-white">Careers</h1>
                    <p className="text-neutral-400 mt-1">Manage job postings and applications</p>
                </div>
                <Link href="/dashboard/careers/new" className="btn-primary">
                    <Plus size={20} />
                    Add Job
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10"
                />
            </div>

            {/* List */}
            {filteredCareers.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-neutral-400">No job postings found. Add your first job!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredCareers.map((career) => (
                        <div key={career.id} className="card">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-white">{career.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded ${career.isActive ? "bg-success-500/20 text-success-500" : "bg-neutral-500/20 text-neutral-500"
                                            }`}>
                                            {career.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-neutral-400">
                                        <span className="flex items-center gap-1">
                                            <Briefcase size={14} />
                                            {career.department}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {career.location}
                                            {career.isRemote && " (Remote)"}
                                        </span>
                                        <span className="px-2 py-0.5 bg-dark-700 rounded">
                                            {getJobTypeBadge(career.type)}
                                        </span>
                                        {career._count && (
                                            <span className="flex items-center gap-1 text-primary-400">
                                                <Users size={14} />
                                                {career._count.applications} applications
                                            </span>
                                        )}
                                        {career.deadline && (
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                Deadline: {new Date(career.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/dashboard/careers/${career.id}/applications`}
                                        className="btn-secondary text-sm"
                                    >
                                        <Users size={16} />
                                        Applications
                                    </Link>
                                    <Link
                                        href={`/dashboard/careers/${career.id}`}
                                        className="p-2 rounded hover:bg-dark-700 text-neutral-400 hover:text-white"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => deleteCareer(career.id)}
                                        className="p-2 rounded hover:bg-dark-700 text-neutral-400 hover:text-error-500"
                                    >
                                        <Trash2 size={18} />
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
