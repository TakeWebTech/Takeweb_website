import Link from "next/link";
import { Metadata } from "next";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight, Code, Smartphone, Globe, GitBranch, TestTube, Rocket } from "lucide-react";

export const metadata: Metadata = {
    title: "Software Development",
    description: "Full-stack custom software development services including web apps, mobile apps, APIs, and cloud-native solutions with agile methodologies.",
};

const capabilities = [
    { icon: Globe, title: "Web Applications", desc: "React, Next.js, Angular & Vue.js applications" },
    { icon: Smartphone, title: "Mobile Development", desc: "iOS, Android, React Native & Flutter" },
    { icon: Code, title: "API Development", desc: "RESTful, GraphQL & microservices architecture" },
    { icon: GitBranch, title: "Agile Methodology", desc: "Scrum, Kanban & continuous iteration" },
    { icon: TestTube, title: "Quality Assurance", desc: "Automated testing, code reviews & CI/CD" },
    { icon: Rocket, title: "DevOps & Deployment", desc: "Containerization, Kubernetes & cloud deployment" },
];

export default function SoftwareDevelopmentPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            Software Development
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Custom Software Built for{" "}
                            <span className="gradient-text">Your Business</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] mb-8">
                            From concept to deployment, we build high-quality custom software
                            using modern technologies, agile practices, and rigorous testing.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            Start Your Project <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Capabilities */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader overline="Capabilities" title="Software" titleHighlight="Development" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {capabilities.map((cap, i) => (
                            <Card3D key={i} className="text-center">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                                    <cap.icon size={28} />
                                </div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{cap.title}</h3>
                                <p className="text-sm text-[var(--text-tertiary)]">{cap.desc}</p>
                            </Card3D>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-12 md:p-16 text-center overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-white mb-4">Build Something Amazing</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Let&apos;s create software that solves real problems and delights users.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                Get Started <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
