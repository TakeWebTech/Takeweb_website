/**
 * Export utility — CSV / JSON export with download trigger.
 */

type ExportRow = Record<string, unknown>;

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
    const result: Record<string, string> = {};
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const val = obj[key];
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
            Object.assign(result, flattenObject(val as Record<string, unknown>, fullKey));
        } else if (Array.isArray(val)) {
            result[fullKey] = val.join("; ");
        } else {
            result[fullKey] = String(val ?? "");
        }
    }
    return result;
}

function escapeCsv(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

/**
 * Export data as CSV and trigger browser download
 */
export function exportToCsv(data: ExportRow[], filename: string) {
    if (data.length === 0) return;

    const flatData = data.map((row) => flattenObject(row as Record<string, unknown>));
    const headers = [...new Set(flatData.flatMap(Object.keys))];

    const csvLines = [
        headers.map(escapeCsv).join(","),
        ...flatData.map((row) => headers.map((h) => escapeCsv(row[h] ?? "")).join(",")),
    ];

    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, `${filename}.csv`);
}

/**
 * Export data as JSON and trigger browser download
 */
export function exportToJson(data: ExportRow[], filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    triggerDownload(blob, `${filename}.json`);
}

function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
