"use client";

import { useState, useEffect } from "react";
import {
    Settings, User, Globe, Shield, Bell, Palette,
    Search as SearchIcon, Save, Eye, EyeOff, Check,
    LinkIcon, Mail, Phone, MapPin, Facebook, Twitter, Linkedin,
    Instagram, Youtube, ExternalLink,
} from "lucide-react";

const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "website", label: "Website", icon: Globe },
    { id: "seo", label: "SEO", icon: SearchIcon },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    /* Profile */
    const [profile, setProfile] = useState({
        firstName: "", lastName: "", email: "", phone: "", bio: "",
    });

    /* Website */
    const [website, setWebsite] = useState({
        siteName: "TakeWeb", tagline: "Enterprise Technology Solutions",
        email: "info@takeweb.in", phone: "+91 98765 43210",
        address: "Bangalore, India",
        facebook: "", twitter: "", linkedin: "https://linkedin.com/company/takeweb",
        instagram: "", youtube: "",
    });

    /* SEO */
    const [seo, setSeo] = useState({
        metaTitle: "TakeWeb — Enterprise Technology Solutions",
        metaDescription: "Building the future of enterprise technology with AI, Cloud, and Digital Transformation.",
        ogImage: "", googleAnalyticsId: "", sitemapEnabled: true,
    });

    /* Appearance */
    const [appearance, setAppearance] = useState({
        primaryColor: "#d97706", accentColor: "#f59e0b",
        logoUrl: "", faviconUrl: "",
    });

    /* Notifications */
    const [notifications, setNotifications] = useState({
        emailOnContact: true, emailOnApplication: true,
        emailDigest: false, browserNotifications: false,
    });

    /* Security */
    const [security, setSecurity] = useState({
        currentPassword: "", newPassword: "", confirmPassword: "",
    });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setProfile({ ...profile, firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "" });
        // Load saved settings from localStorage
        const savedWebsite = localStorage.getItem("admin_website_settings");
        if (savedWebsite) setWebsite(JSON.parse(savedWebsite));
        const savedSeo = localStorage.getItem("admin_seo_settings");
        if (savedSeo) setSeo(JSON.parse(savedSeo));
        const savedAppearance = localStorage.getItem("admin_appearance_settings");
        if (savedAppearance) setAppearance(JSON.parse(savedAppearance));
        const savedNotifications = localStorage.getItem("admin_notification_settings");
        if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    }, []);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            // Persist to localStorage
            localStorage.setItem("admin_website_settings", JSON.stringify(website));
            localStorage.setItem("admin_seo_settings", JSON.stringify(seo));
            localStorage.setItem("admin_appearance_settings", JSON.stringify(appearance));
            localStorage.setItem("admin_notification_settings", JSON.stringify(notifications));
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 600);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Settings</h1>
                    <p>Manage your admin panel and website configuration</p>
                </div>
                <button onClick={handleSave} className="btn-primary" disabled={saving}>
                    {saved ? <><Check size={16} /> Saved!</> : saving ? "Saving..." : <><Save size={16} /> Save Changes</>}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tab nav */}
                <div className="lg:w-52 flex-shrink-0">
                    <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`sidebar-link whitespace-nowrap ${activeTab === tab.id ? "active" : ""}`}
                            >
                                <tab.icon size={16} />
                                <span className="text-sm">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                <div className="flex-1 card animate-fade-in-up">
                    {/* PROFILE */}
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">First Name</label>
                                    <input type="text" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">Last Name</label>
                                    <input type="text" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="w-full" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                                <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Phone</label>
                                <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full" placeholder="+91 12345 67890" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Bio</label>
                                <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full" rows={3} placeholder="A short bio about you..." />
                            </div>
                        </div>
                    )}

                    {/* WEBSITE */}
                    {activeTab === "website" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white">Website Settings</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">Site Name</label>
                                    <input type="text" value={website.siteName} onChange={(e) => setWebsite({ ...website, siteName: e.target.value })} className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">Tagline</label>
                                    <input type="text" value={website.tagline} onChange={(e) => setWebsite({ ...website, tagline: e.target.value })} className="w-full" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1"><Mail size={12} className="inline mr-1" />Contact Email</label>
                                    <input type="email" value={website.email} onChange={(e) => setWebsite({ ...website, email: e.target.value })} className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1"><Phone size={12} className="inline mr-1" />Phone</label>
                                    <input type="text" value={website.phone} onChange={(e) => setWebsite({ ...website, phone: e.target.value })} className="w-full" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1"><MapPin size={12} className="inline mr-1" />Address</label>
                                <input type="text" value={website.address} onChange={(e) => setWebsite({ ...website, address: e.target.value })} className="w-full" />
                            </div>
                            <div className="border-t border-dark-700 pt-4">
                                <h3 className="text-sm font-semibold text-neutral-300 mb-3">Social Links</h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {[
                                        { key: "facebook", icon: Facebook, label: "Facebook" },
                                        { key: "twitter", icon: Twitter, label: "Twitter / X" },
                                        { key: "linkedin", icon: Linkedin, label: "LinkedIn" },
                                        { key: "instagram", icon: Instagram, label: "Instagram" },
                                        { key: "youtube", icon: Youtube, label: "YouTube" },
                                    ].map(({ key, icon: Icon, label }) => (
                                        <div key={key}>
                                            <label className="block text-sm font-medium text-neutral-400 mb-1"><Icon size={12} className="inline mr-1" />{label}</label>
                                            <input type="url" value={(website as any)[key]} onChange={(e) => setWebsite({ ...website, [key]: e.target.value })} className="w-full" placeholder={`https://${key}.com/...`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEO */}
                    {activeTab === "seo" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white">SEO Settings</h2>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Default Meta Title</label>
                                <input type="text" value={seo.metaTitle} onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })} className="w-full" />
                                <p className="text-xs text-neutral-600 mt-1">{seo.metaTitle.length}/60 chars</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Default Meta Description</label>
                                <textarea value={seo.metaDescription} onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })} className="w-full" rows={3} />
                                <p className="text-xs text-neutral-600 mt-1">{seo.metaDescription.length}/160 chars</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">OG Image URL</label>
                                <input type="url" value={seo.ogImage} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })} className="w-full" placeholder="https://yoursite.com/og-image.png" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Google Analytics ID</label>
                                <input type="text" value={seo.googleAnalyticsId} onChange={(e) => setSeo({ ...seo, googleAnalyticsId: e.target.value })} className="w-full" placeholder="G-XXXXXXXXXX" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-white">Auto-generate Sitemap</p>
                                    <p className="text-xs text-neutral-500">Automatically update sitemap.xml</p>
                                </div>
                                <button onClick={() => setSeo({ ...seo, sitemapEnabled: !seo.sitemapEnabled })} className={`toggle ${seo.sitemapEnabled ? "active" : ""}`} />
                            </div>
                        </div>
                    )}

                    {/* APPEARANCE */}
                    {activeTab === "appearance" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white">Appearance</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">Primary Color</label>
                                    <div className="flex items-center gap-3">
                                        <input type="color" value={appearance.primaryColor} onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg border border-dark-600 cursor-pointer p-0" />
                                        <input type="text" value={appearance.primaryColor} onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })} className="flex-1" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">Accent Color</label>
                                    <div className="flex items-center gap-3">
                                        <input type="color" value={appearance.accentColor} onChange={(e) => setAppearance({ ...appearance, accentColor: e.target.value })} className="w-10 h-10 rounded-lg border border-dark-600 cursor-pointer p-0" />
                                        <input type="text" value={appearance.accentColor} onChange={(e) => setAppearance({ ...appearance, accentColor: e.target.value })} className="flex-1" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Logo URL</label>
                                <input type="url" value={appearance.logoUrl} onChange={(e) => setAppearance({ ...appearance, logoUrl: e.target.value })} className="w-full" placeholder="https://yoursite.com/logo.png" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Favicon URL</label>
                                <input type="url" value={appearance.faviconUrl} onChange={(e) => setAppearance({ ...appearance, faviconUrl: e.target.value })} className="w-full" placeholder="https://yoursite.com/favicon.ico" />
                            </div>
                            <div className="card-glass">
                                <p className="text-xs text-neutral-400">Preview of selected colors:</p>
                                <div className="flex items-center gap-3 mt-3">
                                    <div className="w-16 h-16 rounded-xl" style={{ background: appearance.primaryColor }} />
                                    <div className="w-16 h-16 rounded-xl" style={{ background: appearance.accentColor }} />
                                    <div className="w-16 h-16 rounded-xl" style={{ background: `linear-gradient(135deg, ${appearance.primaryColor}, ${appearance.accentColor})` }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS */}
                    {activeTab === "notifications" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white">Notifications</h2>
                            {[
                                { key: "emailOnContact", label: "Contact Form Emails", desc: "Receive email when someone submits the contact form" },
                                { key: "emailOnApplication", label: "Job Application Emails", desc: "Receive email when someone applies for a job" },
                                { key: "emailDigest", label: "Weekly Digest", desc: "Receive a weekly summary of activity" },
                                { key: "browserNotifications", label: "Browser Notifications", desc: "Show desktop notifications for new submissions" },
                            ].map(({ key, label, desc }) => (
                                <div key={key} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-white">{label}</p>
                                        <p className="text-xs text-neutral-500">{desc}</p>
                                    </div>
                                    <button
                                        onClick={() => setNotifications({ ...notifications, [key]: !(notifications as any)[key] })}
                                        className={`toggle ${(notifications as any)[key] ? "active" : ""}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SECURITY */}
                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white">Security</h2>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Current Password</label>
                                <div className="relative">
                                    <input type={showPasswords.current ? "text" : "password"} value={security.currentPassword} onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })} className="w-full pr-10" />
                                    <button onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">New Password</label>
                                <div className="relative">
                                    <input type={showPasswords.new ? "text" : "password"} value={security.newPassword} onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })} className="w-full pr-10" />
                                    <button onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <input type={showPasswords.confirm ? "text" : "password"} value={security.confirmPassword} onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })} className="w-full pr-10" />
                                    <button onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
