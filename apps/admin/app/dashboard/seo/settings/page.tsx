"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft, Settings, Save, Globe, Share2, Search,
    Code2, MapPin, BarChart3, Bot, Shield, FileText,
    Twitter, Facebook, Instagram, Linkedin, Youtube,
} from "lucide-react";

interface SeoSettings {
    id: string;
    siteTitle: string;
    titleSeparator: string;
    metaDescription: string;
    socialImage: string | null;
    twitterHandle: string | null;
    facebookPage: string | null;
    linkedinPage: string | null;
    instagramHandle: string | null;
    youtubeChannel: string | null;
    pinterestProfile: string | null;
    googleVerification: string | null;
    bingVerification: string | null;
    yandexVerification: string | null;
    pinterestVerification: string | null;
    googleAnalyticsId: string | null;
    googleTagManagerId: string | null;
    facebookPixelId: string | null;
    localBusinessName: string | null;
    localBusinessType: string | null;
    localStreetAddress: string | null;
    localCity: string | null;
    localState: string | null;
    localPostalCode: string | null;
    localCountry: string | null;
    localPhone: string | null;
    localEmail: string | null;
    localLatitude: number | null;
    localLongitude: number | null;
    localOpeningHours: any;
    robotsDefault: string;
    robotsNoindex: string[];
    robotsNofollow: string[];
    enableBreadcrumbs: boolean;
    breadcrumbSeparator: string;
    enableOpenGraph: boolean;
    enableTwitterCards: boolean;
    twitterCardType: string;
}

const TITLE_SEPARATORS = [
    { value: "|", label: "| (Pipe)" },
    { value: "-", label: "- (Dash)" },
    { value: "–", label: "– (En Dash)" },
    { value: "—", label: "— (Em Dash)" },
    { value: "»", label: "» (Double Arrow)" },
    { value: "›", label: "› (Single Arrow)" },
    { value: "•", label: "• (Bullet)" },
];

const TWITTER_CARD_TYPES = [
    { value: "summary", label: "Summary" },
    { value: "summary_large_image", label: "Summary with Large Image" },
];

const BUSINESS_TYPES = [
    "LocalBusiness",
    "Restaurant",
    "Store",
    "ProfessionalService",
    "FinancialService",
    "HealthAndBeautyBusiness",
    "HomeAndConstructionBusiness",
    "EntertainmentBusiness",
    "FoodEstablishment",
    "GovernmentOffice",
    "LodgingBusiness",
    "MedicalBusiness",
    "SportsActivityLocation",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function SeoSettingsPage() {
    const [settings, setSettings] = useState<SeoSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_URL}/api/v1/seo/settings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setSettings(await res.json());
            }
        } catch (e) {
            console.error("Failed:", e);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_URL}/api/v1/seo/settings`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                const updated = await res.json();
                setSettings(updated);
            }
        } catch (e) {
            console.error("Save failed:", e);
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: string, value: any) => {
        if (!settings) return;
        setSettings({ ...settings, [field]: value });
    };

    const tabs = [
        { id: "general", label: "General", icon: Settings },
        { id: "social", label: "Social Profiles", icon: Share2 },
        { id: "webmaster", label: "Webmaster Tools", icon: Search },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "local", label: "Local SEO", icon: MapPin },
        { id: "robots", label: "Robots & Indexing", icon: Bot },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-8 w-48" />
                <div className="skeleton h-96 rounded-xl" />
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="p-12 text-center">
                <p>Failed to load settings</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/seo" className="btn-ghost btn-sm">
                    <ArrowLeft size={16} />
                </Link>
                <div className="page-header flex-1">
                    <h1>SEO Settings</h1>
                    <p>Configure global SEO settings for your website</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="btn-primary"
                >
                    {saving ? (
                        <><span className="loading loading-spinner loading-sm" /> Saving...</>
                    ) : (
                        <><Save size={16} /> Save Settings</>
                    )}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tabs */}
                <div className="lg:w-56 flex-shrink-0">
                    <div className="card-container p-2 lg:sticky lg:top-4">
                        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap transition-colors ${
                                            activeTab === tab.id
                                                ? "bg-primary text-primary-content"
                                                : "hover:bg-base-200"
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 card-container p-6">
                    {/* General Tab */}
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Globe size={20} />
                                General Settings
                            </h2>

                            <div>
                                <label className="label">
                                    <span className="label-text">Site Title</span>
                                </label>
                                <input
                                    type="text"
                                    value={settings.siteTitle}
                                    onChange={(e) => updateField("siteTitle", e.target.value)}
                                    placeholder="Your Site Name"
                                    className="input input-bordered w-full"
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    Used as the default title suffix for all pages
                                </p>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Title Separator</span>
                                </label>
                                <select
                                    value={settings.titleSeparator}
                                    onChange={(e) => updateField("titleSeparator", e.target.value)}
                                    className="select select-bordered w-full max-w-xs"
                                >
                                    {TITLE_SEPARATORS.map((sep) => (
                                        <option key={sep.value} value={sep.value}>
                                            {sep.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-neutral-500 mt-1">
                                    Preview: Page Title {settings.titleSeparator} {settings.siteTitle}
                                </p>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Default Meta Description</span>
                                </label>
                                <textarea
                                    value={settings.metaDescription}
                                    onChange={(e) => updateField("metaDescription", e.target.value)}
                                    placeholder="Enter your default meta description"
                                    className="textarea textarea-bordered w-full"
                                    rows={3}
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    {settings.metaDescription.length}/160 characters
                                </p>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Default Social Image URL</span>
                                </label>
                                <input
                                    type="text"
                                    value={settings.socialImage || ""}
                                    onChange={(e) => updateField("socialImage", e.target.value)}
                                    placeholder="https://..."
                                    className="input input-bordered w-full"
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    Used when no specific OG image is set. Recommended: 1200×630px
                                </p>
                            </div>

                            <div className="divider" />

                            <h3 className="font-semibold">Breadcrumbs</h3>
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={settings.enableBreadcrumbs}
                                        onChange={(e) => updateField("enableBreadcrumbs", e.target.checked)}
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="label-text">Enable Breadcrumbs Schema</span>
                                </label>
                            </div>
                            {settings.enableBreadcrumbs && (
                                <div>
                                    <label className="label">
                                        <span className="label-text">Breadcrumb Separator</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.breadcrumbSeparator}
                                        onChange={(e) => updateField("breadcrumbSeparator", e.target.value)}
                                        placeholder="»"
                                        className="input input-bordered w-32"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Social Tab */}
                    {activeTab === "social" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Share2 size={20} />
                                Social Profiles
                            </h2>
                            <p className="text-neutral-500">
                                Add your social media profiles for schema markup and social meta tags.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text flex items-center gap-2">
                                            <Twitter size={16} /> Twitter Handle
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.twitterHandle || ""}
                                        onChange={(e) => updateField("twitterHandle", e.target.value)}
                                        placeholder="@yourhandle"
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text flex items-center gap-2">
                                            <Facebook size={16} /> Facebook Page
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.facebookPage || ""}
                                        onChange={(e) => updateField("facebookPage", e.target.value)}
                                        placeholder="https://facebook.com/..."
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text flex items-center gap-2">
                                            <Instagram size={16} /> Instagram Handle
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.instagramHandle || ""}
                                        onChange={(e) => updateField("instagramHandle", e.target.value)}
                                        placeholder="@yourhandle"
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text flex items-center gap-2">
                                            <Linkedin size={16} /> LinkedIn Page
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.linkedinPage || ""}
                                        onChange={(e) => updateField("linkedinPage", e.target.value)}
                                        placeholder="https://linkedin.com/company/..."
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text flex items-center gap-2">
                                            <Youtube size={16} /> YouTube Channel
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.youtubeChannel || ""}
                                        onChange={(e) => updateField("youtubeChannel", e.target.value)}
                                        placeholder="https://youtube.com/..."
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            </div>

                            <div className="divider" />

                            <h3 className="font-semibold">Open Graph & Twitter Cards</h3>
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={settings.enableOpenGraph}
                                            onChange={(e) => updateField("enableOpenGraph", e.target.checked)}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text">Enable Open Graph Meta Tags</span>
                                    </label>
                                </div>

                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={settings.enableTwitterCards}
                                            onChange={(e) => updateField("enableTwitterCards", e.target.checked)}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text">Enable Twitter Cards</span>
                                    </label>
                                </div>

                                {settings.enableTwitterCards && (
                                    <div>
                                        <label className="label">
                                            <span className="label-text">Twitter Card Type</span>
                                        </label>
                                        <select
                                            value={settings.twitterCardType}
                                            onChange={(e) => updateField("twitterCardType", e.target.value)}
                                            className="select select-bordered w-full max-w-xs"
                                        >
                                            {TWITTER_CARD_TYPES.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Webmaster Tab */}
                    {activeTab === "webmaster" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Search size={20} />
                                Webmaster Verification
                            </h2>
                            <p className="text-neutral-500">
                                Enter verification codes from search engines to verify site ownership.
                            </p>

                            <div>
                                <label className="label">
                                    <span className="label-text">Google Search Console</span>
                                </label>
                                <input
                                    type="text"
                                    value={settings.googleVerification || ""}
                                    onChange={(e) => updateField("googleVerification", e.target.value)}
                                    placeholder="Verification code or full meta tag"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Bing Webmaster Tools</span>
                                </label>
                                <input
                                    type="text"
                                    value={settings.bingVerification || ""}
                                    onChange={(e) => updateField("bingVerification", e.target.value)}
                                    placeholder="Verification code"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Yandex Webmaster</span>
                                </label>
                                <input
                                    type="text"
                                    value={settings.yandexVerification || ""}
                                    onChange={(e) => updateField("yandexVerification", e.target.value)}
                                    placeholder="Verification code"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Pinterest</span>
                                </label>
                                <input
                                    type="text"
                                    value={settings.pinterestVerification || ""}
                                    onChange={(e) => updateField("pinterestVerification", e.target.value)}
                                    placeholder="Verification code"
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === "analytics" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <BarChart3 size={20} />
                                Analytics & Tracking
                            </h2>
                            <p className="text-neutral-500">
                                Add tracking codes for analytics platforms.
                            </p>

                            <div>
                                <label className="label">
                                    <span className="label-text">Google Analytics ID</span>
                                </label>
                                <input
                                    type="text"
                                    value={settings.googleAnalyticsId || ""}
                                    onChange={(e) => updateField("googleAnalyticsId", e.target.value)}
                                    placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Google Tag Manager ID</span>
                                </label>
                                <input
                                    type="text"
                                    value={settings.googleTagManagerId || ""}
                                    onChange={(e) => updateField("googleTagManagerId", e.target.value)}
                                    placeholder="GTM-XXXXXXX"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Facebook Pixel ID</span>
                                </label>
                                <input
                                    type="text"
                                    value={settings.facebookPixelId || ""}
                                    onChange={(e) => updateField("facebookPixelId", e.target.value)}
                                    placeholder="XXXXXXXXXXXXXXXXX"
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* Local SEO Tab */}
                    {activeTab === "local" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <MapPin size={20} />
                                Local Business SEO
                            </h2>
                            <p className="text-neutral-500">
                                Add local business information for location-based schema markup.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Business Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.localBusinessName || ""}
                                        onChange={(e) => updateField("localBusinessName", e.target.value)}
                                        placeholder="Your Business Name"
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">Business Type</span>
                                    </label>
                                    <select
                                        value={settings.localBusinessType || ""}
                                        onChange={(e) => updateField("localBusinessType", e.target.value)}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Select type</option>
                                        {BUSINESS_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Street Address</span>
                                </label>
                                <input
                                    type="text"
                                    value={settings.localStreetAddress || ""}
                                    onChange={(e) => updateField("localStreetAddress", e.target.value)}
                                    placeholder="123 Main Street"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">City</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.localCity || ""}
                                        onChange={(e) => updateField("localCity", e.target.value)}
                                        placeholder="City"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text">State</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.localState || ""}
                                        onChange={(e) => updateField("localState", e.target.value)}
                                        placeholder="State"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text">Postal Code</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.localPostalCode || ""}
                                        onChange={(e) => updateField("localPostalCode", e.target.value)}
                                        placeholder="12345"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text">Country</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.localCountry || ""}
                                        onChange={(e) => updateField("localCountry", e.target.value)}
                                        placeholder="IN"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Phone Number</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.localPhone || ""}
                                        onChange={(e) => updateField("localPhone", e.target.value)}
                                        placeholder="+91 XXXXX XXXXX"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.localEmail || ""}
                                        onChange={(e) => updateField("localEmail", e.target.value)}
                                        placeholder="contact@example.com"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Latitude</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={settings.localLatitude || ""}
                                        onChange={(e) => updateField("localLatitude", parseFloat(e.target.value) || null)}
                                        placeholder="28.6139"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text">Longitude</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={settings.localLongitude || ""}
                                        onChange={(e) => updateField("localLongitude", parseFloat(e.target.value) || null)}
                                        placeholder="77.2090"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Robots Tab */}
                    {activeTab === "robots" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Bot size={20} />
                                Robots & Indexing
                            </h2>
                            <p className="text-neutral-500">
                                Control how search engines crawl and index your site.
                            </p>

                            <div>
                                <label className="label">
                                    <span className="label-text">Default Robots Meta</span>
                                </label>
                                <select
                                    value={settings.robotsDefault}
                                    onChange={(e) => updateField("robotsDefault", e.target.value)}
                                    className="select select-bordered w-full max-w-xs"
                                >
                                    <option value="index,follow">Index, Follow (Recommended)</option>
                                    <option value="index,nofollow">Index, No Follow</option>
                                    <option value="noindex,follow">No Index, Follow</option>
                                    <option value="noindex,nofollow">No Index, No Follow</option>
                                </select>
                            </div>

                            <div className="alert alert-info">
                                <Shield size={16} />
                                <div>
                                    <p className="font-medium">Robots.txt</p>
                                    <p className="text-sm">
                                        Your robots.txt file is automatically generated at /robots.txt
                                    </p>
                                </div>
                            </div>

                            <div className="alert alert-warning">
                                <FileText size={16} />
                                <div>
                                    <p className="font-medium">Sitemap Location</p>
                                    <p className="text-sm">
                                        Your sitemap is available at /sitemap.xml and is automatically
                                        referenced in robots.txt
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
