"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  Loader2,
  MapPin,
} from "lucide-react";
import { Card3D } from "@/components/ui/card-3d";
import {
  careersApi,
  ErpJob,
  formatJobDate,
  responseError,
} from "@/lib/careers";

export default function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [job, setJob] = useState<ErpJob | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(careersApi(`/${encodeURIComponent(id)}`))
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        return response.json();
      })
      .then((data) => setJob(data.job))
      .catch((reason) =>
        setError(
          reason instanceof Error ? reason.message : "Unable to load this job.",
        ),
      );
  }, [id]);

  return (
    <section className="pt-32 pb-20 min-h-screen">
      <div className="container-main max-w-4xl">
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-[var(--text-tertiary)] hover:text-amber-500 mb-8"
        >
          <ArrowLeft size={18} /> Back to Careers
        </Link>

        {error && (
          <Card3D className="p-8">
            <p className="text-red-500" role="alert">
              {error}
            </p>
          </Card3D>
        )}
        {!job && !error && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-amber-500" size={42} />
          </div>
        )}

        {job && (
          <Card3D className="p-8 md:p-10">
            <div className="flex flex-wrap justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                  {job.title}
                </h1>
                {job.designation && (
                  <p className="text-lg text-[var(--text-secondary)]">
                    {job.designation}
                  </p>
                )}
              </div>
              {job.employment_type && (
                <span className="h-fit px-3 py-1.5 text-sm bg-amber-500/10 text-amber-500 rounded-full">
                  {job.employment_type}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 pb-6 border-b border-[var(--border-primary)] text-sm text-[var(--text-tertiary)]">
              {job.department && (
                <span className="flex items-center gap-2">
                  <Briefcase size={16} />
                  {job.department}
                </span>
              )}
              {job.location && (
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {job.location}
                </span>
              )}
              {job.posted_on && (
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  Posted {formatJobDate(job.posted_on)}
                </span>
              )}
              {job.closes_on && (
                <span>Closes {formatJobDate(job.closes_on)}</span>
              )}
            </div>

            {job.salary !== null && job.salary !== "" && (
              <div className="my-6 p-4 bg-amber-500/10 rounded-xl">
                <div className="text-sm text-amber-500 font-medium">
                  Compensation
                </div>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  {job.salary}
                </div>
              </div>
            )}

            <div className="my-8">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                About the Role
              </h2>
              <p className="text-[var(--text-tertiary)] whitespace-pre-wrap">
                {job.description ||
                  "Details will be shared during the application process."}
              </p>
            </div>

            <Link
              href={`/careers/apply?job=${encodeURIComponent(job.id)}`}
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg transition-all"
            >
              Apply Now <ArrowRight size={18} />
            </Link>
          </Card3D>
        )}
      </div>
    </section>
  );
}
