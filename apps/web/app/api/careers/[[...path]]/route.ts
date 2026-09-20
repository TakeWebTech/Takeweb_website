import { NextRequest, NextResponse } from "next/server";
import type { ErpJob, JobApplicationInput } from "@/lib/careers";

type RouteContext = { params: Promise<{ path?: string[] }> };
type FrappeResponse<T> = { message?: T };
type JobsMessage = { jobs?: ErpJob[]; count?: number };
type JobMessage = { job?: ErpJob };
type ApplicationMessage = { success?: boolean; applicant?: string; job?: string };

const ERP_METHOD_PATH = "/api/method/takeweb_suite.api.website";

function erpBaseUrl() {
  return process.env.ERP_BASE_URL?.replace(/\/$/, "") || null;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function classifyErpError(status: number, raw: string) {
  const message = raw.toLowerCase();

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
    return errorResponse("ERPNext is currently unavailable.", 503);
  }
  return errorResponse("ERPNext could not process the request.", 502);
}

async function callErp<T>(method: string, body?: Record<string, string>) {
  const baseUrl = erpBaseUrl();
  if (!baseUrl) {
    return { error: errorResponse("The careers service is not configured.", 503) };
  }

  try {
    const response = await fetch(`${baseUrl}${ERP_METHOD_PATH}.${method}`, {
      method: body ? "POST" : "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const raw = await response.text();

    let payload: FrappeResponse<T>;
    try {
      payload = JSON.parse(raw) as FrappeResponse<T>;
    } catch {
      return { error: errorResponse("ERPNext returned an unexpected response.", 502) };
    }

    if (!response.ok || payload.message === undefined) {
      return { error: classifyErpError(response.status, raw) };
    }

    return { data: payload.message };
  } catch {
    return { error: errorResponse("ERPNext is currently unavailable.", 503) };
  }
}

function validApplication(value: unknown): value is JobApplicationInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Partial<JobApplicationInput>;
  return Boolean(
    input.applicant_name?.trim() &&
      input.email_id?.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email_id) &&
      input.phone_number?.trim() &&
      input.country?.trim() &&
      (input.cover_letter === undefined || typeof input.cover_letter === "string"),
  );
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;

  if (path.length === 0) {
    const result = await callErp<JobsMessage>("get_jobs");
    if (result.error) return result.error;
    if (!Array.isArray(result.data?.jobs)) {
      return errorResponse("ERPNext returned an unexpected jobs response.", 502);
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

  return errorResponse("Career route not found.", 404);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  if (path.length !== 2 || path[1] !== "apply") {
    return errorResponse("Career route not found.", 404);
  }
  const jobId = path[0];
  if (!jobId) return errorResponse("Job not found.", 404);

  const application = await request.json().catch(() => null);
  if (!validApplication(application)) {
    return errorResponse(
      "Full name, valid email, phone number, and country are required.",
      400,
    );
  }

  const result = await callErp<ApplicationMessage>("apply_for_job", {
    job: jobId,
    applicant_name: application.applicant_name.trim(),
    email_id: application.email_id.trim(),
    phone_number: application.phone_number.trim(),
    country: application.country.trim(),
    cover_letter: application.cover_letter?.trim() || "",
  });
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
