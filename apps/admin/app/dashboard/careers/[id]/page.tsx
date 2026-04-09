"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Users } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [applications, setApplications] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        department: "",
        location: "",
        type: "FULL_TIME",
        isRemote: false,
        description: "",
        requirements: "",
        benefits: "",
        minSalary: "",
        maxSalary: "",
        deadline: "",
        isActive: true,
    });

    useEffect(() => { fetchJob(); fetchApplications(); }, [resolvedParams.id]);

    const fetchJob = async () => {
        try {
            const data = await api.get<any>(`/api/v1/careers/admin/${resolvedParams.id}`);
            setFormData({
                title: data.title || "",
                slug: data.slug || "",
                department: data.department || "",
                location: data.location || "",
                type: data.type || "FULL_TIME",
                isRemote: data.isRemote ?? false,
                description: data.description || "",
                requirements: data.requirements || "",  // Already a string from API
                benefits: Array.isArray(data.benefits) ? data.benefits.join("\n") : "",
                minSalary: data.minSalary ? data.minSalary.toString() : "",
                maxSalary: data.maxSalary ? data.maxSalary.toString() : "",
                deadline: data.deadline ? data.deadline.split('T')[0] : "",
                isActive: data.isActive ?? true,
            });
        } catch { showToast("Failed to load job", "error"); }
        finally { setLoading(false); }
    };

    const fetchApplications = async () => {
        try {
            const data = await api.get<any[]>(`/api/v1/careers/admin/${resolvedParams.id}/applications`);
            setApplications(data || []);
        } catch { /* Applications endpoint might not exist */ }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                title: formData.title,
                slug: formData.slug,
                department: formData.department,
                location: formData.location,
                type: formData.type,
                isRemote: formData.isRemote,
                description: formData.description,
                requirements: formData.requirements, // Keep as string
                benefits: formData.benefits.split("\n").filter(b => b.trim()),
                minSalary: formData.minSalary ? parseInt(formData.minSalary) : undefined,
                maxSalary: formData.maxSalary ? parseInt(formData.maxSalary) : undefined,
                deadline: formData.deadline || undefined,
                isActive: formData.isActive,
            };

            await api.put(`/api/v1/careers/admin/${resolvedParams.id}`, payload);
            showToast("Job updated successfully!", "success");
            router.push("/dashboard/careers");
        } catch (error: any) { showToast(error.message || "Failed to update job", "error"); }
        finally { setSaving(false); }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this job posting?")) return;
        try { await api.delete(`/api/v1/careers/admin/${resolvedParams.id}`); showToast("Job deleted", "success"); router.push("/dashboard/careers"); }
        catch { showToast("Failed to delete job", "error"); }
    };

    if (loading) return <div className="space-y-6"><div className="skeleton h-12 w-64" /><div className="skeleton h-96 rounded-xl" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/careers" className="p-2 rounded-lg hover:bg-dark-700 text-neutral-400"><ArrowLeft size={20} /></Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Edit Job</h1>
                        <p className="text-neutral-400 mt-1">{formData.title}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={handleDelete} className="btn-danger"><Trash2 size={18} /> Delete</button>
                    <button type="submit" form="job-form" disabled={saving} className="btn-primary disabled:opacity-50"><Save size={18} /> {saving ? "Saving..." : "Save"}</button>
                </div>
            </div>

            {applications.length > 0 && (
                <div className="card border-primary-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="text-primary-500" size={20} />
                        <h2 className="text-lg font-semibold text-white">Applications ({applications.length})</h2>
                    </div>
                    <div className="space-y-2">
                        {applications.slice(0, 5).map((app: any) => (
                            <div key={app.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                <div>
                                    <p className="text-white font-medium">{app.name}</p>
                                    <p className="text-sm text-neutral-400">{app.email}</p>
                                </div>
                                <span className="text-xs text-neutral-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <form id="job-form" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Job Details</h2>
                        <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full" /></div>
                                <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Slug</label><input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full font-mono text-sm" /></div>
                                <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Department *</label><input type="text" name="department" value={formData.department} onChange={handleChange} required className="w-full" /></div>
                                <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Location *</label><input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full" /></div>
                                <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className="w-full">
                                        <option value="FULL_TIME">Full Time</option>
                                        <option value="PART_TIME">Part Time</option>
                                        <option value="CONTRACT">Contract</option>
                                        <option value="INTERNSHIP">Internship</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 pt-8">
                                    <input type="checkbox" id="isRemote" checked={formData.isRemote} onChange={(e) => setFormData(prev => ({ ...prev, isRemote: e.target.checked }))} className="w-5 h-5 rounded" />
                                    <label htmlFor="isRemote" className="text-sm text-neutral-300">Remote Position</label>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Min Salary (₹ in Lakhs)</label><input type="number" name="minSalary" value={formData.minSalary} onChange={handleChange} className="w-full" /></div>
                                <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Max Salary (₹ in Lakhs)</label><input type="number" name="maxSalary" value={formData.maxSalary} onChange={handleChange} className="w-full" /></div>
                            </div>

                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Application Deadline</label><input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full" /></div>

                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Description *</label><textarea name="description" value={formData.description} onChange={handleChange} rows={6} required className="w-full" /></div>
                        </div>
                    </div>
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Requirements & Benefits</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Requirements (one per line)</label>
                                <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={8} className="w-full font-mono text-sm" />
                                <p className="text-xs text-neutral-500 mt-1">Enter each requirement on a new line</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Benefits (one per line)</label>
                                <textarea name="benefits" value={formData.benefits} onChange={handleChange} rows={6} className="w-full font-mono text-sm" />
                                <p className="text-xs text-neutral-500 mt-1">Enter each benefit on a new line</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card h-fit">
                    <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="w-5 h-5 rounded" />
                        <label htmlFor="isActive" className="text-sm text-neutral-300">Active (visible on careers page)</label>
                    </div>
                </div>
            </form>
        </div>
    );
}
