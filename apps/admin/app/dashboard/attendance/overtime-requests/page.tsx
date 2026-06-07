"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function OvertimeRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`${base}/api/v1/attendance/overtime/admin`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            } else {
                setRequests([]);
            }
        } catch (err) {
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
        try {
            const res = await fetch(`${base}/api/v1/attendance/overtime/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error(await res.text());
            toast.success(`Overtime ${status.toLowerCase()}`);
            fetchRequests();
        } catch (err: any) {
            toast.error("Failed to update overtime: " + err.message);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="page-header"><div className="skeleton h-8 w-56" /><div className="skeleton h-4 w-72 mt-2" /></div>
                <div className="skeleton h-96 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="page-header">
                <h1 className="flex items-center gap-2">
                    <Clock size={22} className="text-primary-400" /> Overtime Requests
                </h1>
                <p>Review and approve employee overtime submissions</p>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dark-700">
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Employee</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Date</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Hours</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Reason</th>
                                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Status</th>
                                <th className="text-right py-3 px-4 text-neutral-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length === 0 ? (
                                <tr><td colSpan={6} className="py-8 text-center text-neutral-500">No overtime requests found.</td></tr>
                            ) : (
                                requests.map((r) => (
                                    <tr key={r.id} className="border-b border-dark-700/50 hover:bg-dark-850 transition-colors">
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-white font-medium">{r.employee?.firstName} {r.employee?.lastName}</p>
                                            <p className="text-xs text-neutral-500">{r.employee?.email}</p>
                                        </td>
                                        <td className="py-3 px-4 text-neutral-300">
                                            {new Date(r.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-neutral-300">{r.hours}</td>
                                        <td className="py-3 px-4 text-neutral-300 max-w-[260px]">
                                            <p className="truncate">{r.reason}</p>
                                            {r.attachmentUrl && (
                                                <a href={r.attachmentUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-400 hover:underline">
                                                    View attachment
                                                </a>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : r.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => updateStatus(r.id, "APPROVED")}
                                                    disabled={r.status === "APPROVED"}
                                                    className="btn-icon disabled:opacity-30"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(r.id, "REJECTED")}
                                                    disabled={r.status === "REJECTED"}
                                                    className="btn-icon hover:text-error-400 disabled:opacity-30"
                                                    title="Reject"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
