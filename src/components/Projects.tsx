import { ExternalLink, Github, Folder, Star, GitFork, Clock, Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useGitHubRepos, GitHubRepo } from "@/hooks/use-github";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import GitHubActivity from "./GitHubActivity";

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

// Language icons mapping
const languageIcons: Record<string, string> = {
    TypeScript: "TS",
    JavaScript: "JS",
    Python: "PY",
    Java: "JV",
    HTML: "H5",
    CSS: "CS",
    "C#": "C#",
    Go: "GO",
    Rust: "RS",
    Ruby: "RB",
    PHP: "PH",
    Shell: "SH",
};

const ProjectCard = ({ repo, index }: { repo: GitHubRepo; index: number }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong"
    >
        {/* Icon and Links */}
        <div className="flex items-start justify-between mb-6">
            <motion.div
                whileHover={{ rotate: 10 }}
                className="p-3 rounded-xl bg-primary/10 text-primary"
            >
                <Folder className="w-6 h-6" />
            </motion.div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-secondary transition-smooth"
                >
                    <Github className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </a>
                {repo.homepage && (
                    <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-secondary transition-smooth"
                    >
                        <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-primary" />
                    </a>
                )}
            </div>
        </div>

        {/* Content */}
        <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-smooth">
            {repo.name.replace(/-/g, " ").replace(/_/g, " ")}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
            {repo.description || "Sem descrição disponível"}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            {repo.stargazers_count > 0 && (
                <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" />
                    {repo.stargazers_count}
                </span>
            )}
            {repo.forks_count > 0 && (
                <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" />
                    {repo.forks_count}
                </span>
            )}
            <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDistanceToNow(new Date(repo.pushed_at), {
                    addSuffix: true,
                    locale: ptBR,
                })}
            </span>
        </div>

        {/* Language and Topics */}
        <div className="flex flex-wrap gap-2">
            {repo.language && (
                <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-secondary text-foreground">
                    <span
                        className={`w-2 h-2 rounded-full ${languageColors[repo.language] || "bg-gray-400"}`}
                    />
                    {repo.language}
                </span>
            )}
            {repo.topics?.slice(0, 2).map((topic) => (
                <span
                    key={topic}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted-foreground"
                >
                    {topic}
                </span>
            ))}
        </div>
    </motion.div>
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
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Repositórios carregados diretamente do GitHub em tempo real.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Activity Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="lg:col-span-1"
                        >
                            <div className="sticky top-24 glass-strong rounded-2xl p-6 shadow-card">
                                <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                                    <Github className="w-5 h-5 text-primary" />
                                    Atividade Recente
                                </h3>
                                <GitHubActivity />
                            </div>
                        </motion.div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
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
