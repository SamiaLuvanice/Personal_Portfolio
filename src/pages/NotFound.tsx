import { useEffect } from "react";

const NotFound = () => {
    const { pathname } = window.location;

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", pathname);
    }, [pathname]);

    return (
        <main className="surface-dark flex min-h-screen items-center justify-center px-5">
            <div className="text-center">
                <h1 className="mb-4 font-display text-6xl font-bold">404</h1>
                <p className="mb-8 text-lg text-muted-foreground">Página não encontrada.</p>
                <a
                    href="/"
                    className="inline-flex min-h-12 items-center rounded-full border border-transparent bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary-glow"
                >
                    Voltar ao início
                </a>
            </div>
        </main>
    );
};

export default NotFound;
