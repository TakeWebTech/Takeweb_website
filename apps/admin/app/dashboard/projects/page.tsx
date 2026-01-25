"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Star, StarOff } from "lucide-react";

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

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/projects/admin/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFeatured = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/projects/admin/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ isFeatured: !currentStatus }),
                }
            );
            fetchProjects();
        } catch (error) {
            console.error("Failed to toggle featured:", error);
        }
    };

    const deleteProject = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/projects/admin/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchProjects();
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    const filteredProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(search.toLowerCase())
    );

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
                    <h1 className="text-2xl font-bold text-white">Projects</h1>
                    <p className="text-neutral-400 mt-1">Manage your portfolio and case studies</p>
                </div>
                <Link href="/dashboard/projects/new" className="btn-primary">
                    <Plus size={20} />
                    Add Project
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10"
                />
            </div>

            {/* Grid */}
            {filteredProjects.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-neutral-400">No projects found. Add your first project!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="card">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-white">{project.title}</h3>
                                    <p className="text-sm text-neutral-400">{project.client}</p>
                                </div>
                                <button
                                    onClick={() => toggleFeatured(project.id, project.isFeatured)}
                                    className={project.isFeatured ? "text-yellow-500" : "text-neutral-500"}
                                >
                                    {project.isFeatured ? <Star size={20} /> : <StarOff size={20} />}
                                </button>
                            </div>
                            <div className="text-sm text-neutral-500 mb-4">
                                {project.industry && <span>{project.industry}</span>}
                                {project.service && (
                                    <span className="ml-2 px-2 py-0.5 bg-dark-700 rounded">
                                        {project.service.title}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-xs ${project.isActive ? "text-success-500" : "text-neutral-500"}`}>
                                    {project.isActive ? "Active" : "Inactive"}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/dashboard/projects/${project.id}`}
                                        className="p-1.5 rounded hover:bg-dark-700 text-neutral-400 hover:text-white"
                                    >
                                        <Edit size={16} />
                                    </Link>
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        className="p-1.5 rounded hover:bg-dark-700 text-neutral-400 hover:text-error-500"
                                    >
                                        <Trash2 size={16} />
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
