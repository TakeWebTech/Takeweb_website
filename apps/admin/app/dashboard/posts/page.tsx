"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

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

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/blog/admin/posts`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || data);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/blog/admin/posts/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.ok) {
                fetchPosts();
            }
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || post.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return <span className="badge-success">Published</span>;
            case "DRAFT":
                return <span className="badge-warning">Draft</span>;
            case "ARCHIVED":
                return <span className="badge-info">Archived</span>;
            default:
                return <span className="badge">{status}</span>;
        }
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
                    <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
                    <p className="text-neutral-400 mt-1">Manage your blog content</p>
                </div>
                <Link href="/dashboard/posts/new" className="btn-primary">
                    <Plus size={20} />
                    New Post
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-48"
                >
                    <option value="all">All Status</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
            </div>

            {/* Table */}
            {filteredPosts.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-neutral-400">No posts found. Create your first post!</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Views</th>
                                <th>Date</th>
                                <th className="w-20">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map((post) => (
                                <tr key={post.id}>
                                    <td>
                                        <div className="font-medium text-white">{post.title}</div>
                                    </td>
                                    <td>{getStatusBadge(post.status)}</td>
                                    <td>{post.category?.name || "—"}</td>
                                    <td>{post.author.firstName} {post.author.lastName}</td>
                                    <td>{post.viewCount.toLocaleString()}</td>
                                    <td className="text-neutral-400">
                                        {post.publishedAt
                                            ? new Date(post.publishedAt).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/dashboard/posts/${post.id}`}
                                                className="p-1.5 rounded hover:bg-dark-700 text-neutral-400 hover:text-white"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button className="p-1.5 rounded hover:bg-dark-700 text-neutral-400 hover:text-white">
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => deletePost(post.id)}
                                                className="p-1.5 rounded hover:bg-dark-700 text-neutral-400 hover:text-error-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                    Showing {filteredPosts.length} of {posts.length} posts
                </p>
                <div className="flex gap-2">
                    <button className="btn-secondary" disabled>
                        Previous
                    </button>
                    <button className="btn-secondary">Next</button>
                </div>
            </div>
        </div>
    );
}
