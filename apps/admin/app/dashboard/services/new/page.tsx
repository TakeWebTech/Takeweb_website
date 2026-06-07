"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function NewServicePage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        shortDescription: "",
        content: "",
        icon: "",
        benefits: "",
        sortOrder: 0,
        isActive: true,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseInt(value) || 0 : value,
            ...(name === "title" ? { slug: generateSlug(value) } : {}),
        }));
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                benefits: formData.benefits.split("\n").map(f => f.trim()).filter(Boolean),
                technologies: [],
                useCases: [],
            };
            await api.post("/api/v1/services/admin", payload);
            showToast("Service created successfully!", "success");
            router.push("/dashboard/services");
        } catch (error: any) {
            showToast(error.message || "Failed to create service", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/services" className="p-2 rounded-lg hover:bg-dark-700 text-neutral-400">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">New Service</h1>
                        <p className="text-neutral-400 mt-1">Add a new service offering</p>
                    </div>
                </div>
                <button type="submit" form="service-form" disabled={loading} className="btn-primary disabled:opacity-50">
                    <Save size={18} />
                    {loading ? "Saving..." : "Create Service"}
                </button>
            </div>

            <form id="service-form" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Service Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Web Development" required className="w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Slug</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="web-development" className="w-full font-mono text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Short Description</label>
                                <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Brief service overview..." rows={2} className="w-full resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Full Description</label>
                                <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Detailed service description..." rows={8} className="w-full resize-y" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Features (one per line)</label>
                                <textarea name="benefits" value={formData.benefits} onChange={handleChange} placeholder="Custom design&#10;Responsive layout&#10;SEO optimization" rows={6} className="w-full resize-y font-mono text-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Icon (emoji or class)</label>
                                <input type="text" name="icon" value={formData.icon} onChange={handleChange} placeholder="🌐 or icon-web" className="w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Sort Order</label>
                                <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} min="0" className="w-full" />
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="w-5 h-5 rounded" />
                                <label htmlFor="isActive" className="text-sm text-neutral-300">Active (visible on website)</label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
