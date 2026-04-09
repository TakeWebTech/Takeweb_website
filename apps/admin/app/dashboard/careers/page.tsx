"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    UserPlus, Plus, Search, Edit, Trash2, Calendar,
    MapPin, Briefcase, Clock, CheckCircle2, XCircle,
} from "lucide-react";

interface Career {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    isActive: boolean;
    createdAt: string;
}

export default function CareersPage() {
    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => { fetchCareers(); }, []);

    const fetchCareers = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/careers/admin/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) setCareers(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const deleteCareer = async (id: string) => {
        if (!confirm("Delete this job posting?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/careers/admin/${id}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCareers();
        } catch (e) { console.error(e); }
    };

    const filtered = careers.filter((c) =>
        `${c.title} ${c.department} ${c.location}`.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-8 w-48" />
                <div className="skeleton h-64 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Careers</h1>
                    <p>Manage job postings on your website</p>
                </div>
                <Link href="/dashboard/careers/new" className="btn-primary">
                    <Plus size={16} /> New Job
                </Link>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 text-sm" />
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state card">
                    <UserPlus size={40} className="empty-state-icon" />
                    <p className="text-neutral-400 mb-2">No job postings found</p>
                    <Link href="/dashboard/careers/new" className="btn-primary mt-4"><Plus size={16} /> Add Job</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                    {filtered.map((career) => (
                        <div key={career.id} className="card group hover:border-dark-600">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate">{career.title}</h3>
                                    {career.department && <p className="text-xs text-neutral-500 mt-0.5">{career.department}</p>}
                                </div>
                                <span className={`badge ml-2 ${career.isActive ? "badge-success" : "badge-neutral"}`}>
                                    {career.isActive ? <><CheckCircle2 size={10} /> Open</> : <><XCircle size={10} /> Closed</>}
                                </span>
                            </div>

                            <div className="space-y-1.5 mb-4 text-xs text-neutral-500">
                                {career.location && <p className="flex items-center gap-1.5"><MapPin size={12} /> {career.location}</p>}
                                {career.type && <p className="flex items-center gap-1.5"><Clock size={12} /> {career.type}</p>}
                                <p className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(career.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="flex items-center justify-end gap-1 pt-3 border-t border-dark-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/dashboard/careers/${career.id}`} className="btn-icon"><Edit size={14} /></Link>
                                <button onClick={() => deleteCareer(career.id)} className="btn-icon hover:text-error-400"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
