"use client";

import { useState } from "react";
import {
    FileStack,
    Search,
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    GripVertical,
    Settings2,
    X,
} from "lucide-react";

interface Page {
    id: string;
    name: string;
    path: string;
    status: "published" | "draft";
    category: string;
    title: string;
    description: string;
    lastModified: string;
}

const initialPages: Page[] = [
    { id: "1", name: "Home", path: "/", status: "published", category: "Main", title: "TakeWeb — Enterprise Technology Solutions", description: "Building the future of enterprise technology with AI, Cloud, and Digital Transformation.", lastModified: "2024-12-15" },
    { id: "2", name: "About", path: "/about", status: "published", category: "Main", title: "About TakeWeb — Our Story & Team", description: "Learn about our mission, values, leadership team, and journey.", lastModified: "2024-12-10" },
    { id: "3", name: "Services", path: "/services", status: "published", category: "Main", title: "Our Services — TakeWeb", description: "Comprehensive technology services including web development, AI, cloud, and more.", lastModified: "2024-12-12" },
    { id: "4", name: "Projects", path: "/projects", status: "published", category: "Main", title: "Our Projects — TakeWeb Portfolio", description: "Explore our portfolio of enterprise projects and case studies.", lastModified: "2024-12-08" },
    { id: "5", name: "Blog", path: "/blog", status: "published", category: "Main", title: "Blog — TakeWeb Insights", description: "Latest insights, tutorials, and news from TakeWeb.", lastModified: "2024-12-14" },
    { id: "6", name: "Contact", path: "/contact", status: "published", category: "Main", title: "Contact Us — TakeWeb", description: "Get in touch with our team for your technology needs.", lastModified: "2024-12-13" },
    { id: "7", name: "Careers", path: "/careers", status: "published", category: "Main", title: "Careers — Join TakeWeb", description: "Explore open positions and join our growing team.", lastModified: "2024-12-11" },
    { id: "8", name: "Web & Mobile Apps", path: "/services/web-mobile", status: "published", category: "Services", title: "Web & Mobile App Development", description: "Custom web and mobile application development services.", lastModified: "2024-12-05" },
    { id: "9", name: "Cloud & DevOps", path: "/services/cloud-devops", status: "published", category: "Services", title: "Cloud & DevOps Solutions", description: "Cloud migration, infrastructure, and DevOps services.", lastModified: "2024-12-05" },
    { id: "10", name: "AI & Data Analytics", path: "/services/ai-data-analytics", status: "published", category: "Services", title: "AI & Data Analytics", description: "AI/ML and data analytics solutions for enterprise.", lastModified: "2024-12-05" },
    { id: "11", name: "Enterprise Solutions", path: "/services/enterprise-solutions", status: "published", category: "Services", title: "Enterprise Solutions", description: "Enterprise grade software solutions.", lastModified: "2024-12-05" },
    { id: "12", name: "Software Development", path: "/services/software-development", status: "published", category: "Services", title: "Software Development", description: "Custom software development services.", lastModified: "2024-12-05" },
    { id: "13", name: "Healthcare", path: "/solutions/healthcare", status: "published", category: "Solutions", title: "Healthcare Solutions", description: "Technology solutions for the healthcare industry.", lastModified: "2024-12-01" },
    { id: "14", name: "FinTech", path: "/solutions/fintech", status: "published", category: "Solutions", title: "FinTech Solutions", description: "Financial technology solutions.", lastModified: "2024-12-01" },
    { id: "15", name: "Startups", path: "/solutions/startups", status: "published", category: "Solutions", title: "Startup Solutions", description: "Technology solutions for startups.", lastModified: "2024-12-01" },
    { id: "16", name: "Enterprise", path: "/solutions/enterprise", status: "published", category: "Solutions", title: "Enterprise Solutions", description: "Solutions for enterprise clients.", lastModified: "2024-12-01" },
    { id: "17", name: "EdTech", path: "/solutions/edtech", status: "published", category: "Solutions", title: "EdTech Solutions", description: "Education technology solutions.", lastModified: "2024-12-01" },
    { id: "18", name: "Privacy Policy", path: "/privacy", status: "published", category: "Legal", title: "Privacy Policy — TakeWeb", description: "Our privacy policy and data handling practices.", lastModified: "2024-11-20" },
    { id: "19", name: "Terms of Service", path: "/terms", status: "published", category: "Legal", title: "Terms of Service — TakeWeb", description: "Terms and conditions for using our services.", lastModified: "2024-11-20" },
    { id: "20", name: "Security", path: "/security", status: "published", category: "Legal", title: "Security — TakeWeb", description: "Our security practices and compliance.", lastModified: "2024-11-20" },
];

const categories = ["All", "Main", "Services", "Solutions", "Legal"];

export default function PagesManager() {
    const [pages, setPages] = useState<Page[]>(initialPages);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [editingPage, setEditingPage] = useState<Page | null>(null);

    const filteredPages = pages.filter((page) => {
        const matchesSearch = page.name.toLowerCase().includes(search.toLowerCase()) ||
            page.path.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === "All" || page.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const groupedPages = filteredPages.reduce((acc, page) => {
        if (!acc[page.category]) acc[page.category] = [];
        acc[page.category]!.push(page);
        return acc;
    }, {} as Record<string, Page[]>);

    const toggleStatus = (id: string) => {
        setPages(pages.map((p) =>
            p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p
        ));
    };

    const deletePage = (id: string) => {
        if (!confirm("Are you sure you want to delete this page?")) return;
        setPages(pages.filter((p) => p.id !== id));
    };

    const savePage = (updatedPage: Page) => {
        setPages(pages.map((p) => (p.id === updatedPage.id ? updatedPage : p)));
        setEditingPage(null);
    };

    const publishedCount = pages.filter((p) => p.status === "published").length;
    const draftCount = pages.filter((p) => p.status === "draft").length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Website Pages</h1>
                    <p>Manage all pages on your website</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="badge badge-success">{publishedCount} Published</span>
                        <span className="badge badge-warning">{draftCount} Draft</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search pages..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 text-sm"
                    />
                </div>
                <div className="tab-list">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`tab-item ${filterCategory === cat ? "active" : ""}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Pages by category */}
            {Object.entries(groupedPages).map(([category, categoryPages]) => (
                <div key={category}>
                    <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <FileStack size={14} />
                        {category}
                        <span className="text-neutral-600">({categoryPages.length})</span>
                    </h3>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Page Name</th>
                                    <th className="hidden md:table-cell">Path</th>
                                    <th className="hidden lg:table-cell">SEO Title</th>
                                    <th>Status</th>
                                    <th className="hidden md:table-cell">Modified</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryPages.map((page) => (
                                    <tr key={page.id}>
                                        <td>
                                            <span className="font-medium text-white">{page.name}</span>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <code className="text-xs text-neutral-500 bg-dark-800 px-2 py-0.5 rounded">{page.path}</code>
                                        </td>
                                        <td className="hidden lg:table-cell">
                                            <span className="text-neutral-400 text-xs truncate max-w-[200px] block">{page.title}</span>
                                        </td>
                                        <td>
                                            <button onClick={() => toggleStatus(page.id)}>
                                                {page.status === "published" ? (
                                                    <span className="badge badge-success"><CheckCircle2 size={10} /> Live</span>
                                                ) : (
                                                    <span className="badge badge-warning"><AlertCircle size={10} /> Draft</span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <span className="text-xs text-neutral-500">{page.lastModified}</span>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setEditingPage(page)}
                                                    className="btn-icon"
                                                    title="Edit SEO"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <a
                                                    href={page.path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-icon"
                                                    title="View Page"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                                {page.category !== "Main" && (
                                                    <button
                                                        onClick={() => deletePage(page.id)}
                                                        className="btn-icon hover:text-error-400"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {filteredPages.length === 0 && (
                <div className="empty-state card">
                    <FileStack size={40} className="empty-state-icon" />
                    <p className="text-neutral-400 mb-2">No pages found</p>
                    <p className="text-sm text-neutral-600">Try adjusting your search or filter</p>
                </div>
            )}

            {/* Edit Modal */}
            {editingPage && (
                <div className="modal-backdrop" onClick={() => setEditingPage(null)}>
                    <div className="modal max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Edit Page SEO</h3>
                            <button onClick={() => setEditingPage(null)} className="btn-icon">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Page Name</label>
                                <input
                                    type="text"
                                    value={editingPage.name}
                                    onChange={(e) => setEditingPage({ ...editingPage, name: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">SEO Title</label>
                                <input
                                    type="text"
                                    value={editingPage.title}
                                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                                    className="w-full"
                                />
                                <p className="mt-1 text-xs text-neutral-500">{editingPage.title.length}/60 characters</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Meta Description</label>
                                <textarea
                                    value={editingPage.description}
                                    onChange={(e) => setEditingPage({ ...editingPage, description: e.target.value })}
                                    className="w-full"
                                    rows={3}
                                />
                                <p className="mt-1 text-xs text-neutral-500">{editingPage.description.length}/160 characters</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">URL Path</label>
                                <input
                                    type="text"
                                    value={editingPage.path}
                                    readOnly
                                    className="w-full opacity-60"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button onClick={() => setEditingPage(null)} className="btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={() => savePage(editingPage)} className="btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
