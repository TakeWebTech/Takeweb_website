"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft, Plus, Search, Map, Trash2, Edit, ExternalLink,
    CheckCircle2, XCircle, Download, RefreshCw, Clock,
    Eye, EyeOff, Globe,
} from "lucide-react";

interface SitemapEntry {
    id: string;
    url: string;
    changeFrequency: string;
    priority: number;
    lastModified: string | null;
    isIncluded: boolean;
    createdAt: string;
}

const CHANGE_FREQUENCIES = [
    { value: "always", label: "Always" },
    { value: "hourly", label: "Hourly" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "never", label: "Never" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function SitemapPage() {
    const [entries, setEntries] = useState<SitemapEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<SitemapEntry | null>(null);
    const [formData, setFormData] = useState({
        url: "",
        changeFrequency: "weekly",
        priority: 0.5,
        isIncluded: true,
    });

    useEffect(() => { fetchEntries(); }, []);

    const fetchEntries = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_URL}/api/v1/seo/sitemap/entries?limit=200`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setEntries(data.items || []);
            }
        } catch (e) {
            console.error("Failed:", e);
        } finally {
            setLoading(false);
        }
    };

    const saveEntry = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const url = editingEntry
                ? `${API_URL}/api/v1/seo/sitemap/entries/${editingEntry.id}`
                : `${API_URL}/api/v1/seo/sitemap/entries`;

            const res = await fetch(url, {
                method: editingEntry ? "PUT" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowModal(false);
                setEditingEntry(null);
                resetForm();
                fetchEntries();
            }
        } catch (e) {
            console.error("Save failed:", e);
        }
    };

    const deleteEntry = async (id: string) => {
        if (!confirm("Remove this URL from sitemap?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(`${API_URL}/api/v1/seo/sitemap/entries/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEntries();
        } catch (e) {
            console.error("Delete failed:", e);
        }
    };

    const toggleIncluded = async (entry: SitemapEntry) => {
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(`${API_URL}/api/v1/seo/sitemap/entries/${entry.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isIncluded: !entry.isIncluded }),
            });
            fetchEntries();
        } catch (e) {
            console.error("Toggle failed:", e);
        }
    };

    const resetForm = () => {
        setFormData({
            url: "",
            changeFrequency: "weekly",
            priority: 0.5,
            isIncluded: true,
        });
    };

    const openEditModal = (entry: SitemapEntry) => {
        setEditingEntry(entry);
        setFormData({
            url: entry.url,
            changeFrequency: entry.changeFrequency,
            priority: entry.priority,
            isIncluded: entry.isIncluded,
        });
        setShowModal(true);
    };

    const openNewModal = () => {
        setEditingEntry(null);
        resetForm();
        setShowModal(true);
    };

    const downloadSitemap = () => {
        window.open(`${API_URL}/api/v1/seo/sitemap.xml`, "_blank");
    };

    const filtered = entries.filter(e =>
        e.url.toLowerCase().includes(search.toLowerCase())
    );

    const includedCount = entries.filter(e => e.isIncluded).length;

    const getPriorityColor = (priority: number) => {
        if (priority >= 0.8) return "text-success";
        if (priority >= 0.5) return "text-warning";
        return "text-neutral-400";
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
                    <h1>Sitemap Manager</h1>
                    <p>Configure which URLs appear in your XML sitemap</p>
                </div>
                <button onClick={downloadSitemap} className="btn-ghost btn-sm">
                    <Download size={16} />
                    Download XML
                </button>
                <button onClick={openNewModal} className="btn-primary">
                    <Plus size={16} />
                    Add URL
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card-container p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Map className="text-primary" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Total URLs</p>
                            <p className="text-2xl font-bold">{entries.length}</p>
                        </div>
                    </div>
                </div>
                <div className="card-container p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                            <Eye className="text-success" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Included</p>
                            <p className="text-2xl font-bold text-success">{includedCount}</p>
                        </div>
                    </div>
                </div>
                <div className="card-container p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                            <EyeOff className="text-warning" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Excluded</p>
                            <p className="text-2xl font-bold text-warning">
                                {entries.length - includedCount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sitemap URL */}
            <div className="card-container p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Globe className="text-primary" size={20} />
                        <div>
                            <p className="text-sm text-neutral-500">Your Sitemap URL</p>
                            <code className="text-sm">https://takeweb.in/sitemap.xml</code>
                        </div>
                    </div>
                    <a
                        href="https://takeweb.in/sitemap.xml"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                    >
                        <ExternalLink size={14} />
                        View
                    </a>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search URLs..."
                    className="input input-bordered w-full pl-10"
                />
            </div>

            {/* Entries Table */}
            <div className="card-container overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>URL</th>
                                <th>Change Frequency</th>
                                <th>Priority</th>
                                <th>Last Modified</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Map className="mx-auto text-neutral-400 mb-2" size={32} />
                                        <p className="text-neutral-500">
                                            {entries.length === 0
                                                ? "No sitemap entries yet. Add your first URL!"
                                                : "No matching URLs found"}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((entry) => (
                                    <tr key={entry.id} className={!entry.isIncluded ? "opacity-50" : ""}>
                                        <td>
                                            <code className="text-sm bg-base-200 px-2 py-1 rounded max-w-[200px] truncate block">
                                                {entry.url}
                                            </code>
                                        </td>
                                        <td>
                                            <span className="badge badge-outline capitalize">
                                                {entry.changeFrequency}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`font-semibold ${getPriorityColor(entry.priority)}`}>
                                                {entry.priority.toFixed(1)}
                                            </span>
                                        </td>
                                        <td>
                                            {entry.lastModified ? (
                                                <div className="text-sm">
                                                    <p>{new Date(entry.lastModified).toLocaleDateString()}</p>
                                                </div>
                                            ) : (
                                                <span className="text-neutral-400 text-sm">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => toggleIncluded(entry)}
                                                className={`badge ${entry.isIncluded ? "badge-success" : "badge-neutral"}`}
                                            >
                                                {entry.isIncluded ? (
                                                    <><CheckCircle2 size={10} /> Included</>
                                                ) : (
                                                    <><XCircle size={10} /> Excluded</>
                                                )}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openEditModal(entry)}
                                                    className="btn btn-ghost btn-sm btn-square"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => deleteEntry(entry.id)}
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
                            {editingEntry ? "Edit Sitemap Entry" : "Add URL to Sitemap"}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">URL</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.url}
                                    onChange={(e) =>
                                        setFormData({ ...formData, url: e.target.value })
                                    }
                                    placeholder="https://takeweb.in/page"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Change Frequency</span>
                                    </label>
                                    <select
                                        value={formData.changeFrequency}
                                        onChange={(e) =>
                                            setFormData({ ...formData, changeFrequency: e.target.value })
                                        }
                                        className="select select-bordered w-full"
                                    >
                                        {CHANGE_FREQUENCIES.map((freq) => (
                                            <option key={freq.value} value={freq.value}>
                                                {freq.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text">Priority ({formData.priority.toFixed(1)})</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={formData.priority}
                                        onChange={(e) =>
                                            setFormData({ ...formData, priority: parseFloat(e.target.value) })
                                        }
                                        className="range range-primary"
                                    />
                                    <div className="flex justify-between text-xs text-neutral-500 px-1">
                                        <span>Low</span>
                                        <span>High</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.isIncluded}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isIncluded: e.target.checked })
                                        }
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="label-text">Include in sitemap</span>
                                </label>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingEntry(null);
                                }}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button onClick={saveEntry} className="btn btn-primary">
                                {editingEntry ? "Save Changes" : "Add to Sitemap"}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowModal(false)} />
                </div>
            )}
        </div>
    );
}
