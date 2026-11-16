import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import ExpertisePreview from "@/components/ExpertisePreview";
import SectionTitle from "@/components/SectionTitle";
import { EXPERTISE } from "@/content/portfolio";

/** Áreas de competência: vários itens podem ficar abertos; o primeiro começa aberto (spec 0003). */
const Expertise = () => (
  <section aria-labelledby="expertise-title" className="surface-dark px-5 py-20 md:px-10 md:py-24 lg:px-20 lg:py-32">
    <div className="mx-auto flex max-w-[80rem] flex-col gap-10 md:gap-14">
      <SectionTitle id="expertise-title">EXPERTISE</SectionTitle>

      <AccordionPrimitive.Root type="multiple" defaultValue={[EXPERTISE[0].id]} className="border-b border-border">
        {EXPERTISE.map((item, index) => (
          <AccordionPrimitive.Item key={item.id} value={item.id} className="group/item border-t border-border">
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger className="group flex w-full items-center gap-3 py-5 text-left transition-[padding] duration-200 focus-visible:outline-none motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring md:gap-6 md:py-7 lg:hover:pl-4">
                <span aria-hidden="true" className="w-7 shrink-0 font-display text-xs text-muted-foreground md:w-10 md:text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-2xl font-bold uppercase leading-tight tracking-tight text-foreground/75 transition-colors motion-reduce:transition-none group-hover:text-foreground group-data-[state=open]:text-foreground md:text-4xl lg:text-[3.5rem]">
                  {item.title}
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors group-hover:bg-white group-hover:text-[hsl(var(--surface-dark))] group-data-[state=open]:border-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground md:h-14 md:w-14"
                >
                  <Plus className="h-5 w-5 group-data-[state=open]:hidden" />
                  <Minus className="hidden h-5 w-5 group-data-[state=open]:block" />
                </span>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:!animate-none">
              <div className="grid gap-6 pb-8 md:pb-10 lg:grid-cols-[1fr_minmax(0,32rem)] lg:gap-16 lg:pl-16">
                <ul aria-label={`Tecnologias de ${item.title}`} className="flex flex-wrap content-start gap-2">
                  {item.technologies.map((technology) => (
                    <li key={technology} className="rounded-full border border-border bg-white/5 px-3 py-1.5 font-display text-sm">
                      {technology}
                    </li>
                  ))}
                </ul>
                <ExpertisePreview kind={item.id} />
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </div>
  </section>
);

export default Expertise;
