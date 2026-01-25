"use client";

import { useState } from "react";
import { Search, Eye, Mail, Phone, Trash2 } from "lucide-react";

// Mock data
const mockSubmissions = [
    {
        id: "1",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@company.com",
        phone: "+1 555-0123",
        company: "Tech Corp",
        service: "IT Consulting",
        message: "We are looking for a partner to help us with our digital transformation...",
        status: "NEW",
        createdAt: "2025-01-14 14:30",
    },
    {
        id: "2",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@startup.io",
        phone: "+1 555-0456",
        company: "StartupIO",
        service: "Software Development",
        message: "Need a custom CRM solution for our sales team. Looking for a quote...",
        status: "READ",
        createdAt: "2025-01-13 09:15",
    },
    {
        id: "3",
        firstName: "Michael",
        lastName: "Brown",
        email: "m.brown@enterprise.com",
        phone: null,
        company: "Enterprise Inc",
        service: "Cloud & DevOps",
        message: "Interested in migrating our infrastructure to AWS. Can we schedule a call?",
        status: "REPLIED",
        createdAt: "2025-01-12 16:45",
    },
    {
        id: "4",
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.d@agency.co",
        phone: "+1 555-0789",
        company: "Creative Agency",
        service: "AI & Data Analytics",
        message: "Looking for AI solutions to automate our content curation process.",
        status: "NEW",
        createdAt: "2025-01-11 11:20",
    },
];

export default function ContactPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedSubmission, setSelectedSubmission] = useState<typeof mockSubmissions[0] | null>(
        null
    );

    const filteredSubmissions = mockSubmissions.filter((sub) => {
        const matchesSearch =
            sub.firstName.toLowerCase().includes(search.toLowerCase()) ||
            sub.lastName.toLowerCase().includes(search.toLowerCase()) ||
            sub.email.toLowerCase().includes(search.toLowerCase()) ||
            sub.company?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "NEW":
                return <span className="badge-error">New</span>;
            case "READ":
                return <span className="badge-warning">Read</span>;
            case "REPLIED":
                return <span className="badge-success">Replied</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
                <p className="text-neutral-400 mt-1">Manage incoming inquiries</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search submissions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-40"
                        >
                            <option value="all">All Status</option>
                            <option value="NEW">New</option>
                            <option value="READ">Read</option>
                            <option value="REPLIED">Replied</option>
                        </select>
                    </div>

                    {/* Submissions List */}
                    <div className="space-y-3">
                        {filteredSubmissions.map((sub) => (
                            <div
                                key={sub.id}
                                onClick={() => setSelectedSubmission(sub)}
                                className={`card cursor-pointer transition-colors ${selectedSubmission?.id === sub.id
                                        ? "border-primary-500"
                                        : "hover:border-neutral-700"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white">
                                                {sub.firstName} {sub.lastName}
                                            </span>
                                            {getStatusBadge(sub.status)}
                                        </div>
                                        <p className="text-sm text-neutral-400 mb-1">{sub.company}</p>
                                        <p className="text-sm text-neutral-500 truncate">{sub.message}</p>
                                    </div>
                                    <div className="text-xs text-neutral-500 whitespace-nowrap">
                                        {sub.createdAt}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="card lg:sticky lg:top-6 h-fit">
                    {selectedSubmission ? (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        {selectedSubmission.firstName} {selectedSubmission.lastName}
                                    </h2>
                                    <p className="text-sm text-neutral-400">{selectedSubmission.company}</p>
                                </div>
                                {getStatusBadge(selectedSubmission.status)}
                            </div>

                            <div className="space-y-2 text-sm">
                                <a
                                    href={`mailto:${selectedSubmission.email}`}
                                    className="flex items-center gap-2 text-primary-400 hover:underline"
                                >
                                    <Mail size={16} />
                                    {selectedSubmission.email}
                                </a>
                                {selectedSubmission.phone && (
                                    <a
                                        href={`tel:${selectedSubmission.phone}`}
                                        className="flex items-center gap-2 text-neutral-300 hover:text-white"
                                    >
                                        <Phone size={16} />
                                        {selectedSubmission.phone}
                                    </a>
                                )}
                            </div>

                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Service Interest</p>
                                <p className="text-neutral-200">{selectedSubmission.service}</p>
                            </div>

                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Message</p>
                                <p className="text-neutral-200 whitespace-pre-wrap">
                                    {selectedSubmission.message}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-neutral-800 flex gap-2">
                                <button className="btn-primary flex-1">
                                    <Mail size={16} />
                                    Reply
                                </button>
                                <button className="btn-secondary">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-neutral-500">
                            <Eye size={32} className="mx-auto mb-2 opacity-50" />
                            <p>Select a submission to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
