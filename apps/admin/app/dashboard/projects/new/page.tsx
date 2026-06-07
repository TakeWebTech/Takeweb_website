"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

interface Service {
    id: string;
    title: string;
}

export default function NewProjectPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        client: "",
        industry: "",
        description: "",
        challenge: "",
        solution: "",
        outcome: "",
        technologies: "",
        serviceId: "",
        coverImage: "",
        images: "",
        isFeatured: false,
        isActive: true,
    });

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        try {
            const data = await api.get<Service[]>("/api/v1/services");
            setServices(data || []);
        } catch { /* ok */ }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "title" ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : {}),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/api/v1/projects/admin", {
                ...formData,
                technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
                images: formData.images.split("\n").map(i => i.trim()).filter(Boolean),
            });
            showToast("Project created!", "success");
            router.push("/dashboard/projects");
        } catch (error: any) {
            showToast(error.message || "Failed to create project", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/projects" className="p-2 rounded-lg hover:bg-dark-700 text-neutral-400"><ArrowLeft size={20} /></Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">New Project</h1>
                        <p className="text-neutral-400 mt-1">Add a new portfolio project</p>
                    </div>
                </div>
                <button type="submit" form="project-form" disabled={loading} className="btn-primary disabled:opacity-50">
                    <Save size={18} /> {loading ? "Saving..." : "Create Project"}
                </button>
            </div>

            <form id="project-form" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Project Info</h2>
                        <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full" /></div>
                                <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Slug</label><input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full font-mono text-sm" /></div>
                                <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Client</label><input type="text" name="client" value={formData.client} onChange={handleChange} className="w-full" /></div>
                                <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Industry</label><input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="FinTech, Healthcare..." className="w-full" /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Full Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full" /></div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Case Study</h2>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Challenge</label><textarea name="challenge" value={formData.challenge} onChange={handleChange} rows={4} placeholder="What problem did the client face?" className="w-full" /></div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Solution</label><textarea name="solution" value={formData.solution} onChange={handleChange} rows={4} placeholder="How did you solve it?" className="w-full" /></div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Outcome</label><textarea name="outcome" value={formData.outcome} onChange={handleChange} rows={4} placeholder="What outcomes were achieved?" className="w-full" /></div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Details</h2>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Service</label>
                                <select name="serviceId" value={formData.serviceId} onChange={handleChange} className="w-full">
                                    <option value="">Select service</option>
                                    {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                </select>
                            </div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Technologies (comma-separated)</label><input type="text" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="React, Node.js, AWS" className="w-full" /></div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Cover Image URL</label><input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} className="w-full" /></div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Gallery Images (one URL per line)</label><textarea name="images" value={formData.images} onChange={handleChange} rows={3} className="w-full font-mono text-sm" /></div>
                            <div className="flex items-center gap-3"><input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))} className="w-5 h-5 rounded" /><label htmlFor="isFeatured" className="text-sm text-neutral-300">Featured Project</label></div>
                            <div className="flex items-center gap-3"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="w-5 h-5 rounded" /><label htmlFor="isActive" className="text-sm text-neutral-300">Active</label></div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
