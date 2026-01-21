import { motion } from "framer-motion";

const skills = {
  frontend: [
    { name: "HTML5", color: "hsl(14, 79%, 50%)" },
    { name: "CSS3", color: "hsl(214, 82%, 51%)" },
    { name: "JavaScript", color: "hsl(50, 94%, 50%)" },
    { name: "TypeScript", color: "hsl(211, 60%, 48%)" },
    { name: "React", color: "hsl(193, 95%, 68%)" },
    { name: "Next.js", color: "hsl(0, 0%, 20%)" },
  ],
  styling: [
    { name: "Tailwind", color: "hsl(198, 93%, 60%)" },
    { name: "Sass", color: "hsl(330, 50%, 60%)" },
    { name: "Bootstrap", color: "hsl(261, 51%, 51%)" },
  ],
  backend: [
    { name: "Node.js", color: "hsl(120, 40%, 45%)" },
    { name: "Express", color: "hsl(0, 0%, 45%)" },
  ],
  database: [
    { name: "PostgreSQL", color: "hsl(210, 50%, 45%)" },
  ],
  tools: [
    { name: "Git", color: "hsl(10, 75%, 50%)" },
    { name: "GitHub", color: "hsl(0, 0%, 30%)" },
    { name: "Bitbucket", color: "hsl(214, 82%, 51%)" },
    { name: "VS Code", color: "hsl(210, 70%, 50%)" },
    { name: "Figma", color: "hsl(330, 70%, 55%)" },
    { name: "Trello", color: "hsl(210, 90%, 50%)" },
  ],
  aiTools: [
    { name: "Supabase", color: "hsl(153, 60%, 50%)" },
    { name: "Make", color: "hsl(280, 70%, 55%)" },
    { name: "n8n", color: "hsl(10, 80%, 55%)" },
    { name: "Airtable", color: "hsl(210, 70%, 55%)" },
    { name: "ManyChat", color: "hsl(210, 90%, 55%)" },
  ],
};

const SkillBadge = ({ name, color, index }: { name: string; color: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.1 }}
    className="px-4 py-2 rounded-full text-sm font-medium cursor-default"
    style={{
      backgroundColor: `${color}15`,
      color: color,
      border: `1px solid ${color}30`,
    }}
  >
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
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estou sempre em busca de aprender novas tecnologias e aprimorar minhas habilidades 
              para criar soluções modernas e eficientes.
            </p>
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
