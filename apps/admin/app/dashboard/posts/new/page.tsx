"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Save,
    Eye,
    Image as ImageIcon,
    X,
    Upload,
    Globe,
    ChevronDown,
    Tag,
    Calendar,
    Send,
} from "lucide-react";
import { api, endpoints } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import RichEditor from "@/components/ui/rich-editor";

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function NewPostPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        categoryId: "",
        status: "DRAFT" as "DRAFT" | "PUBLISHED",
        metaTitle: "",
        metaDescription: "",
        coverImage: "",
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await api.get<Category[]>("/api/v1/blog/categories");
            setCategories(data);
        } catch {
            setCategories([
                { id: "1", name: "Technology", slug: "technology" },
                { id: "2", name: "Design", slug: "design" },
                { id: "3", name: "Business", slug: "business" },
                { id: "4", name: "Engineering", slug: "engineering" },
            ]);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "title" ? { slug: generateSlug(value), metaTitle: value } : {}),
        }));
    };

    const generateSlug = (title: string) =>
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    };

    const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
        setLoading(true);
        try {
            const payload = { ...formData, status, tags };
            await api.post(endpoints.posts.create, payload);
            showToast(
                status === "PUBLISHED" ? "Post published!" : "Draft saved!",
                "success"
            );
            router.push("/dashboard/posts");
        } catch (error: any) {
            showToast(error.message || "Failed to create post", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCoverDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, coverImage: url }));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/posts" className="btn-icon">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="page-header">
                        <h1>New Post</h1>
                        <p>Create a new blog post</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleSubmit("DRAFT")}
                        disabled={loading || !formData.title}
                        className="btn-secondary disabled:opacity-50"
                    >
                        <Save size={16} /> Save Draft
                    </button>
                    <button
                        onClick={() => handleSubmit("PUBLISHED")}
                        disabled={loading || !formData.title}
                        className="btn-primary disabled:opacity-50"
                    >
                        <Send size={16} /> {loading ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </div>

            {/* Tab nav */}
            <div className="tab-list">
                <button
                    className={`tab-item ${activeTab === "content" ? "active" : ""}`}
                    onClick={() => setActiveTab("content")}
                >
                    Content
                </button>
                <button
                    className={`tab-item ${activeTab === "seo" ? "active" : ""}`}
                    onClick={() => setActiveTab("seo")}
                >
                    SEO & Meta
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* ── Main Column ── */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === "content" && (
                        <>
                            {/* Title */}
                            <div className="card">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                            Title <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter a compelling title..."
                                            required
                                            className="w-full text-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                            Slug
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-neutral-500">/blog/</span>
                                            <input
                                                type="text"
                                                name="slug"
                                                value={formData.slug}
                                                onChange={handleChange}
                                                className="flex-1 font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                            Excerpt
                                        </label>
                                        <textarea
                                            name="excerpt"
                                            value={formData.excerpt}
                                            onChange={handleChange}
                                            placeholder="Brief summary for listings and social sharing..."
                                            rows={2}
                                            className="w-full resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Rich Editor */}
                            <div className="card">
                                <RichEditor
                                    label="Content"
                                    value={formData.content}
                                    onChange={(val) =>
                                        setFormData((prev) => ({ ...prev, content: val }))
                                    }
                                    placeholder="Write your post content in Markdown..."
                                    minHeight="400px"
                                />
                            </div>
                        </>
                    )}

                    {activeTab === "seo" && (
                        <div className="card space-y-4">
                            <h2 className="text-lg font-semibold text-white">SEO Settings</h2>
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
                                <p className="mt-1 text-xs text-neutral-500">
                                    {formData.metaTitle.length}/60 characters
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Meta Description
                                </label>
                                <textarea
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    placeholder="SEO description for search results..."
                                    rows={3}
                                    className="w-full resize-none"
                                />
                                <p className="mt-1 text-xs text-neutral-500">
                                    {formData.metaDescription.length}/160 characters
                                </p>
                            </div>

                            {/* Google Preview */}
                            <div>
                                <h3 className="text-sm font-medium text-neutral-400 mb-2">
                                    Google Preview
                                </h3>
                                <div className="p-4 rounded-lg bg-white/5 border border-dark-700">
                                    <p className="text-sm text-primary-400 truncate">
                                        takeweb.in/blog/{formData.slug || "your-post-slug"}
                                    </p>
                                    <p className="text-base text-blue-400 hover:underline cursor-pointer truncate mt-0.5">
                                        {formData.metaTitle || formData.title || "Post Title"}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                                        {formData.metaDescription ||
                                            formData.excerpt ||
                                            "Your meta description will appear here..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Sidebar ── */}
                <div className="space-y-6">
                    {/* Cover Image */}
                    <div className="card">
                        <h2 className="text-sm font-semibold text-white mb-3">
                            Cover Image
                        </h2>
                        {formData.coverImage ? (
                            <div className="relative group rounded-lg overflow-hidden">
                                <img
                                    src={formData.coverImage}
                                    alt="Cover"
                                    className="w-full h-40 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                coverImage: "",
                                            }))
                                        }
                                        className="btn-icon text-white"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onDrop={handleCoverDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center hover:border-primary-500/50 transition-colors cursor-pointer"
                            >
                                <Upload
                                    size={24}
                                    className="mx-auto mb-2 text-neutral-500"
                                />
                                <p className="text-xs text-neutral-500">
                                    Drag & drop or paste URL
                                </p>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={formData.coverImage}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            coverImage: e.target.value,
                                        }))
                                    }
                                    className="w-full mt-2 text-xs"
                                />
                            </div>
                        )}
                    </div>

                    {/* Category */}
                    <div className="card">
                        <h2 className="text-sm font-semibold text-white mb-3">
                            Category
                        </h2>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full"
                        >
                            <option value="">Select category...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div className="card">
                        <h2 className="text-sm font-semibold text-white mb-3">
                            Tags
                        </h2>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-500/15 text-primary-400 text-xs"
                                >
                                    <Tag size={10} />
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-white"
                                    >
                                        <X size={10} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Add tag, press Enter"
                            className="w-full text-sm"
                        />
                    </div>

                    {/* Publish Info */}
                    <div className="card">
                        <h2 className="text-sm font-semibold text-white mb-3">
                            Status
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400">Status</span>
                                <span
                                    className={`badge ${formData.status === "PUBLISHED" ? "badge-success" : "badge-warning"}`}
                                >
                                    {formData.status === "PUBLISHED"
                                        ? "Published"
                                        : "Draft"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400">Date</span>
                                <span className="text-neutral-300 flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
