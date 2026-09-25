export type CmsTextItem = { text: string };

export type CmsPage = {
    title: string;
    slug: string;
    path: string;
    seoTitle?: string;
    seoDescription?: string;
    hero?: {
        overline?: string;
        title: string;
        titleHighlight?: string;
        description?: string;
        image?: string;
        primaryCta?: { label: string; href: string; variant?: string };
        secondaryCta?: { label: string; href: string; variant?: string };
    };
    sections?: Array<Record<string, unknown>>;
    isActive?: boolean;
    sortOrder?: number;
};

export const fallbackSitePages: CmsPage[] = [
    {
        title: "About TakeWeb",
        slug: "about",
        path: "/about",
        seoTitle: "About TakeWeb",
        seoDescription: "Learn about TakeWeb Enterprise, our mission, values, leadership, and journey.",
        hero: {
            overline: "About TakeWeb",
            title: "Building the Future of",
            titleHighlight: "Enterprise Technology",
            description: "We are a team of passionate technologists, innovators, and problem-solvers dedicated to helping enterprises thrive in the digital age.",
            image: "/founder.jpg",
            primaryCta: { label: "Work With Us", href: "/contact", variant: "primary" },
        },
        sections: [
            {
                __component: "page.card-grid-section",
                heading: { overline: "Mission & Vision", title: "Purpose Built", titleHighlight: "for Impact" },
                background: "secondary",
                columns: 2,
                cards: [
                    { icon: "target", title: "Our Mission", description: "To empower enterprises with innovative technology solutions that drive growth, efficiency, and competitive advantage in an ever-evolving digital landscape." },
                    { icon: "eye", title: "Our Vision", description: "To be the most trusted technology partner for enterprises worldwide, known for excellence, innovation, and the transformative impact of our solutions." },
                ],
            },
            {
                __component: "page.card-grid-section",
                heading: { overline: "Our Values", title: "What Drives", titleHighlight: "Our Work" },
                background: "default",
                columns: 4,
                cards: [
                    { icon: "target", title: "Excellence", description: "We strive for excellence in everything we do." },
                    { icon: "lightbulb", title: "Innovation", description: "We embrace emerging technologies and creative solutions." },
                    { icon: "heart", title: "Integrity", description: "We operate with transparency, honesty, and ethical practices." },
                    { icon: "eye", title: "Vision", description: "We focus on long-term success and sustainable growth." },
                ],
            },
            {
                __component: "page.people-section",
                heading: { overline: "Leadership", title: "Meet Our", titleHighlight: "Team", description: "The experienced leaders driving TakeWeb's vision and growth." },
                background: "secondary",
                people: [
                    { uid: "owner", name: "Himanshu Mathankar", role: "Founder & CEO", imageFallback: "/founder.jpg", bio: "Visionary leader dedicated to transforming enterprise technology through innovation and excellence. Himanshu leads the strategic direction of TakeWeb, ensuring we deliver world-class solutions to our global partners.", email: "hello@takeweb.in", socialMedia: [{ name: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/in/himanshumathankar" }, { name: "Twitter", icon: "twitter", href: "https://twitter.com/himanshumathankar" }] },
                    { uid: "founder", name: "Rajesh Kumar", role: "Co-Founder & Advisor", imageFallback: "/founder.jpg", bio: "Rajesh brings 20+ years of experience in enterprise software and digital transformation. He now serves as a strategic advisor to the team.", email: "rajesh@takeweb.in", socialMedia: [{ name: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/in/rajeshkumar" }, { name: "Twitter", icon: "twitter", href: "https://twitter.com/rajeshkumar" }] },
                    { uid: "cto", name: "Priya Sharma", role: "Chief Technology Officer", imageFallback: "/founder.jpg", bio: "Priya leads TakeWeb's technology strategy and engineering teams. With expertise in cloud architecture, AI/ML, and DevOps, she ensures our solutions are built on solid technical foundations.", email: "priya@takeweb.in", socialMedia: [{ name: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/in/priyasharma" }, { name: "Twitter", icon: "twitter", href: "https://twitter.com/priyasharma" }] },
                    { uid: "cfo", name: "Michael Chen", role: "Chief Financial Officer", imageFallback: "/founder.jpg", bio: "Michael oversees TakeWeb's financial operations and strategic planning. His background in investment banking and fintech gives him unique insights into growing technology companies sustainably.", email: "michael@takeweb.in", socialMedia: [{ name: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/in/michaelchen" }] },
                    { uid: "coo", name: "Sarah Williams", role: "Chief Operating Officer", imageFallback: "/founder.jpg", bio: "Sarah ensures TakeWeb's operations run smoothly across all regions and brings extensive experience in scaling global technology services companies.", email: "sarah@takeweb.in", socialMedia: [{ name: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/in/sarahwilliams" }] },
                    { uid: "vp-eng", name: "Amit Patel", role: "VP of Engineering", imageFallback: "/founder.jpg", bio: "Amit leads engineering teams and ensures technical excellence across all projects with deep expertise in enterprise systems and agile delivery.", email: "amit@takeweb.in", socialMedia: [{ name: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/in/amitpatel" }] },
                    { uid: "vp-sales", name: "Jennifer Lee", role: "VP of Sales & Partnerships", imageFallback: "/founder.jpg", bio: "Jennifer drives TakeWeb's global sales strategy and partnership ecosystem across enterprise clients and technology partners.", email: "jennifer@takeweb.in", socialMedia: [{ name: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/in/jenniferlee" }] },
                ],
            },
            {
                __component: "page.timeline-section",
                heading: { overline: "Our Journey", title: "Milestones &", titleHighlight: "Achievements" },
                items: [
                    { year: "2018", title: "Founded", description: "TakeWeb established in Bangalore" },
                    { year: "2019", title: "First Enterprise Client", description: "Secured Fortune 500 partnership" },
                    { year: "2020", title: "Cloud Expansion", description: "Launched cloud & DevOps services" },
                    { year: "2021", title: "AI Integration", description: "Added AI/ML capabilities" },
                    { year: "2022", title: "Global Reach", description: "Expanded to 50+ countries" },
                    { year: "2023", title: "500+ Projects", description: "Major delivery milestone" },
                    { year: "2024", title: "Product Launch", description: "Launched TakeWeb Cloud Platform" },
                ],
            },
            {
                __component: "home.cta-section",
                title: "Start Your Digital Journey",
                description: "Partner with us to accelerate your digital transformation and achieve sustainable growth.",
                primaryCta: { label: "Get Started Now", href: "/contact", variant: "primary" },
            },
        ],
        isActive: true,
        sortOrder: 10,
    },
    {
        title: "Contact Us",
        slug: "contact",
        path: "/contact",
        seoTitle: "Contact TakeWeb",
        seoDescription: "Contact TakeWeb Enterprise to discuss your software, cloud, AI, cybersecurity, or IT consulting needs.",
        hero: {
            overline: "Contact Us",
            title: "Let's Build Something",
            titleHighlight: "Great Together",
            description: "Have a project in mind? We'd love to hear about it. Get in touch and let's discuss how we can help.",
        },
        sections: [
            {
                __component: "page.contact-section",
                formTitle: "Send Us a Message",
                infoTitle: "Get in Touch",
                infoDescription: "Prefer to reach out directly? Here's how you can contact us.",
                methods: [
                    { icon: "mail", title: "Email Us", value: "hello@takeweb.in", href: "mailto:hello@takeweb.in" },
                    { icon: "phone", title: "Call Us", value: "+91 98765 43210", href: "tel:+919876543210" },
                    { icon: "map-pin", title: "Visit Us", value: "Bangalore, Karnataka, India" },
                    { icon: "clock", title: "Business Hours", value: "Mon - Fri, 9 AM - 6 PM IST" },
                ],
                scheduleTitle: "Schedule a Consultation",
                scheduleDescription: "Book a 30-minute call with our team to discuss your project.",
                scheduleCta: { label: "Book a Meeting", href: "#", variant: "secondary" },
                trustItems: [{ text: "Secure & Encrypted" }, { text: "GDPR Compliant" }, { text: "Response within 24 hours" }],
            },
        ],
        isActive: true,
        sortOrder: 20,
    },
    {
        title: "Partnerships",
        slug: "partnerships",
        path: "/partnerships",
        hero: {
            overline: "TakeWeb Partner Ecosystem",
            title: "Scale Better,",
            titleHighlight: "Together",
            description: "Join forces with TakeWeb to deliver innovative enterprise solutions, accelerate digital transformation, and unlock new growth opportunities worldwide.",
            primaryCta: { label: "Become a Partner", href: "#join", variant: "primary" },
            secondaryCta: { label: "Contact Partnerships Team", href: "/contact", variant: "secondary" },
        },
        sections: [
            {
                __component: "page.card-grid-section",
                heading: { overline: "Collaboration Paths", title: "How We Can", titleHighlight: "Work Together", description: "Choose the partnership model that best fits your business goals and expertise." },
                columns: 3,
                cards: [
                    { icon: "zap", title: "Integration Partners", description: "Seamlessly integrate your SaaS or enterprise software with TakeWeb's ecosystem to provide unified solutions.", badge: "API access, Priority support, Co-marketing" },
                    { icon: "globe", title: "Global Alliances", description: "Scale your business globally by partnering with our world-class delivery and consulting teams.", badge: "Global reach, Scale bandwidth, Strategic alignment" },
                    { icon: "rocket", title: "Solution Providers", description: "Leverage TakeWeb's technology platform to build and deliver custom solutions for your own clients.", badge: "White-labeling, Tech training, Revenue share" },
                ],
            },
            {
                __component: "page.card-grid-section",
                heading: { overline: "Strategic Advantage", title: "Why Partner with", titleHighlight: "TakeWeb?", description: "We build ecosystems around shared goals, technical support, and joint market expansion." },
                background: "secondary",
                columns: 4,
                cards: [
                    { icon: "award", title: "Brand Credibility", description: "Align with a globally recognized leader in enterprise IT." },
                    { icon: "chart", title: "Market Growth", description: "Access new markets and customer segments through our network." },
                    { icon: "cloud", title: "Tech Innovation", description: "Stay ahead with early access to our R&D and platform updates." },
                    { icon: "handshake", title: "Co-Selling", description: "Partner on large-scale enterprise deals with our sales experts." },
                ],
            },
            {
                __component: "home.cta-section",
                title: "Start Your Partnership",
                description: "Complete the form and our team will get back to you within 48 hours.",
                primaryCta: { label: "Submit Application", href: "/contact", variant: "primary" },
            },
        ],
        isActive: true,
        sortOrder: 30,
    },
    {
        title: "Security",
        slug: "security",
        path: "/security",
        seoTitle: "Security",
        seoDescription: "Learn about TakeWeb's security practices, compliance certifications, data protection measures, and infrastructure security.",
        hero: {
            overline: "Security & Compliance",
            title: "Enterprise-Grade",
            titleHighlight: "Security First",
            description: "At TakeWeb, security is built into everything we do. From code to infrastructure, we protect your data with industry-leading practices.",
            primaryCta: { label: "Request Security Audit", href: "/contact", variant: "primary" },
        },
        sections: [
            {
                __component: "page.card-grid-section",
                heading: { overline: "Our Approach", title: "Security", titleHighlight: "Practices" },
                background: "secondary",
                columns: 3,
                cards: [
                    { icon: "lock", title: "Data Encryption", description: "AES-256 encryption at rest, TLS 1.3 in transit for all data" },
                    { icon: "shield", title: "Access Control", description: "Role-based access, MFA, and least-privilege principles" },
                    { icon: "eye", title: "Continuous Monitoring", description: "24/7 security monitoring, SIEM & real-time alerting" },
                    { icon: "server", title: "Infrastructure Security", description: "SOC 2 Type II certified cloud infrastructure" },
                    { icon: "file-check", title: "Compliance", description: "GDPR, HIPAA, ISO 27001 & PCI-DSS compliant" },
                    { icon: "alert-triangle", title: "Incident Response", description: "Documented IR plans with <1 hour response SLA" },
                ],
            },
            {
                __component: "page.card-grid-section",
                heading: { title: "Our Security", titleHighlight: "Commitments" },
                columns: 1,
                cards: [
                    { title: "Regular Penetration Testing", description: "We conduct regular third-party penetration testing and vulnerability assessments across all systems and client deployments." },
                    { title: "Secure Development Lifecycle", description: "Every line of code goes through automated SAST/DAST scanning, peer review, and security checks before deployment." },
                    { title: "Employee Security Training", description: "All team members undergo mandatory security awareness training, background checks, and NDAs before onboarding." },
                ],
            },
            {
                __component: "home.cta-section",
                title: "Have Security Questions?",
                description: "Our security team is happy to answer your questions and provide additional documentation.",
                primaryCta: { label: "Contact Security Team", href: "/contact", variant: "primary" },
            },
        ],
        isActive: true,
        sortOrder: 40,
    },
    {
        title: "Privacy Policy",
        slug: "privacy",
        path: "/privacy",
        seoTitle: "Privacy Policy",
        seoDescription: "TakeWeb Enterprise Privacy Policy. Learn how we collect, use, and protect your personal data.",
        hero: { overline: "Legal", title: "Privacy", titleHighlight: "Policy", description: "Last updated: February 2026" },
        sections: [
            {
                __component: "page.legal-content-section",
                cta: { label: "Contact Us", href: "/contact", variant: "primary" },
                sections: [
                    { title: "1. Information We Collect", body: "We collect information you provide directly to us, including:", items: [{ text: "Name, email address, and contact information when you fill out forms or contact us" }, { text: "Company name, job title, and business-related information" }, { text: "Communication preferences and feedback you provide" }, { text: "Technical data such as IP address, browser type, and device information collected automatically" }] },
                    { title: "2. How We Use Your Information", body: "We use the information we collect to provide, maintain, improve, secure, and communicate about our services.", items: [{ text: "Respond to inquiries and provide customer support" }, { text: "Send technical notices, updates, and administrative messages" }, { text: "Monitor and analyze trends, usage, and activities" }, { text: "Detect, investigate, and prevent security incidents" }] },
                    { title: "3. Cookies & Tracking", body: "We use cookies and similar tracking technologies to analyze website traffic, personalize content, and improve your experience." },
                    { title: "4. Data Sharing & Disclosure", body: "We do not sell your personal information. We may share information with service providers, professional advisors, or authorities when required by law." },
                    { title: "5. Data Security", body: "We implement industry-standard security measures including encryption, access controls, and regular security audits to protect personal information." },
                    { title: "6. Your Rights", body: "Depending on your location, you may have rights to access, correct, delete, restrict, or port your personal information." },
                    { title: "7. Contact Us", body: "If you have questions about this Privacy Policy or our data practices, please contact us." },
                ],
            },
        ],
        isActive: true,
        sortOrder: 50,
    },
    {
        title: "Terms of Service",
        slug: "terms",
        path: "/terms",
        seoTitle: "Terms of Service",
        seoDescription: "TakeWeb Enterprise Terms of Service governing your use of our services and platform.",
        hero: { overline: "Legal", title: "Terms of", titleHighlight: "Service", description: "Last updated: February 2026" },
        sections: [
            {
                __component: "page.legal-content-section",
                cta: { label: "Contact Us", href: "/contact", variant: "primary" },
                sections: [
                    { title: "1. Acceptance of Terms", body: "By accessing or using TakeWeb Enterprise services, you agree to be bound by these Terms of Service." },
                    { title: "2. Services", body: "TakeWeb provides enterprise IT consulting, custom software development, cloud solutions, AI integration, cybersecurity, and related technology services." },
                    { title: "3. Intellectual Property", body: "Unless otherwise agreed in writing, project intellectual property is assigned according to the applicable agreement or statement of work." },
                    { title: "4. Payment Terms", body: "Payment terms will be specified in individual project agreements. Unless otherwise stated, invoices are due within 30 days." },
                    { title: "5. Confidentiality", body: "Both parties agree to maintain the confidentiality of proprietary information shared during the engagement." },
                    { title: "6. Limitation of Liability", body: "To the maximum extent permitted by law, TakeWeb shall not be liable for indirect or consequential damages arising from our services." },
                    { title: "7. Termination", body: "Either party may terminate an engagement with 30 days' written notice, subject to payment for completed work and incurred expenses." },
                    { title: "8. Governing Law", body: "These Terms shall be governed by the laws of India, with disputes subject to courts in Bangalore, India." },
                    { title: "9. Changes to Terms", body: "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance." },
                    { title: "10. Contact", body: "For questions about these Terms of Service, please reach out to us." },
                ],
            },
        ],
        isActive: true,
        sortOrder: 60,
    },
    {
        title: "System Status",
        slug: "status",
        path: "/status",
        hero: {
            title: "System",
            titleHighlight: "Status",
            description: "Real-time status updates and historical uptime data for all our enterprise services.",
        },
        sections: [
            {
                __component: "page.status-section",
                overallStatus: "All Systems Operational",
                verifiedText: "Verified 1 minute ago",
                uptimeLabel: "30-Day Uptime",
                uptimeValue: "99.98%",
                latencyLabel: "Avg Latency",
                latencyValue: "18ms",
                systems: [
                    { name: "Public Website", status: "operational", uptime: "99.99%", latency: "12ms" },
                    { name: "Admin Dashboard", status: "operational", uptime: "99.95%", latency: "45ms" },
                    { name: "Core API Service", status: "operational", uptime: "99.99%", latency: "28ms" },
                    { name: "Database Cluster", status: "operational", uptime: "100%", latency: "2ms" },
                    { name: "CDN / Assets", status: "operational", uptime: "100%", latency: "4ms" },
                    { name: "Authentication Service", status: "operational", uptime: "99.98%", latency: "32ms" },
                ],
                incidents: [
                    { date: "Dec 12, 2024", title: "Scheduled Database Maintenance", status: "completed", type: "maintenance" },
                    { date: "Nov 28, 2024", title: "Minor Latency in API Gateway", status: "resolved", type: "incident" },
                ],
            },
        ],
        isActive: true,
        sortOrder: 70,
    },
    {
        title: "Coming Soon",
        slug: "coming-soon",
        path: "/coming-soon",
        hero: {
            overline: "In Development",
            title: "Coming",
            titleHighlight: "Soon",
            description: "We are currently building this section of the TakeWeb Platform to bring you the best-in-class enterprise experience. Stay tuned for updates!",
            primaryCta: { label: "Return Home", href: "/", variant: "primary" },
            secondaryCta: { label: "Contact Us Now", href: "/contact", variant: "secondary" },
        },
        sections: [],
        isActive: true,
        sortOrder: 80,
    },
    {
        title: "Startup Solutions",
        slug: "startups",
        path: "/solutions/startups",
        hero: {
            overline: "Startup Solutions",
            title: "From Idea to Scale",
            titleHighlight: "Built for Speed",
            description: "We help startups move fast without breaking things. From MVPs to production-ready platforms, we're your technical co-founders.",
            primaryCta: { label: "Launch Your Idea", href: "/contact", variant: "primary" },
        },
        sections: [
            {
                __component: "page.card-grid-section",
                heading: { overline: "What We Offer", title: "Startup", titleHighlight: "Solutions" },
                background: "secondary",
                columns: 3,
                cards: [
                    { icon: "rocket", title: "MVP Development", description: "Launch fast with lean, validated product prototypes" },
                    { icon: "code", title: "Scalable Architecture", description: "Cloud-native systems built to grow with you" },
                    { icon: "zap", title: "Rapid Deployment", description: "CI/CD pipelines and automated release management" },
                    { icon: "chart", title: "Growth Engineering", description: "Analytics, A/B testing, and conversion optimization" },
                    { icon: "users", title: "Team Augmentation", description: "On-demand senior engineers to boost your team" },
                    { icon: "globe", title: "Go-to-Market Tech", description: "Landing pages, integrations, and marketing automation" },
                ],
            },
            { __component: "home.cta-section", title: "Ready to Build Your Startup?", description: "Let's turn your vision into a scalable, market-ready product.", primaryCta: { label: "Get Started", href: "/contact", variant: "primary" } },
        ],
        isActive: true,
        sortOrder: 90,
    },
    {
        title: "Enterprise Solutions",
        slug: "enterprise",
        path: "/solutions/enterprise",
        hero: {
            overline: "Enterprise Solutions",
            title: "Technology Built for",
            titleHighlight: "Enterprise Scale",
            description: "Modernize complex systems, improve delivery, and build resilient platforms for large organizations.",
            primaryCta: { label: "Plan Transformation", href: "/contact", variant: "primary" },
        },
        sections: [
            {
                __component: "page.card-grid-section",
                heading: { overline: "Enterprise Capabilities", title: "Operate at", titleHighlight: "Scale" },
                background: "secondary",
                columns: 3,
                cards: [
                    { icon: "server", title: "Platform Modernization", description: "Modern cloud-native architecture for critical enterprise workloads" },
                    { icon: "shield", title: "Security & Compliance", description: "Governance, access control, audit readiness, and secure delivery" },
                    { icon: "chart", title: "Operational Analytics", description: "Dashboards and decision systems for leadership and operations" },
                    { icon: "cloud", title: "Cloud Transformation", description: "Migration, DevOps, observability, and cost optimization" },
                    { icon: "users", title: "Delivery Enablement", description: "Agile operating models and technical leadership support" },
                    { icon: "zap", title: "Automation", description: "Workflow automation to reduce manual work and improve reliability" },
                ],
            },
            { __component: "home.cta-section", title: "Transform Your Enterprise", description: "Build a practical roadmap for modernization and measurable business impact.", primaryCta: { label: "Talk to Experts", href: "/contact", variant: "primary" } },
        ],
        isActive: true,
        sortOrder: 91,
    },
    {
        title: "Healthcare Solutions",
        slug: "healthcare",
        path: "/solutions/healthcare",
        hero: {
            overline: "Healthcare Solutions",
            title: "Digital Health",
            titleHighlight: "Built Securely",
            description: "Secure healthcare platforms, patient portals, analytics, and workflow systems designed for trust and compliance.",
            primaryCta: { label: "Discuss Healthcare Tech", href: "/contact", variant: "primary" },
        },
        sections: [
            {
                __component: "page.card-grid-section",
                heading: { overline: "Healthcare Capabilities", title: "Patient-Centered", titleHighlight: "Technology" },
                background: "secondary",
                columns: 3,
                cards: [
                    { icon: "shield", title: "Compliance-Ready Systems", description: "Secure architecture aligned with healthcare privacy needs" },
                    { icon: "users", title: "Patient Portals", description: "Digital experiences for patients, providers, and administrators" },
                    { icon: "database", title: "Healthcare Data", description: "Interoperable data pipelines, reporting, and analytics" },
                ],
            },
            { __component: "home.cta-section", title: "Build Better Healthcare Experiences", description: "Create secure, scalable systems for modern healthcare delivery.", primaryCta: { label: "Get Started", href: "/contact", variant: "primary" } },
        ],
        isActive: true,
        sortOrder: 92,
    },
    {
        title: "FinTech Solutions",
        slug: "fintech",
        path: "/solutions/fintech",
        hero: {
            overline: "FinTech Solutions",
            title: "Secure Financial",
            titleHighlight: "Technology",
            description: "Payment platforms, financial dashboards, automation, integrations, and compliance-ready systems for modern finance teams.",
            primaryCta: { label: "Build FinTech Systems", href: "/contact", variant: "primary" },
        },
        sections: [
            {
                __component: "page.card-grid-section",
                heading: { overline: "FinTech Capabilities", title: "Move Fast with", titleHighlight: "Trust" },
                background: "secondary",
                columns: 3,
                cards: [
                    { icon: "lock", title: "Secure Transactions", description: "Security-first systems for payments and financial workflows" },
                    { icon: "chart", title: "Financial Analytics", description: "Real-time dashboards, reconciliation, and reporting" },
                    { icon: "cloud", title: "Scalable Infrastructure", description: "Reliable platforms for high-volume financial products" },
                ],
            },
            { __component: "home.cta-section", title: "Launch Secure Financial Products", description: "Build with reliability, compliance, and user trust from day one.", primaryCta: { label: "Talk to Us", href: "/contact", variant: "primary" } },
        ],
        isActive: true,
        sortOrder: 93,
    },
    {
        title: "EdTech Solutions",
        slug: "edtech",
        path: "/solutions/edtech",
        hero: {
            overline: "EdTech Solutions",
            title: "Learning Platforms",
            titleHighlight: "That Scale",
            description: "We build learning platforms, student dashboards, content systems, and analytics tools for education businesses.",
            primaryCta: { label: "Build EdTech Platform", href: "/contact", variant: "primary" },
        },
        sections: [
            {
                __component: "page.card-grid-section",
                heading: { overline: "EdTech Capabilities", title: "Better Digital", titleHighlight: "Learning" },
                background: "secondary",
                columns: 3,
                cards: [
                    { icon: "users", title: "Learner Portals", description: "Role-based experiences for students, teachers, and admins" },
                    { icon: "globe", title: "Content Platforms", description: "Scalable systems for courses, resources, and certifications" },
                    { icon: "chart", title: "Learning Analytics", description: "Insights into engagement, progress, and outcomes" },
                ],
            },
            { __component: "home.cta-section", title: "Create Better Learning Products", description: "Turn your education vision into a polished, scalable platform.", primaryCta: { label: "Start Now", href: "/contact", variant: "primary" } },
        ],
        isActive: true,
        sortOrder: 94,
    },
];
