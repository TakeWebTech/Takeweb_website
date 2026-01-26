"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Image as ImageIcon, X, Trash2 } from "lucide-react";
import { api, endpoints } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface PostData {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    categoryId: string | null;
    status: string;
    metaTitle: string;
    metaDescription: string;
    coverImage: string;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<PostData>({
        id: "",
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        categoryId: "",
        status: "DRAFT",
        metaTitle: "",
        metaDescription: "",
        coverImage: "",
    });

    useEffect(() => {
        fetchCategories();
        fetchPost();
    }, [resolvedParams.id]);

    const fetchCategories = async () => {
        try {
            const data = await api.get<Category[]>("/api/v1/blog/categories");
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const fetchPost = async () => {
        try {
            const data = await api.get<PostData>(`/api/v1/blog/admin/posts/${resolvedParams.id}`);
            setFormData({
                id: data.id,
                title: data.title || "",
                slug: data.slug || "",
                excerpt: data.excerpt || "",
                content: data.content || "",
                categoryId: data.categoryId || "",
                status: data.status || "DRAFT",
                metaTitle: data.metaTitle || "",
                metaDescription: data.metaDescription || "",
                coverImage: data.coverImage || "",
            });
        } catch (error: any) {
            setError(error.message || "Failed to load post");
            showToast("Failed to load post", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const payload: Record<string, any> = {
                title: formData.title,
                slug: formData.slug,
                content: formData.content,
                status: formData.status,
            };

            if (formData.excerpt) payload.excerpt = formData.excerpt;
            if (formData.categoryId) payload.categoryId = formData.categoryId;
            if (formData.coverImage) payload.coverImage = formData.coverImage;
            if (formData.metaTitle) payload.metaTitle = formData.metaTitle;
            if (formData.metaDescription) payload.metaDescription = formData.metaDescription;

            await api.put(`/api/v1/blog/admin/posts/${resolvedParams.id}`, payload);
            showToast("Post updated successfully!", "success");
            router.push("/dashboard/posts");
        } catch (error: any) {
            setError(error.message || "Failed to update post");
            showToast(error.message || "Failed to update post", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            return;
        }

        try {
            await api.delete(`/api/v1/blog/admin/posts/${resolvedParams.id}`);
            showToast("Post deleted successfully", "success");
            router.push("/dashboard/posts");
        } catch (error: any) {
            showToast(error.message || "Failed to delete post", "error");
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="skeleton w-10 h-10 rounded-lg" />
                    <div>
                        <div className="skeleton h-8 w-48 mb-2" />
                        <div className="skeleton h-4 w-32" />
                    </div>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="skeleton h-96 rounded-xl" />
                    </div>
                    <div className="space-y-6">
                        <div className="skeleton h-48 rounded-xl" />
                        <div className="skeleton h-48 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error && !formData.id) {
        return (
            <div className="card text-center py-12">
                <p className="text-error-500 mb-4">{error}</p>
                <Link href="/dashboard/posts" className="btn-primary">
                    Back to Posts
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/posts"
                        className="p-2 rounded-lg hover:bg-dark-700 text-neutral-400"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Edit Post</h1>
                        <p className="text-neutral-400 mt-1">Update your article</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="btn-danger"
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>
                    <button type="button" className="btn-secondary">
                        <Eye size={18} />
                        Preview
                    </button>
                    <button
                        type="submit"
                        form="post-form"
                        disabled={saving}
                        className="btn-primary disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4 flex items-center justify-between">
                    <p className="text-error-500">{error}</p>
                    <button onClick={() => setError(null)} className="text-error-500 hover:text-error-400">
                        <X size={18} />
                    </button>
                </div>
            )}

            <form id="post-form" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Content</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter post title"
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="post-url-slug"
                                    className="w-full font-mono text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Excerpt
                                </label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    placeholder="Brief summary of the post..."
                                    rows={2}
                                    className="w-full resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Content
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your article content here..."
                                    rows={15}
                                    required
                                    className="w-full resize-y font-mono text-sm"
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    Supports Markdown formatting
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">SEO Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={handleChange}
                                    placeholder="SEO title (defaults to post title)"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Meta Description
                                </label>
                                <textarea
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    placeholder="SEO description for search engines..."
                                    rows={2}
                                    className="w-full resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Publish Settings */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Publish</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full"
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Category
                                </label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId || ""}
                                    onChange={handleChange}
                                    className="w-full"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Cover Image</h2>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                Image URL
                            </label>
                            <input
                                type="text"
                                name="coverImage"
                                value={formData.coverImage}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full text-sm"
                            />
                        </div>
                        {formData.coverImage ? (
                            <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-dark-700">
                                <img
                                    src={formData.coverImage}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="mt-3 aspect-video bg-dark-700 rounded-lg flex items-center justify-center border-2 border-dashed border-neutral-700">
                                <div className="text-center">
                                    <ImageIcon className="mx-auto text-neutral-500 mb-2" size={32} />
                                    <p className="text-sm text-neutral-500">Enter URL above</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
