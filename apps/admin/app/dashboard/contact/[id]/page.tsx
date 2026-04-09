"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Clock, CheckCircle, Archive, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

export default function ViewContactPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<ContactMessage | null>(null);

    useEffect(() => { fetchMessage(); }, [resolvedParams.id]);

    const fetchMessage = async () => {
        try {
            const data = await api.get<ContactMessage>(`/api/v1/contact/admin/${resolvedParams.id}`);
            setMessage(data);
        } catch { showToast("Failed to load message", "error"); }
        finally { setLoading(false); }
    };

    const updateStatus = async (status: string) => {
        try {
            await api.put(`/api/v1/contact/admin/${resolvedParams.id}`, { status });
            showToast("Status updated", "success");
            setMessage(prev => prev ? { ...prev, status } : null);
        } catch { showToast("Failed to update status", "error"); }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this message?")) return;
        try {
            await api.delete(`/api/v1/contact/admin/${resolvedParams.id}`);
            showToast("Message deleted", "success");
            router.push("/dashboard/contact");
        } catch { showToast("Failed to delete", "error"); }
    };

    if (loading) return <div className="space-y-6"><div className="skeleton h-12 w-64" /><div className="skeleton h-96 rounded-xl" /></div>;

    if (!message) return <div className="card text-center py-12"><p className="text-neutral-400">Message not found</p><Link href="/dashboard/contact" className="btn-primary mt-4">Back to Messages</Link></div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "NEW": return "text-blue-400 bg-blue-500/10";
            case "READ": return "text-neutral-400 bg-neutral-500/10";
            case "REPLIED": return "text-green-400 bg-green-500/10";
            case "ARCHIVED": return "text-neutral-500 bg-neutral-700/50";
            default: return "text-neutral-400 bg-neutral-500/10";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/contact" className="p-2 rounded-lg hover:bg-dark-700 text-neutral-400"><ArrowLeft size={20} /></Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{message.subject || "No Subject"}</h1>
                        <p className="text-neutral-400 mt-1">From {message.name}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleDelete} className="btn-danger"><Trash2 size={18} /> Delete</button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="card">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-white">{message.name}</h2>
                                <a href={`mailto:${message.email}`} className="text-primary-400 hover:underline">{message.email}</a>
                                {message.phone && <p className="text-neutral-400 text-sm mt-1">{message.phone}</p>}
                                {message.company && <p className="text-neutral-400 text-sm">{message.company}</p>}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(message.status)}`}>
                                {message.status}
                            </span>
                        </div>

                        <div className="border-t border-neutral-700 pt-6">
                            <h3 className="text-lg font-medium text-white mb-3">{message.subject || "Message"}</h3>
                            <div className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
                                {message.message}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-neutral-700 text-sm text-neutral-500">
                            <Clock size={16} />
                            Received {new Date(message.createdAt).toLocaleString()}
                        </div>
                    </div>

                    <div className="card mt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Reply</h3>
                        <a
                            href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || "Your inquiry")}`}
                            className="btn-primary"
                        >
                            <Mail size={18} /> Reply via Email
                        </a>
                    </div>
                </div>

                <div className="card h-fit">
                    <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                    <div className="space-y-2">
                        <button onClick={() => updateStatus("READ")} className="w-full btn-secondary justify-start">
                            <CheckCircle size={18} /> Mark as Read
                        </button>
                        <button onClick={() => updateStatus("REPLIED")} className="w-full btn-secondary justify-start">
                            <Mail size={18} /> Mark as Replied
                        </button>
                        <button onClick={() => updateStatus("ARCHIVED")} className="w-full btn-secondary justify-start">
                            <Archive size={18} /> Archive
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
