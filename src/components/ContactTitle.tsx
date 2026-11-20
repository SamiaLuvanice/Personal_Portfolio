import { useRef } from "react";
import { useDrawOnce, usePointerGlow } from "@/hooks/use-title-effects";

const TITLE = "Vamos construir algo relevante?";

/**
 * Título do Contato (spec 0008): o texto preenchido é o próprio h2; por cima, duas cópias
 * decorativas com a mesma quebra de linha — o contorno da entrada e o brilho que segue o ponteiro.
 */
const ContactTitle = () => {
  const ref = useRef<HTMLHeadingElement>(null);
  useDrawOnce(ref);
  usePointerGlow(ref);

  return (
    <h2
      ref={ref}
      id="contact-title"
      className="contact-title relative font-display text-[2.5rem] font-bold uppercase leading-[0.98] tracking-tight md:text-6xl lg:text-8xl"
    >
      {TITLE}
      <span aria-hidden="true" className="contact-title-outline">
        {TITLE}
      </span>
      <span aria-hidden="true" className="contact-title-glow">
        {TITLE}
      </span>
    </h2>
  );
};

export default ContactTitle;
