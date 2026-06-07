"use client";

import { useState, useEffect } from "react";
import { Save, Users, Shield, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const base = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") : "";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" });

export default function ReviewSettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch Settings
        fetch(`${base}/api/v1/reviews/admin/settings`, { headers: headers() })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    setSettings({
                        isAnonymousEnabled: data.isAnonymousEnabled ?? true,
                        managementUserIds: data.managementUserIds || [],
                        hrUserIds: data.hrUserIds || []
                    });
                }
            });

        // Fetch Users for selection
        fetch(`${base}/api/v1/users`, { headers: headers() })
            .then(res => res.ok ? res.json() : [])
            .then(data => setAllUsers(data));
    }, []);

    const toggleUserId = (listName: "managementUserIds" | "hrUserIds", userId: string) => {
        setSettings((prev: any) => {
            const list = prev[listName] as string[];
            if (list.includes(userId)) {
                return { ...prev, [listName]: list.filter(id => id !== userId) };
            } else {
                return { ...prev, [listName]: [...list, userId] };
            }
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${base}/api/v1/reviews/admin/settings`, {
                method: "PUT",
                headers: headers(),
                body: JSON.stringify(settings)
            });
            if (!res.ok) throw new Error("Failed to save settings");
            toast.success("Review settings updated successfully");
        } catch (error) {
            toast.error("Error saving review settings");
        } finally {
            setSaving(false);
        }
    };

    if (!settings) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="max-w-5xl space-y-6 animate-fade-in">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="flex items-center gap-2"><Shield className="text-blue-500" /> Review System Settings</h1>
                    <p>Configure global anonymous review parameters and roles.</p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="btn-primary"
                >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
                    Save Settings
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                
                {/* General Policy */}
                <div className="card space-y-6">
                    <h2 className="text-lg font-bold text-white border-b border-dark-700 pb-3">General Policy</h2>
                    
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-dark-800 rounded-xl border border-dark-700">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-dark-600 bg-dark-900 text-blue-500 focus:ring-blue-500"
                            checked={settings.isAnonymousEnabled}
                            onChange={(e) => setSettings({...settings, isAnonymousEnabled: e.target.checked})}
                        />
                        <div>
                            <span className="text-white font-medium block">Enable Anonymity Mode</span>
                            <span className="text-xs text-neutral-400">If disabled, all future reviews will show the reviewer's real identity to everyone.</span>
                        </div>
                    </label>
                </div>

                {/* Management Group Assignment */}
                <div className="card space-y-4">
                    <div className="flex items-center gap-2 border-b border-dark-700 pb-3">
                        <Users className="text-purple-400" size={18} />
                        <h2 className="text-lg font-bold text-white">Management Reviewees</h2>
                    </div>
                    <p className="text-xs text-neutral-400">Select users that should appear in the "Management" section of the review workflow.</p>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {allUsers.map(user => {
                            const isSelected = settings.managementUserIds.includes(user.id);
                            return (
                                <label key={`mgmt-${user.id}`} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${isSelected ? 'bg-purple-500/10 border-purple-500/30' : 'bg-dark-800/50 border-transparent hover:bg-dark-700'}`}>
                                    <input 
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleUserId("managementUserIds", user.id)}
                                        className="rounded border-dark-600 bg-dark-900 text-purple-500"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-neutral-500">{user.email}</p>
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                </div>

                {/* HR Group Assignment */}
                <div className="card space-y-4">
                    <div className="flex items-center gap-2 border-b border-dark-700 pb-3">
                        <Users className="text-emerald-400" size={18} />
                        <h2 className="text-lg font-bold text-white">HR Representatives</h2>
                    </div>
                    <p className="text-xs text-neutral-400">Select users that should appear in the "HR Representatives" section of the review workflow.</p>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {allUsers.map(user => {
                            const isSelected = settings.hrUserIds.includes(user.id);
                            return (
                                <label key={`hr-${user.id}`} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${isSelected ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-dark-800/50 border-transparent hover:bg-dark-700'}`}>
                                    <input 
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleUserId("hrUserIds", user.id)}
                                        className="rounded border-dark-600 bg-dark-900 text-emerald-500"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-neutral-500">{user.email}</p>
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
