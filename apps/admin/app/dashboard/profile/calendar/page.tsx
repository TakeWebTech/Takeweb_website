"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Sun, Gift } from "lucide-react";

type DayStatus = "present" | "absent" | "holiday" | "weekend" | "half-day" | "future";

const HOLIDAYS: Record<string, string> = {
    "2026-01-01": "New Year's Day",
    "2026-01-26": "Republic Day",
    "2026-03-14": "Holi",
    "2026-04-18": "Good Friday",
    "2026-05-01": "May Day",
    "2026-08-15": "Independence Day",
    "2026-10-20": "Diwali",
    "2026-12-25": "Christmas",
};

function getDayStatus(dateStr: string, today: Date): DayStatus {
    const d = new Date(dateStr);
    if (d > today) return "future";
    if (HOLIDAYS[dateStr]) return "holiday";
    const day = d.getDay();
    if (day === 0 || day === 6) return "weekend";
    // Mock: random present/absent for past weekdays
    const hash = dateStr.split("-").reduce((a, b) => a + parseInt(b), 0);
    if (hash % 17 === 0) return "absent";
    if (hash % 23 === 0) return "half-day";
    return "present";
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_STYLES: Record<DayStatus, { bg: string; text: string; dot: string }> = {
    present: { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
    absent: { bg: "bg-red-500/15", text: "text-red-400", dot: "bg-red-400" },
    holiday: { bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400" },
    weekend: { bg: "bg-dark-800/30", text: "text-neutral-600", dot: "bg-neutral-600" },
    "half-day": { bg: "bg-orange-500/15", text: "text-orange-400", dot: "bg-orange-400" },
    future: { bg: "", text: "text-neutral-600", dot: "" },
};

export default function CalendarPage() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
    const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

    const cells: { day: number; dateStr: string; status: DayStatus }[] = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: 0, dateStr: "", status: "future" });
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        cells.push({ day: d, dateStr, status: getDayStatus(dateStr, today) });
    }

    // Stats
    const presentCount = cells.filter(c => c.status === "present").length;
    const absentCount = cells.filter(c => c.status === "absent").length;
    const holidayCount = cells.filter(c => c.status === "holiday").length;
    const halfDayCount = cells.filter(c => c.status === "half-day").length;

    // Upcoming holidays
    const upcomingHolidays = Object.entries(HOLIDAYS)
        .filter(([d]) => new Date(d) >= today)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .slice(0, 4);

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl">
            <div className="page-header">
                <h1 className="flex items-center gap-2"><CalendarDays size={22} className="text-primary-400" /> Attendance Calendar</h1>
                <p>Visual overview of your attendance, holidays, and leave</p>
            </div>

            {/* Legend & Stats */}
            <div className="flex flex-wrap gap-4">
                {[
                    { label: "Present", count: presentCount, color: "bg-emerald-400", textColor: "text-emerald-400" },
                    { label: "Absent", count: absentCount, color: "bg-red-400", textColor: "text-red-400" },
                    { label: "Holiday", count: holidayCount, color: "bg-amber-400", textColor: "text-amber-400" },
                    { label: "Half Day", count: halfDayCount, color: "bg-orange-400", textColor: "text-orange-400" },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800/50 border border-dark-700/50 text-xs">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        <span className="text-neutral-400">{item.label}</span>
                        <span className={`font-bold ${item.textColor}`}>{item.count}</span>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-5">
                        <button onClick={prevMonth} className="btn-icon"><ChevronLeft size={18} /></button>
                        <h2 className="text-lg font-bold text-white">{MONTHS[month]} {year}</h2>
                        <button onClick={nextMonth} className="btn-icon"><ChevronRight size={18} /></button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map((d) => (
                            <div key={d} className="text-center text-[10px] font-semibold text-neutral-500 uppercase py-1">{d}</div>
                        ))}
                    </div>

                    {/* Date cells */}
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((cell, i) => {
                            if (cell.day === 0) return <div key={`empty-${i}`} />;
                            const style = STATUS_STYLES[cell.status];
                            const isToday = cell.dateStr === todayStr;
                            const holidayName = HOLIDAYS[cell.dateStr];
                            return (
                                <div
                                    key={cell.dateStr}
                                    className={`relative p-2 rounded-lg text-center transition-all cursor-default ${style.bg} ${isToday ? "ring-2 ring-primary-500 ring-offset-1 ring-offset-dark-900" : ""}`}
                                    title={holidayName || cell.status}
                                >
                                    <p className={`text-sm font-medium ${isToday ? "text-primary-400 font-bold" : style.text}`}>{cell.day}</p>
                                    {cell.status !== "future" && cell.status !== "weekend" && (
                                        <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${style.dot}`} />
                                    )}
                                    {holidayName && (
                                        <Gift size={8} className="absolute top-1 right-1 text-amber-400" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Holidays */}
                <div className="card h-fit">
                    <div className="flex items-center gap-2 mb-4">
                        <Sun size={16} className="text-amber-400" />
                        <h2 className="text-sm font-semibold text-white">Upcoming Holidays</h2>
                    </div>
                    <div className="space-y-3">
                        {upcomingHolidays.map(([date, name]) => (
                            <div key={date} className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                                <Gift size={16} className="text-amber-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-medium truncate">{name}</p>
                                    <p className="text-[10px] text-neutral-500 font-mono">{new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                                </div>
                            </div>
                        ))}
                        {upcomingHolidays.length === 0 && (
                            <p className="text-xs text-neutral-500 text-center py-4">No upcoming holidays</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
