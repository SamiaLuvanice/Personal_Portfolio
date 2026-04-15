import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { IconType } from "react-icons";
import { useLayoutEffect, useRef } from "react";
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

gsap.registerPlugin(ScrollTrigger);

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

const TECH_SEGMENT_COUNT = 6;
const DESKTOP_PIN_TOP_OFFSET = 96;

const About = () => {
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const segmentRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const pinEl = pinSectionRef.current;
    const trackEl = trackRef.current;

    if (!pinEl || !trackEl) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getDistance = () => Math.max(0, trackEl.scrollWidth - pinEl.clientWidth);
      gsap.set(trackEl, { x: 0 });
      gsap.set(segmentRefs.current, { scaleX: 0, transformOrigin: "left center" });

      const tween = gsap.to(trackEl, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinEl,
          start: `top top+=${DESKTOP_PIN_TOP_OFFSET}`,
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const totalProgress = self.progress * TECH_SEGMENT_COUNT;
            segmentRefs.current.forEach((segment, index) => {
              if (!segment) {
                return;
              }

              const fill = Math.max(0, Math.min(1, totalProgress - index));
              gsap.set(segment, { scaleX: fill });
            });
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    mm.add("(max-width: 767px)", () => {
      gsap.set(trackEl, { x: 0 });
      gsap.set(segmentRefs.current, { scaleX: 0 });
      const cards = trackEl.querySelectorAll("[data-tech-card]");

      if (!cards.length) {
        return;
      }

      const tween = gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: pinEl,
            start: "top 80%",
            once: true,
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:hidden"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Tecnologias & <span className="text-gradient">Ferramentas</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              No desktop, a rolagem vira uma trilha horizontal para explorar meu stack.
            </p>
          </motion.div>

          <div
            ref={pinSectionRef}
            className="relative overflow-visible md:overflow-hidden md:h-[56vh] lg:h-[60vh] rounded-2xl"
          >
            <div className="hidden md:block absolute top-0 inset-x-0 z-20 text-center pointer-events-none">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Tecnologias & <span className="text-gradient">Ferramentas</span>
              </h2>
              <div className="mx-auto w-full max-w-2xl grid grid-cols-6 gap-1.5">
                {Array.from({ length: TECH_SEGMENT_COUNT }).map((_, index) => (
                  <div key={index} className="h-1 rounded-full bg-border/70 overflow-hidden">
                    <div
                      ref={(element) => {
                        segmentRefs.current[index] = element;
                      }}
                      className="h-full w-full bg-gradient-to-r from-primary via-accent to-pink-500 origin-left scale-x-0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              ref={trackRef}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 md:absolute md:top-28 lg:top-32 md:left-0 md:flex md:items-start md:gap-8 md:px-2 will-change-transform"
            >
              <motion.div
                data-tech-card
                variants={itemVariants}
                className="w-full md:w-[52vw] lg:w-[40vw] xl:w-[34vw] md:h-fit md:shrink-0 glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
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

              <motion.div
                data-tech-card
                variants={itemVariants}
                className="w-full md:w-[52vw] lg:w-[40vw] xl:w-[34vw] md:h-fit md:shrink-0 glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
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

              <motion.div
                data-tech-card
                variants={itemVariants}
                className="w-full md:w-[52vw] lg:w-[40vw] xl:w-[34vw] md:h-fit md:shrink-0 glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
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

              <motion.div
                data-tech-card
                variants={itemVariants}
                className="w-full md:w-[52vw] lg:w-[40vw] xl:w-[34vw] md:h-fit md:shrink-0 glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
              >
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-cyan-500 rounded-full" />
                  DevOps
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.devops.map((skill, index) => (
                    <SkillBadge key={skill.name} {...skill} index={index} />
                  ))}
                </div>
              </motion.div>

              <motion.div
                data-tech-card
                variants={itemVariants}
                className="w-full md:w-[52vw] lg:w-[40vw] xl:w-[34vw] md:h-fit md:shrink-0 glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
              >
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-muted-foreground rounded-full" />
                  Tools & Design
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.tools.map((skill, index) => (
                    <SkillBadge key={skill.name} {...skill} index={index} />
                  ))}
                </div>
              </motion.div>

              <motion.div
                data-tech-card
                variants={itemVariants}
                className="w-full md:w-[52vw] lg:w-[40vw] xl:w-[34vw] md:h-fit md:shrink-0 glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
              >
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-violet-500 rounded-full" />
                  Automation & AI
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
      </div>
    </section>
  );
};

export default About;
