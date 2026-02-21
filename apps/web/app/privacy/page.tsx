import { Metadata } from "next";
import Link from "next/link";
import { FloatingElements } from "@/components/floating-elements";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "TakeWeb Enterprise Privacy Policy — Learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-12 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
                            Legal
                        </span>
                        <h1 className="text-[var(--text-primary)] mb-6">
                            Privacy{" "}
                            <span className="gradient-text">Policy</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)]">
                            Last updated: February 2026
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="max-w-3xl mx-auto prose-custom">
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">1. Information We Collect</h2>
                                <p className="text-[var(--text-tertiary)] mb-3">We collect information you provide directly to us, including:</p>
                                <ul className="list-disc pl-6 text-[var(--text-tertiary)] space-y-2">
                                    <li>Name, email address, and contact information when you fill out forms or contact us</li>
                                    <li>Company name, job title, and business-related information</li>
                                    <li>Communication preferences and feedback you provide</li>
                                    <li>Technical data such as IP address, browser type, and device information collected automatically</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">2. How We Use Your Information</h2>
                                <p className="text-[var(--text-tertiary)] mb-3">We use the information we collect to:</p>
                                <ul className="list-disc pl-6 text-[var(--text-tertiary)] space-y-2">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Respond to your inquiries and provide customer support</li>
                                    <li>Send you technical notices, updates, and administrative messages</li>
                                    <li>Communicate about products, services, and events we think may interest you</li>
                                    <li>Monitor and analyze trends, usage, and activities</li>
                                    <li>Detect, investigate, and prevent security incidents</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">3. Cookies & Tracking</h2>
                                <p className="text-[var(--text-tertiary)] mb-3">
                                    We use cookies and similar tracking technologies to collect and track information about your browsing activity. These help us analyze website traffic, personalize content, and improve your experience. You can control cookie preferences through your browser settings.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">4. Data Sharing & Disclosure</h2>
                                <p className="text-[var(--text-tertiary)] mb-3">
                                    We do not sell your personal information. We may share your information with:
                                </p>
                                <ul className="list-disc pl-6 text-[var(--text-tertiary)] space-y-2">
                                    <li>Service providers who assist in our operations</li>
                                    <li>Professional advisors such as lawyers and accountants</li>
                                    <li>Authorities when required by law or to protect our rights</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">5. Data Security</h2>
                                <p className="text-[var(--text-tertiary)]">
                                    We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your personal information. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">6. Your Rights</h2>
                                <p className="text-[var(--text-tertiary)] mb-3">
                                    Depending on your location, you may have the right to:
                                </p>
                                <ul className="list-disc pl-6 text-[var(--text-tertiary)] space-y-2">
                                    <li>Access, correct, or delete your personal information</li>
                                    <li>Object to or restrict certain processing</li>
                                    <li>Data portability</li>
                                    <li>Withdraw consent at any time</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">7. Contact Us</h2>
                                <p className="text-[var(--text-tertiary)] mb-4">
                                    If you have questions about this Privacy Policy or our data practices, please contact us.
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                >
                                    Contact Us <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
