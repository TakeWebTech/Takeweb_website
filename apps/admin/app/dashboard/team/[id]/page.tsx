"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", position: "", department: "", bio: "",
        email: "", phone: "", avatar: "", linkedin: "", twitter: "",
        sortOrder: 0, isActive: true,
    });

    useEffect(() => { fetchMember(); }, [resolvedParams.id]);

    const fetchMember = async () => {
        try {
            const data = await api.get<any>(`/api/v1/team/admin/${resolvedParams.id}`);
            setFormData({
                firstName: data.firstName || "", lastName: data.lastName || "",
                position: data.position || "", department: data.department || "",
                bio: data.bio || "", email: data.email || "", phone: data.phone || "",
                avatar: data.avatar || "", linkedin: data.linkedin || "", twitter: data.twitter || "",
                sortOrder: data.sortOrder || 0, isActive: data.isActive ?? true,
            });
        } catch { showToast("Failed to load member", "error"); }
        finally { setLoading(false); }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "number" ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true);
        try {
            await api.put(`/api/v1/team/admin/${resolvedParams.id}`, formData);
            showToast("Member updated!", "success");
            router.push("/dashboard/team");
        } catch (error: any) { showToast(error.message || "Failed to update", "error"); }
        finally { setSaving(false); }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this team member?")) return;
        try { await api.delete(`/api/v1/team/admin/${resolvedParams.id}`); showToast("Deleted", "success"); router.push("/dashboard/team"); }
        catch (error: any) { showToast("Failed to delete", "error"); }
    };

    if (loading) return <div className="space-y-6"><div className="skeleton h-12 w-64" /><div className="skeleton h-96 rounded-xl" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/team" className="p-2 rounded-lg hover:bg-dark-700 text-neutral-400"><ArrowLeft size={20} /></Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Edit Team Member</h1>
                        <p className="text-neutral-400 mt-1">{formData.firstName} {formData.lastName}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={handleDelete} className="btn-danger"><Trash2 size={18} /> Delete</button>
                    <button type="submit" form="team-form" disabled={saving} className="btn-primary disabled:opacity-50"><Save size={18} /> {saving ? "Saving..." : "Save"}</button>
                </div>
            </div>

            <form id="team-form" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Personal Info</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full" /></div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full" /></div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Position</label><input type="text" name="position" value={formData.position} onChange={handleChange} required className="w-full" /></div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Department</label><input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full" /></div>
                        </div>
                        <div className="mt-4"><label className="block text-sm font-medium text-neutral-300 mb-1.5">Bio</label><textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full" /></div>
                    </div>
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Contact & Social</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full" /></div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full" /></div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">LinkedIn</label><input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full" /></div>
                            <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Twitter</label><input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className="w-full" /></div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-4">Avatar</h2>
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Avatar URL</label><input type="url" name="avatar" value={formData.avatar} onChange={handleChange} className="w-full" /></div>
                        {formData.avatar && <div className="w-24 h-24 rounded-full overflow-hidden bg-dark-700 mx-auto"><img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" /></div>}
                        <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Sort Order</label><input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} className="w-full" /></div>
                        <div className="flex items-center gap-3"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="w-5 h-5 rounded" /><label htmlFor="isActive" className="text-sm text-neutral-300">Active</label></div>
                    </div>
                </div>
            </form>
        </div>
    );
}
