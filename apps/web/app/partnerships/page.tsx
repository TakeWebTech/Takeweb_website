"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FloatingElements } from "@/components/floating-elements";
import { SectionHeader } from "@/components/ui/section-header";
import { Card3D } from "@/components/ui/card-3d";
import { 
    Users, 
    Handshake, 
    Globe, 
    Zap, 
    Award, 
    ArrowRight, 
    CheckCircle2, 
    BarChart3, 
    Rocket,
    Cloud
} from "lucide-react";

const partnerTypes = [
    {
        title: "Integration Partners",
        description: "Seamlessly integrate your SaaS or enterprise software with TakeWeb's ecosystem to provide unified solutions.",
        icon: Zap,
        benefits: ["API access", "Priority support", "Co-marketing"]
    },
    {
        title: "Global Alliances",
        description: "Scale your business globally by partnering with our world-class delivery and consulting teams.",
        icon: Globe,
        benefits: ["Global reach", "Scale bandwidth", "Strategic alignment"]
    },
    {
        title: "Solution Providers",
        description: "Leverage TakeWeb's technology platform to build and deliver custom solutions for your own clients.",
        icon: Rocket,
        benefits: ["White-labeling", "Tech training", "Revenue share"]
    }
];

const benefits = [
    { icon: Award, title: "Brand Credibility", desc: "Align with a globally recognized leader in enterprise IT." },
    { icon: BarChart3, title: "Market Growth", desc: "Access new markets and customer segments through our network." },
    { icon: Cloud, title: "Tech Innovation", desc: "Stay ahead with early access to our R&D and platform updates." },
    { icon: Handshake, title: "Co-Selling", desc: "Partner on large-scale enterprise deals with our sales experts." }
];

export default function PartnershipsPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden">
            <FloatingElements />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 border-b border-[var(--border-primary)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
                <div className="container-main relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm font-bold text-amber-500 mb-8"
                    >
                        <Handshake size={16} />
                        TakeWeb Partner Ecosystem
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                    >
                        Scale Better, <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Together</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-[var(--text-tertiary)] max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Join forces with TakeWeb to deliver innovative enterprise solutions, 
                        accelerate digital transformation, and unlock new growth opportunities worldwide.
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link 
                            href="#join"
                            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                        >
                            Become a Partner
                        </Link>
                        <Link 
                            href="/contact"
                            className="px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] font-bold rounded-xl hover:bg-[var(--bg-tertiary)] transition-all"
                        >
                            Contact Partnerships Team
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Partner Types Grid */}
            <section className="section-padding">
                <div className="container-main">
                    <SectionHeader 
                        overline="Collaboration Paths"
                        title="How We Can"
                        titleHighlight="Work Together"
                        description="Choose the partnership model that best fits your business goals and expertise."
                    />

                    <div className="grid md:grid-cols-3 gap-8">
                        {partnerTypes.map((type, index) => (
                            <motion.div
                                key={type.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card3D className="h-full flex flex-col items-center text-center p-8 group">
                                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                        <type.icon size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{type.title}</h3>
                                    <p className="text-[var(--text-tertiary)] mb-8 flex-grow leading-relaxed">
                                        {type.description}
                                    </p>
                                    <div className="w-full space-y-3 pt-6 border-t border-[var(--border-primary)]">
                                        {type.benefits.map((benefit) => (
                                            <div key={benefit} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium">
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>
                                </Card3D>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Partner with Us */}
            <section className="section-padding bg-[var(--bg-secondary)] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="container-main relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4 block">Strategic Advantage</span>
                            <h2 className="text-4xl font-bold mb-6">Why Partner with <span className="text-gradient">TakeWeb?</span></h2>
                            <p className="text-lg text-[var(--text-tertiary)] mb-10">
                                We don't just sign contracts; we build ecosystems. Our commitment to partner success is built on shared goals, technical support, and joint market expansion.
                            </p>
                            
                            <div className="grid sm:grid-cols-2 gap-6">
                                {benefits.map((benefit) => (
                                    <div key={benefit.title} className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-primary)] hover:border-amber-500/30 transition-all group">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <benefit.icon size={20} />
                                        </div>
                                        <h4 className="font-bold mb-2">{benefit.title}</h4>
                                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{benefit.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="aspect-square rounded-3xl overflow-hidden glass-morphism border border-white/5 p-8 flex items-center justify-center">
                                <motion.div 
                                    animate={{ 
                                        rotate: 360,
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{ 
                                        rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="relative w-full h-full"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-32 h-32 rounded-3xl bg-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex items-center justify-center">
                                            <Handshake size={60} className="text-white" />
                                        </div>
                                    </div>
                                    {/* Orbital dots */}
                                    {[...Array(6)].map((_, i) => (
                                        <div 
                                            key={i}
                                            className="absolute w-4 h-4 bg-amber-500 rounded-full blur-[2px]"
                                            style={{
                                                top: '50%',
                                                left: '50%',
                                                transform: `rotate(${i * 60}deg) translate(140px)`
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Join Form CTA */}
            <section id="join" className="section-padding">
                <div className="container-main max-w-4xl mx-auto">
                    <div className="p-10 md:p-16 rounded-[40px] bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px]" />
                        
                        <div className="relative z-10 text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Start Your Partnership</h2>
                            <p className="text-[var(--text-tertiary)]">Complete the form below and our team will get back to you within 48 hours.</p>
                        </div>

                        <form className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Company Name</label>
                                <input type="text" className="w-full px-5 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] focus:border-amber-500/50 outline-none transition-all" placeholder="Enter company name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Partnership Type</label>
                                <select className="w-full px-5 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] focus:border-amber-500/50 outline-none transition-all">
                                    <option>Integration Partner</option>
                                    <option>Global Alliance</option>
                                    <option>Solution Provider</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Contact Email</label>
                                <input type="email" className="w-full px-5 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] focus:border-amber-500/50 outline-none transition-all" placeholder="name@company.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Website URL</label>
                                <input type="text" className="w-full px-5 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] focus:border-amber-500/50 outline-none transition-all" placeholder="https://company.com" />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                                <label className="text-sm font-medium ml-1">Message</label>
                                <textarea rows={4} className="w-full px-5 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] focus:border-amber-500/50 outline-none transition-all resize-none" placeholder="Tell us about your business goals..." />
                            </div>
                            <button className="sm:col-span-2 w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                Submit Application <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
