"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft, FileX, Search, Trash2, Link2, ExternalLink,
    CheckCircle2, AlertTriangle, RefreshCw, XCircle, Filter,
} from "lucide-react";

interface Error404 {
    id: string;
    url: string;
    hitCount: number;
    firstOccurred: string;
    lastOccurred: string;
    referrer: string | null;
    userAgent: string | null;
    resolved: boolean;
    redirectedTo: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Monitor404Page() {
    const [errors, setErrors] = useState<Error404[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [resolvedFilter, setResolvedFilter] = useState("unresolved");
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [selectedError, setSelectedError] = useState<Error404 | null>(null);
    const [redirectUrl, setRedirectUrl] = useState("");

    useEffect(() => { fetchErrors(); }, []);

    const fetchErrors = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_URL}/api/v1/seo/404-errors?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setErrors(data.items || []);
            }
        } catch (e) {
            console.error("Failed:", e);
        } finally {
            setLoading(false);
        }
    };

    const resolveError = async () => {
        if (!selectedError) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(`${API_URL}/api/v1/seo/404-errors/${selectedError.id}/resolve`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    redirectToUrl: redirectUrl || undefined,
                }),
            });
            setShowResolveModal(false);
            setSelectedError(null);
            setRedirectUrl("");
            fetchErrors();
        } catch (e) {
            console.error("Resolve failed:", e);
        }
    };

    const deleteError = async (id: string) => {
        if (!confirm("Delete this 404 error record?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(`${API_URL}/api/v1/seo/404-errors/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchErrors();
        } catch (e) {
            console.error("Delete failed:", e);
        }
    };

    const deleteAllResolved = async () => {
        if (!confirm("Delete all resolved 404 errors?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(`${API_URL}/api/v1/seo/404-errors`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchErrors();
        } catch (e) {
            console.error("Delete all failed:", e);
        }
    };

    const openResolveModal = (error: Error404) => {
        setSelectedError(error);
        setRedirectUrl("");
        setShowResolveModal(true);
    };

    const filtered = errors.filter((e) => {
        const matchesSearch = e.url.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            resolvedFilter === "all" ||
            (resolvedFilter === "unresolved" && !e.resolved) ||
            (resolvedFilter === "resolved" && e.resolved);
        return matchesSearch && matchesFilter;
    });

    const unresolvedCount = errors.filter(e => !e.resolved).length;
    const totalHits = errors.reduce((sum, e) => sum + e.hitCount, 0);

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
                    <h1>404 Error Monitor</h1>
                    <p>Track and fix broken links on your website</p>
                </div>
                <button onClick={fetchErrors} className="btn-ghost btn-sm">
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card-container p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                            <FileX className="text-error" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Unresolved</p>
                            <p className="text-2xl font-bold text-error">{unresolvedCount}</p>
                        </div>
                    </div>
                </div>
                <div className="card-container p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="text-success" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Resolved</p>
                            <p className="text-2xl font-bold text-success">
                                {errors.filter(e => e.resolved).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card-container p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="text-warning" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Total Hits</p>
                            <p className="text-2xl font-bold">{totalHits.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="card-container p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                            <Link2 className="text-info" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Redirected</p>
                            <p className="text-2xl font-bold">
                                {errors.filter(e => e.redirectedTo).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
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
                        value={resolvedFilter}
                        onChange={(e) => setResolvedFilter(e.target.value)}
                        className="select select-bordered"
                    >
                        <option value="all">All Errors</option>
                        <option value="unresolved">Unresolved</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
                {errors.filter(e => e.resolved).length > 0 && (
                    <button onClick={deleteAllResolved} className="btn btn-outline btn-error btn-sm">
                        <Trash2 size={14} />
                        Clear Resolved
                    </button>
                )}
            </div>

            {/* Errors Table */}
            <div className="card-container overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>URL</th>
                                <th>Hits</th>
                                <th>Last Occurred</th>
                                <th>Referrer</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <FileX className="mx-auto text-neutral-400 mb-2" size={32} />
                                        <p className="text-neutral-500">
                                            {unresolvedCount === 0 
                                                ? "No 404 errors detected. Great job!" 
                                                : "No matching errors found"}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((error) => (
                                    <tr key={error.id} className={error.resolved ? "opacity-60" : ""}>
                                        <td>
                                            <div className="max-w-xs">
                                                <code className="text-sm bg-base-200 px-2 py-1 rounded block truncate">
                                                    {error.url}
                                                </code>
                                                {error.redirectedTo && (
                                                    <div className="flex items-center gap-1 mt-1 text-xs text-success">
                                                        <Link2 size={10} />
                                                        Redirected to: {error.redirectedTo}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`font-mono ${error.hitCount > 10 ? "text-error font-bold" : ""}`}>
                                                {error.hitCount}
                                            </span>
                                        </td>
                                        <td>
                                            <div>
                                                <p className="text-sm">
                                                    {new Date(error.lastOccurred).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    {new Date(error.lastOccurred).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            {error.referrer ? (
                                                <a
                                                    href={error.referrer}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:underline flex items-center gap-1 max-w-[150px] truncate"
                                                >
                                                    {error.referrer}
                                                    <ExternalLink size={10} />
                                                </a>
                                            ) : (
                                                <span className="text-neutral-400 text-sm">Direct</span>
                                            )}
                                        </td>
                                        <td>
                                            {error.resolved ? (
                                                <span className="badge badge-success">
                                                    <CheckCircle2 size={10} /> Resolved
                                                </span>
                                            ) : (
                                                <span className="badge badge-error">
                                                    <XCircle size={10} /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                {!error.resolved && (
                                                    <button
                                                        onClick={() => openResolveModal(error)}
                                                        className="btn btn-ghost btn-sm btn-square"
                                                        title="Resolve with redirect"
                                                    >
                                                        <Link2 size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteError(error.id)}
                                                    className="btn btn-ghost btn-sm btn-square text-error"
                                                    title="Delete"
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

            {/* Resolve Modal */}
            {showResolveModal && selectedError && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Resolve 404 Error</h3>

                        <div className="alert alert-info mb-4">
                            <FileX size={16} />
                            <div>
                                <p className="font-medium">URL Not Found</p>
                                <code className="text-sm">{selectedError.url}</code>
                            </div>
                        </div>

                        <p className="text-sm text-neutral-500 mb-4">
                            You can either mark this as resolved (if the page was intentionally removed)
                            or create a redirect to another page.
                        </p>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Redirect to (optional)</span>
                            </label>
                            <input
                                type="text"
                                value={redirectUrl}
                                onChange={(e) => setRedirectUrl(e.target.value)}
                                placeholder="/new-page or leave empty"
                                className="input input-bordered w-full"
                            />
                            <p className="text-xs text-neutral-500 mt-1">
                                Leave empty to mark as resolved without redirect
                            </p>
                        </div>

                        <div className="modal-action">
                            <button
                                onClick={() => {
                                    setShowResolveModal(false);
                                    setSelectedError(null);
                                }}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button onClick={resolveError} className="btn btn-primary">
                                {redirectUrl ? "Create Redirect" : "Mark Resolved"}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowResolveModal(false)} />
                </div>
            )}
        </div>
    );
}
