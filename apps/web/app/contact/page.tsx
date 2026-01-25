import { Metadata } from "next";
import Link from "next/link";
import { FloatingElements } from "@/components/floating-elements";
import { Card3D } from "@/components/ui/card-3d";
import { Mail, Phone, MapPin, Clock, Send, Calendar } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with TakeWeb Enterprise. Let's discuss how we can help transform your business with our IT solutions.",
};

const contactInfo = [
    {
        icon: Mail,
        title: "Email Us",
        value: "hello@takeweb.in",
        href: "mailto:hello@takeweb.in",
    },
    {
        icon: Phone,
        title: "Call Us",
        value: "+91 98765 43210",
        href: "tel:+919876543210",
    },
    {
        icon: MapPin,
        title: "Visit Us",
        value: "Bangalore, Karnataka, India",
        href: null,
    },
    {
        icon: Clock,
        title: "Business Hours",
        value: "Mon - Fri, 9 AM - 6 PM IST",
        href: null,
    },
];

export default function ContactPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <FloatingElements />

                <div className="container-main relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4">
                            Contact Us
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Let&apos;s Build Something{" "}
                            <span className="gradient-text">Great Together</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)]">
                            Have a project in mind? We&apos;d love to hear about it.
                            Get in touch and let&apos;s discuss how we can help.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <Card3D className="p-8 md:p-10">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                                Send Us a Message
                            </h2>

                            <form className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            required
                                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            required
                                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                        placeholder="john@company.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                        placeholder="Your Company"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="service" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Service Interested In
                                    </label>
                                    <select
                                        id="service"
                                        name="service"
                                        className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                    >
                                        <option value="">Select a service</option>
                                        <option value="enterprise-software">Enterprise Software Development</option>
                                        <option value="cloud-devops">Cloud & DevOps</option>
                                        <option value="ai-data">AI & Data Engineering</option>
                                        <option value="cybersecurity">Cybersecurity</option>
                                        <option value="web-mobile">Web & Mobile Development</option>
                                        <option value="consulting">IT Consulting</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        required
                                        className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none"
                                        placeholder="Tell us about your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:shadow-[0_0_40px_-10px_oklch(55%_0.18_250_/_0.5)] hover:-translate-y-0.5 transition-all"
                                >
                                    <Send size={18} />
                                    Send Message
                                </button>
                            </form>
                        </Card3D>

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                                Get in Touch
                            </h2>
                            <p className="text-[var(--text-tertiary)] mb-8">
                                Prefer to reach out directly? Here&apos;s how you can contact us.
                            </p>

                            <div className="space-y-4 mb-10">
                                {contactInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-5 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl hover:border-[var(--border-secondary)] transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center flex-shrink-0">
                                            <info.icon size={24} />
                                        </div>
                                        <div>
                                            <div className="text-sm text-[var(--text-muted)] mb-1">
                                                {info.title}
                                            </div>
                                            {info.href ? (
                                                <a
                                                    href={info.href}
                                                    className="text-[var(--text-primary)] font-medium hover:text-primary-500 transition-colors"
                                                >
                                                    {info.value}
                                                </a>
                                            ) : (
                                                <div className="text-[var(--text-primary)] font-medium">
                                                    {info.value}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Schedule Call CTA */}
                            <Card3D className="p-8 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-primary-500/20">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500 text-white flex items-center justify-center flex-shrink-0">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                                            Schedule a Consultation
                                        </h3>
                                        <p className="text-sm text-[var(--text-tertiary)] mb-4">
                                            Book a 30-minute call with our team to discuss your project.
                                        </p>
                                        <Link
                                            href="#"
                                            className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors"
                                        >
                                            Book a Meeting
                                            <Calendar size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </Card3D>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="pb-20">
                <div className="container-main">
                    <div className="flex flex-wrap items-center justify-center gap-8 text-center text-sm text-[var(--text-muted)]">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Secure & Encrypted
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            GDPR Compliant
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Response within 24 hours
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
