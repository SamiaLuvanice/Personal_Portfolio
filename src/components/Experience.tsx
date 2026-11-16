import SectionTitle from "@/components/SectionTitle";
import { EXPERIENCE } from "@/content/portfolio";

/** Experiência compacta: uma linha por vínculo (spec 0003). */
const Experience = () => (
  <section aria-labelledby="experience-title" className="surface-light surface-muted px-5 py-14 md:px-10 md:py-20 lg:px-20 lg:py-24">
    <div className="mx-auto flex max-w-[80rem] flex-col gap-6 md:gap-8">
      <SectionTitle id="experience-title">EXPERIÊNCIA</SectionTitle>
      <p className="text-center text-base text-muted-foreground md:text-lg">2+ anos em desenvolvimento full stack</p>
      <ul className="border-t border-foreground/15">
        {EXPERIENCE.map((entry) => (
          <li key={entry.company} className="flex items-center justify-between gap-4 border-b border-foreground/15 py-5 md:px-2 md:py-7">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="flex flex-wrap items-center gap-2.5">
                <span className="font-display text-lg font-medium md:text-2xl">{entry.company}</span>
                {entry.current && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-card px-2.5 py-1 font-display text-[0.6875rem] font-medium uppercase tracking-[0.08em]">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Atual
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground md:text-base">{entry.role}</p>
            </div>
            <p className="shrink-0 text-right text-xs text-muted-foreground md:text-base">{entry.period}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Experience;
