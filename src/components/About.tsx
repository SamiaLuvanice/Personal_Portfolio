import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiAirtable,
  SiBitbucket,
  SiBootstrap,
  SiCss3,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiMongodb,
  SiPython,
  SiPostgresql,
  SiReact,
  SiN8N,
  SiSupabase,
  SiTailwindcss,
  SiTrello,
  SiTypescript,
  SiMake,
} from "react-icons/si";

type Skill = {
  name: string;
  color: string;
  className?: string;
  icon?: IconType;
  iconSrc?: string;
};

const skills = {
  frontend: [
    { name: "HTML5", color: "#E34F26", icon: SiHtml5 },
    { name: "CSS3", color: "#1572B6", icon: SiCss3 },
    { name: "JavaScript", color: "#F7DF1E", icon: SiJavascript },
    { name: "TypeScript", color: "#3178C6", icon: SiTypescript },
    { name: "React", color: "#61DAFB", icon: SiReact },
    { name: "Tailwind", color: "#06B6D4", icon: SiTailwindcss },
    { name: "Bootstrap", color: "#7952B3", icon: SiBootstrap },
    {
      name: "Next.js",
      color: "hsl(0, 0%, 20%)",
      className:
        "text-zinc-800 border-zinc-700/35 dark:text-zinc-300 dark:border-zinc-400/35",
      icon: SiNextdotjs,
    },
  ] as Skill[],
  backend: [
    { name: "Node.js", color: "#339933", icon: SiNodedotjs },
    { name: "Python", color: "#3776AB", icon: SiPython },
    { name: "Django", color: "#44B78B", icon: SiDjango },
    { name: "FastAPI", color: "#009688", icon: SiFastapi },
  ] as Skill[],
  database: [
    { name: "PostgreSQL", color: "#4169E1", icon: SiPostgresql },
    { name: "MongoDB", color: "#47A248", icon: SiMongodb },
  ] as Skill[],
  devops: [{ name: "Docker", color: "#2496ED", icon: SiDocker }] as Skill[],
  tools: [
    { name: "Git", color: "#F05032", icon: SiGit },
    {
      name: "GitHub", 
      color: "hsl(0, 0%, 30%)",
      className:
        "text-neutral-800 border-neutral-700/35 dark:text-neutral-300 dark:border-neutral-400/35",
      icon: SiGithub,
    },
    { name: "Bitbucket", color: "#0052CC", icon: SiBitbucket },
    { name: "Figma", color: "#F24E1E", icon: SiFigma },
    { name: "Trello", color: "#0052CC", icon: SiTrello },
  ] as Skill[],
  aiTools: [
    { name: "Supabase", color: "#3ECF8E", icon: SiSupabase },
    { name: "Make", color: "#6D5BD0", icon: SiMake },
    { name: "n8n", color: "#EA4B71", icon: SiN8N },
    { name: "Airtable", color: "#18BFFF", icon: SiAirtable },
    { name: "ManyChat", color: "#00A5FF", iconSrc: "/icons/manychat.svg" },
  ] as Skill[],
};

const techGroups = [
  { label: "Front-end", color: "bg-primary", items: skills.frontend },
  { label: "Back-end", color: "bg-accent", items: skills.backend },
  { label: "Banco de Dados", color: "bg-blue-500", items: skills.database },
  { label: "DevOps", color: "bg-cyan-500", items: skills.devops },
  { label: "Tools & Design", color: "bg-muted-foreground", items: skills.tools },
  { label: "Automation & AI", color: "bg-violet-500", items: skills.aiTools },
];

const SkillBadge = ({
  name,
  color,
  className,
  icon: Icon,
  iconSrc,
}: {
  name: string;
  color: string;
  className?: string;
  icon?: IconType;
  iconSrc?: string;
}) => (
  <div
    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${className ?? ""}`}
    style={
      className
        ? undefined
        : {
            backgroundColor: `${color}15`,
            color: color,
            border: `1px solid ${color}35`,
          }
    }
  >
    {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
    {!Icon && iconSrc ? <img src={iconSrc} alt="" aria-hidden="true" className="h-4 w-4 shrink-0" /> : null}
    <span>{name}</span>
  </div>
);

const About = () => {
  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight md:text-6xl">
              <span className="text-gradient">Tecnologias</span>
            </h2>
            <div className="mt-5 h-px w-full bg-border/80" />
          </motion.div>

          <div className="grid gap-16 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              viewport={{ once: true }}
              className="space-y-6 md:sticky md:top-24 md:self-start"
            >
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                Stack
              </p>
            </motion.div>

            <div className="space-y-0">
              {techGroups.map((group, index) => (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="border-b border-border/70 py-6 first:pt-0"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${group.color}`} />
                    <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                      {group.label}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {group.items.map((skill) => (
                      <SkillBadge key={skill.name} {...skill} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;