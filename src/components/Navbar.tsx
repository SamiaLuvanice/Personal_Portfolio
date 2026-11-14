import { useRef, useState, type KeyboardEvent } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { name: "Tecnologias", href: "#about" },
  { name: "Certificados", href: "#certificates" },
  { name: "Projetos", href: "#projects" },
  { name: "Contato", href: "#contact" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setIsMobileMenuOpen(false);
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && isMobileMenuOpen) {
      closeMenu();
      menuButton.current?.focus();
    }
  };

  return (
    <nav
      aria-label="Navegação principal"
      className="portfolio-nav fixed left-1/2 z-50 w-max max-w-[calc(100%_-_2rem)] -translate-x-1/2"
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <div className="glass-strong flex items-center gap-2 rounded-full p-1.5 md:gap-3">
        <Button asChild variant="ghost" size="icon" className="rounded-full font-display text-lg font-bold">
          <a href="#inicio" aria-label="SL, início" onClick={closeMenu}>
            SL
          </a>
        </Button>

        <Button
          ref={menuButton}
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          onClick={(event) => {
            event.currentTarget.focus();
            setIsMobileMenuOpen((isOpen) => !isOpen);
          }}
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="portfolio-nav-links"
        >
          {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
        <ul
          id="portfolio-nav-links"
          data-expanded={isMobileMenuOpen}
          className="portfolio-nav-links gap-1 md:flex"
        >
          {NAV_ITEMS.map(({ name, href }) => (
            <li key={href}>
              <Button asChild variant="ghost" className="w-full justify-start md:rounded-full">
                <a href={href} onClick={closeMenu}>{name}</a>
              </Button>
            </li>
          ))}
        </ul>
        <ThemeToggle className="rounded-full" />
      </div>
    </nav>
  );
};

export default Navbar;
