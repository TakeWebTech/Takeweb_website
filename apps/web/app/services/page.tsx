import Link from "next/link";
import { Metadata } from "next";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/ui/section-header";
import { FloatingElements } from "@/components/floating-elements";
import { ArrowRight, Code, Cloud, Shield, Cpu, Smartphone, BarChart3, Check } from "lucide-react";

export const metadata: Metadata = {
    title: "Services",
    description: "Comprehensive enterprise IT solutions including software development, cloud services, AI integration, cybersecurity, and digital transformation.",
};

// Icon mapping for services
const iconMap: Record<string, any> = {
    code: Code,
    cloud: Cloud,
    shield: Shield,
    cpu: Cpu,
    smartphone: Smartphone,
    chart: BarChart3,
};

interface Service {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    icon: string;
    features: string[];
    sortOrder: number;
    isActive: boolean;
}

async function getServices(): Promise<Service[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/services`,
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.filter((s: Service) => s.isActive).sort((a: Service, b: Service) => a.sortOrder - b.sortOrder);
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return [];
    }
}

const workflowSteps = [
    {
        step: "01",
        title: "Discovery",
        description: "We dive deep into understanding your business challenges, goals, and technical requirements.",
    },
    {
        step: "02",
        title: "Strategy",
        description: "Our team creates a comprehensive roadmap with clear milestones and deliverables.",
    },
    {
        step: "03",
        title: "Development",
        description: "Agile development with regular demos and feedback cycles to ensure alignment.",
    },
    {
        step: "04",
        title: "Deployment",
        description: "Smooth rollout with comprehensive testing, training, and documentation.",
    },
    {
        step: "05",
        title: "Support",
        description: "Ongoing maintenance, optimization, and 24/7 support to ensure continued success.",
    },
];

const gradients = [
    "from-blue-500 to-cyan-500",
    "from-violet-500 to-purple-500",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-pink-500",
    "from-emerald-500 to-teal-500",
    "from-indigo-500 to-blue-500",
];

export default async function ServicesPage() {
    const services = await getServices();

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />

                <div className="container-main relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4">
                            Our Services
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Enterprise IT Solutions{" "}
                            <span className="gradient-text">That Drive Results</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)]">
                            From strategy to execution, we deliver comprehensive technology solutions
                            that help enterprises innovate, scale, and succeed in the digital age.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section-padding">
                <div className="container-main">
                    {services.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-[var(--text-tertiary)]">Our services will be available soon.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => {
                                const IconComponent = iconMap[service.icon?.toLowerCase()] || Code;
                                const gradient = gradients[index % gradients.length];

                                return (
                                    <Link key={service.id} href={`/services/${service.slug}`}>
                                        <Card3D className="h-full group cursor-pointer">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6`}>
                                                <IconComponent className="text-white" size={28} />
                                            </div>

                                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3 group-hover:text-primary-500 transition-colors">
                                                {service.title}
                                            </h3>

                                            <p className="text-[var(--text-tertiary)] mb-6">
                                                {service.shortDescription || service.description}
                                            </p>

                                            {service.features && service.features.length > 0 && (
                                                <ul className="space-y-2 mb-6">
                                                    {service.features.slice(0, 4).map((feature, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                            <Check size={14} className="text-primary-500 flex-shrink-0" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-500 group-hover:gap-2 transition-all">
                                                Learn more <ArrowRight size={14} />
                                            </span>
                                        </Card3D>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Process Section */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader
                        overline="Our Process"
                        title="How We"
                        titleHighlight="Deliver Excellence"
                        description="A proven methodology that ensures successful outcomes for every project."
                    />

                    <div className="grid md:grid-cols-5 gap-6">
                        {workflowSteps.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-primary-500/10 text-primary-500 font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                                        {item.step}
                                    </div>
                                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-[var(--text-tertiary)]">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Connector */}
                                {index < workflowSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-primary-500/50 to-transparent" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 md:p-16 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-white mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                Let&apos;s discuss your project requirements and how we can help you achieve your goals.
                            </p>

                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                Schedule a Consultation
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
