import { motion } from "framer-motion";

// Interface para projetos em destaque (Vercel, etc)
interface FeaturedProject {
    name: string;
    description: string;
    url: string;
    image?: string;
    language?: string;
    tags?: string[];
    status?: "live" | "building" | "archived";
}

// Language to color mapping
const FeaturedProjectCard = ({ project, index }: { project: FeaturedProject; index: number }) => (
    <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        layout
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: index * 0.08 }}
        whileHover={{ y: -2 }}
        className="group grid overflow-hidden border-b border-border/70 py-6 transition-smooth md:grid-cols-[0.95fr_1.05fr] md:gap-8 md:py-8"
    >
        {project.image && (
            <div className="relative h-56 overflow-hidden rounded-2xl border border-border/60 bg-background/40 md:h-full">
                <motion.img
                    src={project.image}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
            </div>
        )}

        <div className="mt-5 flex flex-col justify-between md:mt-0">
            <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        Destaque
                    </p>
                    {project.status === "live" && (
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            Ao vivo
                        </div>
                    )}
                </div>

                <h3 className="font-display text-2xl font-bold leading-tight md:text-3xl">
                    {project.name}
                </h3>

                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {project.description}
                </p>

                {(project.tags || project.language) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {project.language && (
                            <span className="border border-border/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-foreground">
                                {project.language}
                            </span>
                        )}
                        {project.tags?.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="border border-border/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground transition-smooth group-hover:text-primary">
                <span>Ver projeto</span>
                <span aria-hidden="true">↗</span>
            </div>
        </div>
    </motion.a>
);

// Projetos em destaque (adicione seus projetos Vercel aqui)
const FEATURED_PROJECTS: FeaturedProject[] = [
    {
        name: "StudyNice",
        description: "Acompanhe suas metas de estudo, crie hábitos consistentes e veja seu progresso crescer com nosso sistema de sequências motivador.",
        url: "https://studynice.vercel.app/",
        image: "/projects/studynice-hero.png",
        language: "TypeScript",
        tags: ["Vercel", "Production"],
        status: "live",
    },
    // Adicione mais projetos em destaque conforme necessário
];

const Projects = () => {
    return (
        <section id="projects" className="py-24">
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
                            <span className="text-gradient">Projetos</span>
                        </h2>
                        <div className="mt-5 h-px w-full bg-border/80" />
                    </motion.div>

                    {FEATURED_PROJECTS.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="space-y-2"
                        >
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                                Destaque
                            </p>
                            <div className="mt-6">
                                {FEATURED_PROJECTS.map((project, index) => (
                                    <FeaturedProjectCard
                                        key={project.url}
                                        project={project}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Projects;
