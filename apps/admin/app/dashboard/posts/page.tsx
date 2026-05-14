"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText, Plus, Search, Edit, Trash2, Eye,
    Calendar, User, CheckCircle2, Clock, XCircle,
} from "lucide-react";

interface Post {
    id: string;
    title: string;
    slug: string;
    status: string;
    viewCount: number;
    publishedAt: string | null;
    createdAt: string;
    author: { firstName: string; lastName: string };
    category?: { name: string };
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => { fetchPosts(); }, []);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/blog/admin/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) setPosts(await res.json());
        } catch (e) {
            console.error("Failed:", e);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm("Delete this post?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/blog/admin/${id}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            fetchPosts();
        } catch (e) {
            console.error("Delete:", e);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "published": return <span className="badge badge-success"><CheckCircle2 size={10} /> Published</span>;
            case "draft": return <span className="badge badge-warning"><Clock size={10} /> Draft</span>;
            default: return <span className="badge badge-neutral">{status}</span>;
        }
    };

    const filtered = posts.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Blog Posts</h1>
                    <p>Create and manage your blog content</p>
                </div>
                <Link href="/dashboard/posts/new" className="btn-primary">
                    <Plus size={16} />
                    New Post
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 text-sm"
                    />
                </div>
                <div className="tab-list">
                    {["all", "published", "draft"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`tab-item ${statusFilter === s ? "active" : ""}`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="empty-state card">
                    <FileText size={40} className="empty-state-icon" />
                    <p className="text-neutral-400 mb-2">No blog posts found</p>
                    <p className="text-sm text-neutral-600 mb-4">Start writing your first blog post</p>
                    <Link href="/dashboard/posts/new" className="btn-primary">
                        <Plus size={16} /> Write Post
                    </Link>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th className="hidden md:table-cell">Author</th>
                                <th className="hidden lg:table-cell">Category</th>
                                <th>Status</th>
                                <th className="hidden sm:table-cell">Views</th>
                                <th className="hidden lg:table-cell">Date</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((post) => (
                                <tr key={post.id}>
                                    <td>
                                        <span className="font-medium text-white">{post.title}</span>
                                    </td>
                                    <td className="hidden md:table-cell">
                                        <span className="text-sm text-neutral-400 flex items-center gap-1.5">
                                            <User size={12} />
                                            {post.author?.firstName} {post.author?.lastName}
                                        </span>
                                    </td>
                                    <td className="hidden lg:table-cell">
                                        {post.category ? (
                                            <span className="badge badge-info">{post.category.name}</span>
                                        ) : (
                                            <span className="text-neutral-600">—</span>
                                        )}
                                    </td>
                                    <td>{getStatusBadge(post.status)}</td>
                                    <td className="hidden sm:table-cell">
                                        <span className="text-sm text-neutral-400 flex items-center gap-1">
                                            <Eye size={12} /> {post.viewCount || 0}
                                        </span>
                                    </td>
                                    <td className="hidden lg:table-cell">
                                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {post.publishedAt
                                                ? new Date(post.publishedAt).toLocaleDateString()
                                                : new Date(post.createdAt).toLocaleDateString()
                                            }
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/dashboard/posts/${post.id}`} className="btn-icon">
                                                <Edit size={14} />
                                            </Link>
                                            <button onClick={() => deletePost(post.id)} className="btn-icon hover:text-error-400">
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
