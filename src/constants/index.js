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
    href: "#", // Update when deployed
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