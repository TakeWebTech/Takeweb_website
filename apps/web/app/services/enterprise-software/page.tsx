import Link from "next/link";
import { Metadata } from "next";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight, Check, Code, Database, GitBranch, Layers, Zap, Shield } from "lucide-react";

export const metadata: Metadata = {
    title: "Enterprise Software Development",
    description: "Custom enterprise software solutions engineered for complex business challenges. From legacy modernization to greenfield development.",
};

const features = [
    { icon: Code, title: "Custom Applications", desc: "Tailored solutions built from the ground up" },
    { icon: Database, title: "API Development", desc: "RESTful & GraphQL APIs at scale" },
    { icon: GitBranch, title: "System Integration", desc: "Connect disparate systems seamlessly" },
    { icon: Layers, title: "Legacy Modernization", desc: "Transform outdated systems" },
    { icon: Zap, title: "High Performance", desc: "Optimized for speed and reliability" },
    { icon: Shield, title: "Enterprise Security", desc: "Bank-grade security standards" },
];

const technologies = [
    "Java", "Spring Boot", ".NET", "Node.js", "Python", "Go",
    "React", "Angular", "Vue.js", "Next.js", "TypeScript",
    "PostgreSQL", "MongoDB", "Redis", "Elasticsearch",
    "AWS", "Azure", "GCP", "Kubernetes", "Docker",
];

const process = [
    { step: "01", title: "Discovery", desc: "Deep dive into requirements" },
    { step: "02", title: "Architecture", desc: "Scalable system design" },
    { step: "03", title: "Development", desc: "Agile sprints with demos" },
    { step: "04", title: "Testing", desc: "Automated QA pipeline" },
    { step: "05", title: "Deployment", desc: "Zero-downtime releases" },
    { step: "06", title: "Support", desc: "24/7 maintenance" },
];

export default function EnterpriseSoftwarePage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            Enterprise Software Development
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Custom Solutions for{" "}
                            <span className="gradient-text">Complex Challenges</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] mb-8">
                            We build scalable, secure, and maintainable enterprise applications
                            that transform how your business operates.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                Get a Quote <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/projects"
                                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-[var(--text-primary)] border-2 border-[var(--border-secondary)] rounded-xl hover:border-amber-500 transition-all"
                            >
                                View Case Studies
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader
                        overline="Capabilities"
                        title="What We"
                        titleHighlight="Deliver"
                    />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <Card3D key={i} className="text-center">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                                <p className="text-sm text-[var(--text-tertiary)]">{feature.desc}</p>
                            </Card3D>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technologies */}
            <section className="section-padding">
                <div className="container-main">
                    <SectionHeader
                        overline="Tech Stack"
                        title="Technologies We"
                        titleHighlight="Master"
                    />
                    <div className="flex flex-wrap justify-center gap-3">
                        {technologies.map((tech) => (
                            <span
                                key={tech}
                                className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full text-sm text-[var(--text-secondary)] hover:border-amber-500/50 hover:text-[var(--text-primary)] transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader
                        overline="Our Process"
                        title="How We"
                        titleHighlight="Work"
                    />
                    <div className="grid md:grid-cols-6 gap-4">
                        {process.map((item, i) => (
                            <div key={i} className="text-center p-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center mx-auto mb-3">
                                    {item.step}
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-1">{item.title}</h4>
                                <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-12 md:p-16 text-center overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-white mb-4">Ready to Build?</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Let&apos;s discuss your project requirements and create something amazing.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                Start Your Project <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
