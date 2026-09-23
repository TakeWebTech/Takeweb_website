import { fallbackSitePages, type CmsPage } from "@/content/site-pages";

const STRAPI_URL = (process.env.STRAPI_URL || "https://cms.takeweb.in").replace(/\/$/, "");

type StrapiMedia = string | { url?: string; alternativeText?: string; data?: { attributes?: { url?: string } } } | null | undefined;
type TextListValue = string[] | { text?: string }[] | null | undefined;

function withStrapiUrl(path?: string) {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${STRAPI_URL}${path}`;
}

function getAttributes<T>(item: T & { attributes?: T }) {
    return item.attributes ? { id: (item as { id?: string | number }).id, ...item.attributes } : item;
}

function getMediaUrl(media: StrapiMedia) {
    if (!media) return "";
    if (typeof media === "string") return withStrapiUrl(media);
    if (media.url) return withStrapiUrl(media.url);
    return withStrapiUrl(media.data?.attributes?.url);
}

function getTextList(value: TextListValue) {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => typeof item === "string" ? item : item.text)
        .filter((item): item is string => Boolean(item));
}

async function strapiSingle<T>(path: string, revalidate = 1800): Promise<T | null> {
    if (!STRAPI_URL) return null;
    try {
        const token = process.env.STRAPI_API_TOKEN;
        const res = await fetch(`${STRAPI_URL}/api/${path.replace(/^\//, "")}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            next: { revalidate },
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) return null;

        const json = await res.json();
        return json.data ? getAttributes(json.data) as T : null;
    } catch {
        return null;
    }
}

async function strapiFetch<T>(path: string, revalidate = 1800): Promise<T[]> {
    if (!STRAPI_URL) return [];
    try {
        const token = process.env.STRAPI_API_TOKEN;
        const res = await fetch(`${STRAPI_URL}/api/${path.replace(/^\//, "")}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            next: { revalidate },
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) return [];

        const json = await res.json();
        const rows = Array.isArray(json.data) ? json.data : [];
        return rows.map(getAttributes) as T[];
    } catch {
        return [];
    }
}

export interface SiteService {
    id: string | number;
    title: string;
    slug: string;
    shortDescription?: string;
    description?: string;
    icon?: string;
    gradient?: string;
    features?: TextListValue;
    benefits?: TextListValue;
    technologies?: TextListValue;
    sortOrder?: number;
    isActive?: boolean;
}

export const defaultServices: SiteService[] = [
    {
        id: "enterprise-software",
        title: "Enterprise Software",
        slug: "enterprise-software",
        shortDescription: "Custom solutions built with cutting-edge technologies for complex business challenges.",
        description: "Custom enterprise platforms, workflow systems, integrations, and modernization programs built for scale.",
        icon: "code",
        gradient: "from-blue-500 to-cyan-500",
        features: ["Custom application development", "Legacy modernization", "API integrations", "Enterprise architecture"],
        technologies: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
        sortOrder: 1,
        isActive: true,
    },
    {
        id: "cloud-devops",
        title: "Cloud & DevOps",
        slug: "cloud-devops",
        shortDescription: "Seamless cloud migration, infrastructure automation, and continuous delivery.",
        description: "Cloud architecture, migration, infrastructure automation, CI/CD, observability, and managed DevOps.",
        icon: "cloud",
        gradient: "from-violet-500 to-purple-500",
        features: ["Cloud migration", "Infrastructure as code", "CI/CD pipelines", "Monitoring and observability"],
        technologies: ["AWS", "Azure", "Kubernetes", "Terraform"],
        sortOrder: 2,
        isActive: true,
    },
    {
        id: "cybersecurity",
        title: "Cybersecurity",
        slug: "cybersecurity",
        shortDescription: "Enterprise-grade security to protect your digital assets and ensure compliance.",
        description: "Security assessments, compliance programs, secure architecture, and threat protection for modern businesses.",
        icon: "shield",
        gradient: "from-rose-500 to-pink-500",
        features: ["Security audits", "Compliance readiness", "Application security", "Threat monitoring"],
        technologies: ["SIEM", "Zero Trust", "OWASP", "Cloud Security"],
        sortOrder: 3,
        isActive: true,
    },
    {
        id: "ai-data",
        title: "AI & Data Engineering",
        slug: "ai-data",
        shortDescription: "Intelligent automation and predictive analytics for data-driven decisions.",
        description: "Data pipelines, analytics platforms, AI-powered automation, and machine learning systems.",
        icon: "cpu",
        gradient: "from-amber-500 to-orange-500",
        features: ["Data engineering", "AI automation", "Dashboards", "Machine learning platforms"],
        technologies: ["Python", "OpenAI", "BigQuery", "dbt"],
        sortOrder: 4,
        isActive: true,
    },
    {
        id: "web-mobile",
        title: "Web & Mobile Apps",
        slug: "web-mobile",
        shortDescription: "Native and cross-platform apps delivering exceptional user experiences.",
        description: "Responsive web apps, mobile apps, portals, and product experiences for customers and teams.",
        icon: "smartphone",
        gradient: "from-emerald-500 to-teal-500",
        features: ["Web applications", "Mobile apps", "Design systems", "Performance optimization"],
        technologies: ["React", "Next.js", "React Native", "Flutter"],
        sortOrder: 5,
        isActive: true,
    },
    {
        id: "it-consulting",
        title: "IT Consulting",
        slug: "it-consulting",
        shortDescription: "Strategic guidance to modernize operations and accelerate digital transformation.",
        description: "Technology strategy, roadmap planning, architecture reviews, and transformation consulting.",
        icon: "chart",
        gradient: "from-indigo-500 to-blue-500",
        features: ["Technology strategy", "Architecture review", "Roadmaps", "Vendor selection"],
        technologies: ["Cloud", "Security", "Data", "Enterprise Architecture"],
        sortOrder: 6,
        isActive: true,
    },
];

export interface SiteBlogPost {
    id: string | number;
    slug: string;
    title: string;
    excerpt?: string;
    content?: string;
    coverImage?: StrapiMedia;
    author?: string | { name?: string; data?: { attributes?: { name?: string } } };
    category?: string | { name?: string; data?: { attributes?: { name?: string } } };
    readTime?: number;
    publishedAt?: string;
    isFeatured?: boolean;
    isPublished?: boolean;
}

export interface SiteProject {
    id: string | number;
    slug: string;
    title: string;
    client?: string;
    industry?: string;
    shortDescription?: string;
    description?: string;
    challenge?: string;
    solution?: string;
    results?: string;
    technologies?: TextListValue;
    coverImage?: StrapiMedia;
    isFeatured?: boolean;
    isActive?: boolean;
}

export interface SiteJob {
    id: string | number;
    title: string;
    slug: string;
    department: string;
    location: string;
    type: string;
    minSalary?: number;
    maxSalary?: number;
    description: string;
    requirements?: string;
    benefits?: TextListValue;
    deadline?: string;
    isRemote?: boolean;
    isActive?: boolean;
}

export interface GlobalLink {
    name: string;
    href: string;
    desc?: string;
}

export interface GlobalMenu {
    title: string;
    items?: GlobalLink[];
    sections?: { title: string; items: GlobalLink[] }[];
    featured?: { name: string; desc?: string; href: string };
}

export interface GlobalContent {
    siteName: string;
    companyName?: string;
    tagline?: string;
    logo?: StrapiMedia;
    email?: string;
    phone?: string;
    address?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    navigation?: Record<string, GlobalMenu>;
    footerLinks?: Record<string, GlobalLink[]>;
    socialLinks?: GlobalLink[];
    copyrightText?: string;
}

export interface HomePageContent {
    hero?: {
        badgeText?: string;
        title: string;
        titleHighlight?: string;
        description?: string;
        primaryCta?: { label: string; href: string; variant?: string };
        secondaryCta?: { label: string; href: string; variant?: string };
        showScrollIndicator?: boolean;
    };
    partnerSlider?: {
        eyebrow?: string;
        tiles?: { name: string; icon?: string }[];
    };
    stats?: { value: number; suffix?: string; label: string }[];
    servicesHeading?: { overline?: string; title: string; titleHighlight?: string; description?: string };
    services?: { title: string; description?: string; href: string; icon?: string; gradient?: string }[];
    whyTakeWeb?: {
        overline?: string;
        title: string;
        titleHighlight?: string;
        description?: string;
        features?: { title: string; description?: string; icon?: string }[];
    };
    testimonialsHeading?: { overline?: string; title: string; titleHighlight?: string; description?: string };
    testimonials?: { quote: string; author: string; role?: string; avatar?: StrapiMedia; avatarFallback?: string }[];
    cta?: {
        title: string;
        description?: string;
        primaryCta?: { label: string; href: string; variant?: string };
        secondaryCta?: { label: string; href: string; variant?: string };
    };
}

export type SitePageContent = CmsPage;

export const defaultHomePageContent: HomePageContent = {
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

export const defaultGlobalContent: GlobalContent = {
    siteName: "TakeWeb",
    companyName: "TakeWeb Enterprise",
    tagline: "Next-generation enterprise IT solutions. We deliver world-class consulting, custom software, and digital transformation services.",
    email: "hello@takeweb.in",
    phone: "+91 98765 43210",
    address: "Bangalore, India",
    primaryCtaLabel: "Get Consultation",
    primaryCtaHref: "/contact",
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
            featured: { name: "TakeWeb AI Suite", desc: "Transform your enterprise with AI", href: "/products/ai-suite" },
        },
        solutions: {
            title: "Solutions",
            sections: [
                {
                    title: "By Business",
                    items: [
                        { name: "Startups", href: "/solutions/startups" },
                        { name: "Growing Companies", href: "/solutions/growing-companies" },
                        { name: "Enterprises", href: "/solutions/enterprise" },
                    ],
                },
                {
                    title: "By Need",
                    items: [
                        { name: "Digital Transformation", href: "/solutions/digital-transformation" },
                        { name: "Cloud Migration", href: "/solutions/cloud-migration" },
                        { name: "AI Adoption", href: "/solutions/ai-adoption" },
                        { name: "Security & Compliance", href: "/solutions/security-compliance" },
                    ],
                },
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
    copyrightText: "TakeWeb Enterprise. All rights reserved.",
};

export async function getGlobalContent() {
    const global = await strapiSingle<GlobalContent>("global?populate=*", 1800);
    if (!global) return defaultGlobalContent;

    return {
        ...defaultGlobalContent,
        ...global,
        logo: getMediaUrl(global.logo) || "/logo.png",
        navigation: global.navigation || defaultGlobalContent.navigation,
        footerLinks: global.footerLinks || defaultGlobalContent.footerLinks,
        socialLinks: global.socialLinks || defaultGlobalContent.socialLinks,
    };
}

export async function getHomePageContent() {
    const homePage = await strapiSingle<HomePageContent>("home-page?populate[hero][populate]=*&populate[partnerSlider][populate][tiles]=*&populate[stats][populate]=*&populate[servicesHeading][populate]=*&populate[services][populate]=*&populate[whyTakeWeb][populate][features]=*&populate[testimonialsHeading][populate]=*&populate[testimonials][populate]=*&populate[cta][populate]=*", 1800);
    if (!homePage) return defaultHomePageContent;

    return {
        ...defaultHomePageContent,
        ...homePage,
        hero: { ...defaultHomePageContent.hero, ...homePage.hero },
        partnerSlider: { ...defaultHomePageContent.partnerSlider, ...homePage.partnerSlider },
        stats: homePage.stats?.length ? homePage.stats : defaultHomePageContent.stats,
        servicesHeading: { ...defaultHomePageContent.servicesHeading, ...homePage.servicesHeading },
        services: homePage.services?.length ? homePage.services : defaultHomePageContent.services,
        whyTakeWeb: {
            ...defaultHomePageContent.whyTakeWeb,
            ...homePage.whyTakeWeb,
            features: homePage.whyTakeWeb?.features?.length ? homePage.whyTakeWeb.features : defaultHomePageContent.whyTakeWeb?.features,
        },
        testimonialsHeading: { ...defaultHomePageContent.testimonialsHeading, ...homePage.testimonialsHeading },
        testimonials: homePage.testimonials?.length
            ? homePage.testimonials.map((testimonial) => ({
                ...testimonial,
                avatar: getMediaUrl(testimonial.avatar) || testimonial.avatarFallback || "/founder.jpg",
            }))
            : defaultHomePageContent.testimonials,
        cta: { ...defaultHomePageContent.cta, ...homePage.cta },
    };
}

export async function getSitePage(slug: string) {
    const pages = await strapiFetch<SitePageContent>(
        `site-pages?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[hero][populate]=*&populate[sections][on][page.card-grid-section][populate][heading]=*&populate[sections][on][page.card-grid-section][populate][cards]=*&populate[sections][on][page.people-section][populate][heading]=*&populate[sections][on][page.people-section][populate][people][populate]=*&populate[sections][on][page.timeline-section][populate][heading]=*&populate[sections][on][page.timeline-section][populate][items]=*&populate[sections][on][page.legal-content-section][populate][sections][populate][items]=*&populate[sections][on][page.legal-content-section][populate][cta]=*&populate[sections][on][page.contact-section][populate]=*&populate[sections][on][page.status-section][populate]=*&populate[sections][on][home.cta-section][populate]=*`,
        1800,
    );
    const page = pages.find((item) => item.isActive !== false);
    if (page) {
        return {
            ...page,
            hero: page.hero ? { ...page.hero, image: getMediaUrl(page.hero.image) || page.hero.image } : page.hero,
        };
    }

    return fallbackSitePages.find((item) => item.slug === slug) || null;
}

export async function getServices() {
    const services = await strapiFetch<SiteService>("services?sort=sortOrder:asc&populate=*", 3600);
    const rows = services.length ? services : defaultServices;
    return rows
        .filter((service) => service.isActive !== false)
        .map((service) => ({
            ...service,
            features: getTextList(service.features),
            benefits: getTextList(service.benefits),
            technologies: getTextList(service.technologies),
        }));
}

export async function getServiceBySlug(slug: string) {
    const aliasMap: Record<string, string> = {
        "software-development": "enterprise-software",
        "enterprise-solutions": "enterprise-software",
        "ai-data-analytics": "ai-data",
    };
    const normalizedSlug = aliasMap[slug] || slug;
    const services = await getServices();
    return services.find((service) => service.slug === normalizedSlug) || null;
}

export async function getBlogPosts() {
    const posts = await strapiFetch<SiteBlogPost>("blog-posts?sort=publishedAt:desc&populate=*", 60);

    return posts
        .filter((post) => post.isPublished !== false)
        .map((post) => ({
            ...post,
            coverImage: getMediaUrl(post.coverImage),
            author: typeof post.author === "string" ? post.author : post.author?.name || post.author?.data?.attributes?.name || "TakeWeb Team",
            category: typeof post.category === "string" ? post.category : post.category?.name || post.category?.data?.attributes?.name || "Insights",
        }));
}

export async function getProjects() {
    const projects = await strapiFetch<SiteProject>("projects?sort=sortOrder:asc&populate=*", 3600);

    return projects
        .filter((project) => project.isActive !== false)
        .map((project) => ({
            ...project,
            coverImage: getMediaUrl(project.coverImage),
            technologies: getTextList(project.technologies),
        }));
}

export async function getJobs() {
    const jobs = await strapiFetch<SiteJob>("jobs?sort=title:asc&populate=*", 900);
    return jobs
        .filter((job) => job.isActive !== false)
        .map((job) => ({
            ...job,
            benefits: getTextList(job.benefits),
        }));
}
