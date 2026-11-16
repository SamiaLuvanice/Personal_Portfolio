import { buildMailtoHref, CONTACT_EMAIL } from "@/lib/contact";

/** Conteúdo da página inicial (spec 0003). Fonte única para seções, navegação e testes. */

export type ProjectCategory = "autoral" | "comercial";

export interface Project {
  name: string;
  title: string;
  category: ProjectCategory;
  tags: [string, string];
  url: string;
  image: { src: string; alt: string };
}

export const PROJECTS: Project[] = [
  {
    name: "BestPrice IA",
    title: "BestPrice IA — Monitor de preços com IA",
    category: "autoral",
    tags: ["SaaS", "Full Stack"],
    url: "https://bestprice-stage.pages.dev/",
    image: { src: "/projects/bestprice.webp", alt: "Página inicial do BestPrice IA com o gráfico de histórico de preço de um produto" },
  },
  {
    name: "StudyNice",
    title: "StudyNice — Hábitos de estudo",
    category: "autoral",
    tags: ["Web App", "Full Stack"],
    url: "https://studynice.vercel.app/",
    image: { src: "/projects/studynice.webp", alt: "Página inicial do StudyNice com a sequência de estudos e o progresso diário" },
  },
  {
    name: "Sound House",
    title: "Sound House — Aulas de música",
    category: "comercial",
    tags: ["Plataforma", "Full Stack"],
    url: "https://www.soundhouse.com.br/",
    image: { src: "/projects/soundhouse.webp", alt: "Página inicial da Sound House, plataforma de aulas de música presenciais e online" },
  },
  {
    name: "Lopes Tech",
    title: "Lopes Tech — Software sob medida",
    category: "comercial",
    tags: ["Site institucional", "Full Stack"],
    url: "https://lopestech.abeesys.com/",
    image: { src: "/projects/lopestech.webp", alt: "Página inicial da Lopes Tech, software house de soluções sob medida" },
  },
];

export type ExpertisePreviewKind = "frontend" | "backend" | "architecture" | "devops" | "ai";

export interface ExpertiseItem {
  id: ExpertisePreviewKind;
  title: string;
  technologies: string[];
}

export const EXPERTISE: ExpertiseItem[] = [
  { id: "frontend", title: "Frontend", technologies: ["React", "TypeScript", "Next.js", "Vite", "Tailwind CSS", "shadcn/ui", "React Query", "Recharts"] },
  { id: "backend", title: "Backend", technologies: ["Python", "FastAPI", "SQLAlchemy", "Alembic", "PostgreSQL", "Node.js", "Django", "MongoDB"] },
  { id: "architecture", title: "Arquitetura & Integrações", technologies: ["REST", "OAuth 2.0", "Workers", "Supabase", "Gemini API", "n8n"] },
  { id: "devops", title: "DevOps & Workflow", technologies: ["Git/GitHub", "Docker", "Pytest", "Vitest", "Playwright", "CI no GitHub", "Vercel", "Cloudflare Pages", "Render"] },
  { id: "ai", title: "IA no fluxo de engenharia", technologies: ["Claude Code", "Codex", "Cursor", "Spec-driven", "TDD"] },
];

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  current: boolean;
}

export const EXPERIENCE: ExperienceEntry[] = [
  { company: "Sound House", role: "Desenvolvedora Full Stack", period: "Mai 2024 — atual", current: true },
  { company: "Governo do Estado do Ceará", role: "Suporte Técnico em Hardware e Software", period: "Set 2017 — atual", current: false },
];

export const SOCIAL_LINKS = {
  github: "https://github.com/SamiaLuvanice",
  linkedin: "https://www.linkedin.com/in/samialuvanice/",
  resume: "/curriculo.pdf",
  email: buildMailtoHref(),
  emailAddress: CONTACT_EMAIL,
};

export type SectionId = "projects" | "expertise" | "experience" | "contact";

export interface NavItem {
  id: SectionId;
  label: string;
  count?: string;
}

const pad = (value: number) => String(value).padStart(2, "0");

export const NAV_ITEMS: NavItem[] = [
  { id: "projects", label: "Projetos", count: pad(PROJECTS.length) },
  { id: "expertise", label: "Expertise", count: pad(EXPERTISE.length) },
  { id: "experience", label: "Experiência", count: pad(EXPERIENCE.length) },
  { id: "contact", label: "Contato" },
];
