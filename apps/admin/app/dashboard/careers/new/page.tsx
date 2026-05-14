"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function NewJobPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
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
            const payload = {
                title: formData.title,
                slug: formData.slug,
                department: formData.department,
                location: formData.location,
                type: formData.type,
                isRemote: formData.isRemote,
                description: formData.description,
                requirements: formData.requirements, // Keep as string
                benefits: formData.benefits.split("\n").filter(b => b.trim()), // Array
                minSalary: formData.minSalary ? parseInt(formData.minSalary) : undefined,
                maxSalary: formData.maxSalary ? parseInt(formData.maxSalary) : undefined,
                deadline: formData.deadline || undefined,
                isActive: formData.isActive,
            };

            await api.post("/api/v1/careers/admin", payload);
            showToast("Job posted successfully!", "success");
            router.push("/dashboard/careers");
        } catch (error: any) {
            showToast(error.message || "Failed to post job", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/careers" className="p-2 rounded-lg hover:bg-dark-700 text-neutral-400">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Post New Job</h1>
                        <p className="text-neutral-400 mt-1">Create a new job opening</p>
                    </div>
                </div>
                <button type="submit" form="job-form" disabled={loading} className="btn-primary disabled:opacity-50">
                    <Save size={18} /> {loading ? "Posting..." : "Post Job"}
                </button>
            </div>

            <form id="job-form" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Job Details</h2>
                        <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Job Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Senior Full-Stack Engineer" required className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Slug</label>
                                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full font-mono text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Department *</label>
                                    <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Engineering" required className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Location *</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Remote / Bangalore" required className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Type</label>
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
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Min Salary (₹ in Lakhs)</label>
                                    <input type="number" name="minSalary" value={formData.minSalary} onChange={handleChange} placeholder="25" className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Max Salary (₹ in Lakhs)</label>
                                    <input type="number" name="maxSalary" value={formData.maxSalary} onChange={handleChange} placeholder="40" className="w-full" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Application Deadline</label>
                                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="Build scalable enterprise applications using React, Node.js, and cloud technologies."
                                    required
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Requirements & Benefits</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Requirements (one per line)</label>
                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    rows={8}
                                    placeholder={"5+ years of experience with React, Node.js, or similar\nStrong understanding of microservices architecture\nExperience with cloud platforms (AWS/Azure/GCP)\nExcellent problem-solving skills"}
                                    className="w-full font-mono text-sm"
                                />
                                <p className="text-xs text-neutral-500 mt-1">Enter each requirement on a new line</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Benefits (one per line)</label>
                                <textarea
                                    name="benefits"
                                    value={formData.benefits}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder={"Competitive Salary\nHealth Insurance\nFlexible Work Hours\nRemote First\nLearning Budget"}
                                    className="w-full font-mono text-sm"
                                />
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
