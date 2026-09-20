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

export type JobApplicationInput = {
  applicant_name: string;
  email_id: string;
  phone_number: string;
  country: string;
  cover_letter?: string;
};

export function careersApi(path = "") {
  return `/api/careers${path}`;
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
