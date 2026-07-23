export const servicesData = [
  {
    title: "FullStack Development",
    description:
      "Your business deserves a fast, secure, and future-proof digital foundation. I develop custom web apps with clean architecture, optimized databases, and seamless integrations—ensuring reliability at every layer.",
    items: [
      {
        title: "Backend Engineering",
        description: "(REST/GraphQL APIs, Microservices, Auth Systems)",
      },
      {
        title: "Frontend Excellence",
        description: "(React, Vue, TypeScript, Interactive UI/UX)",
      },
      {
        title: "Database Design",
        description: "(SQL/NoSQL Optimization, Scalable Structures)",
      },
    ],
  },
  {
    title: "DevOps & Cloud Solutions",
    description:
      "Deploying software shouldn't be a gamble. I automate infrastructure, enforce security, and leverage cloud platforms (AWS/Azure) to keep your app running smoothly—24/7, at any scale.",
    items: [
      {
        title: "CI/CD Pipelines",
        description: "(GitHub Actions, Docker, Kubernetes)",
      },
      {
        title: "Server Management ",
        description: "(Linux, Nginx, Load Balancing)",
      },
      {
        title: "Performance Tuning",
        description: "(Caching, Compression, Lighthouse 90+ Scores)",
      },
    ],
  },
  {
    title: "Security & Optimization",
    description:
      "Slow or hacked apps destroy trust. I harden security (XSS/SQLI protection, OAuth) and optimize bottlenecks so your app stays fast, safe, and scalable as you grow.",
    items: [
      {
        title: "Code Audits",
        description: "(Refactoring, Tech Debt Cleanup)",
      },
      {
        title: "Pen Testing",
        description: "(Vulnerability Assessments)",
      },
      {
        title: "SEO Tech Stack",
        description: "(SSR, Metadata, Structured Data)",
      },
    ],
  },
  {
    title: "Web & Mobile Apps",
    description:
      "A clunky interface can sink even the best ideas. I craft responsive, pixel perfect web and mobile apps (React Native/Flutter) that users love—bridging design and functionality seamlessly.",
    items: [
      {
        title: "Cross-Platform Apps",
        description: "(Single codebase for iOS/Android/Web)",
      },
      {
        title: "PWAs",
        description: "(Offline mode, Push Notifications)",
      },
      {
        title: "E-Commerce",
        description: "(Checkout flows, Payment Gateways, Inventory APIs)",
      },
    ],
  },
];

export const projects = [
  {
    id: 1,
    name: "Zyntric Systems",
    description:
      "A production-grade template marketplace with dual-market support. Built guest-only checkout with M-Pesa STK Push and Paystack card payments, idempotent order processing, and secure ZIP delivery via expiring tokens. Handles 12,900+ downloads across 50+ countries.",
    role: "Solo Founder & Full-Stack Engineer",
    outcome: "12,900+ downloads, 50+ countries, zero double-charges",
    href: "https://devshop-kuqi.vercel.app/",
    image: "/assets/projects/devshop.png",
    bgImage: "/assets/backgrounds/blanket.jpg",
    frameworks: [
      { id: 1, name: "Next.js" },
      { id: 2, name: "TypeScript" },
      { id: 3, name: "Neon DB" },
      { id: 4, name: "Drizzle ORM" },
      { id: 5, name: "Paystack" },
      { id: 6, name: "M-Pesa" },
    ],
  },
  {
    id: 2,
    name: "PropFlow Kenya",
    description:
      "An invite-only property management platform for Kenyan real estate agencies. Features multi-tenant architecture with strict agency isolation, automated M-Pesa rent collection via Daraja API, utility billing with meter readings, lease agreement generation, and complaint ticketing.",
    role: "Solo Full-Stack Engineer",
    outcome: "End-to-end rent lifecycle from tenant onboarding to automated billing",
    href: "#",
    image: "/assets/projects/sms.png",
    bgImage: "/assets/backgrounds/curtains.jpg",
    frameworks: [
      { id: 1, name: "Next.js" },
      { id: 2, name: "Clerk" },
      { id: 3, name: "Neon DB" },
      { id: 4, name: "Drizzle ORM" },
      { id: 5, name: "M-Pesa" },
      { id: 6, name: "Africa's Talking" },
    ],
  },
  {
    id: 3,
    name: "DevSchool SMS",
    description:
      "A multi-role school management system with dedicated dashboards for administrators, teachers, parents, and students. Features attendance tracking, grade management, fee payment records, and real-time parent notifications.",
    role: "Solo Full-Stack Engineer",
    outcome: "Complete academic and administrative workflow digitization",
    href: "https://sms-k1nf.vercel.app/",
    image: "/assets/projects/school.png",
    bgImage: "/assets/backgrounds/map.jpg",
    frameworks: [
      { id: 1, name: "Next.js" },
      { id: 2, name: "React" },
      { id: 3, name: "Tailwind CSS" },
      { id: 4, name: "PostgreSQL" },
    ],
  },
  {
    id: 4,
    name: "AI Medical Assistant",
    description:
      "A SaaS platform that processes and analyzes medical reports using AI. Features secure patient data handling, report upload and parsing, and intelligent health insights generation for healthcare providers.",
    role: "Solo Full-Stack Engineer",
    outcome: "Automated medical report analysis pipeline",
    href: "https://ai-med-agent-qj7a.vercel.app/",
    image: "/assets/projects/ai med.png",
    bgImage: "/assets/backgrounds/table.jpg",
    frameworks: [
      { id: 1, name: "Next.js" },
      { id: 2, name: "React" },
      { id: 3, name: "Firebase" },
      { id: 4, name: "Clerk" },
      { id: 5, name: "Shadcn UI" },
    ],
  },
];

export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/mwas.dev/reels/" },
  {
    name: "Youtube",
    href: "https://www.youtube.com/@simonmwangi6228/",
  },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/simon-mwangi-6a3aa716b/" },
  { name: "X", href: "https://x.com/SimonMw749" },
];