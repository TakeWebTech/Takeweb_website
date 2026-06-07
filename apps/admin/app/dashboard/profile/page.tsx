"use client";

import { useState, useEffect } from "react";
import { User, Mail, Building2, Star, Calendar, Clock, MapPin, Briefcase, Shield, Phone, Edit, Save, X, Settings2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function MyProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        fetch(`${base}/api/v1/auth/profile`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(setUser)
            .catch(() => {
                const stored = localStorage.getItem("user");
                if (stored) setUser(JSON.parse(stored));
            });
    }, []);

    const togglePortalAccess = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("accessToken");
            const newStatus = !user.portalAccess;
            const res = await fetch(`${base}/api/v1/employees/${user.id}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ portalAccess: newStatus })
            });
            if (res.ok) {
                const updated = await res.json();
                setUser(updated);
                toast.success(newStatus ? "Portal access enabled" : "Portal access disabled");
            } else {
                toast.error("Failed to update portal access");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (!user) return <div className="space-y-4"><div className="skeleton h-8 w-48" /><div className="skeleton h-64 rounded-xl" /></div>;

    const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

    const fields = [
        { label: "Full Name", value: `${user.firstName} ${user.lastName}`, icon: User, color: "text-blue-400" },
        { label: "Email", value: user.email, icon: Mail, color: "text-emerald-400" },
        { label: "Role", value: user.role, icon: Shield, color: "text-amber-400" },
        { label: "Department", value: user.department || "General", icon: Building2, color: "text-purple-400" },
        { label: "Employee ID", value: user.employeeId || user.id?.slice(0, 8)?.toUpperCase() || "—", icon: Briefcase, color: "text-cyan-400" },
        { label: "Location", value: user.location || "Remote", icon: MapPin, color: "text-rose-400" },
        { label: "Phone", value: user.phone || "Not set", icon: Phone, color: "text-indigo-400" },
        { label: "Work Type", value: user.workType || "FULL_TIME", icon: Clock, color: "text-teal-400" },
        { label: "Joining Date", value: user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : "Not set", icon: Calendar, color: "text-orange-400" },
        { label: "Status", value: user.lifecycleStatus || "ACTIVE", icon: Star, color: "text-lime-400" },
    ];

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="page-header">
                <h1 className="flex items-center gap-2"><User size={22} className="text-primary-400" /> My Profile</h1>
                <p>Your personal information and details</p>
            </div>

            {/* Profile Header */}
            <div className="card bg-gradient-to-r from-dark-850 to-dark-900 border-primary-500/10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-primary-500/20">
                        {initials}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                        <p className="text-sm text-neutral-400">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">{user.role}</span>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                            {user.isDirector && <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Director</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
                {fields.map((f) => (
                    <div key={f.label} className="card flex items-center gap-3 py-4">
                        <div className={`w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center ${f.color}`}>
                            <f.icon size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] text-neutral-500">{f.label}</p>
                            <p className="text-sm font-medium text-white">{f.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Settings & Bio Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Account Settings */}
                <div className="card space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Settings2 size={18} className="text-neutral-400" />
                        <h3 className="text-sm font-semibold text-white">Account Settings</h3>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg border border-dark-700 bg-dark-800/50">
                        <div>
                            <p className="text-sm font-medium text-white">Portal Access</p>
                            <p className="text-xs text-neutral-400 mt-0.5">Enable or disable your login access to the portal</p>
                        </div>
                        <button 
                            onClick={togglePortalAccess}
                            disabled={saving}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${user.portalAccess ? 'bg-primary-500' : 'bg-dark-600'}`}
                        >
                            {saving && <span className="absolute -left-5"><Loader2 size={14} className="animate-spin text-primary-500" /></span>}
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.portalAccess ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                {/* Bio */}
                <div className="card">
                    <h3 className="text-sm font-semibold text-white mb-2">Bio</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{user.bio || "No bio added yet. Update your profile to add a short description about yourself."}</p>
                </div>
            </div>
        </div>
    );
}
