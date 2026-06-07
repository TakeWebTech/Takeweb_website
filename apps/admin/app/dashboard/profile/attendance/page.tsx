"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, LogIn, LogOut, Calendar, CheckCircle2, XCircle, Timer, FileText, Plus, X, PieChart as PieChartIcon, Sun } from "lucide-react";
import { toast } from "react-hot-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const base = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") : "";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" });

export default function AttendancePage() {
    const [now, setNow] = useState(new Date());
    const [checkedIn, setCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<Date | null>(null);
    const [elapsed, setElapsed] = useState("00:00:00");
    const [initialLoading, setInitialLoading] = useState(true);
    const [verifyingLocation, setVerifyingLocation] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [overtimeRequests, setOvertimeRequests] = useState<any[]>([]);
    
    // Leave Modal State
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [leaveStart, setLeaveStart] = useState("");
    const [leaveEnd, setLeaveEnd] = useState("");
    const [leaveReason, setLeaveReason] = useState("");
    const [submittingLeave, setSubmittingLeave] = useState(false);

    // Overtime Request State
    const [isOvertimeModalOpen, setIsOvertimeModalOpen] = useState(false);
    const [overtimeDate, setOvertimeDate] = useState("");
    const [overtimeHoursInput, setOvertimeHoursInput] = useState("");
    const [overtimeReason, setOvertimeReason] = useState("");
    const [overtimeAttachmentUrl, setOvertimeAttachmentUrl] = useState("");
    const [submittingOvertime, setSubmittingOvertime] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchHistory = () => {
        fetch(`${base}/api/v1/attendance/history`, { headers: headers() })
            .then(res => res.ok ? res.json() : [])
            .then(data => setHistory(data));
    };

    const fetchAnalytics = () => {
        fetch(`${base}/api/v1/attendance/analytics`, { headers: headers() })
            .then(res => res.ok ? res.json() : null)
            .then(data => setAnalytics(data))
            .catch(() => setAnalytics(null));
    };

    const fetchOvertimeRequests = () => {
        fetch(`${base}/api/v1/attendance/overtime`, { headers: headers() })
            .then(res => res.ok ? res.json() : [])
            .then(data => setOvertimeRequests(data));
    };

    useEffect(() => {
        const fetchStatus = () => {
            fetch(`${base}/api/v1/attendance/status`, { headers: headers() })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && data.status === "ACTIVE" && data.checkinTime) {
                        setCheckedIn(true);
                        setCheckInTime(new Date(data.checkinTime));
                    } else {
                        setCheckedIn(false);
                        setCheckInTime(null);
                    }
                })
                .finally(() => setInitialLoading(false));
        };

        fetchStatus();
        fetchHistory();
        fetchAnalytics();
        fetchOvertimeRequests();

        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (checkedIn && checkInTime) {
            timerRef.current = setInterval(() => {
                const diff = Date.now() - checkInTime.getTime();
                const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
                setElapsed(`${h}:${m}:${s}`);
            }, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [checkedIn, checkInTime]);

    const handlePunchIn = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        if (verifyingLocation || submitting || checkedIn) return;

        setVerifyingLocation(true);
        setActionMessage("Verifying Location...");
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            try {
                setVerifyingLocation(false);
                setSubmitting(true);
                setActionMessage("Punching In...");
                const res = await fetch(`${base}/api/v1/attendance/punch-in`, {
                    method: "POST", headers: headers(), body: JSON.stringify({ latitude, longitude, accuracy })
                });
                if (!res.ok) {
                    const errData = await res.json().catch(() => null);
                    throw new Error(errData?.message || "Unable to punch in");
                }
                const data = await res.json();
                setCheckedIn(true); setCheckInTime(new Date(data.checkinTime)); setElapsed("00:00:00");
                toast.success("Punch-In successful");
                setActionMessage("Punch-In Successful");
                setTimeout(() => setActionMessage(null), 2000);
                fetchHistory();
                fetchAnalytics();
            } catch (err: any) {
                toast.error("Failed to punch in: " + err.message);
                setActionMessage(null);
            } finally {
                setSubmitting(false);
            }
        }, (error) => {
            setVerifyingLocation(false);
            setActionMessage(null);
            toast.error("Location access denied. Cannot punch in.");
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    };

    const handlePunchOut = async () => {
        if (checkInTime) {
            const diffHours = (Date.now() - checkInTime.getTime()) / 3600000;
            if (diffHours < 8) {
                if (!window.confirm("You are punching out early. Your hours will be marked incomplete. Are you sure you want to proceed?")) {
                    return;
                }
            }
        }

        if (verifyingLocation || submitting || !checkedIn) return;
        setSubmitting(true);
        setActionMessage("Punching Out...");
        try {
            const res = await fetch(`${base}/api/v1/attendance/punch-out`, {
                method: "POST", headers: headers()
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.message || "Unable to punch out");
            }
            setCheckedIn(false); if (timerRef.current) clearInterval(timerRef.current);
            toast.success("Punch-Out successful");
            setActionMessage(null);
            fetchHistory();
            fetchAnalytics();
        } catch (err: any) {
            toast.error("Failed to punch out: " + err.message);
            setActionMessage(null);
        } finally {
            setSubmitting(false);
        }
    };

    const submitLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingLeave(true);
        try {
            const res = await fetch(`${base}/api/v1/attendance/leave`, {
                method: "POST", headers: headers(),
                body: JSON.stringify({ startDate: leaveStart, endDate: leaveEnd, reason: leaveReason })
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.message || "Unable to submit overtime");
            }
            toast.success("Leave application submitted successfully!");
            setIsLeaveModalOpen(false);
            setLeaveStart(""); setLeaveEnd(""); setLeaveReason("");
        } catch(err: any) {
            toast.error("Failed to apply: " + err.message);
        } finally {
            setSubmittingLeave(false);
        }
    };

    const submitOvertime = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!overtimeDate || !overtimeHoursInput || !overtimeReason) {
            toast.error("Please fill all required overtime fields");
            return;
        }
        setSubmittingOvertime(true);
        try {
            const res = await fetch(`${base}/api/v1/attendance/overtime`, {
                method: "POST",
                headers: headers(),
                body: JSON.stringify({
                    date: overtimeDate,
                    hours: Number(overtimeHoursInput),
                    reason: overtimeReason,
                    attachmentUrl: overtimeAttachmentUrl || undefined,
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            toast.success("Overtime request submitted");
            setIsOvertimeModalOpen(false);
            setOvertimeDate("");
            setOvertimeHoursInput("");
            setOvertimeReason("");
            setOvertimeAttachmentUrl("");
            fetchOvertimeRequests();
        } catch (err: any) {
            toast.error("Failed to submit overtime: " + err.message);
        } finally {
            setSubmittingOvertime(false);
        }
    };

    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

    const presentDays = analytics?.presentDays ?? 0;
    const absentDays = analytics?.absentDays ?? 0;
    const lateCount = analytics?.lateCount ?? 0;
    const halfDays = analytics?.halfDayCount ?? 0;
    const holidayWorkDays = analytics?.holidayWorkDays ?? 0;
    const totalWorkingDays = analytics?.totalWorkingDays ?? 0;
    const overtimeHoursValue = (analytics?.approvedOvertimeHours ?? 0) > 0
        ? analytics?.approvedOvertimeHours
        : (analytics?.overtimeHours ?? 0);
    const shiftDurationHours = analytics?.shiftDurationHours ?? 8;

    const presentPct = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 0;
    const absentPct = totalWorkingDays > 0 ? Math.round((absentDays / totalWorkingDays) * 100) : 0;
    const latePct = totalWorkingDays > 0 ? Math.round((lateCount / totalWorkingDays) * 100) : 0;
    const holidayPct = totalWorkingDays > 0 ? Math.round((holidayWorkDays / totalWorkingDays) * 100) : 0;
    const overtimePct = totalWorkingDays > 0 && shiftDurationHours > 0
        ? Math.round((overtimeHoursValue / (totalWorkingDays * shiftDurationHours)) * 100)
        : 0;

    const pieData = [
        { name: "Present", value: presentPct, color: "#34d399" },
        { name: "Absent", value: absentPct, color: "#f87171" },
        { name: "Late", value: latePct, color: "#f59e0b" },
        { name: "Overtime", value: overtimePct, color: "#60a5fa" },
        { name: "Holiday Work", value: holidayPct, color: "#fbbf24" },
    ];

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl relative">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="flex items-center gap-2"><Clock size={22} className="text-emerald-400" /> My Attendance</h1>
                    <p>Track your daily attendance and working hours</p>
                </div>
                <button onClick={() => setIsLeaveModalOpen(true)} className="btn-primary">
                    <FileText size={16} /> Apply for Leave
                </button>
            </div>

            {/* Live Punch-In Card */}
            <div className="card bg-gradient-to-r from-dark-850 to-dark-900 border-primary-500/10">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-center">
                        <p className="text-4xl font-mono font-bold text-white tracking-wider">{timeStr}</p>
                        <p className="text-xs text-neutral-500 mt-1">{now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                    </div>
                    <div className="h-16 w-px bg-dark-700 hidden sm:block" />
                    <div className="flex items-center gap-4">
                        {initialLoading ? (
                            <div className="h-12 w-32 rounded-xl bg-dark-700 animate-pulse" />
                        ) : !checkedIn ? (
                            <button
                                onClick={handlePunchIn}
                                disabled={verifyingLocation || submitting}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <LogIn size={18} /> {verifyingLocation ? "Verifying Location..." : submitting ? "Punching In..." : "Punch In"}
                            </button>
                        ) : (
                            <button
                                onClick={handlePunchOut}
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <LogOut size={18} /> {submitting ? "Punching Out..." : "Punch Out"}
                            </button>
                        )}
                        {actionMessage && (
                            <span className="text-xs text-neutral-400">{actionMessage}</span>
                        )}
                        <div className="text-center">
                            <p className="text-[10px] text-neutral-500">Working Time</p>
                            <p className="text-xl font-mono font-bold text-primary-400">{elapsed}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Analytics */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <PieChartIcon size={16} className="text-primary-400" />
                    <h2 className="text-sm font-semibold text-white">Attendance Analytics</h2>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="card text-center">
                            <CheckCircle2 size={20} className="text-emerald-400 mx-auto mb-2" />
                            <p className="text-xl font-bold text-emerald-400">{presentDays}</p>
                            <p className="text-[11px] text-neutral-500">Present Days</p>
                        </div>
                        <div className="card text-center">
                            <XCircle size={20} className="text-red-400 mx-auto mb-2" />
                            <p className="text-xl font-bold text-red-400">{absentDays}</p>
                            <p className="text-[11px] text-neutral-500">Absent Days</p>
                        </div>
                        <div className="card text-center">
                            <Timer size={20} className="text-amber-400 mx-auto mb-2" />
                            <p className="text-xl font-bold text-amber-400">{lateCount}</p>
                            <p className="text-[11px] text-neutral-500">Late Count</p>
                        </div>
                        <div className="card text-center">
                            <Clock size={20} className="text-blue-400 mx-auto mb-2" />
                            <p className="text-xl font-bold text-blue-400">{overtimeHoursValue.toFixed(1)}</p>
                            <p className="text-[11px] text-neutral-500">Overtime Hours</p>
                        </div>
                        <div className="card text-center">
                            <Sun size={20} className="text-amber-300 mx-auto mb-2" />
                            <p className="text-xl font-bold text-amber-300">{holidayWorkDays}</p>
                            <p className="text-[11px] text-neutral-500">Holiday Work Days</p>
                        </div>
                        <div className="card text-center">
                            <Calendar size={20} className="text-primary-400 mx-auto mb-2" />
                            <p className="text-xl font-bold text-primary-400">{totalWorkingDays}</p>
                            <p className="text-[11px] text-neutral-500">Total Working Days</p>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                                        {pieData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 text-xs">
                            {pieData.map((entry) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                                    <span className="text-neutral-400">{entry.name}</span>
                                    <span className="text-neutral-200">{entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance History */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar size={16} className="text-blue-400" />
                    <h2 className="text-sm font-semibold text-white">Recent History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dark-700">
                                <th className="text-left py-2 px-3 text-neutral-400 font-medium">Date</th>
                                <th className="text-left py-2 px-3 text-neutral-400 font-medium">Punch In</th>
                                <th className="text-left py-2 px-3 text-neutral-400 font-medium">Punch Out</th>
                                <th className="text-left py-2 px-3 text-neutral-400 font-medium">Hours</th>
                                <th className="text-left py-2 px-3 text-neutral-400 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length === 0 ? (
                                <tr><td colSpan={5} className="py-8 text-center text-neutral-500">No attendance records found.</td></tr>
                            ) : (
                                history.map((r) => {
                                    const checkInDate = new Date(r.checkinTime);
                                    const checkOutDate = r.checkoutTime ? new Date(r.checkoutTime) : null;
                                    const h = r.workingHours ? Math.floor(r.workingHours) : 0;
                                    const m = r.workingHours ? Math.floor((r.workingHours * 60) % 60) : 0;
                                    const statusLabel = r.status === 'ACTIVE'
                                        ? 'Active'
                                        : r.earlyCheckout
                                            ? 'Half-Day'
                                            : r.isLate
                                                ? 'Late'
                                                : 'Present';
                                    const statusClass = r.status === 'ACTIVE'
                                        ? 'bg-blue-500/10 text-blue-400'
                                        : r.earlyCheckout
                                            ? 'bg-amber-500/10 text-amber-400'
                                            : r.isLate
                                                ? 'bg-orange-500/10 text-orange-400'
                                                : 'bg-emerald-500/10 text-emerald-400';
                                    
                                    return (
                                        <tr key={r.id} className="border-b border-dark-700/50 hover:bg-dark-850 transition-colors">
                                            <td className="py-2.5 px-3 text-neutral-300 font-mono text-xs">{checkInDate.toLocaleDateString()}</td>
                                            <td className="py-2.5 px-3 text-neutral-300">{checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</td>
                                            <td className="py-2.5 px-3 text-neutral-300">{checkOutDate ? checkOutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) : '—'}</td>
                                            <td className="py-2.5 px-3 text-white font-medium">{r.checkoutTime ? `${h}h ${m}m` : 'In Progress'}</td>
                                            <td className="py-2.5 px-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusClass}`}>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Overtime Requests */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-400" />
                        <h2 className="text-sm font-semibold text-white">Overtime Requests</h2>
                    </div>
                    <button onClick={() => setIsOvertimeModalOpen(true)} className="btn-secondary text-sm">
                        <Plus size={14} /> Request Overtime
                    </button>
                </div>
                {overtimeRequests.length === 0 ? (
                    <p className="text-sm text-neutral-500">No overtime requests yet.</p>
                ) : (
                    <div className="space-y-2">
                        {overtimeRequests.map((r) => (
                            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50 border border-dark-700/50">
                                <div>
                                    <p className="text-sm text-white font-medium">{new Date(r.date).toLocaleDateString()}</p>
                                    <p className="text-xs text-neutral-500">{r.hours} hrs • {r.reason}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : r.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                    {r.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Leave Application Modal */}
            {isLeaveModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
                        <div className="flex justify-between items-center p-4 border-b border-dark-800">
                            <h2 className="text-lg font-bold text-white">Apply for Leave</h2>
                            <button onClick={() => setIsLeaveModalOpen(false)} className="btn-icon"><X size={18} /></button>
                        </div>
                        <form onSubmit={submitLeave} className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Start Date</label>
                                    <input type="date" required value={leaveStart} onChange={e => setLeaveStart(e.target.value)} className="input-field w-full" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">End Date</label>
                                    <input type="date" required value={leaveEnd} onChange={e => setLeaveEnd(e.target.value)} className="input-field w-full" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Reason for Leave</label>
                                <textarea required value={leaveReason} onChange={e => setLeaveReason(e.target.value)} className="input-field w-full h-24 resize-none" placeholder="Medical, Vacation, etc..." />
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={submittingLeave} className="btn-primary w-full justify-center">
                                    {submittingLeave ? "Submitting..." : "Submit Application"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Overtime Request Modal */}
            {isOvertimeModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
                        <div className="flex justify-between items-center p-4 border-b border-dark-800">
                            <h2 className="text-lg font-bold text-white">Request Overtime</h2>
                            <button onClick={() => setIsOvertimeModalOpen(false)} className="btn-icon"><X size={18} /></button>
                        </div>
                        <form onSubmit={submitOvertime} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Date</label>
                                <input type="date" required value={overtimeDate} onChange={e => setOvertimeDate(e.target.value)} className="input-field w-full" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Extra Hours Worked</label>
                                <input type="number" min={0} step={0.5} required value={overtimeHoursInput} onChange={e => setOvertimeHoursInput(e.target.value)} className="input-field w-full" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Reason / Description</label>
                                <textarea required value={overtimeReason} onChange={e => setOvertimeReason(e.target.value)} className="input-field w-full h-24 resize-none" placeholder="Project deadline, incident, etc..." />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Attachment URL (optional)</label>
                                <input type="url" value={overtimeAttachmentUrl} onChange={e => setOvertimeAttachmentUrl(e.target.value)} className="input-field w-full" placeholder="https://..." />
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={submittingOvertime} className="btn-primary w-full justify-center">
                                    {submittingOvertime ? "Submitting..." : "Submit Overtime Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
