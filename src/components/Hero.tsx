import { type CSSProperties, useRef } from "react";
import { ArrowRight, FileText, Github, Linkedin, Mail, type LucideIcon } from "lucide-react";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import HeroAurora from "@/components/HeroAurora";
import { SOCIAL_LINKS } from "@/content/portfolio";
import { useAuroraPointer, useHeroMotion } from "@/hooks/use-hero-aurora";

const HERO_LINKS: { label: string; href: string; external: boolean; Icon: LucideIcon }[] = [
  { label: "GitHub", href: SOCIAL_LINKS.github, external: true, Icon: Github },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, external: true, Icon: Linkedin },
  { label: "Currículo (PDF)", href: SOCIAL_LINKS.resume, external: true, Icon: FileText },
  { label: "E-mail", href: SOCIAL_LINKS.email, external: false, Icon: Mail },
];

const PORTRAIT = { src: "/hero/portrait-2026.webp", width: 720, height: 958 };

/** Atraso escalonado da entrada (só fora de movimento reduzido; ver `.hero-enter`). */
const enter = (index: number) => ({ "--enter-delay": `${120 + index * 60}ms` }) as CSSProperties;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--surface-dark))]";

/** Hero Liquid Aurora: monocromático por padrão, cor pela interação (spec 0006). */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  useAuroraPointer(sectionRef, photoRef);
  useHeroMotion(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      tabIndex={-1}
      aria-labelledby="hero-title"
      data-reveal="false"
      className="hero surface-dark relative isolate flex flex-col overflow-hidden px-5 pb-12 pt-5 focus:outline-none md:px-10 md:pb-16 lg:min-h-[max(40rem,100svh)] lg:pb-14 lg:pt-[calc(var(--nav-top-height)+1rem)]"
    >
      <HeroAurora />

      <div className="relative z-20 flex items-center justify-between lg:hidden">
        <AvailabilityBadge short />
        <a href="#projects" className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-sm font-semibold text-white ${FOCUS_RING}`}>
          Ver projetos
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>

      <h1
        id="hero-title"
        className="hero-name relative mx-auto mt-8 w-full max-w-[90rem] font-hero font-bold uppercase leading-[0.88] tracking-[-0.02em] [font-size:calc((100vw-2.5rem)/4.45)] md:[font-size:calc((100vw-5rem)/4.45)] lg:mt-2 lg:[font-size:min(calc((100vw-5rem)/5.45),26svh,16rem)]"
      >
        <span className="hero-name-outline block text-left lg:pl-[0.05em]">Sâmia</span>{" "}
        <span className="block -mt-[0.06em] text-right lg:-mt-[0.1em]">Luvanice</span>
      </h1>

      <div
        ref={photoRef}
        className="hero-photo relative z-10 mx-auto mt-3 aspect-[720/958] w-[min(82vw,22rem)] translate-x-[4%] md:mr-[1%] md:w-[27.5rem] md:translate-x-0 lg:absolute lg:bottom-[-9%] lg:mt-0 lg:w-auto lg:-translate-x-1/2"
      >
        <img
          src={PORTRAIT.src}
          alt="Retrato de Sâmia Luvanice sorrindo, de braços cruzados"
          width={PORTRAIT.width}
          height={PORTRAIT.height}
          {...{ fetchpriority: "high" }}
          decoding="async"
          className="hero-portrait absolute inset-0 h-full w-full"
        />
        {["hero-portrait-color", "hero-portrait-color hero-portrait-color-alt"].map((className) => (
          <img key={className} src={PORTRAIT.src} alt="" aria-hidden="true" width={PORTRAIT.width} height={PORTRAIT.height} decoding="async" className={`${className} absolute inset-0 h-full w-full`} />
        ))}
      </div>

      <div className="relative z-20 mx-auto -mt-16 flex w-full max-w-[90rem] flex-col gap-8 md:-mt-20 lg:mt-auto lg:flex-row lg:items-end lg:justify-between">
        <div className="hero-intro flex flex-col gap-4 md:gap-5">
          <p className="hero-enter font-display text-3xl font-medium leading-tight md:text-4xl lg:text-5xl" style={enter(0)}>
            Full Stack Developer
          </p>
          <p className="hero-enter text-base text-[hsl(280_15%_88%)] md:text-lg" style={enter(1)}>
            Transformo ideias em aplicações web completas, conectando interfaces intuitivas, soluções robustas e experiências digitais.
          </p>
          <div className="hero-enter mt-1 flex flex-col gap-3 whitespace-nowrap sm:flex-row sm:flex-wrap" style={enter(2)}>
            <a
              href="#projects"
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[hsl(280_20%_95%)] px-6 font-semibold text-[hsl(var(--surface-dark))] transition-colors hover:bg-primary hover:text-primary-foreground motion-reduce:transition-none ${FOCUS_RING}`}
            >
              Explorar projetos
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className={`inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 motion-reduce:transition-none ${FOCUS_RING}`}
            >
              Entrar em contato
            </a>
          </div>
        </div>

        <ul aria-label="Links profissionais" className="hero-enter flex gap-3 lg:flex-col" style={enter(3)}>
          {HERO_LINKS.map(({ label, href, external, Icon }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-[hsl(var(--surface-dark)/0.55)] text-white/90 transition-colors hover:border-white/60 hover:bg-white/5 motion-reduce:transition-none ${FOCUS_RING}`}
              >
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                <span className="sr-only">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Hero;
