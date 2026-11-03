export const TECHNOLOGY_GROUPS = [
  {
    category: "Languages",
    technologies: ["JavaScript", "TypeScript", "SQL", "HTML", "CSS"],
    context: "Used across frontend and backend application development.",
  },
  {
    category: "Frontend",
    technologies: [
      "React", "Next.js", "Tailwind CSS", "shadcn/ui",
      "Framer Motion", "GSAP", "Three.js", "React Three Fiber",
    ],
    context: "Building responsive interfaces, reusable components, dashboards, and interactive web experiences.",
  },
  {
    category: "Backend and APIs",
    technologies: ["Node.js", "Next.js server-side features", "REST APIs", "Server Actions"],
    context: "Application logic, API endpoints, server-side workflows, and external service integrations.",
  },
  {
    category: "Databases and data access",
    technologies: ["PostgreSQL", "Neon", "Supabase", "Drizzle ORM", "Prisma"],
    context: "Relational data modelling, schema design, queries, and application persistence.",
  },
  {
    category: "Authentication and authorization",
    technologies: ["Clerk", "Role-based access control", "Multi-tenant access patterns"],
    context: "Authentication, protected application areas, role-aware access, and tenant isolation patterns.",
  },
  {
    category: "Payments and communication",
    technologies: ["M-Pesa Daraja API", "M-Pesa STK Push", "Paystack", "Africa's Talking SMS"],
    context: "Payment workflows and SMS communication integrations, including services relevant to Kenyan products.",
  },
  {
    category: "Deployment and developer tooling",
    technologies: ["Vercel", "Git", "GitHub", "GitHub Actions", "Docker", "Linux", "Nginx", "Basic AWS"],
    context: "Version control, deployment workflows, CI/CD exposure, hosting, and operations.",
  },
  {
    category: "AI-assisted development and design",
    technologies: ["Claude", "ChatGPT", "Cursor", "Kimi", "Lovable", "Figma", "Antigravity"],
    context: "Research, prototyping, coding assistance, design exploration, debugging, and review. AI-generated work is reviewed and tested.",
  },
];

export const TECHNOLOGY_LIMITS = [
  "Do not describe Simon as a professional Svelte or SvelteKit developer.",
  "Do not claim expertise beyond the technologies and context listed here.",
  "Do not imply that listing a tool means Simon has used every feature of that tool in production.",
];
