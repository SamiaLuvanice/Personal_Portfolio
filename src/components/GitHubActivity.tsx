import { motion } from "framer-motion";
import { GitCommit, Clock, RefreshCw } from "lucide-react";
import { useGitHubActivity } from "@/hooks/use-github";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const getEventDescription = (event: any): string => {
    switch (event.type) {
        case "PushEvent":
            const commits = event.payload?.commits?.length || 0;
            return `Fez ${commits} commit${commits > 1 ? "s" : ""} em ${event.repo.name.split("/")[1]}`;
        case "CreateEvent":
            return `Criou ${event.payload?.ref_type} em ${event.repo.name.split("/")[1]}`;
        case "WatchEvent":
            return `Deu star em ${event.repo.name}`;
        case "ForkEvent":
            return `Fez fork de ${event.repo.name}`;
        case "IssuesEvent":
            return `${event.payload?.action} issue em ${event.repo.name.split("/")[1]}`;
        case "PullRequestEvent":
            return `${event.payload?.action} PR em ${event.repo.name.split("/")[1]}`;
        default:
            return `Atividade em ${event.repo.name.split("/")[1]}`;
    }
};

const getEventIcon = (eventType: string) => {
    switch (eventType) {
        case "PushEvent":
            return <GitCommit className="w-4 h-4" />;
        default:
            return <RefreshCw className="w-4 h-4" />;
    }
};

const GitHubActivity = () => {
    const { events, loading, error } = useGitHubActivity();

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 animate-pulse"
                    >
                        <div className="w-8 h-8 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-muted rounded w-3/4" />
                            <div className="h-2 bg-muted rounded w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error || events.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma atividade recente</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {events.slice(0, 5).map((event, index) => (
                <motion.a
                    key={event.id}
                    href={`https://github.com/${event.repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-smooth group"
                >
                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                        {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-smooth">
                            {getEventDescription(event)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(event.created_at), {
                                addSuffix: true,
                                locale: ptBR,
                            })}
                        </p>
                    </div>
                </motion.a>
            ))}
        </div>
    );
};

export default GitHubActivity;
