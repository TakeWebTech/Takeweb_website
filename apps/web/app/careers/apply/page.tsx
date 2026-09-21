"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Briefcase, Loader2 } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {
  ApplicationField,
  countryCodeFromName,
} from "@/components/application-field";
import { FloatingElements } from "@/components/floating-elements";
import { Card3D } from "@/components/ui/card-3d";
import {
  ApplicationFieldValue,
  careersApi,
  ErpApplicationField,
  ErpJob,
  responseError,
} from "@/lib/careers";

type FormValues = Record<string, ApplicationFieldValue>;
const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const RESUME_EXTENSIONS = ["pdf", "doc", "docx"];
const CORE_FIELD_ORDER = [
  "applicant_name",
  "email_id",
  "country",
  "phone_number",
  "cover_letter",
  "resume",
  "source",
];

function emptyValue(field: ErpApplicationField): ApplicationFieldValue {
  if (field.type === "Multi Select") return [];
  if (field.type === "Checkbox") return false;
  if (field.key === "country") return "India";
  return "";
}

function hasValue(value: ApplicationFieldValue | undefined) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "boolean") return value;
  return Boolean(value?.trim());
}

function normalizedPhone(phone: string, country: string) {
  const parsed = parsePhoneNumberFromString(
    phone.trim(),
    countryCodeFromName(country),
  );
  return parsed?.isValid() ? parsed.number : null;
}

function resumeError(file: File | null, required: boolean) {
  if (!file) return required ? "Resume is required." : null;
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !RESUME_EXTENSIONS.includes(extension)) {
    return "Resume must be a PDF, DOC, or DOCX file.";
  }
  if (file.size > MAX_RESUME_SIZE) {
    return "Resume must be 5 MB or smaller.";
  }
  return null;
}

function ApplyPageContent() {
  const jobId = useSearchParams().get("job");
  const [job, setJob] = useState<ErpJob | null>(null);
  const [fields, setFields] = useState<ErpApplicationField[]>([]);
  const [values, setValues] = useState<FormValues>({});
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!jobId) {
      setLoadError("Please select a job before applying.");
      setLoading(false);
      return;
    }

    fetch(careersApi(`/${encodeURIComponent(jobId)}/application-form`))
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        return response.json();
      })
      .then((data) => {
        const schemaFields = Array.isArray(data.fields)
          ? (data.fields as ErpApplicationField[])
          : [];
        if (!schemaFields.some((field) => field.key === "source")) {
          schemaFields.push({
            key: "source",
            label: "Source",
            type: "Text",
            required: false,
            help_text: "Where did you hear about this opportunity?",
            system: true,
          });
        }
        setJob(data.job);
        setFields(schemaFields);
        setValues(
          Object.fromEntries(
            schemaFields.map((field) => [field.key, emptyValue(field)]),
          ),
        );
      })
      .catch((error) =>
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load the application form.",
        ),
      )
      .finally(() => setLoading(false));
  }, [jobId]);

  const coreFields = useMemo(
    () =>
      fields
        .filter((field) => field.system)
        .sort((a, b) => {
          const aIndex = CORE_FIELD_ORDER.indexOf(a.key);
          const bIndex = CORE_FIELD_ORDER.indexOf(b.key);
          return (
            (aIndex === -1 ? CORE_FIELD_ORDER.length : aIndex) -
            (bIndex === -1 ? CORE_FIELD_ORDER.length : bIndex)
          );
        }),
    [fields],
  );
  const additionalFields = useMemo(
    () => fields.filter((field) => !field.system && field.type !== "File"),
    [fields],
  );

  function updateValue(key: string, value: ApplicationFieldValue) {
    setValues((current) => ({ ...current, [key]: value }));
    setSubmitStatus(null);
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function updateResume(file: File | null) {
    const field = coreFields.find((item) => item.key === "resume");
    const error = resumeError(file, Boolean(field?.required));
    setResume(error ? null : file);
    setSubmitStatus(null);
    setErrors((current) => {
      const next = { ...current };
      if (error) next.resume = error;
      else delete next.resume;
      return next;
    });
  }

  function validate(section: ErpApplicationField[]) {
    const nextErrors: Record<string, string> = {};
    section.forEach((field) => {
      if (field.type === "File") {
        const error = resumeError(resume, field.required);
        if (error) nextErrors[field.key] = error;
        return;
      }
      const value = values[field.key];
      const stringValue = typeof value === "string" ? value.trim() : "";

      if (field.required && !hasValue(value)) {
        nextErrors[field.key] = `${field.label} is required.`;
      } else if (
        (field.key === "email_id" || field.type === "Email") &&
        stringValue &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)
      ) {
        nextErrors[field.key] = "Enter a valid email address.";
      } else if (
        (field.key === "phone_number" || field.type === "Phone") &&
        stringValue &&
        !normalizedPhone(stringValue, String(values.country || "India"))
      ) {
        nextErrors[field.key] =
          "Enter a valid phone number for the selected country.";
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function continueToQuestions() {
    if (validate(coreFields)) setStep(2);
  }

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const visibleFields = additionalFields.length
      ? additionalFields
      : coreFields;
    if (!jobId || !agreed || !validate(visibleFields)) return;

    const answers = Object.fromEntries(
      additionalFields.map((field) => [field.key, values[field.key] ?? ""]),
    );
    const phone = String(values.phone_number || "");
    const formData = new FormData();
    formData.append(
      "applicant_name",
      String(values.applicant_name || "").trim(),
    );
    formData.append("email_id", String(values.email_id || "").trim());
    formData.append(
      "phone_number",
      normalizedPhone(phone, String(values.country || "India")) || phone,
    );
    formData.append("country", String(values.country || ""));
    formData.append("cover_letter", String(values.cover_letter || ""));
    formData.append("source", String(values.source || "").trim());
    formData.append("answers", JSON.stringify(answers));
    if (resume) formData.append("resume", resume, resume.name);

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch(
        careersApi(`/${encodeURIComponent(jobId)}/apply`),
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) throw new Error(await responseError(response));

      setSubmitStatus({
        type: "success",
        message: "Application submitted successfully.",
      });
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

  const activeFields = step === 1 ? coreFields : additionalFields;
  const hasAdditionalQuestions = additionalFields.length > 0;

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
            {loadError ? (
              <Card3D className="p-8">
                <p className="text-red-500" role="alert">
                  {loadError}
                </p>
              </Card3D>
            ) : loading ? (
              <div className="flex flex-col items-center gap-3 py-16 text-[var(--text-tertiary)]">
                <Loader2 className="animate-spin text-amber-500" size={42} />
                Loading application form...
              </div>
            ) : (
              <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-8">
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">
                      Step {step} of {hasAdditionalQuestions ? 2 : 1}
                    </p>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                      {step === 1
                        ? "Basic Information"
                        : "Additional Questions"}
                    </h2>
                    <p className="text-[var(--text-tertiary)]">
                      {step === 1
                        ? "Tell us how we can contact you."
                        : "A few role-specific questions from our hiring team."}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={submitApplication}
                  className="space-y-6"
                  noValidate
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    {activeFields.map((field) => (
                      <div
                        key={field.key}
                        className={
                          field.type === "Long Text" || field.type === "File"
                            ? "sm:col-span-2"
                            : ""
                        }
                      >
                        <ApplicationField
                          field={field}
                          value={values[field.key]}
                          error={errors[field.key]}
                          onChange={(value) => updateValue(field.key, value)}
                          country={String(values.country || "India")}
                          file={field.key === "resume" ? resume : undefined}
                          onFileChange={
                            field.key === "resume" ? updateResume : undefined
                          }
                        />
                      </div>
                    ))}
                  </div>

                  {/* Dynamic ERP file questions remain unsupported for now. */}

                  {(!hasAdditionalQuestions || step === 2) && (
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
                  )}

                  {submitStatus && (
                    <div
                      role="status"
                      className={`p-4 rounded-xl ${submitStatus.type === "success" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                    >
                      {submitStatus.message}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {step === 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          setErrors({});
                          setStep(1);
                        }}
                        className="px-6 py-3 font-semibold text-[var(--text-secondary)] border border-[var(--border-secondary)] rounded-xl hover:border-amber-500 transition-colors"
                      >
                        Back
                      </button>
                    )}
                    {step === 1 && hasAdditionalQuestions ? (
                      <button
                        type="button"
                        onClick={continueToQuestions}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg transition-all"
                      >
                        Continue <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || !agreed}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <ArrowRight size={18} />
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
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
