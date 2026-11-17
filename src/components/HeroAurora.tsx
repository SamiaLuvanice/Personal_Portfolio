/**
 * Aurora líquida do hero (spec 0006). A geometria do Figma (manchas e faixas suaves) vem
 * pré-renderizada em imagens pequenas em public/hero/ (`scripts/generate-hero-aurora.mjs`),
 * ampliadas pelo compositor: desenhar os gradientes e as máscaras de tela inteira no DOM custava
 * centenas de ms de rasterização no celular. O CSS escolhe a imagem de cada camada conforme o
 * modo (ponteiro, ambiente ou estático) e só a pede depois do carregamento da página.
 * Puramente decorativa: oculta para tecnologias assistivas e sem eventos de ponteiro.
 */

// Nomes de classe literais: o Tailwind só mantém classes de @layer que aparecem no código.
const LAYERS = [
  "hero-aurora-layer hero-aurora-mono",
  "hero-aurora-layer hero-aurora-color",
  "hero-aurora-layer hero-aurora-color hero-aurora-color-alt",
];

const HeroAurora = () => (
  <div data-hero-aurora aria-hidden="true" className="hero-aurora">
    {LAYERS.map((className) => (
      <div key={className} className={className}>
        <span className="hero-aurora-image" />
      </div>
    ))}
  </div>
);

export default HeroAurora;
