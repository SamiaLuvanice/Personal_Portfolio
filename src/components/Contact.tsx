import AvailabilityBadge from "@/components/AvailabilityBadge";
import { SOCIAL_LINKS } from "@/content/portfolio";
import { ArrowUpRight } from "lucide-react";

/** Contato monocromático, espelhando o hero: o laranja fica só no botão (spec 0003). */
const Contact = () => (
  <section aria-labelledby="contact-title" className="surface-dark relative overflow-hidden px-5 pb-12 pt-20 md:px-10 md:pt-28 lg:px-20 lg:pt-36">
    <p aria-hidden="true" className="ghost-word absolute inset-x-0 top-8 text-center font-display font-bold leading-none [font-size:24vw] lg:[font-size:min(21vw,19rem)]">
      CONTATO
    </p>
    <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center md:gap-8">
      <AvailabilityBadge />
      <h2 id="contact-title" className="font-display text-[2.5rem] font-bold uppercase leading-[0.98] tracking-tight md:text-6xl lg:text-8xl">
        Vamos construir algo relevante?
      </h2>
      <p className="text-base text-muted-foreground md:text-lg">Aberta a oportunidades em desenvolvimento Full Stack.</p>
      <a
        href={SOCIAL_LINKS.email}
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-transparent bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--surface-dark))] sm:w-auto"
      >
        Iniciar conversa
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </a>
      <a href={SOCIAL_LINKS.email} className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline md:text-base [overflow-wrap:anywhere]">
        {SOCIAL_LINKS.emailAddress}
      </a>
    </div>
  </section>
);

export default Contact;
