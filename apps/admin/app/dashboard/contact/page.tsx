"use client";

import { useEffect, useState } from "react";
import {
    Calendar,
    Eye,
    Mail,
    MessageSquare,
    Search,
    Trash2,
    User,
    X,
} from "lucide-react";

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    service?: string;
    message: string;
    status?: string;
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ContactPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Contact | null>(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

    const fetchContacts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/contact/admin`, { headers: authHeaders() });
            if (res.ok) {
                const data = await res.json();
                setContacts(Array.isArray(data) ? data : data.submissions || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const deleteContact = async (id: string) => {
        if (!confirm("Delete this message?")) return;
        try {
            await fetch(`${API_URL}/api/v1/contact/admin/${id}`, {
                method: "DELETE",
                headers: authHeaders(),
            });
            if (selected?.id === id) setSelected(null);
            fetchContacts();
        } catch (e) {
            console.error(e);
        }
    };

    const filtered = contacts.filter((contact) =>
        `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.service || ""} ${contact.message}`
            .toLowerCase()
            .includes(search.toLowerCase()),
    );

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="page-header">
                    <h1>Contact Messages</h1>
                    <p>View and manage form submissions from your website</p>
                </div>
                <span className="badge badge-info">{contacts.length} Total</span>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input
                    type="text"
                    placeholder="Search messages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 text-sm"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state card">
                    <MessageSquare size={40} className="empty-state-icon" />
                    <p className="text-neutral-400 mb-2">No messages found</p>
                    <p className="text-sm text-neutral-600">Contact submissions will appear here</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Sender</th>
                                <th className="hidden md:table-cell">Service</th>
                                <th className="hidden lg:table-cell">Message</th>
                                <th className="hidden sm:table-cell">Date</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((contact) => (
                                <tr key={contact.id} className="cursor-pointer" onClick={() => setSelected(contact)}>
                                    <td>
                                        <div>
                                            <span className="font-medium text-white flex items-center gap-1.5">
                                                <User size={12} /> {contact.firstName} {contact.lastName}
                                            </span>
                                            <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                                                <Mail size={10} /> {contact.email}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell">
                                        <span className="text-neutral-400 text-sm">{contact.service || "-"}</span>
                                    </td>
                                    <td className="hidden lg:table-cell">
                                        <span className="text-neutral-500 text-sm line-clamp-1 max-w-[200px] block">
                                            {contact.message}
                                        </span>
                                    </td>
                                    <td className="hidden sm:table-cell">
                                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(contact.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setSelected(contact)} className="btn-icon">
                                                <Eye size={14} />
                                            </button>
                                            <button onClick={() => deleteContact(contact.id)} className="btn-icon hover:text-error-400">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selected && (
                <div className="modal-backdrop" onClick={() => setSelected(null)}>
                    <div className="modal max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Message Details</h3>
                            <button onClick={() => setSelected(null)} className="btn-icon">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                    {selected.firstName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-white">
                                        {selected.firstName} {selected.lastName}
                                    </p>
                                    <p className="text-xs text-neutral-500">{selected.email}</p>
                                </div>
                            </div>
                            {selected.phone && <p className="text-sm text-neutral-400">{selected.phone}</p>}
                            {selected.company && <p className="text-sm text-neutral-400">{selected.company}</p>}
                            {selected.service && (
                                <div>
                                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Service</label>
                                    <p className="text-neutral-200 mt-1">{selected.service}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Message</label>
                                <p className="text-neutral-300 mt-1 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                            </div>
                            <div className="text-xs text-neutral-600 flex items-center gap-1">
                                <Calendar size={12} /> Sent {new Date(selected.createdAt).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <a href={`mailto:${selected.email}`} className="btn-primary flex-1 justify-center">
                                    <Mail size={14} /> Reply via Email
                                </a>
                                <button onClick={() => deleteContact(selected.id)} className="btn-danger">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
