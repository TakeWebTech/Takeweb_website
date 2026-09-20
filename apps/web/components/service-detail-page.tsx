import Link from "next/link";
import { notFound } from "next/navigation";
import { FloatingElements } from "@/components/floating-elements";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/ui/section-header";
import { getServiceBySlug } from "@/lib/strapi";
import { ArrowRight, Check, Code } from "lucide-react";

export async function ServiceDetailPage({ slug }: { slug: string }) {
    const service = await getServiceBySlug(slug);
    if (!service) notFound();

    const features = Array.isArray(service.features) ? service.features as string[] : [];
    const technologies = Array.isArray(service.technologies) ? service.technologies as string[] : [];

    return (
        <>
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            {service.title}
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            {service.title}{" "}
                            <span className="gradient-text">Solutions</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] mb-8">
                            {service.description || service.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                Get a Quote <ArrowRight size={18} />
                            </Link>
                            <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-[var(--text-primary)] border-2 border-[var(--border-secondary)] rounded-xl hover:border-amber-500 transition-all">
                                View Case Studies
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader overline="Capabilities" title="What We" titleHighlight="Deliver" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <Card3D key={feature} className="text-center">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                                    <Check size={28} />
                                </div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{feature}</h3>
                                <p className="text-sm text-[var(--text-tertiary)]">{service.shortDescription}</p>
                            </Card3D>
                        ))}
                    </div>
                </div>
            </section>

            {!!technologies.length && (
                <section className="section-padding">
                    <div className="container-main">
                        <SectionHeader overline="Tech Stack" title="Technologies We" titleHighlight="Use" />
                        <div className="flex flex-wrap justify-center gap-3">
                            {technologies.map((tech) => (
                                <span key={tech} className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full text-sm text-[var(--text-secondary)]">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-12 md:p-16 text-center overflow-hidden">
                        <Code className="text-white/20 mx-auto mb-4" size={48} />
                        <h2 className="text-white mb-4">Ready to Build?</h2>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                            Let&apos;s discuss your requirements and create a solution that fits your business.
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all">
                            Start Your Project <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
