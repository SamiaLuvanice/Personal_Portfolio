import AvailabilityBadge from "@/components/AvailabilityBadge";
import { SOCIAL_LINKS } from "@/content/portfolio";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

const HERO_LINKS = [
  { label: "GitHub", href: SOCIAL_LINKS.github, external: true, Icon: ArrowUpRight },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, external: true, Icon: ArrowUpRight },
  { label: "Currículo (PDF)", href: SOCIAL_LINKS.resume, external: true, Icon: ArrowDown },
  { label: "E-mail", href: SOCIAL_LINKS.email, external: false, Icon: ArrowUpRight },
];

/** Hero F: escuro monocromático, retrato P&B e nome com blend "difference" (spec 0003). */
const Hero = () => (
  <section id="inicio" tabIndex={-1} aria-labelledby="hero-title" className="surface-dark relative focus:outline-none overflow-hidden px-5 pb-16 pt-5 md:px-10 md:pb-20 lg:px-10 lg:pb-10 lg:pt-[calc(var(--nav-top-height)+1.5rem)]">
    <p aria-hidden="true" className="ghost-word absolute inset-x-0 top-16 text-center font-hero font-bold leading-none [font-size:36vw] lg:top-[calc(var(--nav-top-height)-1rem)] lg:[font-size:min(29vw,26rem)]">
      SÂMIA
    </p>

    <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-6 md:gap-8 lg:grid-cols-[1fr_minmax(0,38rem)_1fr] lg:items-end lg:gap-x-8 lg:gap-y-0">
      <div className="flex items-center justify-between lg:hidden">
        <AvailabilityBadge short />
        <a href="#projects" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-sm font-semibold text-white">
          Ver projetos
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>

      <div className="mx-auto w-[min(80vw,19.5rem)] md:w-[26rem] lg:col-start-2 lg:row-start-1 lg:w-[min(100%,calc((100svh-15rem)*0.7776))]">
        <img
          src="/hero/portrait.webp"
          alt="Retrato de Sâmia Luvanice sorrindo, de braços cruzados"
          width={720}
          height={926}
          {...{ fetchpriority: "high" }}
          decoding="async"
          className="hero-portrait h-auto w-full"
        />
      </div>

      <h1
        id="hero-title"
        className="hero-name relative z-10 -mt-[1em] text-center font-hero font-bold uppercase leading-[0.88] tracking-[-0.03em] [font-size:calc((100vw-2.5rem)/4.3)] md:-mt-[0.6em] md:whitespace-nowrap md:[font-size:calc((100vw-5rem)/7.7)] lg:col-span-3 lg:row-start-2 lg:-mt-[0.6em] lg:[font-size:min(calc((100vw-5rem)/7.7),10.5rem)]"
      >
        <span className="block md:inline">Sâmia</span> <span className="block md:inline">Luvanice</span>
      </h1>

      <div className="flex flex-col gap-4 md:gap-5 lg:col-start-1 lg:row-start-1 lg:self-center lg:max-w-[22rem]">
        <p className="font-display text-3xl font-medium leading-tight md:text-4xl lg:text-[2.75rem]">
          Full Stack <br className="hidden lg:block" />
          Developer
        </p>
        <p className="text-base text-muted-foreground md:text-lg">Aplicações web completas — da interface ao banco de dados.</p>
        <a
          href="#contact"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 self-start rounded-full border border-transparent bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--surface-dark))] md:w-auto"
        >
          Vamos conversar
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>

      <ul aria-label="Links profissionais" className="hidden flex-wrap gap-2 md:flex lg:col-start-3 lg:row-start-1 lg:self-center lg:flex-col lg:items-end">
        {HERO_LINKS.map(({ label, href, external, Icon }) => (
          <li key={label}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm text-white/90 transition-colors hover:border-white/50 hover:bg-white/10"
            >
              {label}
              <Icon aria-hidden="true" className="h-4 w-4" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Hero;
