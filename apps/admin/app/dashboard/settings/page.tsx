"use client";

import { useState } from "react";
import { Save, User, Globe, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "site", label: "Site Settings", icon: Globe },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-neutral-400 mt-1">Manage your account and site settings</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Tabs */}
                <nav className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full sidebar-link ${activeTab === tab.id ? "active" : ""}`}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className="lg:col-span-3">
                    {activeTab === "profile" && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-white mb-6">Profile Settings</h2>
                            <form className="space-y-4 max-w-lg">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center text-2xl font-bold text-primary-400">
                                        JD
                                    </div>
                                    <button type="button" className="btn-secondary">
                                        Change Avatar
                                    </button>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                            First Name
                                        </label>
                                        <input type="text" defaultValue="John" className="w-full" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                            Last Name
                                        </label>
                                        <input type="text" defaultValue="Doe" className="w-full" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="admin@takeweb.in"
                                        className="w-full"
                                    />
                                </div>

                                <button type="submit" className="btn-primary">
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === "site" && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-white mb-6">Site Settings</h2>
                            <form className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                        Site Title
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="TakeWeb | Enterprise IT Solutions"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                        Site Description
                                    </label>
                                    <textarea
                                        defaultValue="Enterprise IT consulting and software development company..."
                                        rows={3}
                                        className="w-full resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="hello@takeweb.in"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                        Contact Phone
                                    </label>
                                    <input
                                        type="tel"
                                        defaultValue="+91 98765 43210"
                                        className="w-full"
                                    />
                                </div>

                                <button type="submit" className="btn-primary">
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === "notifications" && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-white mb-6">Notifications</h2>
                            <div className="space-y-4 max-w-lg">
                                {[
                                    { label: "New contact form submissions", checked: true },
                                    { label: "New blog post comments", checked: true },
                                    { label: "Weekly analytics report", checked: false },
                                    { label: "New job applications", checked: true },
                                    { label: "System alerts and updates", checked: true },
                                ].map((item, index) => (
                                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            defaultChecked={item.checked}
                                            className="w-4 h-4 rounded border-neutral-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
                                        />
                                        <span className="text-neutral-200">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-white mb-6">Security</h2>
                            <form className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                        Current Password
                                    </label>
                                    <input type="password" className="w-full" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                        New Password
                                    </label>
                                    <input type="password" className="w-full" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                        Confirm New Password
                                    </label>
                                    <input type="password" className="w-full" />
                                </div>

                                <button type="submit" className="btn-primary">
                                    <Save size={18} />
                                    Update Password
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
