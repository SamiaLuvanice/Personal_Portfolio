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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -4 }}
        className="group relative glass rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-smooth"
    >
        {/* Image */}
        {project.image && (
            <div className="relative h-40 overflow-hidden">
                <motion.img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
        )}

        {/* Content */}
        <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-display text-lg font-semibold">
                    {project.name}
                </h3>
                {project.status === "live" && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs font-medium whitespace-nowrap">
                        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        Ao vivo
                    </div>
                )}
            </div>

            <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
                {project.description}
            </p>

            {/* Tags */}
            {(project.tags || project.language) && (
                <div className="flex flex-wrap gap-2">
                    {project.language && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-foreground">
                            {project.language}
                        </span>
                    )}
                    {project.tags?.slice(0, 1).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-muted-foreground"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
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
                <div className="max-w-6xl mx-auto">
                    {/* Section header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                            Meus <span className="text-gradient">Projetos</span>
                        </h2>
                        {/*<p className="text-muted-foreground max-w-2xl mx-auto">
                            Repositórios carregados diretamente do GitHub em tempo real.
                        </p>*/}
                    </motion.div>

                    {FEATURED_PROJECTS.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm text-cyan-500 font-bold">DESTAQUE</span>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
