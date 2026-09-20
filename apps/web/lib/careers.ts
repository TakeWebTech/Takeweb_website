export type ErpJob = {
  id: string;
  title: string;
  designation: string | null;
  company: string | null;
  department: string | null;
  employment_type: string | null;
  location: string | null;
  posted_on: string | null;
  closes_on: string | null;
  description: string | null;
  salary: string | number | null;
};

export type CareersError = {
  message?: string | string[];
  error?: string;
};

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

export function careersApi(path = "") {
  return `${apiBase}/api/v1/careers${path}`;
}

export async function responseError(response: Response) {
  const body = (await response.json().catch(() => ({}))) as CareersError;
  if (Array.isArray(body.message)) return body.message.join(" ");
  return (
    body.message ||
    body.error ||
    "The careers service is currently unavailable."
  );
}

export function formatJobDate(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}
