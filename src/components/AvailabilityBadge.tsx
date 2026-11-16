import { cn } from "@/lib/utils";

/** Selo "Disponível para oportunidades" (fundo escuro). */
const AvailabilityBadge = ({ className, short = false }: { className?: string; short?: boolean }) => (
  <span
    className={cn(
      "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-display text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-white/90",
      className,
    )}
  >
    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[hsl(142_70%_45%)] shadow-[0_0_8px_hsl(142_70%_45%/0.6)]" />
    {short ? "Disponível" : "Disponível para oportunidades"}
  </span>
);

export default AvailabilityBadge;
