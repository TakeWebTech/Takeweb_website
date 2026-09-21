import { NextRequest, NextResponse } from "next/server";
import type { ErpApplicationField, ErpJob } from "@/lib/careers";

type RouteContext = { params: Promise<{ path?: string[] }> };
type FrappeResponse<T> = { message?: T; _server_messages?: string };
type JobsMessage = { jobs?: ErpJob[]; count?: number };
type JobMessage = {
  job?: ErpJob;
  application_form?: { fields?: ErpApplicationField[] };
};
type ApplicationMessage = {
  success?: boolean;
  applicant?: string;
  job?: string;
};

const ERP_METHOD_PATH = "/api/method/takeweb_suite.api.website";
const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const RESUME_EXTENSIONS = new Set(["pdf", "doc", "docx"]);

function erpBaseUrl() {
  return process.env.ERP_BASE_URL?.replace(/\/$/, "") || null;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function classifyErpError(status: number, raw: string) {
  const message = raw.toLowerCase();
  const frappeMessage = getFrappeErrorMessage(raw);

  if (status === 404 || message.includes("not found")) {
    return errorResponse("Job not found or no longer published.", 404);
  }
  if (
    message.includes("closed") ||
    message.includes("unpublished") ||
    message.includes("not accepting")
  ) {
    return errorResponse("This job is no longer accepting applications.", 409);
  }
  if (message.includes("duplicate") || message.includes("already applied")) {
    return errorResponse("An application already exists for this email.", 409);
  }
  if (message.includes("email")) {
    return errorResponse("Please provide a valid email address.", 400);
  }
  if (status >= 500) {
    return errorResponse(
      frappeMessage || "ERPNext is currently unavailable.",
      503,
    );
  }
  if (status >= 400) {
    return errorResponse(
      frappeMessage || "ERPNext could not process the request.",
      400,
    );
  }
  return errorResponse(
    frappeMessage || "ERPNext could not process the request.",
    502,
  );
}

function getFrappeErrorMessage(raw: string) {
  try {
    const payload = JSON.parse(raw) as FrappeResponse<unknown>;
    if (!payload._server_messages) return null;
    const messages = JSON.parse(payload._server_messages) as string[];
    const first = messages[0]
      ? (JSON.parse(messages[0]) as { message?: string })
      : null;
    return first?.message || null;
  } catch {
    return null;
  }
}

async function callErp<T>(method: string, body?: Record<string, unknown>) {
  const baseUrl = erpBaseUrl();
  if (!baseUrl) {
    return {
      error: errorResponse("The careers service is not configured.", 503),
    };
  }

  try {
    const response = await fetch(`${baseUrl}${ERP_METHOD_PATH}.${method}`, {
      method: body ? "POST" : "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      ...(body ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
      signal: AbortSignal.timeout(body ? 60000 : 30000),
    });
    const raw = await response.text();

    let payload: FrappeResponse<T>;
    try {
      payload = JSON.parse(raw) as FrappeResponse<T>;
    } catch {
      return {
        error: errorResponse("ERPNext returned an unexpected response.", 502),
      };
    }

    if (!response.ok || payload.message === undefined) {
      return { error: classifyErpError(response.status, raw) };
    }

    return { data: payload.message };
  } catch {
    return { error: errorResponse("ERPNext is currently unavailable.", 503) };
  }
}

async function callErpMultipart<T>(method: string, body: FormData) {
  const baseUrl = erpBaseUrl();
  if (!baseUrl) {
    return {
      error: errorResponse("The careers service is not configured.", 503),
    };
  }

  try {
    const response = await fetch(`${baseUrl}${ERP_METHOD_PATH}.${method}`, {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(60000),
    });
    const raw = await response.text();

    let payload: FrappeResponse<T>;
    try {
      payload = JSON.parse(raw) as FrappeResponse<T>;
    } catch {
      return {
        error: errorResponse("ERPNext returned an unexpected response.", 502),
      };
    }

    if (!response.ok || payload.message === undefined) {
      return { error: classifyErpError(response.status, raw) };
    }

    return { data: payload.message };
  } catch {
    return { error: errorResponse("ERPNext is currently unavailable.", 503) };
  }
}

function formString(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;

  if (path.length === 0) {
    const result = await callErp<JobsMessage>("get_jobs");
    if (result.error) return result.error;
    if (!Array.isArray(result.data?.jobs)) {
      return errorResponse(
        "ERPNext returned an unexpected jobs response.",
        502,
      );
    }
    return NextResponse.json({
      jobs: result.data.jobs,
      count: result.data.count ?? result.data.jobs.length,
    });
  }

  if (path.length === 1) {
    const id = path[0];
    if (!id) return errorResponse("Job not found.", 404);
    const result = await callErp<JobMessage>(
      `get_job?job=${encodeURIComponent(id)}`,
    );
    if (result.error) return result.error;
    if (!result.data?.job?.id) {
      return errorResponse("Job not found or no longer published.", 404);
    }
    return NextResponse.json({ job: result.data.job });
  }

  if (path.length === 2 && path[1] === "application-form") {
    const id = path[0];
    if (!id) return errorResponse("Job not found.", 404);
    const result = await callErp<JobMessage>(
      `get_job?job=${encodeURIComponent(id)}`,
    );
    const fields = result.data?.application_form?.fields;
    if (result.error) return result.error;
    if (!result.data?.job?.id || !Array.isArray(fields)) {
      return errorResponse(
        "ERPNext returned an unexpected application form response.",
        502,
      );
    }
    return NextResponse.json({ job: result.data.job, fields });
  }

  return errorResponse("Career route not found.", 404);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  if (path.length !== 2 || path[1] !== "apply") {
    return errorResponse("Career route not found.", 404);
  }
  const jobId = path[0];
  if (!jobId) return errorResponse("Job not found.", 404);

  const application = await request.formData().catch(() => null);
  if (!application) {
    return errorResponse("Invalid application form submission.", 400);
  }

  const applicantName = formString(application, "applicant_name");
  const email = formString(application, "email_id");
  if (!applicantName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorResponse(
      "Full name and a valid email address are required.",
      400,
    );
  }

  const resume = application.get("resume");
  if (!(resume instanceof File) || !resume.name || resume.size === 0) {
    return errorResponse("Resume is required.", 400);
  }
  const extension = resume.name.split(".").pop()?.toLowerCase();
  if (!extension || !RESUME_EXTENSIONS.has(extension)) {
    return errorResponse("Resume must be a PDF, DOC, or DOCX file.", 400);
  }
  if (resume.size > MAX_RESUME_SIZE) {
    return errorResponse("Resume must be 5 MB or smaller.", 413);
  }

  const answersRaw = formString(application, "answers") || "{}";
  try {
    const answers = JSON.parse(answersRaw) as unknown;
    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      throw new Error("Invalid answers");
    }
  } catch {
    return errorResponse("Application answers are invalid.", 400);
  }

  const erpForm = new FormData();
  erpForm.append("job", jobId);
  erpForm.append("applicant_name", applicantName);
  erpForm.append("email_id", email);
  erpForm.append("phone_number", formString(application, "phone_number"));
  erpForm.append("country", formString(application, "country"));
  erpForm.append("cover_letter", formString(application, "cover_letter"));
  erpForm.append("answers", answersRaw);
  erpForm.append("resume", resume, resume.name);

  const result = await callErpMultipart<ApplicationMessage>(
    "apply_for_job",
    erpForm,
  );
  if (result.error) return result.error;
  if (!result.data?.success) {
    return errorResponse("ERPNext did not accept the application.", 502);
  }

  return NextResponse.json({
    success: true,
    applicant: result.data.applicant,
    job: result.data.job,
  });
}
