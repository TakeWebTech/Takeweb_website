"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft, Plus, Search, Edit, Trash2, Link2,
    ArrowRight, CheckCircle2, XCircle, Upload, Download,
    MoreVertical, Eye, RefreshCw,
} from "lucide-react";

interface Redirect {
    id: string;
    sourceUrl: string;
    targetUrl: string;
    type: number;
    isActive: boolean;
    hitCount: number;
    lastHitAt: string | null;
    createdAt: string;
}

const REDIRECT_TYPES = [
    { value: 301, label: "301 - Permanent Redirect", description: "Best for SEO" },
    { value: 302, label: "302 - Temporary Redirect", description: "Temporary move" },
    { value: 307, label: "307 - Temporary (Preserve Method)", description: "Keeps POST" },
    { value: 308, label: "308 - Permanent (Preserve Method)", description: "Keeps POST" },
    { value: 410, label: "410 - Content Deleted", description: "Gone forever" },
    { value: 451, label: "451 - Unavailable for Legal Reasons", description: "Legal block" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function RedirectsPage() {
    const [redirects, setRedirects] = useState<Redirect[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null);
    const [formData, setFormData] = useState({
        sourceUrl: "",
        targetUrl: "",
        type: 301,
        isActive: true,
    });

    useEffect(() => { fetchRedirects(); }, []);

    const fetchRedirects = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_URL}/api/v1/seo/redirects?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setRedirects(data.items || []);
            }
        } catch (e) {
            console.error("Failed:", e);
        } finally {
            setLoading(false);
        }
    };

    const saveRedirect = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const url = editingRedirect
                ? `${API_URL}/api/v1/seo/redirects/${editingRedirect.id}`
                : `${API_URL}/api/v1/seo/redirects`;

            const res = await fetch(url, {
                method: editingRedirect ? "PUT" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowModal(false);
                setEditingRedirect(null);
                setFormData({ sourceUrl: "", targetUrl: "", type: 301, isActive: true });
                fetchRedirects();
            }
        } catch (e) {
            console.error("Save failed:", e);
        }
    };

    const deleteRedirect = async (id: string) => {
        if (!confirm("Delete this redirect?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(`${API_URL}/api/v1/seo/redirects/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchRedirects();
        } catch (e) {
            console.error("Delete failed:", e);
        }
    };

    const toggleStatus = async (redirect: Redirect) => {
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(`${API_URL}/api/v1/seo/redirects/${redirect.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isActive: !redirect.isActive }),
            });
            fetchRedirects();
        } catch (e) {
            console.error("Toggle failed:", e);
        }
    };

    const openEditModal = (redirect: Redirect) => {
        setEditingRedirect(redirect);
        setFormData({
            sourceUrl: redirect.sourceUrl,
            targetUrl: redirect.targetUrl,
            type: redirect.type,
            isActive: redirect.isActive,
        });
        setShowModal(true);
    };

    const openNewModal = () => {
        setEditingRedirect(null);
        setFormData({ sourceUrl: "", targetUrl: "", type: 301, isActive: true });
        setShowModal(true);
    };

    const filtered = redirects.filter((r) => {
        const matchesSearch =
            r.sourceUrl.toLowerCase().includes(search.toLowerCase()) ||
            r.targetUrl.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && r.isActive) ||
            (statusFilter === "inactive" && !r.isActive);
        return matchesSearch && matchesStatus;
    });

    const exportRedirects = () => {
        const csv = redirects.map(r =>
            `${r.sourceUrl},${r.targetUrl},${r.type}`
        ).join("\n");
        const blob = new Blob([`source,target,type\n${csv}`], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "redirects.csv";
        a.click();
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-8 w-48" />
                <div className="skeleton h-96 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/seo" className="btn-ghost btn-sm">
                    <ArrowLeft size={16} />
                </Link>
                <div className="page-header flex-1">
                    <h1>Redirects Manager</h1>
                    <p>Manage URL redirections to maintain SEO value</p>
                </div>
                <button onClick={exportRedirects} className="btn-ghost btn-sm">
                    <Download size={16} />
                    Export
                </button>
                <button onClick={openNewModal} className="btn-primary">
                    <Plus size={16} />
                    Add Redirect
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search URLs..."
                        className="input input-bordered w-full pl-10"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="select select-bordered"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card-container p-4">
                    <p className="text-sm text-neutral-500">Total Redirects</p>
                    <p className="text-2xl font-bold">{redirects.length}</p>
                </div>
                <div className="card-container p-4">
                    <p className="text-sm text-neutral-500">Active</p>
                    <p className="text-2xl font-bold text-success">
                        {redirects.filter(r => r.isActive).length}
                    </p>
                </div>
                <div className="card-container p-4">
                    <p className="text-sm text-neutral-500">Total Hits</p>
                    <p className="text-2xl font-bold">
                        {redirects.reduce((sum, r) => sum + r.hitCount, 0).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Redirects Table */}
            <div className="card-container overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Source URL</th>
                                <th>Target URL</th>
                                <th>Type</th>
                                <th>Hits</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-neutral-500">
                                        No redirects found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((redirect) => (
                                    <tr key={redirect.id}>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <code className="text-sm bg-base-200 px-2 py-1 rounded">
                                                    {redirect.sourceUrl}
                                                </code>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <ArrowRight size={14} className="text-neutral-400" />
                                                <code className="text-sm bg-base-200 px-2 py-1 rounded">
                                                    {redirect.targetUrl}
                                                </code>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-outline">{redirect.type}</span>
                                        </td>
                                        <td>
                                            <span className="font-mono">{redirect.hitCount}</span>
                                            {redirect.lastHitAt && (
                                                <p className="text-xs text-neutral-500">
                                                    Last: {new Date(redirect.lastHitAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => toggleStatus(redirect)}
                                                className={`badge ${redirect.isActive ? "badge-success" : "badge-neutral"}`}
                                            >
                                                {redirect.isActive ? (
                                                    <><CheckCircle2 size={10} /> Active</>
                                                ) : (
                                                    <><XCircle size={10} /> Inactive</>
                                                )}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openEditModal(redirect)}
                                                    className="btn btn-ghost btn-sm btn-square"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => deleteRedirect(redirect.id)}
                                                    className="btn btn-ghost btn-sm btn-square text-error"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">
                            {editingRedirect ? "Edit Redirect" : "Add New Redirect"}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Source URL</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.sourceUrl}
                                    onChange={(e) =>
                                        setFormData({ ...formData, sourceUrl: e.target.value })
                                    }
                                    placeholder="/old-page"
                                    className="input input-bordered w-full"
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    Relative path from your domain (e.g., /old-page)
                                </p>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Target URL</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.targetUrl}
                                    onChange={(e) =>
                                        setFormData({ ...formData, targetUrl: e.target.value })
                                    }
                                    placeholder="/new-page or https://..."
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Redirect Type</span>
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: parseInt(e.target.value) })
                                    }
                                    className="select select-bordered w-full"
                                >
                                    {REDIRECT_TYPES.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-neutral-500 mt-1">
                                    {REDIRECT_TYPES.find(t => t.value === formData.type)?.description}
                                </p>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isActive: e.target.checked })
                                        }
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="label-text">Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingRedirect(null);
                                }}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button onClick={saveRedirect} className="btn btn-primary">
                                {editingRedirect ? "Save Changes" : "Create Redirect"}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowModal(false)} />
                </div>
            )}
        </div>
    );
}
