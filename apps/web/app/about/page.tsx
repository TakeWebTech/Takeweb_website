"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { ArrowRight, Target, Eye, Heart, Lightbulb, X, Mail, Linkedin, Twitter, Globe } from "lucide-react";

const values = [
    { icon: Target, title: "Excellence", description: "We strive for excellence in everything we do." },
    { icon: Lightbulb, title: "Innovation", description: "We embrace emerging technologies and creative solutions." },
    { icon: Heart, title: "Integrity", description: "We operate with transparency, honesty, and ethical practices." },
    { icon: Eye, title: "Vision", description: "We focus on long-term success and sustainable growth." },
];

const leadership = [
    {
        id: "founder",
        name: "Rajesh Kumar",
        role: "Founder & CEO",
        image: "/founder.jpg",
        bio: "Rajesh founded TakeWeb with a vision to transform how enterprises leverage technology. With 20+ years of experience in enterprise software and digital transformation, he has led teams at Fortune 500 companies before starting TakeWeb. His passion for innovation and client success drives the company's mission.",
        email: "rajesh@takeweb.in",
        linkedin: "https://linkedin.com/in/rajeshkumar",
        twitter: "https://twitter.com/rajeshkumar",
    },
    {
        id: "cto",
        name: "Priya Sharma",
        role: "Chief Technology Officer",
        image: "/founder.jpg",
        bio: "Priya leads TakeWeb's technology strategy and engineering teams. With expertise in cloud architecture, AI/ML, and DevOps, she ensures our solutions are built on solid technical foundations. Previously, she was a Principal Engineer at a leading cloud provider.",
        email: "priya@takeweb.in",
        linkedin: "https://linkedin.com/in/priyasharma",
        twitter: "https://twitter.com/priyasharma",
    },
    {
        id: "cfo",
        name: "Michael Chen",
        role: "Chief Financial Officer",
        image: "/founder.jpg",
        bio: "Michael oversees TakeWeb's financial operations and strategic planning. His background in investment banking and fintech gives him unique insights into growing technology companies sustainably while maximizing shareholder value.",
        email: "michael@takeweb.in",
        linkedin: "https://linkedin.com/in/michaelchen",
    },
    {
        id: "coo",
        name: "Sarah Williams",
        role: "Chief Operating Officer",
        image: "/founder.jpg",
        bio: "Sarah ensures TakeWeb's operations run smoothly across all regions. She brings extensive experience in scaling global technology services companies and has a proven track record of optimizing delivery excellence.",
        email: "sarah@takeweb.in",
        linkedin: "https://linkedin.com/in/sarahwilliams",
    },
    {
        id: "vp-eng",
        name: "Amit Patel",
        role: "VP of Engineering",
        image: "/founder.jpg",
        bio: "Amit leads our engineering teams and ensures technical excellence across all projects. His deep expertise in enterprise systems and agile methodologies has been instrumental in our 99.9% delivery success rate.",
        email: "amit@takeweb.in",
        linkedin: "https://linkedin.com/in/amitpatel",
    },
    {
        id: "vp-sales",
        name: "Jennifer Lee",
        role: "VP of Sales & Partnerships",
        image: "/founder.jpg",
        bio: "Jennifer drives TakeWeb's global sales strategy and partnership ecosystem. Her relationships with enterprise clients and technology partners have been key to our growth across 50+ countries.",
        email: "jennifer@takeweb.in",
        linkedin: "https://linkedin.com/in/jenniferlee",
    },
];

const milestones = [
    { year: "2018", title: "Founded", description: "TakeWeb established in Bangalore" },
    { year: "2019", title: "First Enterprise Client", description: "Secured Fortune 500 partnership" },
    { year: "2020", title: "Cloud Expansion", description: "Launched cloud & DevOps services" },
    { year: "2021", title: "AI Integration", description: "Added AI/ML capabilities" },
    { year: "2022", title: "Global Reach", description: "Expanded to 50+ countries" },
    { year: "2023", title: "500+ Projects", description: "Major delivery milestone" },
    { year: "2024", title: "Product Launch", description: "Launched TakeWeb Cloud Platform" },
];

export default function AboutPage() {
    const [selectedLeader, setSelectedLeader] = useState<typeof leadership[0] | null>(null);

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />

                <div className="container-main relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                                About TakeWeb
                            </span>
                            <h1 className="text-[var(--text-primary)] mb-6">
                                Building the Future of{" "}
                                <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Enterprise Technology</span>
                            </h1>
                            <p className="text-lg text-[var(--text-tertiary)] mb-8">
                                We are a team of passionate technologists, innovators, and problem-solvers
                                dedicated to helping enterprises thrive in the digital age.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-[0_0_30px_-8px_oklch(75%_0.15_85_/_0.5)] hover:-translate-y-0.5 transition-all group"
                            >
                                Work With Us
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)]">
                                <Image
                                    src="/founder.jpg"
                                    alt="TakeWeb Team"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 p-6 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-xl">
                                <div className="text-3xl font-bold text-[var(--text-primary)]">500+</div>
                                <div className="text-sm text-[var(--text-tertiary)]">Projects Delivered</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card3D className="text-center p-10">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6">
                                <Target size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Our Mission</h3>
                            <p className="text-[var(--text-tertiary)]">
                                To empower enterprises with innovative technology solutions that drive growth,
                                efficiency, and competitive advantage in an ever-evolving digital landscape.
                            </p>
                        </Card3D>

                        <Card3D className="text-center p-10">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6">
                                <Eye size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Our Vision</h3>
                            <p className="text-[var(--text-tertiary)]">
                                To be the most trusted technology partner for enterprises worldwide, known for
                                excellence, innovation, and the transformative impact of our solutions.
                            </p>
                        </Card3D>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-padding">
                <div className="container-main">
                    <SectionHeader
                        overline="Our Values"
                        title="What Drives"
                        titleHighlight="Our Work"
                    />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <Card3D key={index} className="text-center">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                                    <value.icon size={28} />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)] mb-2">{value.title}</h4>
                                <p className="text-sm text-[var(--text-tertiary)]">{value.description}</p>
                            </Card3D>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section id="leadership" className="section-padding bg-[var(--bg-secondary)]">
                <div className="container-main">
                    <SectionHeader
                        overline="Leadership"
                        title="Meet Our"
                        titleHighlight="Team"
                        description="The experienced leaders driving TakeWeb's vision and growth."
                    />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leadership.map((leader) => (
                            <div
                                key={leader.id}
                                onClick={() => setSelectedLeader(leader)}
                                className="cursor-pointer group"
                            >
                                <Card3D className="text-center overflow-hidden p-0">
                                    <div className="relative aspect-square">
                                        <Image
                                            src={leader.image}
                                            alt={leader.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-4 left-4 right-4 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-sm">Click to view profile</p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-amber-500 transition-colors">
                                            {leader.name}
                                        </h4>
                                        <p className="text-sm text-[var(--text-tertiary)]">{leader.role}</p>
                                    </div>
                                </Card3D>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leader Modal */}
            {selectedLeader && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
                    onClick={() => setSelectedLeader(null)}
                >
                    <div
                        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl shadow-2xl animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedLeader(null)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Image */}
                            <div className="relative aspect-square md:aspect-auto">
                                <Image
                                    src={selectedLeader.image}
                                    alt={selectedLeader.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                                    {selectedLeader.name}
                                </h3>
                                <p className="text-amber-500 font-medium mb-6">{selectedLeader.role}</p>

                                <p className="text-[var(--text-tertiary)] mb-6 leading-relaxed">
                                    {selectedLeader.bio}
                                </p>

                                {/* Contact */}
                                <div className="border-t border-[var(--border-primary)] pt-6">
                                    <p className="text-sm font-medium text-[var(--text-muted)] mb-4">Connect</p>
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={`mailto:${selectedLeader.email}`}
                                            className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-amber-500 hover:border-amber-500/50 transition-colors"
                                        >
                                            <Mail size={18} />
                                        </a>
                                        {selectedLeader.linkedin && (
                                            <a
                                                href={selectedLeader.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-amber-500 hover:border-amber-500/50 transition-colors"
                                            >
                                                <Linkedin size={18} />
                                            </a>
                                        )}
                                        {selectedLeader.twitter && (
                                            <a
                                                href={selectedLeader.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-amber-500 hover:border-amber-500/50 transition-colors"
                                            >
                                                <Twitter size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline */}
            <section className="section-padding">
                <div className="container-main">
                    <SectionHeader
                        overline="Our Journey"
                        title="Milestones &"
                        titleHighlight="Achievements"
                    />

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--border-primary)] hidden md:block" />

                        <div className="space-y-8">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl inline-block">
                                            <div className="text-sm font-bold text-amber-500 mb-1">{milestone.year}</div>
                                            <h4 className="font-semibold text-[var(--text-primary)] mb-1">{milestone.title}</h4>
                                            <p className="text-sm text-[var(--text-tertiary)]">{milestone.description}</p>
                                        </div>
                                    </div>

                                    {/* Center dot */}
                                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-500 border-4 border-[var(--bg-primary)] hidden md:block" />

                                    <div className="flex-1 hidden md:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-12 md:p-16 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-white mb-4">Join Our Team</h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                                We&apos;re always looking for talented individuals who share our passion for technology.
                            </p>
                            <Link
                                href="/careers"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                View Open Positions
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
