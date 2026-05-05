"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Save, Loader2, Mail, Phone, MapPin, Building2,
    Calendar, UserCog, Shield, Clock, Edit, Activity, Trash2,
} from "lucide-react";

interface Employee {
    id: string; email: string; firstName: string; lastName: string;
    role: string; avatar?: string; employeeId?: string; workType: string;
    department?: string; location?: string; phone?: string; bio?: string;
    lifecycleStatus: string; joiningDate?: string; dateOfBirth?: string;
    group?: { id: string; name: string } | null;
    team?: { id: string; name: string } | null;
    customRole?: { id: string; name: string } | null;
    createdAt: string; updatedAt: string;
}

const statusConfig: Record<string, { label: string; class: string }> = {
    ACTIVE: { label: "Active", class: "badge-success" },
    ON_LEAVE: { label: "On Leave", class: "badge-warning" },
    EXITED: { label: "Exited", class: "badge-error" },
    BLOCKED: { label: "Blocked", class: "badge-error" },
};

export default function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<any>({});

    useEffect(() => { fetchEmployee(); }, [id]);

    const fetchEmployee = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/v1/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setEmployee(data);
                setForm({
                    firstName: data.firstName, lastName: data.lastName,
                    department: data.department || "", location: data.location || "",
                    phone: data.phone || "", workType: data.workType, role: data.role,
                    bio: data.bio || "",
                });
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const saveChanges = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("accessToken");
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/v1/employees/${id}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setEmployee(await res.json());
                setEditing(false);
            }
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const deleteEmployee = async () => {
        if (!confirm("Are you sure you want to remove this employee?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            await fetch(`${base}/api/v1/employees/${id}`, {
                method: "DELETE", headers: { Authorization: `Bearer ${token}` },
            });
            router.push("/dashboard/employees");
        } catch (err) { console.error(err); }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-8 w-48" />
                <div className="skeleton h-64 rounded-xl" />
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="text-center py-20">
                <UserCog size={48} className="mx-auto text-neutral-600 mb-4" />
                <p className="text-neutral-400">Employee not found</p>
                <Link href="/dashboard/employees" className="btn-primary mt-4 inline-flex">Back to Employees</Link>
            </div>
        );
    }

    const sc = statusConfig[employee.lifecycleStatus] ?? { label: "Active", class: "badge-success" };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/dashboard/employees" className="btn-icon"><ArrowLeft size={18} /></Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg font-bold text-white">
                            {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">{employee.firstName} {employee.lastName}</h1>
                            <p className="text-sm text-neutral-400">{employee.employeeId || employee.email}</p>
                        </div>
                        <span className={`badge ${sc.class} ml-2`}>{sc.label}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {editing ? (
                        <>
                            <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                            <button onClick={saveChanges} disabled={saving} className="btn-primary disabled:opacity-50">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setEditing(true)} className="btn-secondary"><Edit size={16} /> Edit</button>
                            <button onClick={deleteEmployee} className="btn-icon hover:text-error-400"><Trash2 size={16} /></button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Employee Information</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {editing ? (
                                <>
                                    <div>
                                        <label className="block text-sm text-neutral-300 mb-1.5">First Name</label>
                                        <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-300 mb-1.5">Last Name</label>
                                        <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-300 mb-1.5">Department</label>
                                        <input type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-300 mb-1.5">Location</label>
                                        <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-300 mb-1.5">Phone</label>
                                        <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-300 mb-1.5">Work Type</label>
                                        <select value={form.workType} onChange={e => setForm({ ...form, workType: e.target.value })} className="w-full">
                                            <option value="ONSITE">Onsite</option>
                                            <option value="REMOTE">Remote</option>
                                            <option value="CONTRACT">Contract</option>
                                            <option value="INTERN">Intern</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-300 mb-1.5">Role</label>
                                        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full">
                                            <option value="ADMIN">Admin</option>
                                            <option value="EDITOR">Editor</option>
                                            <option value="AUTHOR">Author</option>
                                            <option value="VIEWER">Viewer</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm text-neutral-300 mb-1.5">Bio</label>
                                        <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="w-full" rows={3} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <InfoRow icon={Mail} label="Email" value={employee.email} />
                                    <InfoRow icon={Phone} label="Phone" value={employee.phone || "—"} />
                                    <InfoRow icon={Building2} label="Department" value={employee.department || "—"} />
                                    <InfoRow icon={MapPin} label="Location" value={employee.location || "—"} />
                                    <InfoRow icon={UserCog} label="Work Type" value={employee.workType} />
                                    <InfoRow icon={Shield} label="Role" value={employee.customRole?.name || employee.role} />
                                    <InfoRow icon={Calendar} label="Joined" value={employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "—"} />
                                    <InfoRow icon={Calendar} label="Date of Birth" value={employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "—"} />
                                </>
                            )}
                        </div>
                    </div>

                    {employee.bio && !editing && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-white mb-3">Bio</h2>
                            <p className="text-sm text-neutral-300 leading-relaxed">{employee.bio}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="card">
                        <h3 className="text-sm font-semibold text-white mb-3">Group & Team</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-neutral-500">Group (Department)</p>
                                <p className="text-sm text-neutral-300 mt-0.5">{employee.group?.name || "Not assigned"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500">Team</p>
                                <p className="text-sm text-neutral-300 mt-0.5">{employee.team?.name || "Not assigned"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-sm font-semibold text-white mb-3">Account Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Created</span>
                                <span className="text-neutral-300">{new Date(employee.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Updated</span>
                                <span className="text-neutral-300">{new Date(employee.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Employee ID</span>
                                <span className="text-neutral-300 font-mono text-xs">{employee.employeeId || "—"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 py-2">
            <Icon size={16} className="text-neutral-500 flex-shrink-0" />
            <div>
                <p className="text-xs text-neutral-500">{label}</p>
                <p className="text-sm text-neutral-200">{value}</p>
            </div>
        </div>
    );
}
