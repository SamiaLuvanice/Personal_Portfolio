import { Button } from "@/components/ui/button";
import { GitHubRepo, useGitHubRepos } from "@/hooks/use-github";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Github } from "lucide-react";
import { useMemo, useState } from "react";

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
const languageColors: Record<string, string> = {
    TypeScript: "bg-blue-500",
    JavaScript: "bg-yellow-400",
    HTML: "bg-orange-500",
    CSS: "bg-purple-500",
    Python: "bg-emerald-500",
    Java: "bg-red-500",
    React: "bg-cyan-400",
    "C#": "bg-violet-600",
    "C++": "bg-pink-500",
    Go: "bg-sky-400",
    Rust: "bg-amber-600",
    Ruby: "bg-red-600",
    PHP: "bg-indigo-400",
    Shell: "bg-green-400",
    Dockerfile: "bg-blue-400",
    Vue: "bg-emerald-400",
    Kotlin: "bg-purple-400",
    Swift: "bg-orange-400",
};

const ProjectCard = ({ repo, index }: { repo: GitHubRepo; index: number }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -4 }}
        className="group relative glass rounded-xl p-5 shadow-card hover:shadow-card-hover transition-smooth"
    >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
            <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-smooth flex-1">
                {repo.name.replace(/-/g, " ").replace(/_/g, " ")}
            </h3>
            {repo.html_url && (
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-secondary transition-smooth opacity-60 hover:opacity-100"
                >
                    <Github className="w-4 h-4" />
                </a>
            )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
            {repo.description || "Sem descrição"}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
            {repo.language && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-foreground">
                    {repo.language}
                </span>
            )}
            {repo.topics?.slice(0, 1).map((topic) => (
                <span
                    key={topic}
                    className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-muted-foreground"
                >
                    {topic}
                </span>
            ))}
        </div>
    </motion.div>
);

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

const LoadingCard = ({ index }: { index: number }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        className="glass rounded-2xl p-6 shadow-card animate-pulse"
    >
        <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-muted" />
        </div>
        <div className="h-6 bg-muted rounded w-3/4 mb-3" />
        <div className="h-4 bg-muted rounded w-full mb-2" />
        <div className="h-4 bg-muted rounded w-2/3 mb-4" />
        <div className="flex gap-2">
            <div className="h-6 bg-muted rounded-full w-20" />
            <div className="h-6 bg-muted rounded-full w-16" />
        </div>
    </motion.div>
);

const ITEMS_PER_PAGE = 4;

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
    const { repos, loading, error } = useGitHubRepos();
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const allLanguages = useMemo(() => {
        const languages = repos
            .map((r) => r.language)
            .filter((l): l is string => l !== null);
        return [...new Set(languages)].sort();
    }, [repos]);

    const filteredRepos = useMemo(() => {
        if (!selectedLanguage) return repos;
        return repos.filter((r) => r.language === selectedLanguage);
    }, [selectedLanguage, repos]);

    const visibleRepos = filteredRepos.slice(0, visibleCount);
    const hasMore = visibleCount < filteredRepos.length;

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    };

    // Reset visible count when filter changes
    const handleLanguageChange = (lang: string | null) => {
        setSelectedLanguage(lang);
        setVisibleCount(ITEMS_PER_PAGE);
    };

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

                    <div className="grid lg:grid-cols-1 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-1">
                            {/* Featured Projects */}
                            {FEATURED_PROJECTS.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="mb-12"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm text-cyan-500 font-bold">DESTAQUE</span>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
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

                            {/* Filter */}
                            {!loading && allLanguages.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="mb-8"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <Filter className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground font-medium">
                                            Filtrar por linguagem
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleLanguageChange(null)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth border ${selectedLanguage === null
                                                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                                                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                                }`}
                                        >
                                            Todos
                                            <span className="ml-1.5 text-xs opacity-70">({repos.length})</span>
                                        </motion.button>
                                        {allLanguages.map((lang) => {
                                            const count = repos.filter(r => r.language === lang).length;
                                            return (
                                                <motion.button
                                                    key={lang}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleLanguageChange(lang)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth border flex items-center gap-2 ${selectedLanguage === lang
                                                            ? "bg-primary text-primary-foreground border-primary shadow-glow"
                                                            : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-2.5 h-2.5 rounded-full ${languageColors[lang] || "bg-gray-400"}`}
                                                    />
                                                    {lang}
                                                    <span className="text-xs opacity-70">({count})</span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Loading state */}
                            {loading && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[1, 2, 3, 4].map((i) => (
                                        <LoadingCard key={i} index={i} />
                                    ))}
                                </div>
                            )}

                            {/* Error state */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <p className="text-muted-foreground mb-4">
                                        Não foi possível carregar os repositórios.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.reload()}
                                    >
                                        Tentar novamente
                                    </Button>
                                </motion.div>
                            )}

                            {!loading && !error && (
                                <motion.div layout className="grid md:grid-cols-2 gap-6 mb-8">
                                    <AnimatePresence mode="popLayout">
                                        {visibleRepos.map((repo, index) => (
                                            <ProjectCard key={repo.id} repo={repo} index={index} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            {/* Show more button */}
                            {!loading && !error && hasMore && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center mb-8"
                                >
                                    <Button
                                        variant="secondary"
                                        onClick={handleShowMore}
                                        className="gap-2"
                                    >
                                        Ver mais projetos ({filteredRepos.length - visibleCount} restantes)
                                    </Button>
                                </motion.div>
                            )}

                            {/* Empty state */}
                            {!loading && filteredRepos.length === 0 && !error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-muted-foreground py-12"
                                >
                                    Nenhum projeto encontrado com essa linguagem.
                                </motion.p>
                            )}

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <Button variant="outline" size="lg" asChild className="gap-2">
                                    <a
                                        href="https://github.com/SamiaLuvanice?tab=repositories"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Github className="w-5 h-5" />
                                        Ver todos no GitHub
                                    </a>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
