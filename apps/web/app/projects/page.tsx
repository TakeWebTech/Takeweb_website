import { Metadata } from "next";
import Link from "next/link";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Projects & Case Studies",
    description:
        "Explore TakeWeb's portfolio of successful enterprise projects and digital transformation case studies.",
};

const projects = [
    {
        slug: "fintech-platform-modernization",
        title: "FinTech Platform Modernization",
        client: "Global Financial Services Corp",
        industry: "Finance",
        description: "Modernized legacy banking platform to cloud-native microservices, reducing transaction latency by 80%.",
        technologies: ["AWS", "Kubernetes", "Java", "React"],
        outcome: "80% faster transactions",
    },
    {
        slug: "ai-powered-healthcare",
        title: "AI-Powered Healthcare Diagnostics",
        client: "Healthcare Systems Ltd",
        industry: "Healthcare",
        description: "Built ML-powered diagnostic assistant that improved early disease detection accuracy by 35%.",
        technologies: ["Python", "TensorFlow", "Azure", "Next.js"],
        outcome: "35% better accuracy",
    },
    {
        slug: "retail-digital-transformation",
        title: "Retail Digital Transformation",
        client: "National Retail Chain",
        industry: "Retail",
        description: "End-to-end digital transformation including e-commerce, inventory, and customer experience platforms.",
        technologies: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
        outcome: "150% revenue growth",
    },
    {
        slug: "manufacturing-iot-platform",
        title: "Manufacturing IoT Platform",
        client: "Industrial Manufacturing Inc",
        industry: "Manufacturing",
        description: "Connected factory solution with real-time monitoring, predictive maintenance, and analytics.",
        technologies: ["Azure IoT", "Python", "React", "TimescaleDB"],
        outcome: "40% reduced downtime",
    },
    {
        slug: "government-citizen-portal",
        title: "Government Citizen Portal",
        client: "State Government Agency",
        industry: "Government",
        description: "Unified digital services portal serving 50 million citizens with 200+ government services.",
        technologies: ["Angular", "Spring Boot", "Oracle", "Kubernetes"],
        outcome: "50M+ citizens served",
    },
    {
        slug: "logistics-optimization",
        title: "Logistics Optimization System",
        client: "Global Logistics Corp",
        industry: "Logistics",
        description: "AI-driven route optimization and fleet management reducing operational costs significantly.",
        technologies: ["Python", "ML", "React", "GCP"],
        outcome: "25% cost reduction",
    },
];

export default function ProjectsPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4">
                            Projects & Case Studies
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Real Results for{" "}
                            <span className="gradient-text">Real Enterprises</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)]">
                            Explore how we&apos;ve helped enterprises across industries achieve
                            their digital transformation goals.
                        </p>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((project) => (
                            <Link key={project.slug} href={`/projects/${project.slug}`}>
                                <Card3D className="h-full group cursor-pointer overflow-hidden p-0">
                                    {/* Project visual */}
                                    <div className="aspect-video bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center relative">
                                        <div className="text-6xl opacity-30">🚀</div>
                                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[var(--bg-primary)]/80 text-xs text-[var(--text-secondary)]">
                                            {project.industry}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2 group-hover:text-primary-500 transition-colors">
                                            {project.title}
                                        </h2>
                                        <p className="text-sm text-[var(--text-muted)] mb-3">{project.client}</p>
                                        <p className="text-[var(--text-tertiary)] mb-4">{project.description}</p>

                                        {/* Technologies */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.technologies.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-1 rounded bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)]"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Outcome */}
                                        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-primary)]">
                                            <span className="text-sm text-[var(--text-muted)]">Key Outcome</span>
                                            <span className="font-semibold text-primary-500">{project.outcome}</span>
                                        </div>
                                    </div>
                                </Card3D>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 md:p-16 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-white mb-4">
                                Ready to Be Our Next Success Story?
                            </h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Let&apos;s discuss how we can help you achieve similar results.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                Start a Conversation
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
