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

/** Sinais de que a pessoa assumiu a rolagem (inclui arrastar a barra de rolagem). */
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

const Index = () => {
  // Numa SPA o navegador tenta rolar até o fragmento antes de a seção existir. Depois que os
  // chunks carregam, refaz a rolagem até o destino a cada mudança de altura da página (as seções
  // montam em momentos diferentes), por até 2 s ou até a pessoa rolar por conta própria.
  useEffect(() => {
    const currentId = () => {
      try {
        return decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return ""; // fragmento malformado (ex.: "#%"): não há destino
      }
    };
    const id = currentId();
    if (!id) return;
    let done = false;
    let observer: ResizeObserver | null = null;
    let timer = 0;
    const realign = () => {
      // "instant": o realinhamento não pode virar uma animação recomeçada a cada mudança de altura.
      if (!done && currentId() === id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    };
    const stop = () => {
      done = true;
      observer?.disconnect();
      window.clearTimeout(timer);
      for (const type of USER_SCROLL_EVENTS) window.removeEventListener(type, stop);
    };
    for (const type of USER_SCROLL_EVENTS) window.addEventListener(type, stop, { passive: true });
    Promise.all(Object.values(loaders).map((load) => load()))
      .then(() => {
      if (done) return;
      window.requestAnimationFrame(realign);
      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(realign);
        observer.observe(document.body);
      }
      timer = window.setTimeout(stop, 2000);
      })
      // Falha de rede num chunk: o Suspense da seção trata; aqui só não há realinhamento.
      .catch(stop);
    return stop;
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
