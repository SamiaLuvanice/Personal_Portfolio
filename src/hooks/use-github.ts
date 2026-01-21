import { useState, useEffect } from "react";

export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    topics: string[];
    updated_at: string;
    pushed_at: string;
}

export interface GitHubCommit {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    html_url: string;
}

const GITHUB_USERNAME = "SamiaLuvanice";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheData<T> {
    data: T;
    timestamp: number;
}

function getFromCache<T>(key: string): T | null {
    try {
        const cached = localStorage.getItem(key);
        if (cached) {
            const parsed: CacheData<T> = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_DURATION) {
                return parsed.data;
            }
        }
    } catch {
        // Ignore cache errors
    }
    return null;
}

function setToCache<T>(key: string, data: T): void {
    try {
        const cacheData: CacheData<T> = { data, timestamp: Date.now() };
        localStorage.setItem(key, JSON.stringify(cacheData));
    } catch {
        // Ignore cache errors
    }
}

export function useGitHubRepos() {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepos = async () => {
            const cacheKey = `github_repos_${GITHUB_USERNAME}`;
            const cached = getFromCache<GitHubRepo[]>(cacheKey);

            if (cached) {
                setRepos(cached);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch repositories");
                }

                const data: GitHubRepo[] = await response.json();
                setRepos(data);
                setToCache(cacheKey, data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    return { repos, loading, error };
}

export function useGitHubCommits(repoName?: string) {
    const [commits, setCommits] = useState<GitHubCommit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCommits = async () => {
            if (!repoName) {
                setLoading(false);
                return;
            }

            const cacheKey = `github_commits_${GITHUB_USERNAME}_${repoName}`;
            const cached = getFromCache<GitHubCommit[]>(cacheKey);

            if (cached) {
                setCommits(cached);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/commits?per_page=5`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch commits");
                }

                const data: GitHubCommit[] = await response.json();
                setCommits(data);
                setToCache(cacheKey, data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchCommits();
    }, [repoName]);

    return { commits, loading, error };
}

export function useGitHubActivity() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const cacheKey = `github_events_${GITHUB_USERNAME}`;
            const cached = getFromCache<any[]>(cacheKey);

            if (cached) {
                setEvents(cached);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch activity");
                }

                const data = await response.json();
                setEvents(data);
                setToCache(cacheKey, data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return { events, loading, error };
}
