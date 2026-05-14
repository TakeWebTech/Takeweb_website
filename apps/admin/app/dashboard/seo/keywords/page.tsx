"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft, Plus, Search, TrendingUp, TrendingDown,
    Minus, Trash2, Edit, RefreshCw, Target, Globe,
    ArrowUp, ArrowDown, BarChart3, Calendar,
} from "lucide-react";

interface Keyword {
    id: string;
    keyword: string;
    targetUrl: string | null;
    country: string;
    language: string;
    searchEngine: string;
    currentPosition: number | null;
    previousPosition: number | null;
    bestPosition: number | null;
    positionHistory: Array<{ date: string; position: number }>;
    searchVolume: number | null;
    lastChecked: string | null;
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function KeywordsPage() {
    const [keywords, setKeywords] = useState<Keyword[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
    const [formData, setFormData] = useState({
        keyword: "",
        targetUrl: "",
        country: "IN",
        language: "en",
    });

    useEffect(() => { fetchKeywords(); }, []);

    const fetchKeywords = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_URL}/api/v1/seo/keywords?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setKeywords(data.items || []);
            }
        } catch (e) {
            console.error("Failed:", e);
        } finally {
            setLoading(false);
        }
    };

    const saveKeyword = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const url = editingKeyword
                ? `${API_URL}/api/v1/seo/keywords/${editingKeyword.id}`
                : `${API_URL}/api/v1/seo/keywords`;

            const res = await fetch(url, {
                method: editingKeyword ? "PUT" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowModal(false);
                setEditingKeyword(null);
                setFormData({ keyword: "", targetUrl: "", country: "IN", language: "en" });
                fetchKeywords();
            }
        } catch (e) {
            console.error("Save failed:", e);
        }
    };

    const deleteKeyword = async (id: string) => {
        if (!confirm("Stop tracking this keyword?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(`${API_URL}/api/v1/seo/keywords/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchKeywords();
        } catch (e) {
            console.error("Delete failed:", e);
        }
    };

    const openEditModal = (keyword: Keyword) => {
        setEditingKeyword(keyword);
        setFormData({
            keyword: keyword.keyword,
            targetUrl: keyword.targetUrl || "",
            country: keyword.country,
            language: keyword.language,
        });
        setShowModal(true);
    };

    const openNewModal = () => {
        setEditingKeyword(null);
        setFormData({ keyword: "", targetUrl: "", country: "IN", language: "en" });
        setShowModal(true);
    };

    const getPositionChange = (kw: Keyword) => {
        if (!kw.currentPosition || !kw.previousPosition) return null;
        return kw.previousPosition - kw.currentPosition;
    };

    const getPositionIndicator = (change: number | null) => {
        if (change === null) return <Minus className="text-neutral-400" size={14} />;
        if (change > 0) return <TrendingUp className="text-success" size={14} />;
        if (change < 0) return <TrendingDown className="text-error" size={14} />;
        return <Minus className="text-neutral-400" size={14} />;
    };

    const getPositionColor = (position: number | null) => {
        if (!position) return "text-neutral-400";
        if (position <= 3) return "text-success font-bold";
        if (position <= 10) return "text-primary font-semibold";
        if (position <= 20) return "text-warning";
        return "text-error";
    };

    const filtered = keywords.filter(k =>
        k.keyword.toLowerCase().includes(search.toLowerCase()) ||
        (k.targetUrl && k.targetUrl.toLowerCase().includes(search.toLowerCase()))
    );

    // Calculate stats
    const top3 = keywords.filter(k => k.currentPosition && k.currentPosition <= 3).length;
    const top10 = keywords.filter(k => k.currentPosition && k.currentPosition <= 10).length;
    const avgPosition = keywords.length > 0
        ? Math.round(keywords.reduce((sum, k) => sum + (k.currentPosition || 100), 0) / keywords.length)
        : 0;

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
                    <h1>Keyword Tracking</h1>
                    <p>Monitor your search engine rankings</p>
                </div>
                <button onClick={fetchKeywords} className="btn-ghost btn-sm">
                    <RefreshCw size={16} />
                    Refresh
                </button>
                <button onClick={openNewModal} className="btn-primary">
                    <Plus size={16} />
                    Add Keyword
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card-container p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Target className="text-primary" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Tracking</p>
                            <p className="text-2xl font-bold">{keywords.length}</p>
                        </div>
                    </div>
                </div>
                <div className="card-container p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-success" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Top 3</p>
                            <p className="text-2xl font-bold text-success">{top3}</p>
                        </div>
                    </div>
                </div>
                <div className="card-container p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                            <BarChart3 className="text-info" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Top 10</p>
                            <p className="text-2xl font-bold text-info">{top10}</p>
                        </div>
                    </div>
                </div>
                <div className="card-container p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                            <Globe className="text-warning" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Avg Position</p>
                            <p className="text-2xl font-bold">{avgPosition || "-"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search keywords..."
                    className="input input-bordered w-full pl-10"
                />
            </div>

            {/* Keywords Table */}
            <div className="card-container overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Keyword</th>
                                <th>Position</th>
                                <th>Change</th>
                                <th>Best</th>
                                <th>Target URL</th>
                                <th>Last Checked</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12">
                                        <Target className="mx-auto text-neutral-400 mb-2" size={32} />
                                        <p className="text-neutral-500">
                                            {keywords.length === 0
                                                ? "No keywords being tracked. Add your first keyword!"
                                                : "No matching keywords found"}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((keyword) => {
                                    const change = getPositionChange(keyword);
                                    return (
                                        <tr key={keyword.id}>
                                            <td>
                                                <div>
                                                    <p className="font-medium">{keyword.keyword}</p>
                                                    <p className="text-xs text-neutral-500">
                                                        {keyword.country.toUpperCase()} • {keyword.searchEngine}
                                                    </p>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`text-xl ${getPositionColor(keyword.currentPosition)}`}>
                                                    {keyword.currentPosition || "-"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1">
                                                    {getPositionIndicator(change)}
                                                    {change !== null && (
                                                        <span className={change > 0 ? "text-success" : change < 0 ? "text-error" : ""}>
                                                            {change > 0 ? `+${change}` : change}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`${getPositionColor(keyword.bestPosition)}`}>
                                                    {keyword.bestPosition || "-"}
                                                </span>
                                            </td>
                                            <td>
                                                {keyword.targetUrl ? (
                                                    <code className="text-xs bg-base-200 px-2 py-1 rounded max-w-[150px] truncate block">
                                                        {keyword.targetUrl}
                                                    </code>
                                                ) : (
                                                    <span className="text-neutral-400 text-sm">-</span>
                                                )}
                                            </td>
                                            <td>
                                                {keyword.lastChecked ? (
                                                    <div className="text-sm">
                                                        <p>{new Date(keyword.lastChecked).toLocaleDateString()}</p>
                                                        <p className="text-xs text-neutral-500">
                                                            {new Date(keyword.lastChecked).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-neutral-400 text-sm">Never</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => openEditModal(keyword)}
                                                        className="btn btn-ghost btn-sm btn-square"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteKeyword(keyword.id)}
                                                        className="btn btn-ghost btn-sm btn-square text-error"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
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
                            {editingKeyword ? "Edit Keyword" : "Add New Keyword"}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Keyword</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.keyword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, keyword: e.target.value })
                                    }
                                    placeholder="e.g., web development services"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Target URL (optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.targetUrl}
                                    onChange={(e) =>
                                        setFormData({ ...formData, targetUrl: e.target.value })
                                    }
                                    placeholder="/services/web-development"
                                    className="input input-bordered w-full"
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    The page you want to rank for this keyword
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Country</span>
                                    </label>
                                    <select
                                        value={formData.country}
                                        onChange={(e) =>
                                            setFormData({ ...formData, country: e.target.value })
                                        }
                                        className="select select-bordered w-full"
                                    >
                                        <option value="IN">India</option>
                                        <option value="US">United States</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="CA">Canada</option>
                                        <option value="AU">Australia</option>
                                        <option value="SG">Singapore</option>
                                        <option value="AE">UAE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text">Language</span>
                                    </label>
                                    <select
                                        value={formData.language}
                                        onChange={(e) =>
                                            setFormData({ ...formData, language: e.target.value })
                                        }
                                        className="select select-bordered w-full"
                                    >
                                        <option value="en">English</option>
                                        <option value="hi">Hindi</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingKeyword(null);
                                }}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button onClick={saveKeyword} className="btn btn-primary">
                                {editingKeyword ? "Save Changes" : "Add Keyword"}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowModal(false)} />
                </div>
            )}
        </div>
    );
}
