import { SOCIAL_LINKS } from "@/content/portfolio";
import { ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = [
  { label: "GitHub", href: SOCIAL_LINKS.github },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
  { label: "Currículo", href: SOCIAL_LINKS.resume },
];

/** Rodapé contínuo ao Contato, com o monograma SL em degradê (spec 0002). */
const Footer = () => (
  <footer className="surface-dark px-5 pb-6 md:px-10 lg:px-20 lg:pb-10">
    <div className="mx-auto flex max-w-[80rem] flex-col items-center gap-4 border-t border-border pt-6 md:flex-row md:justify-between">
      <a href="#inicio" className="brand-mark inline-flex items-center gap-3 rounded-full py-1 pl-1 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full font-display font-bold">
          SL
        </span>
        <span className="font-sans text-sm font-semibold">Sâmia Luvanice</span>
      </a>
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {FOOTER_LINKS.map(({ label, href }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-sm text-foreground/90 hover:text-foreground">
              {label}
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </footer>
);

export default Footer;
