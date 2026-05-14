"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Briefcase,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    ArrowUpDown,
    MoreVertical,
    CheckCircle2,
    XCircle,
} from "lucide-react";

interface Service {
    id: string;
    title: string;
    slug: string;
    description: string;
    isActive: boolean;
    order: number;
    createdAt: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/services/admin/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) setServices(await res.json());
        } catch (e) {
            console.error("Failed to fetch:", e);
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (id: string) => {
        const svc = services.find((s) => s.id === id);
        if (!svc) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/services/admin/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ isActive: !svc.isActive }),
                }
            );
            fetchServices();
        } catch (e) {
            console.error("Toggle failed:", e);
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm("Delete this service?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/services/admin/${id}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            fetchServices();
        } catch (e) {
            console.error("Delete failed:", e);
        }
    };

    const filtered = services.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Services</h1>
                    <p>Manage the services offered on your website</p>
                </div>
                <Link href="/dashboard/services/new" className="btn-primary">
                    <Plus size={16} />
                    New Service
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 text-sm"
                />
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="empty-state card">
                    <Briefcase size={40} className="empty-state-icon" />
                    <p className="text-neutral-400 mb-2">No services found</p>
                    <p className="text-sm text-neutral-600 mb-4">Add your first service to display on your website</p>
                    <Link href="/dashboard/services/new" className="btn-primary">
                        <Plus size={16} /> Add Service
                    </Link>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th className="hidden md:table-cell">Description</th>
                                <th>Status</th>
                                <th className="hidden sm:table-cell">Order</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((svc) => (
                                <tr key={svc.id}>
                                    <td>
                                        <div>
                                            <span className="font-medium text-white">{svc.title}</span>
                                            <p className="text-xs text-neutral-600 mt-0.5">/{svc.slug}</p>
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell">
                                        <span className="text-sm text-neutral-400 line-clamp-1 max-w-[250px] block">
                                            {svc.description}
                                        </span>
                                    </td>
                                    <td>
                                        <button onClick={() => toggleActive(svc.id)}>
                                            {svc.isActive ? (
                                                <span className="badge badge-success"><CheckCircle2 size={10} /> Active</span>
                                            ) : (
                                                <span className="badge badge-neutral"><XCircle size={10} /> Inactive</span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="hidden sm:table-cell">
                                        <span className="text-neutral-500 font-mono text-sm">{svc.order}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/dashboard/services/${svc.id}`} className="btn-icon">
                                                <Edit size={14} />
                                            </Link>
                                            <button onClick={() => deleteService(svc.id)} className="btn-icon hover:text-error-400">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
