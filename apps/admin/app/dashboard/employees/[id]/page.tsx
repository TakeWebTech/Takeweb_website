"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Save, Loader2, Mail, Phone, MapPin, Building2,
    Calendar, UserCog, Shield, Clock, Edit, Activity, Trash2, Award, KeyRound
} from "lucide-react";
import SearchableSelect from "../../../../components/SearchableSelect";

interface Employee {
    id: string; email: string; firstName: string; lastName: string;
    role: string; avatar?: string; employeeId?: string; workType: string;
    department?: string; location?: string; phone?: string; bio?: string;
    designation?: string; isDirector: boolean; portalAccess: boolean;
    lifecycleStatus: string; joiningDate?: string; dateOfBirth?: string;
    shiftStart?: string; shiftEnd?: string;
    shiftGraceBeforeMinutes?: number; shiftGraceAfterMinutes?: number; lateGraceMinutes?: number;
    shiftTimezone?: string;
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
    const [resetOpen, setResetOpen] = useState(false);
    const [resetPassword, setResetPassword] = useState("");
    const [resetSaving, setResetSaving] = useState(false);
    const [resetError, setResetError] = useState("");
    const [form, setForm] = useState<any>({});
    const [attendanceAnalytics, setAttendanceAnalytics] = useState<any>(null);
    
    // Options for searchable selects
    const [designationOptions, setDesignationOptions] = useState(["Software Engineer", "Senior Engineer", "Product Manager", "Designer", "HR Manager", "Director"]);
    const [departmentOptions, setDepartmentOptions] = useState(["Engineering", "Human Resources", "Marketing", "Sales", "Finance"]);
    const [locationOptions, setLocationOptions] = useState(["New York", "San Francisco", "London", "Remote", "Berlin", "Toronto"]);

    useEffect(() => { 
        fetchEmployee();
        fetchGroups();
        fetchAttendanceAnalytics();
    }, [id]);

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/v1/groups`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const groupNames = data.map((g: any) => g.name);
                setDepartmentOptions(prev => Array.from(new Set([...prev, ...groupNames])));
            }
        } catch (err) { console.error("Failed to fetch groups", err); }
    };

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
                
                // Add existing employee values to options if they aren't already there
                if (data.designation) setDesignationOptions(p => Array.from(new Set([...p, data.designation])));
                if (data.department) setDepartmentOptions(p => Array.from(new Set([...p, data.department])));
                if (data.location) setLocationOptions(p => Array.from(new Set([...p, data.location])));

                setForm({
                    firstName: data.firstName, lastName: data.lastName,
                    department: data.department || "", location: data.location || "",
                    designation: data.designation || "", phone: data.phone || "", 
                    workType: data.workType, role: data.role, bio: data.bio || "",
                    isDirector: !!data.isDirector,
                    shiftStart: data.shiftStart || "09:00",
                    shiftEnd: data.shiftEnd || "18:00",
                    shiftGraceBeforeMinutes: data.shiftGraceBeforeMinutes ?? 15,
                    shiftGraceAfterMinutes: data.shiftGraceAfterMinutes ?? 30,
                    lateGraceMinutes: data.lateGraceMinutes ?? 15,
                    shiftTimezone: data.shiftTimezone || "",
                });
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchAttendanceAnalytics = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/v1/attendance/analytics?employeeId=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setAttendanceAnalytics(data);
            }
        } catch (err) { console.error(err); }
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

    const resetEmployeePassword = async () => {
        const nextPassword = resetPassword.trim();
        if (!nextPassword) {
            setResetError("Password is required.");
            return;
        }
        setResetSaving(true);
        setResetError("");
        try {
            const token = localStorage.getItem("accessToken");
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/v1/employees/${id}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ password: nextPassword })
            });
            if (res.ok) {
                setResetPassword("");
                setResetOpen(false);
            } else {
                const data = await res.json().catch(() => null);
                setResetError(data?.message || "Failed to reset password");
            }
        } catch (err) {
            console.error(err);
            setResetError("Failed to reset password");
        } finally {
            setResetSaving(false);
        }
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
                        {employee.isDirector && <span className="badge bg-amber-500/10 text-amber-400 ml-2">Director</span>}
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
                                        <label className="block text-sm text-neutral-300 mb-1.5">Designation</label>
                                        <SearchableSelect 
                                            value={form.designation} 
                                            onChange={(val) => setForm({ ...form, designation: val })} 
                                            options={designationOptions} 
                                            placeholder="Select or add designation..."
                                            addLabel="New Designation"
                                            searchPlaceholder="Search"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-300 mb-1.5">Department</label>
                                        <SearchableSelect 
                                            value={form.department} 
                                            onChange={(val) => setForm({ ...form, department: val })} 
                                            options={departmentOptions} 
                                            placeholder="Select or add department..."
                                            addLabel="New Department"
                                            searchPlaceholder="Search"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-300 mb-1.5">Location</label>
                                        <SearchableSelect 
                                            value={form.location} 
                                            onChange={(val) => setForm({ ...form, location: val })} 
                                            options={locationOptions} 
                                            placeholder="Select or add location..."
                                            addLabel="New Work Location"
                                            searchPlaceholder="Search"
                                        />
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
                                        <label className="block text-sm text-neutral-300 mb-1.5">Role (Access Level)</label>
                                        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full">
                                            <option value="ADMIN">Admin</option>
                                            <option value="EDITOR">Editor</option>
                                            <option value="AUTHOR">Author</option>
                                            <option value="VIEWER">Viewer</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <h3 className="text-sm font-semibold text-white mt-2 mb-2">Shift Timing</h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-neutral-300 mb-1.5">Shift Start</label>
                                                <input
                                                    type="time"
                                                    value={form.shiftStart}
                                                    onChange={e => setForm({ ...form, shiftStart: e.target.value })}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-300 mb-1.5">Shift End</label>
                                                <input
                                                    type="time"
                                                    value={form.shiftEnd}
                                                    onChange={e => setForm({ ...form, shiftEnd: e.target.value })}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-300 mb-1.5">Grace Before (minutes)</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={form.shiftGraceBeforeMinutes ?? 0}
                                                    onChange={e => setForm({ ...form, shiftGraceBeforeMinutes: Number(e.target.value) })}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-300 mb-1.5">Grace After (minutes)</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={form.shiftGraceAfterMinutes ?? 0}
                                                    onChange={e => setForm({ ...form, shiftGraceAfterMinutes: Number(e.target.value) })}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-300 mb-1.5">Late After (minutes)</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={form.lateGraceMinutes ?? 0}
                                                    onChange={e => setForm({ ...form, lateGraceMinutes: Number(e.target.value) })}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-neutral-300 mb-1.5">Time Zone (optional)</label>
                                                <input
                                                    type="text"
                                                    value={form.shiftTimezone || ""}
                                                    onChange={e => setForm({ ...form, shiftTimezone: e.target.value })}
                                                    placeholder="e.g. Asia/Kolkata"
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="sm:col-span-2 pt-2 pb-2">
                                        <label className="flex items-start gap-3 cursor-pointer w-fit p-3 rounded-lg bg-dark-800 border border-dark-700">
                                            <div className="mt-0.5">
                                                <input 
                                                    type="checkbox" 
                                                    checked={form.isDirector} 
                                                    onChange={e => setForm({ ...form, isDirector: e.target.checked })} 
                                                    className="rounded border-dark-600 bg-dark-900 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-900" 
                                                />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-medium text-white mb-1">Employee is a Director/person with substantial interest in the company</span>
                                                <span className="block text-xs text-neutral-400 max-w-lg">
                                                    "Substantial interest in a company" means that the employee is a beneficial owner of shares carrying at least 20% voting power. This detail helps in filling Form 12BA.
                                                </span>
                                            </div>
                                        </label>
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
                                    <InfoRow icon={Award} label="Designation" value={employee.designation || "—"} />
                                    <InfoRow icon={Building2} label="Department" value={employee.department || "—"} />
                                    <InfoRow icon={MapPin} label="Location" value={employee.location || "—"} />
                                    <InfoRow icon={UserCog} label="Work Type" value={employee.workType} />
                                    <InfoRow icon={Shield} label="Role" value={employee.customRole?.name || employee.role} />
                                    <InfoRow icon={Calendar} label="Joined" value={employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "—"} />
                                    <InfoRow icon={Calendar} label="Date of Birth" value={employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "—"} />
                                    <InfoRow icon={Activity} label="Substantial Interest" value={employee.isDirector ? "Yes (Form 12BA applicable)" : "No"} />
                                    <InfoRow icon={Clock} label="Shift" value={`${employee.shiftStart || "09:00"} - ${employee.shiftEnd || "18:00"}`} />
                                    <InfoRow icon={Clock} label="Grace Window" value={`Before: ${employee.shiftGraceBeforeMinutes ?? 15}m, After: ${employee.shiftGraceAfterMinutes ?? 30}m`} />
                                    <InfoRow icon={Clock} label="Late After" value={`${employee.lateGraceMinutes ?? 15}m`} />
                                    {employee.shiftTimezone && (
                                        <InfoRow icon={Clock} label="Time Zone" value={employee.shiftTimezone} />
                                    )}
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

                    {attendanceAnalytics && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-white mb-4">Attendance Analytics</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    { label: "Present", value: attendanceAnalytics.presentDays ?? 0, color: "text-emerald-400" },
                                    { label: "Late", value: attendanceAnalytics.lateCount ?? 0, color: "text-amber-400" },
                                    { label: "Absent", value: attendanceAnalytics.absentDays ?? 0, color: "text-red-400" },
                                    { label: "Half-Day", value: attendanceAnalytics.halfDayCount ?? 0, color: "text-orange-400" },
                                    { label: "Overtime (hrs)", value: (attendanceAnalytics.approvedOvertimeHours ?? attendanceAnalytics.overtimeHours ?? 0).toFixed(1), color: "text-blue-400" },
                                    { label: "Total Working Days", value: attendanceAnalytics.totalWorkingDays ?? 0, color: "text-primary-400" },
                                ].map((item) => (
                                    <div key={item.label} className="p-3 rounded-lg bg-dark-800/50 border border-dark-700/50 text-center">
                                        <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                                        <p className="text-[10px] text-neutral-500">{item.label}</p>
                                    </div>
                                ))}
                            </div>
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
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Portal Access</span>
                                <span className={employee.portalAccess ? "text-emerald-400" : "text-error-400"}>{employee.portalAccess ? "Enabled" : "Disabled"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <KeyRound size={16} className="text-neutral-400" />
                                <h3 className="text-sm font-semibold text-white">Reset Password</h3>
                            </div>
                            <button
                                onClick={() => setResetOpen(prev => !prev)}
                                className="btn-secondary text-xs"
                            >
                                {resetOpen ? "Close" : "Reset"}
                            </button>
                        </div>

                        {resetOpen && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-neutral-500 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={resetPassword}
                                        onChange={(e) => setResetPassword(e.target.value)}
                                        className="w-full"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                {resetError && (
                                    <div className="text-xs text-error-400">{resetError}</div>
                                )}
                                <button
                                    onClick={resetEmployeePassword}
                                    disabled={resetSaving}
                                    className="btn-primary w-full disabled:opacity-50"
                                >
                                    {resetSaving ? <><Loader2 size={14} className="animate-spin" /> Resetting...</> : "Update Password"}
                                </button>
                            </div>
                        )}
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
