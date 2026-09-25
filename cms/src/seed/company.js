const leaders = [
  {
    name: "Himanshu Mathankar",
    slug: "owner",
    position: "Founder & CEO",
    description: "Visionary leader dedicated to transforming enterprise technology through innovation and excellence. Himanshu leads the strategic direction of TakeWeb, ensuring we deliver world-class solutions to our global partners.",
    email: "hello@takeweb.in",
    linkedin: "https://linkedin.com/in/himanshumathankar",
    twitter: "https://twitter.com/himanshumathankar",
  },
  {
    name: "Rajesh Kumar",
    slug: "founder",
    position: "Co-Founder & Advisor",
    description: "Rajesh brings 20+ years of experience in enterprise software and digital transformation. He now serves as a strategic advisor to the team.",
    email: "rajesh@takeweb.in",
    linkedin: "https://linkedin.com/in/rajeshkumar",
    twitter: "https://twitter.com/rajeshkumar",
  },
  {
    name: "Priya Sharma",
    slug: "cto",
    position: "Chief Technology Officer",
    description: "Priya leads TakeWeb's technology strategy and engineering teams. With expertise in cloud architecture, AI/ML, and DevOps, she ensures our solutions are built on solid technical foundations.",
    email: "priya@takeweb.in",
    linkedin: "https://linkedin.com/in/priyasharma",
    twitter: "https://twitter.com/priyasharma",
  },
  {
    name: "Michael Chen",
    slug: "cfo",
    position: "Chief Financial Officer",
    description: "Michael oversees TakeWeb's financial operations and strategic planning. His background in investment banking and fintech gives him unique insights into growing technology companies sustainably.",
    email: "michael@takeweb.in",
    linkedin: "https://linkedin.com/in/michaelchen",
  },
  {
    name: "Sarah Williams",
    slug: "coo",
    position: "Chief Operating Officer",
    description: "Sarah ensures TakeWeb's operations run smoothly across all regions and brings extensive experience in scaling global technology services companies.",
    email: "sarah@takeweb.in",
    linkedin: "https://linkedin.com/in/sarahwilliams",
  },
  {
    name: "Amit Patel",
    slug: "vp-eng",
    position: "VP of Engineering",
    description: "Amit leads engineering teams and ensures technical excellence across all projects with deep expertise in enterprise systems and agile delivery.",
    email: "amit@takeweb.in",
    linkedin: "https://linkedin.com/in/amitpatel",
  },
  {
    name: "Jennifer Lee",
    slug: "vp-sales",
    position: "VP of Sales & Partnerships",
    description: "Jennifer drives TakeWeb's global sales strategy and partnership ecosystem across enterprise clients and technology partners.",
    email: "jennifer@takeweb.in",
    linkedin: "https://linkedin.com/in/jenniferlee",
  },
];

const company = {
  pageTitle: "About TakeWeb",
  seoTitle: "About TakeWeb",
  seoDescription: "Learn about TakeWeb Enterprise, our mission, values, leadership, and journey.",
  hero: {
    overline: "About TakeWeb",
    title: "Building the Future of",
    titleHighlight: "Enterprise Technology",
    description: "We are a team of passionate technologists, innovators, and problem-solvers dedicated to helping enterprises thrive in the digital age.",
    primaryCta: { label: "Work With Us", href: "/contact", variant: "primary" },
  },
  missionVisionHeading: { overline: "Mission & Vision", title: "Purpose Built", titleHighlight: "for Impact" },
  mission: { icon: "target", title: "Our Mission", description: "To empower enterprises with innovative technology solutions that drive growth, efficiency, and competitive advantage in an ever-evolving digital landscape." },
  vision: { icon: "eye", title: "Our Vision", description: "To be the most trusted technology partner for enterprises worldwide, known for excellence, innovation, and the transformative impact of our solutions." },
  valuesHeading: { overline: "Our Values", title: "What Drives", titleHighlight: "Our Work" },
  values: [
    { icon: "target", title: "Excellence", description: "We strive for excellence in everything we do." },
    { icon: "lightbulb", title: "Innovation", description: "We embrace emerging technologies and creative solutions." },
    { icon: "heart", title: "Integrity", description: "We operate with transparency, honesty, and ethical practices." },
    { icon: "eye", title: "Vision", description: "We focus on long-term success and sustainable growth." },
  ],
  leadershipHeading: { overline: "Leadership", title: "Meet Our", titleHighlight: "Team", description: "The experienced leaders driving TakeWeb's vision and growth." },
  journeyHeading: { overline: "Our Journey", title: "Milestones &", titleHighlight: "Achievements" },
  milestones: [
    { year: "2018", title: "Founded", description: "TakeWeb established in Bangalore" },
    { year: "2019", title: "First Enterprise Client", description: "Secured Fortune 500 partnership" },
    { year: "2020", title: "Cloud Expansion", description: "Launched cloud & DevOps services" },
    { year: "2021", title: "AI Integration", description: "Added AI/ML capabilities" },
    { year: "2022", title: "Global Reach", description: "Expanded to 50+ countries" },
    { year: "2023", title: "500+ Projects", description: "Major delivery milestone" },
    { year: "2024", title: "Product Launch", description: "Launched TakeWeb Cloud Platform" },
  ],
  cta: {
    title: "Start Your Digital Journey",
    description: "Partner with us to accelerate your digital transformation and achieve sustainable growth.",
    primaryCta: { label: "Get Started Now", href: "/contact", variant: "primary" },
  },
  isActive: true,
};

async function seedCompany(strapi) {
  const companyDocuments = strapi.documents("api::company.company");
  if (await companyDocuments.findFirst()) return;

  const leadershipDocuments = strapi.documents("api::leadership.leadership");
  const leaderDocumentIds = [];

  for (const [index, leader] of leaders.entries()) {
    let record = await leadershipDocuments.findFirst({ filters: { slug: leader.slug } });
    if (!record) {
      record = await leadershipDocuments.create({
        data: { ...leader, sortOrder: index + 1, isActive: true },
      });
    }
    leaderDocumentIds.push(record.documentId);
  }

  await companyDocuments.create({
    data: { ...company, leaders: leaderDocumentIds },
  });

  const oldAboutPage = await strapi.documents("api::site-page.site-page").findFirst({
    filters: { slug: "about" },
  });
  if (oldAboutPage) {
    await strapi.documents("api::site-page.site-page").delete({ documentId: oldAboutPage.documentId });
  }

  strapi.log.info("Seeded the Company page and Leadership collection from the website content.");
}

module.exports = { seedCompany };
