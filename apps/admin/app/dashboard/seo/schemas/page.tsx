"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft, Plus, Search, Code2, Trash2, Edit, Copy,
    CheckCircle2, FileJson, Braces, Building2, FileText,
    Briefcase, HelpCircle, MapPin, Star, Users,
} from "lucide-react";

interface SchemaTemplate {
    id: string;
    name: string;
    type: string;
    schema: any;
    isDefault: boolean;
    description: string | null;
    createdAt: string;
}

const SCHEMA_TYPES = [
    { value: "Article", label: "Article", icon: FileText },
    { value: "BlogPosting", label: "Blog Post", icon: FileText },
    { value: "FAQPage", label: "FAQ Page", icon: HelpCircle },
    { value: "LocalBusiness", label: "Local Business", icon: Building2 },
    { value: "Organization", label: "Organization", icon: Users },
    { value: "Service", label: "Service", icon: Briefcase },
    { value: "Product", label: "Product", icon: Star },
    { value: "JobPosting", label: "Job Posting", icon: Briefcase },
    { value: "Event", label: "Event", icon: MapPin },
    { value: "BreadcrumbList", label: "Breadcrumb List", icon: Code2 },
    { value: "WebSite", label: "Website", icon: Code2 },
    { value: "Person", label: "Person", icon: Users },
    { value: "HowTo", label: "How To", icon: FileText },
    { value: "Recipe", label: "Recipe", icon: FileText },
    { value: "Video", label: "Video", icon: FileJson },
    { value: "Course", label: "Course", icon: FileText },
    { value: "Review", label: "Review", icon: Star },
    { value: "SoftwareApplication", label: "Software App", icon: Code2 },
];

const DEFAULT_SCHEMAS: Record<string, any> = {
    Article: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "{{title}}",
        description: "{{description}}",
        image: "{{image}}",
        datePublished: "{{publishedDate}}",
        dateModified: "{{modifiedDate}}",
        author: {
            "@type": "Person",
            name: "{{authorName}}",
        },
        publisher: {
            "@type": "Organization",
            name: "TakeWeb",
            logo: {
                "@type": "ImageObject",
                url: "{{logoUrl}}",
            },
        },
    },
    FAQPage: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "{{question1}}",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "{{answer1}}",
                },
            },
        ],
    },
    LocalBusiness: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "TakeWeb",
        description: "{{description}}",
        url: "{{url}}",
        telephone: "{{phone}}",
        email: "{{email}}",
        address: {
            "@type": "PostalAddress",
            streetAddress: "{{street}}",
            addressLocality: "{{city}}",
            addressRegion: "{{state}}",
            postalCode: "{{zip}}",
            addressCountry: "{{country}}",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: "{{latitude}}",
            longitude: "{{longitude}}",
        },
        openingHoursSpecification: [],
    },
    Service: {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "{{serviceName}}",
        description: "{{description}}",
        provider: {
            "@type": "Organization",
            name: "TakeWeb",
        },
        areaServed: "{{area}}",
        serviceType: "{{type}}",
    },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function SchemasPage() {
    const [templates, setTemplates] = useState<SchemaTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<SchemaTemplate | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        type: "Article",
        schema: "",
        description: "",
        isDefault: false,
    });
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => { fetchTemplates(); }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_URL}/api/v1/seo/schemas?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setTemplates(data.items || []);
            }
        } catch (e) {
            console.error("Failed:", e);
        } finally {
            setLoading(false);
        }
    };

    const saveTemplate = async () => {
        try {
            let schema;
            try {
                schema = JSON.parse(formData.schema);
            } catch {
                alert("Invalid JSON schema");
                return;
            }

            const token = localStorage.getItem("accessToken");
            const url = editingTemplate
                ? `${API_URL}/api/v1/seo/schemas/${editingTemplate.id}`
                : `${API_URL}/api/v1/seo/schemas`;

            const res = await fetch(url, {
                method: editingTemplate ? "PUT" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    schema,
                }),
            });

            if (res.ok) {
                setShowModal(false);
                setEditingTemplate(null);
                resetForm();
                fetchTemplates();
            }
        } catch (e) {
            console.error("Save failed:", e);
        }
    };

    const deleteTemplate = async (id: string) => {
        if (!confirm("Delete this schema template?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(`${API_URL}/api/v1/seo/schemas/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTemplates();
        } catch (e) {
            console.error("Delete failed:", e);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            type: "Article",
            schema: "",
            description: "",
            isDefault: false,
        });
    };

    const openEditModal = (template: SchemaTemplate) => {
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            type: template.type,
            schema: JSON.stringify(template.schema, null, 2),
            description: template.description || "",
            isDefault: template.isDefault,
        });
        setShowModal(true);
    };

    const openNewModal = (presetType?: string) => {
        setEditingTemplate(null);
        const type = presetType || "Article";
        setFormData({
            name: "",
            type,
            schema: JSON.stringify(DEFAULT_SCHEMAS[type] || { "@context": "https://schema.org", "@type": type }, null, 2),
            description: "",
            isDefault: false,
        });
        setShowModal(true);
    };

    const handleTypeChange = (type: string) => {
        setFormData({
            ...formData,
            type,
            schema: JSON.stringify(DEFAULT_SCHEMAS[type] || { "@context": "https://schema.org", "@type": type }, null, 2),
        });
    };

    const copySchema = async (template: SchemaTemplate) => {
        await navigator.clipboard.writeText(JSON.stringify(template.schema, null, 2));
        setCopied(template.id);
        setTimeout(() => setCopied(null), 2000);
    };

    const filtered = templates.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.type.toLowerCase().includes(search.toLowerCase())
    );

    const getTypeIcon = (type: string) => {
        const found = SCHEMA_TYPES.find(t => t.value === type);
        return found ? found.icon : Code2;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-8 w-48" />
                <div className="skeleton h-96 rounded-xl" />
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
                    <h1>Schema Markup</h1>
                    <p>Create rich snippets and structured data for better search results</p>
                </div>
                <button onClick={() => openNewModal()} className="btn-primary">
                    <Plus size={16} />
                    New Template
                </button>
            </div>

            {/* Quick Create */}
            <div className="card-container p-6">
                <h3 className="font-semibold mb-4">Quick Create Schema</h3>
                <div className="flex flex-wrap gap-2">
                    {SCHEMA_TYPES.slice(0, 8).map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.value}
                                onClick={() => openNewModal(type.value)}
                                className="btn btn-outline btn-sm gap-2"
                            >
                                <Icon size={14} />
                                {type.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search templates..."
                    className="input input-bordered w-full pl-10"
                />
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.length === 0 ? (
                    <div className="col-span-full card-container p-12 text-center">
                        <Code2 className="mx-auto text-neutral-400 mb-2" size={32} />
                        <p className="text-neutral-500">
                            {templates.length === 0
                                ? "No schema templates yet. Create your first one!"
                                : "No matching templates found"}
                        </p>
                    </div>
                ) : (
                    filtered.map((template) => {
                        const Icon = getTypeIcon(template.type);
                        return (
                            <div key={template.id} className="card-container p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Icon className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{template.name}</h3>
                                            <span className="badge badge-outline badge-sm">{template.type}</span>
                                        </div>
                                    </div>
                                    {template.isDefault && (
                                        <span className="badge badge-primary badge-sm">Default</span>
                                    )}
                                </div>

                                {template.description && (
                                    <p className="text-sm text-neutral-500 mb-3 line-clamp-2">
                                        {template.description}
                                    </p>
                                )}

                                <div className="bg-base-200 rounded-lg p-3 mb-3 max-h-32 overflow-hidden relative">
                                    <pre className="text-xs font-mono overflow-hidden">
                                        {JSON.stringify(template.schema, null, 2).slice(0, 300)}...
                                    </pre>
                                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-base-200 to-transparent" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => copySchema(template)}
                                        className="btn btn-ghost btn-sm flex-1"
                                    >
                                        {copied === template.id ? (
                                            <><CheckCircle2 size={14} /> Copied!</>
                                        ) : (
                                            <><Copy size={14} /> Copy</>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => openEditModal(template)}
                                        className="btn btn-ghost btn-sm btn-square"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        onClick={() => deleteTemplate(template.id)}
                                        className="btn btn-ghost btn-sm btn-square text-error"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-lg mb-4">
                            {editingTemplate ? "Edit Schema Template" : "Create Schema Template"}
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Template Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        placeholder="e.g., Blog Article Schema"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text">Schema Type</span>
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => handleTypeChange(e.target.value)}
                                        className="select select-bordered w-full"
                                    >
                                        {SCHEMA_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Describe when to use this template"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">JSON-LD Schema</span>
                                </label>
                                <textarea
                                    value={formData.schema}
                                    onChange={(e) =>
                                        setFormData({ ...formData, schema: e.target.value })
                                    }
                                    className="textarea textarea-bordered w-full font-mono text-sm"
                                    rows={15}
                                    placeholder='{"@context": "https://schema.org", "@type": "Article"}'
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    Use {`{{variableName}}`} for dynamic placeholders
                                </p>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.isDefault}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isDefault: e.target.checked })
                                        }
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="label-text">Set as default for this type</span>
                                </label>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingTemplate(null);
                                }}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button onClick={saveTemplate} className="btn btn-primary">
                                {editingTemplate ? "Save Changes" : "Create Template"}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowModal(false)} />
                </div>
            )}
        </div>
    );
}
