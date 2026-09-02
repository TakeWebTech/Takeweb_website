import Link from "next/link";
import Image from "next/image";
import { FloatingElements } from "@/components/floating-elements";
import { Card3D } from "@/components/ui/card-3d";
import { SectionHeader } from "@/components/ui/section-header";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/scroll-animations";
import { getHomePageContent } from "@/lib/strapi";
import {
    Activity,
    ArrowRight,
    Award,
    BarChart3,
    Box,
    Circle,
    Cloud,
    Code,
    Cpu,
    Database,
    Globe,
    Globe2,
    Hexagon,
    Layers,
    Server,
    Shield,
    Smartphone,
    Triangle,
    Users,
    Zap,
} from "lucide-react";

const iconMap = {
    activity: Activity,
    award: Award,
    box: Box,
    chart: BarChart3,
    circle: Circle,
    cloud: Cloud,
    code: Code,
    cpu: Cpu,
    database: Database,
    globe: Globe,
    globe2: Globe2,
    hexagon: Hexagon,
    layers: Layers,
    server: Server,
    shield: Shield,
    smartphone: Smartphone,
    triangle: Triangle,
    users: Users,
    zap: Zap,
};

function getIcon(name?: string) {
    return iconMap[(name || "code").toLowerCase() as keyof typeof iconMap] || Code;
}

export default async function HomePage() {
    const home = await getHomePageContent();
    const hero = home.hero!;
    const partnerSlider = home.partnerSlider!;
    const whyTakeWeb = home.whyTakeWeb!;
    const cta = home.cta!;

    return (
        <>
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5 animate-gradient" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(179,155,94,0.1),transparent_50%)] animate-pulse" style={{ animationDuration: "4s" }} />
                <FloatingElements />
                <div className="container-main relative z-10 pt-24 pb-16">
                    <div className="max-w-4xl mx-auto text-center">
                        {hero.badgeText && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm font-medium text-amber-500 mb-8 animate-fade-in">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                {hero.badgeText}
                            </div>
                        )}
                        <h1 className="text-[var(--text-primary)] mb-6 animate-slide-up">
                            {hero.title}{" "}
                            {hero.titleHighlight && (
                                <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                    {hero.titleHighlight}
                                </span>
                            )}
                        </h1>
                        <p className="text-lg sm:text-xl text-[var(--text-tertiary)] max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
                            {hero.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
                            {hero.primaryCta && (
                                <Link href={hero.primaryCta.href} className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-[0_0_40px_-10px_oklch(75%_0.15_85_/_0.5)] hover:-translate-y-1 transition-all group">
                                    {hero.primaryCta.label}
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </Link>
                            )}
                            {hero.secondaryCta && (
                                <Link href={hero.secondaryCta.href} className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-[var(--text-primary)] border-2 border-[var(--border-secondary)] rounded-xl hover:border-amber-500 hover:text-amber-500 transition-all">
                                    {hero.secondaryCta.label}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                {hero.showScrollIndicator !== false && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 rounded-full border-2 border-[var(--text-muted)] flex items-start justify-center p-2">
                            <div className="w-1 h-2 rounded-full bg-[var(--text-muted)] animate-pulse" />
                        </div>
                    </div>
                )}
            </section>

            <section className="py-12 border-y border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden">
                <div className="container-main mb-6">
                    <p className="text-center text-sm text-[var(--text-muted)] uppercase tracking-wide font-medium">
                        {partnerSlider.eyebrow}
                    </p>
                </div>
                <div className="relative flex overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none" />
                    <div className="flex items-center gap-16 animate-marquee" style={{ width: "max-content" }}>
                        {[...(partnerSlider.tiles || []), ...(partnerSlider.tiles || [])].map((partner, index) => {
                            const Icon = getIcon(partner.icon);
                            return (
                                <div key={`${partner.name}-${index}`} className="flex items-center justify-center h-12 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                                    <div className="flex items-center gap-3 text-[var(--text-muted)] group">
                                        <Icon size={30} className="text-[var(--text-secondary)] group-hover:text-amber-500 transition-colors" />
                                        <span className="text-xl font-bold whitespace-nowrap tracking-tight">{partner.name}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-16 border-b border-[var(--border-primary)]">
                <div className="container-main">
                    <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {home.stats?.map((stat, index) => (
                            <StaggerItem key={index}>
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2">
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <div className="text-sm text-[var(--text-tertiary)] font-medium">{stat.label}</div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            <section className="section-padding">
                <div className="container-main">
                    <FadeIn>
                        <SectionHeader overline={home.servicesHeading?.overline} title={home.servicesHeading?.title || ""} titleHighlight={home.servicesHeading?.titleHighlight} description={home.servicesHeading?.description} />
                    </FadeIn>
                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {home.services?.map((service, index) => {
                            const Icon = getIcon(service.icon);
                            return (
                                <StaggerItem key={index}>
                                    <Link href={service.href}>
                                        <Card3D className="h-full group cursor-pointer">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5`}>
                                                <Icon className="text-white" size={24} />
                                            </div>
                                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3 group-hover:text-amber-500 transition-colors">{service.title}</h3>
                                            <p className="text-[var(--text-tertiary)] mb-4">{service.description}</p>
                                            <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-500 group-hover:gap-2 transition-all">
                                                Learn more <ArrowRight size={14} />
                                            </span>
                                        </Card3D>
                                    </Link>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </div>
            </section>

            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4 block">{whyTakeWeb.overline}</span>
                            <h2 className="text-[var(--text-primary)] mb-6">
                                {whyTakeWeb.title}{" "}
                                <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">{whyTakeWeb.titleHighlight}</span>
                            </h2>
                            <p className="text-lg text-[var(--text-tertiary)] mb-10">{whyTakeWeb.description}</p>
                            <StaggerContainer className="grid sm:grid-cols-2 gap-6">
                                {whyTakeWeb.features?.map((feature, index) => {
                                    const Icon = getIcon(feature.icon);
                                    return (
                                        <StaggerItem key={index}>
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                                    <Icon size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[var(--text-primary)] mb-1">{feature.title}</h4>
                                                    <p className="text-sm text-[var(--text-tertiary)]">{feature.description}</p>
                                                </div>
                                            </div>
                                        </StaggerItem>
                                    );
                                })}
                            </StaggerContainer>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] p-8 flex items-center justify-center overflow-hidden">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="absolute border border-[var(--border-primary)] rounded-full animate-spin-slow" style={{ width: `${i * 25}%`, height: `${i * 25}%`, animationDuration: `${20 + i * 5}s`, animationDirection: i % 2 === 0 ? "reverse" : "normal" }} />
                                ))}
                                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center animate-float z-10">
                                    <Image src="/logo.png" alt="TakeWeb" width={48} height={48} className="object-contain" />
                                </div>
                            </div>
                            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-3xl blur-3xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div className="container-main">
                    <SectionHeader overline={home.testimonialsHeading?.overline} title={home.testimonialsHeading?.title || ""} titleHighlight={home.testimonialsHeading?.titleHighlight} description={home.testimonialsHeading?.description} />
                    <StaggerContainer className="grid md:grid-cols-3 gap-6">
                        {home.testimonials?.map((testimonial, index) => (
                            <StaggerItem key={index}>
                                <Card3D className="h-full">
                                    <div className="flex flex-col h-full">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-[var(--text-secondary)] mb-6 flex-grow">&ldquo;{testimonial.quote}&rdquo;</p>
                                        <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-primary)]">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[var(--bg-tertiary)]">
                                                <Image src={(testimonial.avatar as string) || testimonial.avatarFallback || "/founder.jpg"} alt={testimonial.author} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-[var(--text-primary)] text-sm">{testimonial.author}</div>
                                                <div className="text-xs text-[var(--text-tertiary)]">{testimonial.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card3D>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-12 md:p-16 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-yellow-400 blur-3xl" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-white mb-4">{cta.title}</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">{cta.description}</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {cta.primaryCta && (
                                    <Link href={cta.primaryCta.href} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all group">
                                        {cta.primaryCta.label}
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                    </Link>
                                )}
                                {cta.secondaryCta && (
                                    <Link href={cta.secondaryCta.href} className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                                        {cta.secondaryCta.label}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
