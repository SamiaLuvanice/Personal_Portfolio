import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiAirtable,
  SiBitbucket,
  SiBootstrap,
  SiCss3,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
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
    { name: "HTML5", color: "hsl(14, 79%, 50%)", icon: SiHtml5 },
    { name: "CSS3", color: "hsl(214, 82%, 51%)", icon: SiCss3 },
    { name: "JavaScript", color: "hsl(50, 94%, 50%)", icon: SiJavascript },
    { name: "TypeScript", color: "hsl(211, 60%, 48%)", icon: SiTypescript },
    { name: "React", color: "hsl(193, 95%, 68%)", icon: SiReact },
    {
      name: "Next.js",
      color: "hsl(0, 0%, 20%)",
      className:
        "text-zinc-800 border-zinc-700/35 dark:text-zinc-300 dark:border-zinc-400/35",
      icon: SiNextdotjs,
    },
  ] as Skill[],
  styling: [
    { name: "Tailwind", color: "hsl(198, 93%, 60%)", icon: SiTailwindcss },
    { name: "Sass", color: "hsl(330, 50%, 60%)", icon: SiSass },
    { name: "Bootstrap", color: "hsl(261, 51%, 51%)", icon: SiBootstrap },
  ] as Skill[],
  backend: [
    { name: "Node.js", color: "hsl(120, 40%, 45%)", icon: SiNodedotjs },
    {
      name: "Express",
      color: "hsl(0, 0%, 45%)",
      className:
        "text-slate-700 border-slate-700/35 dark:text-slate-300 dark:border-slate-400/35",
      icon: SiExpress,
    },
  ] as Skill[],
  database: [
    { name: "PostgreSQL", color: "hsl(210, 50%, 45%)", icon: SiPostgresql },
    { name: "Prisma ORM", color: "hsl(250, 70%, 60%)", icon: SiPrisma },
  ] as Skill[],
  tools: [
    { name: "Git", color: "hsl(10, 75%, 50%)", icon: SiGit },
    {
      name: "GitHub",
      color: "hsl(0, 0%, 30%)",
      className:
        "text-neutral-800 border-neutral-700/35 dark:text-neutral-300 dark:border-neutral-400/35",
      icon: SiGithub,
    },
    { name: "Bitbucket", color: "hsl(214, 82%, 51%)", icon: SiBitbucket },
    { name: "VS Code", color: "hsl(210, 70%, 50%)", iconSrc: "/icons/vscode.svg" },
    { name: "Figma", color: "hsl(330, 70%, 55%)", icon: SiFigma },
    { name: "Trello", color: "hsl(210, 90%, 50%)", icon: SiTrello },
  ] as Skill[],
  aiTools: [
    { name: "Supabase", color: "hsl(153, 60%, 50%)", icon: SiSupabase },
    { name: "Make", color: "hsl(280, 70%, 55%)", icon: SiMake },
    { name: "n8n", color: "hsl(10, 80%, 55%)", icon: SiN8N },
    { name: "Airtable", color: "hsl(210, 70%, 55%)", icon: SiAirtable },
    { name: "ManyChat", color: "hsl(210, 90%, 55%)", iconSrc: "/icons/manychat.svg" },
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
