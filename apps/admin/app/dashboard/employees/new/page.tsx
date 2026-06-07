"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Save, Loader2 } from "lucide-react";
import SearchableSelect from "../../../../components/SearchableSelect";

export default function NewEmployeePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [groups, setGroups] = useState<{id: string, name: string}[]>([]);
    
    // Some basic default options for our new searchable selects
    const [designationOptions] = useState(["Software Engineer", "Senior Engineer", "Product Manager", "Designer", "HR Manager", "Director"]);
    const [departmentOptions, setDepartmentOptions] = useState(["Engineering", "Human Resources", "Marketing", "Sales", "Finance"]);
    const [locationOptions] = useState(["New York", "San Francisco", "London", "Remote", "Berlin", "Toronto"]);

    const [form, setForm] = useState({
        email: "", password: "", firstName: "", lastName: "",
        employeeId: "", dateOfBirth: "", joiningDate: "",
        workType: "ONSITE", department: "", location: "",
        phone: "", role: "AUTHOR", designation: "",
        groupId: "", teamId: "",
        isDirector: false,
        shiftStart: "09:00",
        shiftEnd: "18:00",
        shiftGraceBeforeMinutes: 15,
        shiftGraceAfterMinutes: 30,
        lateGraceMinutes: 15,
        shiftTimezone: "",
    });

    const update = (field: string, value: string | boolean | number) => setForm({ ...form, [field]: value });

    // Fetch groups for department dropdown
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                const res = await fetch(`${base}/api/v1/groups`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setGroups(data);
                    // Add groups to department options
                    const groupNames = data.map((g: any) => g.name);
                    setDepartmentOptions(prev => Array.from(new Set([...prev, ...groupNames])));
                }
            } catch (err) { console.error("Failed to fetch groups", err); }
        };
        fetchGroups();
    }, []);

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 12; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
        update("password", pass);
    };

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
                            <div className="flex gap-2">
                                <input type="text" value={form.password} onChange={e => update("password", e.target.value)} required className="w-full" placeholder="••••••••" />
                                <button type="button" onClick={generatePassword} className="btn-secondary whitespace-nowrap px-3 text-xs">Generate</button>
                            </div>
                        </div>
                        <div className="sm:col-span-2 mt-2">
                            {/* "Send Email" aka Portal Access toggle was removed from here per instructions */}
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
                            <label className="block text-sm text-neutral-300 mb-1.5">Role (Access Level)</label>
                            <select value={form.role} onChange={e => update("role", e.target.value)} className="w-full">
                                <option value="ADMIN">Admin</option>
                                <option value="EDITOR">Editor</option>
                                <option value="AUTHOR">Author</option>
                                <option value="VIEWER">Viewer</option>
                            </select>
                        </div>
                        
                        {/* Searchable Selects */}
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Designation</label>
                            <SearchableSelect 
                                value={form.designation} 
                                onChange={(val) => update("designation", val)} 
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
                                onChange={(val) => update("department", val)} 
                                options={departmentOptions} 
                                placeholder="Select or add department..."
                                addLabel="New Department"
                                searchPlaceholder="Search"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-300 mb-1.5">Work Location</label>
                            <SearchableSelect 
                                value={form.location} 
                                onChange={(val) => update("location", val)} 
                                options={locationOptions} 
                                placeholder="Select or add location..."
                                addLabel="New Work Location"
                                searchPlaceholder="Search"
                            />
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
                        <div className="sm:col-span-2">
                            <h3 className="text-sm font-semibold text-white mt-2 mb-2">Shift Timing</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-neutral-300 mb-1.5">Shift Start</label>
                                    <input type="time" value={form.shiftStart} onChange={e => update("shiftStart", e.target.value)} className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-300 mb-1.5">Shift End</label>
                                    <input type="time" value={form.shiftEnd} onChange={e => update("shiftEnd", e.target.value)} className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-300 mb-1.5">Grace Before (minutes)</label>
                                    <input type="number" min={0} value={form.shiftGraceBeforeMinutes} onChange={e => update("shiftGraceBeforeMinutes", Number(e.target.value))} className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-300 mb-1.5">Grace After (minutes)</label>
                                    <input type="number" min={0} value={form.shiftGraceAfterMinutes} onChange={e => update("shiftGraceAfterMinutes", Number(e.target.value))} className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-300 mb-1.5">Late After (minutes)</label>
                                    <input type="number" min={0} value={form.lateGraceMinutes} onChange={e => update("lateGraceMinutes", Number(e.target.value))} className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-300 mb-1.5">Time Zone (optional)</label>
                                    <input type="text" value={form.shiftTimezone} onChange={e => update("shiftTimezone", e.target.value)} className="w-full" placeholder="e.g. Asia/Kolkata" />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-2 pt-2">
                            <label className="flex items-start gap-3 cursor-pointer w-fit p-3 rounded-lg bg-dark-800 border border-dark-700">
                                <div className="mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={!!form.isDirector}
                                        onChange={e => update("isDirector", e.target.checked)}
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
