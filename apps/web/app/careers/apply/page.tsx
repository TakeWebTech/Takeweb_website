"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Briefcase, Loader2 } from "lucide-react";
import { FloatingElements } from "@/components/floating-elements";
import { Card3D } from "@/components/ui/card-3d";
import {
  careersApi,
  ErpJob,
  JobApplicationInput,
  responseError,
} from "@/lib/careers";

const initialForm: JobApplicationInput = {
  applicant_name: "",
  email_id: "",
  phone_number: "",
  country: "India",
  cover_letter: "",
};

const inputClass =
  "w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500";

function ApplyPageContent() {
  const jobId = useSearchParams().get("job");
  const [job, setJob] = useState<ErpJob | null>(null);
  const [jobError, setJobError] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!jobId) {
      setJobError("Please select a job before applying.");
      return;
    }

    fetch(careersApi(`/${encodeURIComponent(jobId)}`))
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        return response.json();
      })
      .then((data) => setJob(data.job))
      .catch((error) =>
        setJobError(
          error instanceof Error ? error.message : "Unable to load this job.",
        ),
      );
  }, [jobId]);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!jobId || !agreed) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch(
        careersApi(`/${encodeURIComponent(jobId)}/apply`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      if (!response.ok) throw new Error(await responseError(response));

      setSubmitStatus({
        type: "success",
        message: "Application submitted successfully.",
      });
      setFormData(initialForm);
      setAgreed(false);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit your application.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="relative pt-32 pb-12 overflow-hidden">
        <FloatingElements />
        <div className="container-main relative z-10">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <ArrowLeft size={18} /> Back to Careers
          </Link>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
              {job ? `Apply for ${job.title}` : "Job Application"}
            </h1>
            {job && (
              <p className="text-[var(--text-tertiary)] flex items-center gap-2">
                <Briefcase size={18} />{" "}
                {[job.designation, job.department, job.location]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            {jobError ? (
              <Card3D className="p-8">
                <p className="text-red-500" role="alert">
                  {jobError}
                </p>
              </Card3D>
            ) : !job ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-amber-500" size={42} />
              </div>
            ) : (
              <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-8">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                  Your Details
                </h2>
                <p className="text-[var(--text-tertiary)] mb-8">
                  Complete the form below to apply for this position.
                </p>

                <form onSubmit={submitApplication} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name" required>
                      <input
                        required
                        value={formData.applicant_name}
                        onChange={(event) =>
                          setFormData((value) => ({
                            ...value,
                            applicant_name: event.target.value,
                          }))
                        }
                        className={inputClass}
                        autoComplete="name"
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        required
                        type="email"
                        value={formData.email_id}
                        onChange={(event) =>
                          setFormData((value) => ({
                            ...value,
                            email_id: event.target.value,
                          }))
                        }
                        className={inputClass}
                        autoComplete="email"
                      />
                    </Field>
                    <Field label="Phone" required>
                      <input
                        required
                        type="tel"
                        value={formData.phone_number}
                        onChange={(event) =>
                          setFormData((value) => ({
                            ...value,
                            phone_number: event.target.value,
                          }))
                        }
                        className={inputClass}
                        autoComplete="tel"
                      />
                    </Field>
                    <Field label="Country" required>
                      <input
                        required
                        value={formData.country}
                        onChange={(event) =>
                          setFormData((value) => ({
                            ...value,
                            country: event.target.value,
                          }))
                        }
                        className={inputClass}
                        autoComplete="country-name"
                      />
                    </Field>
                  </div>

                  <Field label="Cover Letter">
                    <textarea
                      value={formData.cover_letter}
                      onChange={(event) =>
                        setFormData((value) => ({
                          ...value,
                          cover_letter: event.target.value,
                        }))
                      }
                      rows={7}
                      className={`${inputClass} resize-none`}
                      placeholder="Tell us why you are interested in this role..."
                    />
                  </Field>

                  {/* Resume upload will be added after ERPNext file handling is implemented. */}

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(event) => setAgreed(event.target.checked)}
                      className="mt-1"
                      required
                    />
                    <span className="text-sm text-[var(--text-tertiary)]">
                      I agree to TakeWeb&apos;s{" "}
                      <Link
                        href="/privacy"
                        className="text-amber-500 hover:underline"
                      >
                        Privacy Policy
                      </Link>{" "}
                      and consent to recruitment data processing.
                    </span>
                  </label>

                  {submitStatus && (
                    <div
                      role="status"
                      className={`p-4 rounded-xl ${submitStatus.type === "success" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                    >
                      {submitStatus.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !agreed}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <ArrowRight size={18} />
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-[var(--text-muted)] mb-2 block">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-amber-500" size={48} />
        </div>
      }
    >
      <ApplyPageContent />
    </Suspense>
  );
}
