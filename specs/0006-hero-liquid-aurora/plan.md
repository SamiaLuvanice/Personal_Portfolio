# Plano — 0006 Hero Liquid Aurora

## Contrato da interface

Não há API. O contrato é o DOM público do hero, que os testes consultam:

- `section#inicio` com `aria-labelledby="hero-title"` e fundo `surface-dark` (rgb 22, 22, 24), como na spec 0003.
- `h1#hero-title` com dois `span` em bloco ("Sâmia" contornado e "Luvanice" preenchido) e nome acessível "Sâmia Luvanice". A medição da spec 0005 continua a mesma.
- Retrato: `img` principal com `alt` descritivo, `fetchpriority="high"`, sem `loading="lazy"`, `src=/hero/portrait-2026.webp`. A cópia colorida usa o mesmo arquivo (uma única requisição), com `alt=""` e `aria-hidden`.
- Ações: links "Explorar projetos" (`#projects`) e "Entrar em contato" (`#contact`).
- Lista "Links profissionais" com quatro links só de ícone, cujos nomes acessíveis são GitHub, LinkedIn, Currículo (PDF) e E-mail.
- Estado da revelação: `data-reveal="true|false"` na seção e as variáveis CSS `--mx`/`--my` (posição na seção) e `--px`/`--py` (posição no retrato), em px.

## Arquivos e camadas

| Arquivo | Mudança |
| --- | --- |
| `public/hero/portrait-2026.webp` | Foto nova sem colares, 720×958, WebP com alfa (qualidade 52, ~32 KB). |
| `public/hero/aurora-*.webp` + `scripts/generate-hero-aurora.mjs` | Aurora pré-renderizada (160×100, ~19 KB no total): mono, colorida e colorida já recortada nos focos A e B. Gerada no `<canvas>` do Chromium via Playwright, como o OG image. |
| `src/lib/aurora.ts` (+ teste) | Funções puras: `localPoint` (cliente → seção), `approach` (aproximação suavizada) e `isSettled`. |
| `src/hooks/use-aurora-pointer.ts` | `useAuroraPointer`: ponteiro → variáveis CSS com `requestAnimationFrame` e suavização por tempo (independe da taxa de quadros). Só ativa com `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)` e reage a mudanças dessa media query. `useHeroMotion`: `data-motion="on"` 1,5 s depois do `load` e `data-paused` com o hero fora da tela ou a aba oculta. |
| `src/components/HeroAurora.tsx` | Três camadas decorativas (mono, foco A, foco B), cada uma com uma imagem; o CSS escolhe o arquivo por modo. `aria-hidden`, sem eventos de ponteiro. |
| `src/components/Hero.tsx` (+ `Hero.test.tsx`) | Nova composição: nome em duas linhas atrás do retrato no desktop e acima dele no celular; retrato P&B + cópia colorida mascarada; intro, ações e links por ícone. |
| `src/index.css` | Modos ponteiro/ambiente/estático, máscara radial só no modo ponteiro, deriva (transform) e alternância dos focos (opacity) só após `data-motion`, entrada, cores forçadas. Remove o blend `difference` do nome (`.ghost-word` continua no Contato). |
| `src/pages/Index.tsx` | A rolagem até a âncora passa a se realinhar enquanto as seções montam (até 2 s ou até a pessoa rolar). A espera fixa de dois quadros ficou instável com o hero novo (E2E de cores forçadas no celular falhava 1 em 4). |
| `e2e/portfolio.spec.ts` | Atualiza o teste das ações do hero e adiciona revelação por ponteiro, movimento reduzido, toque/ambiente e o rosto no celular. |

## Decisões

- **Aurora pré-renderizada em imagens pequenas, sem WebGL nem biblioteca.** A página do Liquid Aurora descreve o componente como gradientes CSS com keyframes, e a spec proíbe dependências novas. A primeira versão desenhava ~24 gradientes de meia tela e faixas em SVG com `feGaussianBlur` no DOM. No Lighthouse mobile (rasterização por software), isso gerava uma tarefa de 1–1,5 s na thread principal e TBT de 4–6 s. Medido por bissecção: SVG blur, depois CSS blur, depois gradientes no DOM e por fim as máscaras de tela inteira. Descartado: canvas/WebGL em tempo real, que custa JS na primeira pintura.
- **A cor é uma camada mascarada, sem troca de tema.** A cópia colorida da aurora e do retrato fica sob `mask-image: radial-gradient(circle R at var(--mx) var(--my), …)`, e fora do círculo tudo continua P&B. Descartado: animar `filter: grayscale` na seção inteira, que gera a troca brusca que o pedido proíbe.
- **O ponteiro grava só variáveis CSS, nunca estado React.** O rAF para quando converge, e assim nada re-renderiza a cada quadro. A suavização usa um fator de 0,14 por quadro, que converge em bem menos de 1 s.
- **Três modos guiados por media query, sem JS para os dois últimos.**
  - **Ponteiro** (hover fino): a cor aparece na máscara radial que segue o ponteiro.
  - **Ambiente** (sem hover): dois focos fixos, já recortados nas imagens, alternam por opacidade (compositor).
  - **Estático** (movimento reduzido): só o foco A, discreto e sem animação.
  - Descartado: animar `--mx/--my` registradas com `@property`. Isso roda na thread principal e recalcula o estilo da seção inteira a cada quadro.
- **Decoração progressiva.** A primeira pintura é só fundo, foto e texto, como no hero anterior. A aurora e as cópias coloridas da foto entram com esmaecimento depois do `load`, e as imagens decorativas só são pedidas nesse momento.
- **Esmaecimento da base da foto por máscara estática em cada imagem**, não no contêiner. Uma máscara no contêiner com filhos animados era recomposta a cada quadro. Embutir o esmaecimento no alfa do WebP criava faixas visíveis abaixo da qualidade de alfa 85, e acima disso o arquivo dobrava.
- **O nome e o retrato não animam na entrada**, para não atrasar o LCP. Só intro, ações e links esmaecem.
- **O fundo continua `surface-dark`**, para manter a alternância de seções da spec 0003.

## Riscos

- **Repintura da máscara a cada quadro do ponteiro** (só no desktop com mouse, enquanto ele se move). O loop para ao convergir.
- **Peso do retrato com alfa:** sobe de 18 KB para cerca de 32 KB. O LCP simulado local ficou empatado com a `main` na mesma rodada; a confirmação final é o Lighthouse em produção.
- **Lighthouse local ruidoso nesta máquina:** execuções idênticas variam até ±25 pontos. As comparações foram feitas com a `main` e o branch servidos lado a lado e intercalados (5 execuções cada).
- **Nome atrás do retrato no desktop:** parte das letras fica coberta, por decisão de design. O texto continua no DOM, e o axe não mede sobreposição.
- **Caro de reverter:** nada. A troca é local ao hero, mais o arquivo do retrato.
