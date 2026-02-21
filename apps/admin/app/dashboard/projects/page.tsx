"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FolderOpen, Plus, Search, Edit, Trash2, Star, StarOff,
    CheckCircle2, XCircle, ExternalLink,
} from "lucide-react";

interface Project {
    id: string;
    title: string;
    slug: string;
    client: string;
    industry: string;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: string;
    service?: { title: string };
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/projects/admin/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) setProjects(await res.json());
        } catch (e) {
            console.error("Failed:", e);
        } finally {
            setLoading(false);
        }
    };

    const toggleFeatured = async (id: string, is: boolean) => {
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/projects/admin/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ isFeatured: !is }),
                }
            );
            fetchProjects();
        } catch (e) {
            console.error(e);
        }
    };

    const deleteProject = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/projects/admin/${id}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            fetchProjects();
        } catch (e) {
            console.error(e);
        }
    };

    const filtered = projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.client?.toLowerCase().includes(search.toLowerCase())
    );

    const featuredCount = projects.filter((p) => p.isFeatured).length;

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-8 w-48" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="skeleton h-40 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Projects</h1>
                    <p>Manage your portfolio and case studies</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="badge badge-warning">
                        <Star size={10} className="fill-current" /> {featuredCount} Featured
                    </span>
                    <Link href="/dashboard/projects/new" className="btn-primary">
                        <Plus size={16} />
                        Add Project
                    </Link>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input
                    type="text"
                    placeholder="Search projects by title or client..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 text-sm"
                />
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="empty-state card">
                    <FolderOpen size={40} className="empty-state-icon" />
                    <p className="text-neutral-400 mb-2">No projects found</p>
                    <p className="text-sm text-neutral-600 mb-4">Add your first project to build your portfolio</p>
                    <Link href="/dashboard/projects/new" className="btn-primary">
                        <Plus size={16} /> Add Project
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                    {filtered.map((project) => (
                        <div key={project.id} className="card group hover:border-dark-600">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate">{project.title}</h3>
                                    <p className="text-xs text-neutral-500 mt-0.5">{project.client}</p>
                                </div>
                                <button
                                    onClick={() => toggleFeatured(project.id, project.isFeatured)}
                                    className={`flex-shrink-0 ml-2 transition-colors ${project.isFeatured ? "text-amber-400" : "text-dark-600 hover:text-amber-400"}`}
                                >
                                    {project.isFeatured ? <Star size={18} className="fill-current" /> : <StarOff size={18} />}
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {project.industry && <span className="badge badge-neutral">{project.industry}</span>}
                                {project.service && <span className="badge badge-info">{project.service.title}</span>}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                                <span className={`badge ${project.isActive ? "badge-success" : "badge-neutral"}`}>
                                    {project.isActive ? <><CheckCircle2 size={10} /> Active</> : <><XCircle size={10} /> Inactive</>}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/dashboard/projects/${project.id}`} className="btn-icon">
                                        <Edit size={14} />
                                    </Link>
                                    <button onClick={() => deleteProject(project.id)} className="btn-icon hover:text-error-400">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
