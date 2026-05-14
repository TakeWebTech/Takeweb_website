"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Save, Loader2 } from "lucide-react";

export default function NewEmployeePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        email: "", password: "", firstName: "", lastName: "",
        employeeId: "", dateOfBirth: "", joiningDate: "",
        workType: "ONSITE", department: "", location: "",
        phone: "", role: "AUTHOR", groupId: "", teamId: "",
    });

    const update = (field: string, value: string) => setForm({ ...form, [field]: value });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("accessToken");
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/v1/employees`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to create employee");
            }
            router.push("/dashboard/employees");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="flex items-center gap-3">
                <Link href="/dashboard/employees" className="btn-icon"><ArrowLeft size={18} /></Link>
                <div className="page-header">
                    <h1>Add Employee</h1>
                    <p>Create a new employee account</p>
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                {/* Account Info */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">First Name <span className="text-red-400">*</span></label>
                            <input type="text" value={form.firstName} onChange={e => update("firstName", e.target.value)} required className="w-full" placeholder="John" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Last Name <span className="text-red-400">*</span></label>
                            <input type="text" value={form.lastName} onChange={e => update("lastName", e.target.value)} required className="w-full" placeholder="Doe" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Email <span className="text-red-400">*</span></label>
                            <input type="email" value={form.email} onChange={e => update("email", e.target.value)} required className="w-full" placeholder="john@company.com" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Password <span className="text-red-400">*</span></label>
                            <input type="password" value={form.password} onChange={e => update("password", e.target.value)} required className="w-full" placeholder="••••••••" />
                        </div>
                    </div>
                </div>

                {/* Employee Info */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-4">Employee Details</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Employee ID</label>
                            <input type="text" value={form.employeeId} onChange={e => update("employeeId", e.target.value)} className="w-full" placeholder="EMP-001 (auto-generated if blank)" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Role</label>
                            <select value={form.role} onChange={e => update("role", e.target.value)} className="w-full">
                                <option value="ADMIN">Admin</option>
                                <option value="EDITOR">Editor</option>
                                <option value="AUTHOR">Author</option>
                                <option value="VIEWER">Viewer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Department</label>
                            <input type="text" value={form.department} onChange={e => update("department", e.target.value)} className="w-full" placeholder="Engineering" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Work Type</label>
                            <select value={form.workType} onChange={e => update("workType", e.target.value)} className="w-full">
                                <option value="ONSITE">Onsite</option>
                                <option value="REMOTE">Remote</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERN">Intern</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Location</label>
                            <input type="text" value={form.location} onChange={e => update("location", e.target.value)} className="w-full" placeholder="New York" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Phone</label>
                            <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className="w-full" placeholder="+1 555-0100" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Date of Birth</label>
                            <input type="date" value={form.dateOfBirth} onChange={e => update("dateOfBirth", e.target.value)} className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Joining Date</label>
                            <input type="date" value={form.joiningDate} onChange={e => update("joiningDate", e.target.value)} className="w-full" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href="/dashboard/employees" className="btn-secondary">Cancel</Link>
                    <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <><UserPlus size={16} /> Create Employee</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
