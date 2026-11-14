import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

// Code splitting: componentes carregados sob demanda
const Certificates = lazy(() => import("@/components/Certificates"));
const Projects = lazy(() => import("@/components/Projects"));
const Contact = lazy(() => import("@/components/Contact"));

const LoadingFallback = () => (
  <div className="space-y-4 py-24">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
);

const Index = () => {
    return (
        <div className="portfolio-page min-h-screen bg-background">
            <Navbar />
            <Hero />
            <About />

            <div id="certificates" tabIndex={-1}>
                <Suspense fallback={<LoadingFallback />}>
                    <Certificates />
                </Suspense>
            </div>

            <div id="projects" tabIndex={-1}>
                <Suspense fallback={<LoadingFallback />}>
                    <Projects />
                </Suspense>
            </div>

            <div id="contact" tabIndex={-1}>
                <Suspense fallback={<LoadingFallback />}>
                    <Contact />
                </Suspense>
            </div>

            <Footer />
        </div>
    );
};

export default Index;
