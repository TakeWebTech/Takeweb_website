import { Metadata } from "next";
import Link from "next/link";
import { FloatingElements } from "@/components/floating-elements";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "TakeWeb Enterprise Terms of Service — Read the terms governing your use of our services and platform.",
};

export default function TermsPage() {
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
                            Terms of{" "}
                            <span className="gradient-text">Service</span>
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
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">1. Acceptance of Terms</h2>
                                <p className="text-[var(--text-tertiary)]">
                                    By accessing or using TakeWeb Enterprise services, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services. These terms apply to all visitors, users, and clients of TakeWeb.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">2. Services</h2>
                                <p className="text-[var(--text-tertiary)]">
                                    TakeWeb provides enterprise IT consulting, custom software development, cloud solutions, AI integration, cybersecurity, and related technology services. The specific scope of services will be outlined in individual project agreements or statements of work between TakeWeb and the client.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">3. Intellectual Property</h2>
                                <p className="text-[var(--text-tertiary)]">
                                    Unless otherwise agreed in writing, all intellectual property created by TakeWeb during the course of a project, including but not limited to software code, designs, documentation, and methodologies, shall be assigned to the client upon full payment. TakeWeb retains the right to use general knowledge, skills, and techniques developed during the engagement.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">4. Payment Terms</h2>
                                <p className="text-[var(--text-tertiary)]">
                                    Payment terms will be specified in individual project agreements. Unless otherwise stated, invoices are due within 30 days of issuance. Late payments may incur interest at the rate of 1.5% per month or the maximum rate permitted by law, whichever is lower.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">5. Confidentiality</h2>
                                <p className="text-[var(--text-tertiary)]">
                                    Both parties agree to maintain the confidentiality of all proprietary information shared during the engagement. This obligation survives the termination of the business relationship and extends to all employees, contractors, and agents of both parties.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">6. Limitation of Liability</h2>
                                <p className="text-[var(--text-tertiary)]">
                                    To the maximum extent permitted by law, TakeWeb shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with our services. Our total liability shall not exceed the amount paid by the client for the specific services giving rise to the claim.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">7. Termination</h2>
                                <p className="text-[var(--text-tertiary)]">
                                    Either party may terminate an engagement with 30 days&apos; written notice. Upon termination, the client shall pay for all services rendered and expenses incurred up to the termination date. TakeWeb will deliver all completed work and work in progress to the client.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">8. Governing Law</h2>
                                <p className="text-[var(--text-tertiary)]">
                                    These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, India.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">9. Changes to Terms</h2>
                                <p className="text-[var(--text-tertiary)]">
                                    We reserve the right to modify these terms at any time. Material changes will be communicated through our website or via email. Your continued use of our services after such modifications constitutes acceptance of the updated terms.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">10. Contact</h2>
                                <p className="text-[var(--text-tertiary)] mb-4">
                                    For questions about these Terms of Service, please reach out to us.
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
