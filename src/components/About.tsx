import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiAirtable,
  SiBitbucket,
  SiBootstrap,
  SiCss3,
  SiDocker,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiSass,
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
    {
      name: "Next.js",
      color: "hsl(0, 0%, 20%)",
      className:
        "text-zinc-800 border-zinc-700/35 dark:text-zinc-300 dark:border-zinc-400/35",
      icon: SiNextdotjs,
    },
  ] as Skill[],
  styling: [
    { name: "Tailwind", color: "#06B6D4", icon: SiTailwindcss },
    { name: "Sass", color: "#CC6699", icon: SiSass },
    { name: "Bootstrap", color: "#7952B3", icon: SiBootstrap },
  ] as Skill[],
  backend: [
    { name: "Node.js", color: "#339933", icon: SiNodedotjs },
    { name: "Python", color: "#3776AB", icon: SiPython },
    {
      name: "Express",
      color: "hsl(0, 0%, 45%)",
      className:
        "text-slate-700 border-slate-700/35 dark:text-slate-300 dark:border-slate-400/35",
      icon: SiExpress,
    },
  ] as Skill[],
  database: [
    { name: "PostgreSQL", color: "#4169E1", icon: SiPostgresql },
    { name: "Prisma ORM", color: "#2D3748", icon: SiPrisma },
  ] as Skill[],
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
    { name: "VS Code", color: "#007ACC", iconSrc: "/icons/vscode.svg" },
    { name: "Docker", color: "#2496ED", icon: SiDocker },
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

const SkillBadge = ({
  name,
  color,
  index,
  className,
  icon: Icon,
  iconSrc,
}: {
  name: string;
  color: string;
  index: number;
  className?: string;
  icon?: IconType;
  iconSrc?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.1 }}
    className={`px-4 py-2 rounded-full text-sm font-medium cursor-default border flex items-center gap-2 ${className ?? ""}`}
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
    {Icon ? <Icon className="w-4 h-4 shrink-0" aria-hidden="true" /> : null}
    {!Icon && iconSrc ? (
      <img src={iconSrc} alt="" aria-hidden="true" className="w-4 h-4 shrink-0" />
    ) : null}
    {name}
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Tecnologias & <span className="text-gradient">Ferramentas</span>
            </h2>
            {/*<p className="text-muted-foreground max-w-2xl mx-auto">
              Estou sempre em busca de aprender novas tecnologias e aprimorar minhas habilidades 
              para criar soluções modernas e eficientes.
            </p>*/}
          </motion.div>

          {/* Skills grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Frontend */}
            <motion.div 
              variants={itemVariants}
              className="glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
            >
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded-full" />
                Front-end
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.frontend.map((skill, index) => (
                  <SkillBadge key={skill.name} {...skill} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Styling */}
            <motion.div 
              variants={itemVariants}
              className="glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
            >
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-pink-500 rounded-full" />
                Estilização
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.styling.map((skill, index) => (
                  <SkillBadge key={skill.name} {...skill} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Backend */}
            <motion.div 
              variants={itemVariants}
              className="glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
            >
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-accent rounded-full" />
                Back-end
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.backend.map((skill, index) => (
                  <SkillBadge key={skill.name} {...skill} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Database */}
            <motion.div 
              variants={itemVariants}
              className="glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
            >
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full" />
                Banco de Dados
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.database.map((skill, index) => (
                  <SkillBadge key={skill.name} {...skill} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Tools */}
            <motion.div 
              variants={itemVariants}
              className="glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
            >
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-muted-foreground rounded-full" />
                Ferramentas
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.tools.map((skill, index) => (
                  <SkillBadge key={skill.name} {...skill} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Build Tools */}
            <motion.div 
              variants={itemVariants}
              className="glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
            >
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-500 rounded-full" />
                Ferramentas de IA & Automação
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.aiTools.map((skill, index) => (
                  <SkillBadge key={skill.name} {...skill} index={index} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
