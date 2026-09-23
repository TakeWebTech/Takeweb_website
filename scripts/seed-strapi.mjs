import fs from "node:fs";

const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/$/, "");
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL) {
  console.error("Missing STRAPI_URL. Set it to the deployed Strapi URL.");
  process.exit(1);
}

if (!TOKEN) {
    console.error("Missing STRAPI_API_TOKEN. Create a Strapi API token with create/update permissions first.");
    process.exit(1);
}

const textItems = (items) => items.map((text) => ({ text }));

function loadFallbackSitePages() {
    const source = fs.readFileSync("apps/web/content/site-pages.ts", "utf8");
    const declaration = "export const fallbackSitePages: CmsPage[] = ";
    const start = source.indexOf(declaration);

    if (start === -1) {
        throw new Error("Could not find fallbackSitePages in apps/web/content/site-pages.ts");
    }

    const expression = source.slice(start + declaration.length).trim().replace(/;$/, "");
    const pages = Function(`"use strict"; return (${expression});`)();

    return pages.map((page) => ({
        ...page,
        hero: page.hero ? { ...page.hero, image: undefined } : undefined,
    }));
}

const sitePages = loadFallbackSitePages();

const services = [
    {
        title: "Enterprise Software",
        slug: "enterprise-software",
        shortDescription: "Custom solutions built with cutting-edge technologies for complex business challenges.",
        description: "Custom enterprise platforms, workflow systems, integrations, and modernization programs built for scale.",
        icon: "code",
        gradient: "from-blue-500 to-cyan-500",
        features: textItems(["Custom application development", "Legacy modernization", "API integrations", "Enterprise architecture"]),
        technologies: textItems(["Next.js", "Node.js", "PostgreSQL", "AWS"]),
        sortOrder: 1,
        isActive: true,
    },
    {
        title: "Cloud & DevOps",
        slug: "cloud-devops",
        shortDescription: "Seamless cloud migration, infrastructure automation, and continuous delivery.",
        description: "Cloud architecture, migration, infrastructure automation, CI/CD, observability, and managed DevOps.",
        icon: "cloud",
        gradient: "from-violet-500 to-purple-500",
        features: textItems(["Cloud migration", "Infrastructure as code", "CI/CD pipelines", "Monitoring and observability"]),
        technologies: textItems(["AWS", "Azure", "Kubernetes", "Terraform"]),
        sortOrder: 2,
        isActive: true,
    },
    {
        title: "Cybersecurity",
        slug: "cybersecurity",
        shortDescription: "Enterprise-grade security to protect your digital assets and ensure compliance.",
        description: "Security assessments, compliance programs, secure architecture, and threat protection for modern businesses.",
        icon: "shield",
        gradient: "from-rose-500 to-pink-500",
        features: textItems(["Security audits", "Compliance readiness", "Application security", "Threat monitoring"]),
        technologies: textItems(["SIEM", "Zero Trust", "OWASP", "Cloud Security"]),
        sortOrder: 3,
        isActive: true,
    },
    {
        title: "AI & Data Engineering",
        slug: "ai-data",
        shortDescription: "Intelligent automation and predictive analytics for data-driven decisions.",
        description: "Data pipelines, analytics platforms, AI-powered automation, and machine learning systems.",
        icon: "cpu",
        gradient: "from-amber-500 to-orange-500",
        features: textItems(["Data engineering", "AI automation", "Dashboards", "Machine learning platforms"]),
        technologies: textItems(["Python", "OpenAI", "BigQuery", "dbt"]),
        sortOrder: 4,
        isActive: true,
    },
    {
        title: "Web & Mobile Apps",
        slug: "web-mobile",
        shortDescription: "Native and cross-platform apps delivering exceptional user experiences.",
        description: "Responsive web apps, mobile apps, portals, and product experiences for customers and teams.",
        icon: "smartphone",
        gradient: "from-emerald-500 to-teal-500",
        features: textItems(["Web applications", "Mobile apps", "Design systems", "Performance optimization"]),
        technologies: textItems(["React", "Next.js", "React Native", "Flutter"]),
        sortOrder: 5,
        isActive: true,
    },
    {
        title: "IT Consulting",
        slug: "it-consulting",
        shortDescription: "Strategic guidance to modernize operations and accelerate digital transformation.",
        description: "Technology strategy, roadmap planning, architecture reviews, and transformation consulting.",
        icon: "chart",
        gradient: "from-indigo-500 to-blue-500",
        features: textItems(["Technology strategy", "Architecture review", "Roadmaps", "Vendor selection"]),
        technologies: textItems(["Cloud", "Security", "Data", "Enterprise Architecture"]),
        sortOrder: 6,
        isActive: true,
    },
];

const global = {
    siteName: "TakeWeb",
    companyName: "TakeWeb Enterprise",
    tagline: "Next-generation enterprise IT solutions. We deliver world-class consulting, custom software, and digital transformation services.",
    email: "hello@takeweb.in",
    phone: "+91 98765 43210",
    address: "Bangalore, India",
    primaryCtaLabel: "Get Consultation",
    primaryCtaHref: "/contact",
    copyrightText: "TakeWeb Enterprise. All rights reserved.",
    navigation: {
        products: {
            title: "Products",
            sections: [
                {
                    title: "Platforms",
                    items: [
                        { name: "TakeWeb Cloud Platform", desc: "Enterprise-grade cloud management & automation", href: "/products/cloud-platform" },
                        { name: "TakeWeb AI Suite", desc: "AI, analytics & intelligent automation", href: "/products/ai-suite" },
                        { name: "TakeWeb Secure", desc: "Security, compliance & threat protection", href: "/products/secure" },
                    ],
                },
                {
                    title: "Developer Tools",
                    items: [
                        { name: "TakeWeb APIs", desc: "RESTful & GraphQL APIs", href: "/products/apis" },
                        { name: "DevOps Toolkit", desc: "CI/CD & automation tools", href: "/products/devops-toolkit" },
                        { name: "Monitoring & Observability", desc: "Real-time insights", href: "/products/monitoring" },
                    ],
                },
            ],
            featured: { name: "TakeWeb AI Suite", desc: "Transform your enterprise with AI", href: "/blog" },
        },
        solutions: {
            title: "Solutions",
            sections: [
                { title: "By Business", items: [{ name: "Startups", href: "/solutions/startups" }, { name: "Growing Companies", href: "/solutions/growing-companies" }, { name: "Enterprises", href: "/solutions/enterprise" }] },
                { title: "By Need", items: [{ name: "Digital Transformation", href: "/solutions/digital-transformation" }, { name: "Cloud Migration", href: "/solutions/cloud-migration" }, { name: "AI Adoption", href: "/solutions/ai-adoption" }, { name: "Security & Compliance", href: "/solutions/security-compliance" }] },
            ],
            featured: { name: "Enterprise Transformation", desc: "End-to-end digital transformation", href: "/solutions/enterprise" },
        },
        services: {
            title: "Services",
            sections: [
                { title: "Engineering", items: [{ name: "Custom Software Development", href: "/services/enterprise-software" }, { name: "Web & Mobile Applications", href: "/services/web-mobile" }] },
                { title: "Cloud & DevOps", items: [{ name: "Cloud Architecture", href: "/services/cloud-devops" }, { name: "DevOps & Automation", href: "/services/cloud-devops" }] },
                { title: "Data & AI", items: [{ name: "AI / ML Development", href: "/services/ai-data" }, { name: "Data Engineering", href: "/services/ai-data" }] },
                { title: "Security", items: [{ name: "Cybersecurity", href: "/services/cybersecurity" }, { name: "Compliance & Audits", href: "/services/cybersecurity" }] },
                { title: "Consulting", items: [{ name: "IT Consulting", href: "/services/it-consulting" }, { name: "Technology Strategy", href: "/services/it-consulting" }] },
            ],
        },
        industries: {
            title: "Industries",
            items: [
                { name: "SaaS & Technology", href: "/industries/saas" },
                { name: "FinTech & Banking", href: "/industries/fintech" },
                { name: "Healthcare", href: "/industries/healthcare" },
                { name: "Education", href: "/industries/education" },
                { name: "E-commerce", href: "/industries/ecommerce" },
                { name: "Enterprise & Corporates", href: "/industries/enterprise" },
            ],
        },
        resources: {
            title: "Resources",
            sections: [
                { title: "Insights", items: [{ name: "Blog", href: "/blog" }, { name: "Articles", href: "/blog" }] },
                { title: "Learn", items: [{ name: "Case Studies", href: "/projects" }, { name: "Whitepapers", href: "/resources/whitepapers" }, { name: "Service Status", href: "/status" }, { name: "News & Updates", href: "/blog" }] },
            ],
            featured: { name: "Latest Insights", desc: "The Future of Enterprise AI", href: "/blog" },
        },
        company: {
            title: "Company",
            items: [
                { name: "About TakeWeb", href: "/about" },
                { name: "Mission & Vision", href: "/about#mission" },
                { name: "Leadership", href: "/about#leadership" },
                { name: "Security & Compliance", href: "/security" },
                { name: "Partnerships", href: "/partnerships" },
                { name: "Careers", href: "/careers" },
            ],
        },
    },
    footerLinks: {
        services: [
            { name: "Enterprise Software", href: "/services/enterprise-software" },
            { name: "Cloud & DevOps", href: "/services/cloud-devops" },
            { name: "AI & Data Engineering", href: "/services/ai-data" },
            { name: "Cybersecurity", href: "/services/cybersecurity" },
            { name: "Web & Mobile", href: "/services/web-mobile" },
            { name: "IT Consulting", href: "/services/it-consulting" },
        ],
        solutions: [
            { name: "For Startups", href: "/solutions/startups" },
            { name: "For Enterprise", href: "/solutions/enterprise" },
            { name: "Healthcare", href: "/solutions/healthcare" },
            { name: "FinTech", href: "/solutions/fintech" },
            { name: "EdTech", href: "/solutions/edtech" },
        ],
        company: [
            { name: "About Us", href: "/about" },
            { name: "Partnerships", href: "/partnerships" },
            { name: "Blog", href: "/blog" },
            { name: "Projects", href: "/projects" },
            { name: "Careers", href: "/careers" },
            { name: "Contact", href: "/contact" },
        ],
        legal: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Security", href: "/security" },
        ],
    },
    socialLinks: [
        { name: "LinkedIn", href: "https://linkedin.com/company/takeweb" },
        { name: "Twitter", href: "https://twitter.com/takeweb" },
        { name: "GitHub", href: "https://github.com/takewebtech" },
        { name: "YouTube", href: "https://youtube.com/@takeweb" },
    ],
};

const homePage = {
    hero: {
        badgeText: "Trusted by 500+ enterprises worldwide",
        title: "Next-Generation",
        titleHighlight: "Enterprise IT Solutions",
        description: "We deliver world-class consulting, custom software, cloud solutions, and AI-powered innovations to enterprises and governments worldwide.",
        primaryCta: { label: "Get a Consultation", href: "/contact", variant: "primary" },
        secondaryCta: { label: "Explore Solutions", href: "/services", variant: "secondary" },
        showScrollIndicator: true,
    },
    partnerSlider: {
        eyebrow: "Trusted by leading enterprises & powered by world-class technology",
        tiles: [
            { name: "AWS", icon: "cloud" },
            { name: "Google Cloud", icon: "database" },
            { name: "Microsoft Azure", icon: "server" },
            { name: "Oracle", icon: "shield" },
            { name: "Salesforce", icon: "globe" },
            { name: "SAP", icon: "cpu" },
            { name: "IBM", icon: "activity" },
            { name: "Red Hat", icon: "box" },
            { name: "TechVentures", icon: "layers" },
            { name: "DataFlow", icon: "hexagon" },
            { name: "InnovateCorp", icon: "triangle" },
            { name: "GlobalStack", icon: "circle" },
            { name: "PeakSystems", icon: "globe2" },
        ],
    },
    stats: [
        { value: 500, suffix: "+", label: "Projects Delivered" },
        { value: 99.9, suffix: "%", label: "Uptime SLA" },
        { value: 150, suffix: "+", label: "Enterprise Clients" },
        { value: 50, suffix: "+", label: "Countries Served" },
    ],
    servicesHeading: {
        overline: "Our Services",
        title: "Comprehensive IT Solutions",
        titleHighlight: "for Modern Enterprises",
        description: "From custom software development to cloud infrastructure and AI, we deliver end-to-end solutions that drive business growth.",
    },
    services: [
        { icon: "code", title: "Enterprise Software", description: "Custom solutions built with cutting-edge technologies for complex business challenges.", href: "/services/enterprise-software", gradient: "from-blue-500 to-cyan-500" },
        { icon: "cloud", title: "Cloud & DevOps", description: "Seamless cloud migration, infrastructure automation, and continuous delivery.", href: "/services/cloud-devops", gradient: "from-violet-500 to-purple-500" },
        { icon: "shield", title: "Cybersecurity", description: "Enterprise-grade security to protect your digital assets and ensure compliance.", href: "/services/cybersecurity", gradient: "from-rose-500 to-pink-500" },
        { icon: "cpu", title: "AI & Data Engineering", description: "Intelligent automation and predictive analytics for data-driven decisions.", href: "/services/ai-data", gradient: "from-amber-500 to-orange-500" },
        { icon: "smartphone", title: "Web & Mobile Apps", description: "Native and cross-platform apps delivering exceptional user experiences.", href: "/services/web-mobile", gradient: "from-emerald-500 to-teal-500" },
        { icon: "chart", title: "IT Consulting", description: "Strategic guidance to modernize operations and accelerate digital transformation.", href: "/services/it-consulting", gradient: "from-indigo-500 to-blue-500" },
    ],
    whyTakeWeb: {
        overline: "Why TakeWeb",
        title: "Your Trusted Partner in",
        titleHighlight: "Digital Excellence",
        description: "We combine deep technical expertise with strategic business acumen to deliver solutions that drive real results.",
        features: [
            { icon: "award", title: "Enterprise-Grade Quality", description: "Rigorous testing, security audits, and compliance certifications." },
            { icon: "zap", title: "Rapid Delivery", description: "Agile methodologies ensure on-time delivery without compromising quality." },
            { icon: "users", title: "Expert Teams", description: "Senior architects with deep expertise across industries and technologies." },
            { icon: "globe", title: "Global Reach", description: "Serving clients across continents with 24-hour development cycles." },
        ],
    },
    testimonialsHeading: {
        overline: "Testimonials",
        title: "Trusted by Industry",
        titleHighlight: "Leaders",
        description: "See what our clients say about working with TakeWeb Enterprise.",
    },
    testimonials: [
        { quote: "TakeWeb transformed our legacy systems into a modern, scalable platform. Their team's expertise and dedication exceeded our expectations.", author: "Sarah Chen", role: "CTO, TechVentures Inc.", avatarFallback: "/founder.jpg" },
        { quote: "The cloud migration was seamless. We reduced costs by 40% while improving performance. Highly recommend their services.", author: "Michael Rodriguez", role: "VP Engineering, DataFlow", avatarFallback: "/founder.jpg" },
        { quote: "Their AI solutions helped us automate 70% of our manual processes. The ROI was visible within the first quarter.", author: "Emily Watson", role: "Director of Operations, InnovateCorp", avatarFallback: "/founder.jpg" },
    ],
    cta: {
        title: "Ready to Transform Your Business?",
        description: "Let's discuss how TakeWeb can help you achieve your digital transformation goals.",
        primaryCta: { label: "Schedule a Call", href: "/contact", variant: "primary" },
        secondaryCta: { label: "View Our Work", href: "/projects", variant: "secondary" },
    },
};

const blogPosts = [
    {
        title: "The Future of Enterprise AI",
        slug: "future-of-enterprise-ai",
        excerpt: "How AI is reshaping enterprise operations, automation, and decision-making.",
        content: "Enterprise AI is moving from experimentation into practical workflows. Teams are using it to automate support, improve forecasting, accelerate development, and unlock better decisions from existing data.",
        author: "TakeWeb Team",
        category: "AI & ML",
        readTime: 5,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date().toISOString(),
    },
    {
        title: "Cloud Migration Without the Chaos",
        slug: "cloud-migration-without-chaos",
        excerpt: "A practical approach to moving enterprise systems to the cloud.",
        content: "Successful cloud migration starts with discovery, risk mapping, workload prioritization, and a clear operating model. The goal is not just moving infrastructure, but improving reliability and delivery speed.",
        author: "TakeWeb Team",
        category: "Cloud & DevOps",
        readTime: 4,
        isFeatured: false,
        isPublished: true,
        publishedAt: new Date().toISOString(),
    },
];

const projects = [
    {
        title: "Enterprise Platform Modernization",
        slug: "enterprise-platform-modernization",
        client: "TechVentures Inc.",
        industry: "Technology",
        shortDescription: "Modernized a legacy enterprise platform into a scalable cloud-native system.",
        description: "TakeWeb helped transform legacy systems into a modern platform with improved reliability, usability, and deployment speed.",
        challenge: "The client had aging systems, slow release cycles, and rising maintenance cost.",
        solution: "We rebuilt core workflows, added API integrations, migrated workloads to cloud infrastructure, and introduced CI/CD.",
        results: "40% lower operating cost",
        technologies: textItems(["Next.js", "Node.js", "PostgreSQL", "AWS"]),
        isFeatured: true,
        isActive: true,
        sortOrder: 1,
    },
    {
        title: "AI Process Automation",
        slug: "ai-process-automation",
        client: "InnovateCorp",
        industry: "Enterprise",
        shortDescription: "Automated manual workflows with AI-assisted operations.",
        description: "We designed AI-enabled workflows that reduced manual effort and improved response times across operations.",
        challenge: "Manual processes slowed down teams and created inconsistent outcomes.",
        solution: "We built automation workflows, dashboards, and human review loops for sensitive actions.",
        results: "70% manual work automated",
        technologies: textItems(["Python", "OpenAI", "Next.js", "PostgreSQL"]),
        isFeatured: false,
        isActive: true,
        sortOrder: 2,
    },
];

const jobs = [
    {
        title: "Senior Full Stack Engineer",
        slug: "senior-full-stack-engineer",
        department: "Engineering",
        location: "Bangalore",
        type: "FULL_TIME",
        minSalary: 35,
        maxSalary: 55,
        description: "Build next-generation enterprise platforms using Next.js and Node.js.",
        requirements: "5+ years of React and Node.js experience\nStrong system design knowledge\nExperience with AWS or GCP",
        isRemote: true,
        isActive: true,
    },
    {
        title: "Product Designer",
        slug: "product-designer",
        department: "Design",
        location: "Remote",
        type: "FULL_TIME",
        minSalary: 20,
        maxSalary: 35,
        description: "Create beautiful, intuitive interfaces for enterprise applications.",
        requirements: "3+ years of product design experience\nProficiency in Figma\nStrong SaaS portfolio",
        isRemote: true,
        isActive: true,
    },
    {
        title: "Cloud Solutions Architect",
        slug: "cloud-architect",
        department: "Infrastructure",
        location: "Mumbai",
        type: "CONTRACT",
        minSalary: 40,
        maxSalary: 60,
        description: "Help clients migrate, modernize, and scale infrastructure on the cloud.",
        requirements: "AWS or Azure Solutions Architect certification\nExperience with Kubernetes and Terraform",
        isRemote: true,
        isActive: true,
    },
];

async function createEntry(collection, data) {
    const res = await fetch(`${STRAPI_URL}/api/${collection}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(`${collection}/${data.slug || data.title}: ${res.status} ${message}`);
    }
}

async function findEntry(collection, slug) {
    const params = new URLSearchParams({
        "filters[slug][$eq]": slug,
        "pagination[pageSize]": "1",
    });
    const res = await fetch(`${STRAPI_URL}/api/${collection}?${params}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (!res.ok) {
        throw new Error(`${collection}/${slug}: ${res.status} ${await res.text()}`);
    }

    const json = await res.json();
    return Array.isArray(json.data) && json.data.length > 0;
}

async function updateSingle(path, data) {
    const current = await fetch(`${STRAPI_URL}/api/${path}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (current.ok && (await current.json()).data) {
        console.log(`Kept existing ${path}`);
        return;
    }

    if (current.status !== 404) {
        throw new Error(`${path}: ${current.status} ${await current.text()}`);
    }

    const res = await fetch(`${STRAPI_URL}/api/${path}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(`${path}: ${res.status} ${message}`);
    }

    console.log(`Updated ${path}`);
}

async function seed(collection, rows) {
    for (const row of rows) {
        try {
            if (row.slug && await findEntry(collection, row.slug)) {
                console.log(`Kept existing ${collection}: ${row.title}`);
                continue;
            }
            await createEntry(collection, row);
            console.log(`Created ${collection}: ${row.title}`);
        } catch (error) {
            console.error(error.message);
        }
    }
}

await updateSingle("global", global);
await updateSingle("home-page", homePage);
await seed("services", services);
await seed("blog-posts", blogPosts);
await seed("projects", projects);
await seed("site-pages", sitePages);
