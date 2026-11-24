/**
 * Selo "Disponível para oportunidades" (fundo escuro). `display` define a exibição (ex.: oculto
 * no celular): ficar fora das classes base evita depender de mesclagem de classes, cujo preparo
 * custava script no carregamento inicial (spec 0009).
 */
const AvailabilityBadge = ({ display = "inline-flex", short = false }: { display?: string; short?: boolean }) => (
  <span
    className={`${display} items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-display text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-white/90`}
  >
    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[hsl(142_70%_45%)] shadow-[0_0_8px_hsl(142_70%_45%/0.6)]" />
    {short ? "Disponível" : "Disponível para oportunidades"}
  </span>
);

export default AvailabilityBadge;
