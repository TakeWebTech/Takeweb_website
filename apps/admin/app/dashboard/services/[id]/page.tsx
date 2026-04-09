"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        shortDescription: "",
        description: "",
        icon: "",
        features: "",
        sortOrder: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchService();
    }, [resolvedParams.id]);

    const fetchService = async () => {
        try {
            const data = await api.get<any>(`/api/v1/services/admin/${resolvedParams.id}`);
            setFormData({
                title: data.title || "",
                slug: data.slug || "",
                shortDescription: data.shortDescription || "",
                description: data.description || "",
                icon: data.icon || "",
                features: Array.isArray(data.features) ? data.features.join("\n") : "",
                sortOrder: data.sortOrder || 0,
                isActive: data.isActive ?? true,
            });
        } catch (error: any) {
            showToast("Failed to load service", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...formData,
                features: formData.features.split("\n").filter(f => f.trim()),
            };
            await api.put(`/api/v1/services/admin/${resolvedParams.id}`, payload);
            showToast("Service updated successfully!", "success");
            router.push("/dashboard/services");
        } catch (error: any) {
            showToast(error.message || "Failed to update service", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this service?")) return;
        try {
            await api.delete(`/api/v1/services/admin/${resolvedParams.id}`);
            showToast("Service deleted", "success");
            router.push("/dashboard/services");
        } catch (error: any) {
            showToast(error.message || "Failed to delete", "error");
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-12 w-64" />
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2"><div className="skeleton h-96 rounded-xl" /></div>
                    <div><div className="skeleton h-48 rounded-xl" /></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/services" className="p-2 rounded-lg hover:bg-dark-700 text-neutral-400">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Edit Service</h1>
                        <p className="text-neutral-400 mt-1">{formData.title}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={handleDelete} className="btn-danger"><Trash2 size={18} /> Delete</button>
                    <button type="submit" form="service-form" disabled={saving} className="btn-primary disabled:opacity-50">
                        <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <form id="service-form" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Service Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Slug</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full font-mono text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Short Description</label>
                                <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className="w-full resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Full Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={8} className="w-full resize-y" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Features (one per line)</label>
                                <textarea name="features" value={formData.features} onChange={handleChange} rows={6} className="w-full resize-y font-mono text-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Icon</label>
                                <input type="text" name="icon" value={formData.icon} onChange={handleChange} className="w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Sort Order</label>
                                <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} min="0" className="w-full" />
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="w-5 h-5 rounded" />
                                <label htmlFor="isActive" className="text-sm text-neutral-300">Active</label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
