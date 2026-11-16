import { lazy, Suspense, useEffect } from "react";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

// Seções abaixo da dobra em chunks próprios: mantêm o primeiro render leve (LCP do retrato).
const loaders = {
  projects: () => import("@/components/Projects"),
  expertise: () => import("@/components/Expertise"),
  experience: () => import("@/components/Experience"),
  contact: () => import("@/components/Contact"),
};

const SECTIONS = [
  { id: "projects", Component: lazy(loaders.projects), minHeight: "min-h-[60rem]" },
  { id: "expertise", Component: lazy(loaders.expertise), minHeight: "min-h-[40rem]" },
  { id: "experience", Component: lazy(loaders.experience), minHeight: "min-h-[20rem]" },
  { id: "contact", Component: lazy(loaders.contact), minHeight: "min-h-[30rem]" },
];

const Index = () => {
  // Numa SPA o navegador tenta rolar até o fragmento antes de a seção existir. Depois que os
  // chunks carregam e as seções montam com a altura real, refaz a rolagem até o destino.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let cancelled = false;
    Promise.all(Object.values(loaders).map((load) => load())).then(() => {
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => {
          if (!cancelled && window.location.hash.slice(1) === id) document.getElementById(id)?.scrollIntoView();
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="portfolio-page min-h-screen bg-[hsl(var(--surface-dark))]">
      <Navbar />
      <main>
        <Hero />
        {SECTIONS.map(({ id, Component, minHeight }) => (
          <div key={id} id={id} tabIndex={-1} className="focus:outline-none">
            <Suspense fallback={<div className={minHeight} />}>
              <Component />
            </Suspense>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
