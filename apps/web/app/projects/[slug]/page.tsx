import Image from "next/image";
import { notFound } from "next/navigation";
import { FloatingElements } from "@/components/floating-elements";
import { getProjects } from "@/lib/strapi";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = (await getProjects()).find((item) => item.slug === slug);

    if (!project) notFound();

    return (
        <>
            <section className="relative pt-32 pb-12 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <span className="text-sm font-semibold uppercase tracking-widest text-primary-500">
                            {project.industry || "Case Study"}
                        </span>
                        <h1 className="text-[var(--text-primary)] mt-4 mb-6">{project.title}</h1>
                        <p className="text-lg text-[var(--text-tertiary)]">{project.shortDescription || project.description}</p>
                    </div>
                </div>
            </section>

            {project.coverImage && (
                <div className="container-main pb-12">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-[var(--border-primary)]">
                        <Image src={project.coverImage} alt={project.title} fill className="object-cover" />
                    </div>
                </div>
            )}

            <section className="container-main max-w-4xl pb-24">
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)]">
                        <div className="text-sm text-[var(--text-muted)] mb-1">Client</div>
                        <div className="font-semibold text-[var(--text-primary)]">{project.client || "TakeWeb Client"}</div>
                    </div>
                    <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)]">
                        <div className="text-sm text-[var(--text-muted)] mb-1">Industry</div>
                        <div className="font-semibold text-[var(--text-primary)]">{project.industry || "Technology"}</div>
                    </div>
                    <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)]">
                        <div className="text-sm text-[var(--text-muted)] mb-1">Outcome</div>
                        <div className="font-semibold text-primary-500">{project.results || "Delivered successfully"}</div>
                    </div>
                </div>

                <div className="space-y-10 text-[var(--text-secondary)]">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Challenge</h2>
                        <p className="whitespace-pre-line">{project.challenge}</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Solution</h2>
                        <p className="whitespace-pre-line">{project.solution}</p>
                    </div>
                    {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                                <span key={tech} className="px-3 py-1 rounded bg-[var(--bg-tertiary)] text-sm">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
