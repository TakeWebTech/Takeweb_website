"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FloatingElements } from "@/components/floating-elements";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/ui/section-header";
import type { SitePageContent } from "@/lib/strapi";
import {
    AlertTriangle,
    ArrowRight,
    Award,
    BarChart3,
    Calendar,
    CheckCircle2,
    Clock,
    Cloud,
    Code,
    Database,
    Eye,
    FileCheck,
    Globe,
    Github,
    Handshake,
    Heart,
    Instagram,
    Lightbulb,
    Linkedin,
    Lock,
    Mail,
    MapPin,
    Phone,
    Rocket,
    Send,
    Server,
    Shield,
    Target,
    Twitter,
    Users,
    X,
    Zap,
} from "lucide-react";

const iconMap = {
    "alert-triangle": AlertTriangle,
    award: Award,
    chart: BarChart3,
    calendar: Calendar,
    clock: Clock,
    cloud: Cloud,
    code: Code,
    database: Database,
    eye: Eye,
    "file-check": FileCheck,
    globe: Globe,
    handshake: Handshake,
    heart: Heart,
    lightbulb: Lightbulb,
    lock: Lock,
    mail: Mail,
    "map-pin": MapPin,
    phone: Phone,
    rocket: Rocket,
    send: Send,
    server: Server,
    shield: Shield,
    target: Target,
    users: Users,
    zap: Zap,
};

type Person = {
    uid?: string;
    name: string;
    role?: string;
    image?: string;
    imageFallback?: string;
    bio?: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
    website?: string;
};

function getIcon(name?: string) {
    return iconMap[(name || "target").toLowerCase() as keyof typeof iconMap] || Target;
}

function gridClass(columns?: unknown) {
    if (columns === 1) return "grid gap-6 max-w-3xl mx-auto";
    if (columns === 2) return "grid md:grid-cols-2 gap-8";
    if (columns === 4) return "grid sm:grid-cols-2 lg:grid-cols-4 gap-6";
    return "grid md:grid-cols-3 gap-8";
}

function CtaButton({ cta }: { cta?: { label?: string; href?: string; variant?: string } }) {
    if (!cta?.label || !cta.href) return null;
    const secondary = cta.variant === "secondary";
    return (
        <Link
            href={cta.href}
            className={secondary
                ? "inline-flex items-center gap-2 px-8 py-4 font-semibold text-[var(--text-primary)] border-2 border-[var(--border-secondary)] rounded-xl hover:border-amber-500 hover:text-amber-500 transition-all"
                : "inline-flex items-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all group"}
        >
            {cta.label}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
        </Link>
    );
}

export function CmsPageRenderer({ page }: { page: SitePageContent }) {
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    return (
        <>
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className={page.hero?.image ? "grid lg:grid-cols-2 gap-16 items-center" : "max-w-3xl mx-auto text-center"}>
                        <div>
                            {page.hero?.overline && <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">{page.hero.overline}</span>}
                            <h1 className="text-[var(--text-primary)] mb-6">
                                {page.hero?.title || page.title}{" "}
                                {page.hero?.titleHighlight && <span className="gradient-text">{page.hero.titleHighlight}</span>}
                            </h1>
                            {page.hero?.description && <p className="text-lg text-[var(--text-tertiary)] mb-8">{page.hero.description}</p>}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <CtaButton cta={page.hero?.primaryCta as { label?: string; href?: string; variant?: string }} />
                                <CtaButton cta={page.hero?.secondaryCta as { label?: string; href?: string; variant?: string }} />
                            </div>
                        </div>
                        {page.hero?.image && (
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)]">
                                <Image src={page.hero.image} alt={page.title} fill className="object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {page.sections?.map((section, index) => {
                const component = section.__component;

                if (component === "page.card-grid-section") {
                    const heading = section.heading as { overline?: string; title?: string; titleHighlight?: string; description?: string } | undefined;
                    const cards = (section.cards || []) as Array<{ icon?: string; title: string; description?: string; href?: string; badge?: string }>;
                    const body = (
                        <div className={gridClass(section.columns)}>
                            {cards.map((card, cardIndex) => {
                                const Icon = getIcon(card.icon);
                                const content = (
                                    <Card3D className="h-full text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                                            <Icon size={28} />
                                        </div>
                                        <h3 className="font-semibold text-[var(--text-primary)] mb-2">{card.title}</h3>
                                        {card.description && <p className="text-sm text-[var(--text-tertiary)]">{card.description}</p>}
                                        {card.badge && <p className="text-xs text-amber-500 mt-4">{card.badge}</p>}
                                    </Card3D>
                                );
                                return card.href ? <Link key={cardIndex} href={card.href}>{content}</Link> : <div key={cardIndex}>{content}</div>;
                            })}
                        </div>
                    );
                    return (
                        <section key={index} className={`section-padding ${section.background === "secondary" ? "bg-[var(--bg-secondary)]" : ""}`}>
                            <div className="container-main">
                                {heading?.title && <SectionHeader overline={heading.overline} title={heading.title} titleHighlight={heading.titleHighlight} description={heading.description} />}
                                {body}
                            </div>
                        </section>
                    );
                }

                if (component === "page.people-section") {
                    const heading = section.heading as { overline?: string; title?: string; titleHighlight?: string; description?: string } | undefined;
                    const people = (section.people || []) as Person[];
                    return (
                        <section key={index} className={`section-padding ${section.background === "secondary" ? "bg-[var(--bg-secondary)]" : ""}`}>
                            <div className="container-main">
                                {heading?.title && <SectionHeader overline={heading.overline} title={heading.title} titleHighlight={heading.titleHighlight} description={heading.description} />}
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {people.map((person) => (
                                        <button key={person.uid || person.name} onClick={() => setSelectedPerson(person)} className="text-left group">
                                            <Card3D className="text-center overflow-hidden p-0">
                                                <div className="relative aspect-square">
                                                    <Image src={person.image || person.imageFallback || "/founder.jpg"} alt={person.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <div className="p-6">
                                                    <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-amber-500 transition-colors">{person.name}</h4>
                                                    <p className="text-sm text-[var(--text-tertiary)]">{person.role}</p>
                                                </div>
                                            </Card3D>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                }

                if (component === "page.timeline-section") {
                    const heading = section.heading as { overline?: string; title?: string; titleHighlight?: string } | undefined;
                    const items = (section.items || []) as Array<{ year: string; title: string; description?: string }>;
                    return (
                        <section key={index} className="section-padding">
                            <div className="container-main">
                                {heading?.title && <SectionHeader overline={heading.overline} title={heading.title} titleHighlight={heading.titleHighlight} />}
                                <div className="space-y-8">
                                    {items.map((item) => (
                                        <div key={`${item.year}-${item.title}`} className="p-6 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl max-w-3xl mx-auto">
                                            <div className="text-sm font-bold text-amber-500 mb-1">{item.year}</div>
                                            <h4 className="font-semibold text-[var(--text-primary)] mb-1">{item.title}</h4>
                                            <p className="text-sm text-[var(--text-tertiary)]">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                }

                if (component === "page.legal-content-section") {
                    const sections = (section.sections || []) as Array<{ title: string; body?: string; items?: Array<{ text: string }> }>;
                    const cta = section.cta as { label?: string; href?: string; variant?: string } | undefined;
                    return (
                        <section key={index} className="section-padding">
                            <div className="container-main">
                                <div className="max-w-3xl mx-auto space-y-10">
                                    {sections.map((item) => (
                                        <div key={item.title}>
                                            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">{item.title}</h2>
                                            {item.body && <p className="text-[var(--text-tertiary)] mb-3">{item.body}</p>}
                                            {!!item.items?.length && (
                                                <ul className="list-disc pl-6 text-[var(--text-tertiary)] space-y-2">
                                                    {item.items.map((listItem) => <li key={listItem.text}>{listItem.text}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                    <CtaButton cta={cta} />
                                </div>
                            </div>
                        </section>
                    );
                }

                if (component === "page.contact-section") {
                    const methods = (section.methods || []) as Array<{ icon?: string; title: string; value: string; href?: string }>;
                    const trustItems = (section.trustItems || []) as Array<{ text: string }>;
                    return (
                        <section key={index} className="section-padding">
                            <div className="container-main">
                                <div className="grid lg:grid-cols-2 gap-16">
                                    <Card3D className="p-8 md:p-10">
                                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">{String(section.formTitle || "Send Us a Message")}</h2>
                                        <ContactForm />
                                    </Card3D>
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">{String(section.infoTitle || "Get in Touch")}</h2>
                                        {Boolean(section.infoDescription) && <p className="text-[var(--text-tertiary)] mb-8">{String(section.infoDescription)}</p>}
                                        <div className="space-y-4 mb-10">
                                            {methods.map((method) => {
                                                const Icon = getIcon(method.icon);
                                                const value = <span className="text-[var(--text-primary)] font-medium">{method.value}</span>;
                                                return (
                                                    <div key={method.title} className="flex items-start gap-4 p-5 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl">
                                                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0"><Icon size={24} /></div>
                                                        <div>
                                                            <div className="text-sm text-[var(--text-muted)] mb-1">{method.title}</div>
                                                            {method.href ? <a href={method.href}>{value}</a> : value}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {Boolean(section.scheduleTitle) && (
                                            <Card3D className="p-8 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
                                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{String(section.scheduleTitle)}</h3>
                                                {Boolean(section.scheduleDescription) && <p className="text-sm text-[var(--text-tertiary)] mb-4">{String(section.scheduleDescription)}</p>}
                                                <CtaButton cta={section.scheduleCta as { label?: string; href?: string; variant?: string }} />
                                            </Card3D>
                                        )}
                                    </div>
                                </div>
                                {!!trustItems.length && <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-[var(--text-muted)]">{trustItems.map((item) => <span key={item.text} className="flex items-center gap-2"><CheckCircle2 size={18} className="text-green-500" />{item.text}</span>)}</div>}
                            </div>
                        </section>
                    );
                }

                if (component === "page.status-section") {
                    const systems = (section.systems || []) as Array<{ name: string; uptime?: string; latency?: string }>;
                    const incidents = (section.incidents || []) as Array<{ date: string; title: string; status?: string; type?: string }>;
                    return (
                        <main key={index} className="container-main pb-20 relative z-10">
                            <div className="mb-12 p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center"><CheckCircle2 className="text-white" size={32} /></div>
                                    <div><h2 className="text-2xl font-bold">{String(section.overallStatus || "All Systems Operational")}</h2><p className="text-emerald-500/70">{String(section.verifiedText || "")}</p></div>
                                </div>
                                <div className="flex gap-8">
                                    <div className="text-center"><div className="text-2xl font-bold">{String(section.uptimeValue || "")}</div><div className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{String(section.uptimeLabel || "")}</div></div>
                                    <div className="text-center"><div className="text-2xl font-bold">{String(section.latencyValue || "")}</div><div className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{String(section.latencyLabel || "")}</div></div>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                                {systems.map((system) => <Card3D key={system.name}><h3 className="font-semibold mb-4">{system.name}</h3><p className="text-sm text-[var(--text-tertiary)]">Uptime: {system.uptime}</p><p className="text-sm text-[var(--text-tertiary)]">Latency: {system.latency}</p></Card3D>)}
                            </div>
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2"><Clock className="text-amber-500" size={24} />Past Incidents</h3>
                            <div className="space-y-4">{incidents.map((incident) => <div key={`${incident.date}-${incident.title}`} className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] flex items-center justify-between"><div><p className="text-sm font-bold text-[var(--text-muted)] mb-1">{incident.date}</p><h4 className="font-semibold">{incident.title}</h4></div><span className="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-emerald-500/10 text-emerald-500">{incident.status}</span></div>)}</div>
                        </main>
                    );
                }

                if (component === "home.cta-section") {
                    return (
                        <section key={index} className="section-padding">
                            <div className="container-main">
                                <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-12 md:p-16 text-center overflow-hidden">
                                    <h2 className="text-white mb-4">{String(section.title || "")}</h2>
                                    {Boolean(section.description) && <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">{String(section.description)}</p>}
                                    <CtaButton cta={section.primaryCta as { label?: string; href?: string; variant?: string }} />
                                </div>
                            </div>
                        </section>
                    );
                }

                return null;
            })}

            {selectedPerson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedPerson(null)}>
                    <div className="relative max-w-2xl w-full bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl shadow-2xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
                        <button onClick={() => setSelectedPerson(null)} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[var(--bg-tertiary)]"><X size={20} /></button>
                        <div className="grid md:grid-cols-2">
                            <div className="relative aspect-square"><Image src={selectedPerson.image || selectedPerson.imageFallback || "/founder.jpg"} alt={selectedPerson.name} fill className="object-cover" /></div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{selectedPerson.name}</h3>
                                <p className="text-amber-500 font-medium mb-6">{selectedPerson.role}</p>
                                <p className="text-[var(--text-tertiary)] mb-6 leading-relaxed">{selectedPerson.bio}</p>
                                {selectedPerson.email && <a href={`mailto:${selectedPerson.email}`} className="text-amber-500 hover:underline">{selectedPerson.email}</a>}
                                <div className="flex items-center gap-3 mt-5">
                                    {selectedPerson.linkedin && <SocialLink href={selectedPerson.linkedin} label="LinkedIn"><Linkedin size={18} /></SocialLink>}
                                    {selectedPerson.twitter && <SocialLink href={selectedPerson.twitter} label="Twitter"><Twitter size={18} /></SocialLink>}
                                    {selectedPerson.instagram && <SocialLink href={selectedPerson.instagram} label="Instagram"><Instagram size={18} /></SocialLink>}
                                    {selectedPerson.github && <SocialLink href={selectedPerson.github} label="GitHub"><Github size={18} /></SocialLink>}
                                    {selectedPerson.website && <SocialLink href={selectedPerson.website} label="Website"><Globe size={18} /></SocialLink>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-primary)] text-[var(--text-tertiary)] transition-colors hover:border-amber-500 hover:text-amber-500"
        >
            {children}
        </a>
    );
}

function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setStatus(null);
        const form = new FormData(event.currentTarget);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${form.get("firstName")} ${form.get("lastName")}`,
                    email: form.get("email"),
                    company: form.get("company"),
                    subject: form.get("service") || "General Inquiry",
                    message: form.get("message"),
                }),
            });
            setStatus(res.ok ? "Thank you! We'll get back to you soon." : "Failed to send message. Please try again.");
            if (res.ok) event.currentTarget.reset();
        } catch {
            setStatus("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {status && <div className="p-4 rounded-xl bg-amber-500/10 text-amber-500">{status}</div>}
            <div className="grid sm:grid-cols-2 gap-6">
                <input name="firstName" required className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl" placeholder="First name" />
                <input name="lastName" required className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl" placeholder="Last name" />
            </div>
            <input name="email" type="email" required className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl" placeholder="Email address" />
            <input name="company" className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl" placeholder="Company" />
            <select name="service" className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl">
                <option value="">Select a service</option>
                <option value="enterprise-software">Enterprise Software Development</option>
                <option value="cloud-devops">Cloud & DevOps</option>
                <option value="ai-data">AI & Data Engineering</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="web-mobile">Web & Mobile Development</option>
                <option value="consulting">IT Consulting</option>
            </select>
            <textarea name="message" rows={5} required className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl resize-none" placeholder="Tell us about your project..." />
            <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl disabled:opacity-50">
                <Send size={18} />
                {loading ? "Sending..." : "Send Message"}
            </button>
        </form>
    );
}
