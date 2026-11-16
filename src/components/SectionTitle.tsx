import { cn } from "@/lib/utils";

/** Título de seção no formato "/NOME", centralizado e em caixa alta. */
const SectionTitle = ({ id, children, className }: { id: string; children: string; className?: string }) => (
  <h2 id={id} className={cn("text-center font-display text-4xl font-bold uppercase tracking-tight md:text-5xl lg:text-7xl", className)}>
    <span aria-hidden="true">/</span>
    {children}
  </h2>
);

export default SectionTitle;
