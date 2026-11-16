import { ArrowRight } from "lucide-react";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import { NAV_ITEMS } from "@/content/portfolio";
import { useActiveSection } from "@/hooks/use-active-section";

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

/** Barra superior a partir de 1024 px e barra inferior de quatro colunas abaixo disso (spec 0003). */
const Navbar = () => {
  const active = useActiveSection(SECTION_IDS);

  return (
    <nav aria-label="Navegação principal" className="site-nav">
      <div className="site-nav-surface flex items-center rounded-full p-1 sm:p-1.5 lg:justify-between lg:rounded-none lg:px-10 lg:py-4">
        <AvailabilityBadge className="hidden lg:inline-flex" />
        <ul className="grid w-full grid-cols-4 lg:flex lg:w-auto lg:items-center lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="min-w-0">
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className="flex min-h-11 items-center justify-center gap-1 rounded-full px-1 text-[0.75rem] text-[hsl(280_10%_72%)] transition-colors hover:text-white motion-reduce:transition-none sm:px-4 sm:text-sm lg:px-3 lg:text-[0.9375rem] lg:text-white/90"
              >
                {item.label}
                {item.count && (
                  <span aria-hidden="true" className="hidden self-start pt-2.5 font-display text-[0.6875rem] leading-none text-[hsl(280_10%_72%)] lg:inline">
                    [{item.count}]
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#projects"
          className="hidden min-h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 lg:inline-flex"
        >
          Ver projetos
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
