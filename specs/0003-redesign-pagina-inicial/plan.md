# Plano da spec 0003

Branch: `feat/redesign-pagina-inicial`. Sem API nem backend: a mudança fica na interface, no conteúdo, nos metadados e nos testes.

## Camadas e arquivos

**Conteúdo (novo, `src/content/portfolio.ts`)**
- Fonte única dos dados exibidos: projetos (com URLs, categoria e tags), itens de expertise, vínculos de experiência, links sociais e contagens da navegação.
- As contagens derivam do tamanho das listas, para não divergirem da página.
- É dado puro e tipado, testado por invariantes (quatro projetos, dois por categoria, cinco itens de expertise, dois vínculos).

**Lógica pura (novo, em `src/lib/`)**
- `filter-projects.ts`: filtra por "todos", "autoral" ou "comercial".
- `active-section.ts`: escolhe a seção ativa a partir das posições medidas. A regra do fim da página leva a Contato.
- O hook `src/hooks/use-active-section.ts` só liga essa regra ao `IntersectionObserver` e à rolagem.

**Componentes**

| Situação | Arquivos | Conteúdo |
|---|---|---|
| Reescritos | `Hero.tsx`, `Navbar.tsx`, `Projects.tsx`, `Contact.tsx` | Contato inclui o `<footer>` |
| Novos | `ProjectCard.tsx`, `Expertise.tsx`, `ExpertisePreview.tsx`, `Experience.tsx` | `ExpertisePreview` traz as quatro prévias desenhadas em HTML |
| Removidos | `About.tsx`, `Certificates.tsx`, `ThemeToggle.tsx`, `Footer.tsx` | O rodapé passa para dentro do Contato |
| Página | `src/pages/Index.tsx` | Ordem Hero, Projetos, Expertise, Experiência, Contato. As âncoras persistentes continuam para as seções carregadas sob demanda |
| App | `src/App.tsx` | Remove o `ThemeProvider` |

**Estilos (`src/index.css`, `tailwind.config.ts`)**
- Duas superfícies, `.surface-dark` e `.surface-light`, redefinem os tokens shadcn (`--background`, `--foreground`, `--muted-foreground`, `--border`, `--card`) por seção. Assim os componentes de `ui/` seguem corretos em fundo claro e escuro.
- O escuro único é `hsl(240 6% 9%)` (`#161618`).
- O bloco `.dark` e o tema alternável saem. O `:root` fica com a superfície clara.
- Regras da navbar: barra superior a partir de 1024 px, barra inferior abaixo disso, `scroll-margin-top` das seções e área segura.

**Imagens (`public/projects/`)**
- Screenshots 1440×900 dos quatro projetos e do problema do BestPrice, convertidos para WebP (qualidade ≈ 0,8).
- A conversão usa o Chromium do Playwright (canvas `toDataURL`), sem nova dependência.
- Cada `<img>` tem `width`/`height` e `loading="lazy"`, exceto o retrato do hero. O retrato usa `fetchpriority="high"` e é convertido para WebP a partir de `profile-photo-b.jpeg`.

**Metadados:** `index.html` (title, description, OG/Twitter e `theme-color` `#161618`).

**Testes**
- Vitest:
  - invariantes do conteúdo;
  - `filter-projects`;
  - `active-section`;
  - Projetos: filtro com `aria-pressed` e região `aria-live`;
  - Expertise: vários itens abertos, `aria-expanded` e teclado.
- Playwright (desktop e mobile) substitui o `e2e/portfolio.spec.ts`:
  - ordem das seções e um `h1`;
  - destinos dos cards e links;
  - filtro e accordion pelo teclado;
  - barra superior e inferior conforme a largura;
  - âncora sem cobrir o título;
  - Contato ativo no fim da página;
  - sem rolagem horizontal em 320, 390, 768 e 1440 px;
  - alvos de toque ≥ 44 px;
  - axe sem violações sérias;
  - `mailto`;
  - movimento reduzido.
- Os testes da 0001 (menu compacto e tema) e da 0002 (marca na barra) saem. O teste do degradê do monograma passa a valer no rodapé.

## Decisões

1. **Esquema fixo por seção com tokens remapeados**, em vez de manter `next-themes` e um tema "forçado".
   - Descartada: forçar `class="dark"` e pintar as seções claras à mão, que duplicaria cores e quebraria os componentes de `ui/` nas seções claras.
   - A dependência `next-themes` continua por enquanto, porque `ui/sonner.tsx` a usa. Sem o provider, ela cai em `system` sem efeito visual.
2. **Prévias da Expertise em HTML**, em vez de imagens exportadas do Figma.
   - O texto fica real, nítido e legível por tecnologias assistivas, sem peso de imagem.
   - Descartada: PNGs do Figma, mais pesados e com texto inacessível.
3. **Accordion com o componente `ui/accordion`** (Radix, `type="multiple"`, primeiro item aberto).
   - Ele já entrega `aria-expanded`, Enter/Espaço e foco.
   - Descartado: botão próprio com `<details>`, que tem estilização e animação piores.
4. **Filtro como grupo de botões com `aria-pressed`** e anúncio em região `aria-live="polite"` ("2 projetos autorais").
   - Descartado: abas (`role="tablist"`), cuja semântica implica painéis separados.
5. **P&B nas imagens** com `filter: grayscale(1)` só em `@media (hover: hover) and (pointer: fine)`. A cor volta com `group-hover` e `group-focus-visible`. Em toque, a imagem fica colorida.
6. **Nome do hero com `mix-blend-mode: difference`** em texto real dentro do `h1`.
   - O nome fica legível por leitores de tela e, sem suporte a blend, aparece em branco sólido.
7. **Seção ativa:** `IntersectionObserver` com margem que considera a barra. No fim do documento, a seção ativa é Contato. O link ativo recebe `aria-current="true"`.
8. **Animações de entrada (GSAP/Framer Motion) removidas da página inicial.**
   - Ficam só as transições de hover, foco e expansão.
   - Isso reduz o JavaScript inicial e simplifica a regra de movimento reduzido. As dependências seguem instaladas por enquanto.

## Decisões caras de reverter

- A remoção do tema claro/escuro e das seções Sobre e Certificados (conteúdo e testes).
- O formato do conteúdo centralizado, que vai servir também ao case study da spec seguinte.

## Ajustes feitos durante a implementação

- **Rodapé separado:** `Footer.tsx` continua como componente próprio, logo após o Contato e com a mesma superfície escura. Assim fica um único `contentinfo` no nível da página, em vez de um rodapé aninhado na seção.
- **Retrato em `public/hero/portrait.webp`:** o arquivo saiu de `src/assets` e é pré-carregado no `index.html`. A medição mostrou 1,7 s de atraso para o navegador descobrir a imagem do LCP, porque ela só aparecia depois que o JavaScript renderizava a SPA.
- **Fontes sem bloquear a renderização:** `preload` com troca no `onload`, mais `noscript`. O `@import` bloqueava a renderização por cerca de 1 s.
- **`App` sem providers de toast, tooltip e React Query:** nada na página os usava. O bundle principal caiu de 103 KB para 64 KB gzip.
- **Critério de imagens reescrito na spec:** o navegador antecipa imagens preguiçosas a cerca de 1.250 px da tela. O critério verificável passou a ser "preguiçosas e sem competir com o retrato".
- **Página 404 ajustada:** o link laranja em fundo claro reprovava o contraste. Ela passou para a superfície escura com o botão primário.
- **Contagens da barra em `<span>`:** o preflight do Tailwind zera o `line-height` de `<sup>`, e a caixa ficava com altura 0.
- **Accordion com `@radix-ui/react-accordion` direto**, em vez de `ui/accordion`, porque o gatilho é próprio (índice, título e +/−). A semântica é a mesma.
- **Seção ativa por rolagem com `requestAnimationFrame` e `ResizeObserver`**, em vez de `IntersectionObserver`. A regra pura precisa das posições exatas para tratar o fim da página.
- **Seções continuam sob demanda.** Importá-las direto piorou o LCP para 2,4–3,3 s. A âncora direta é resolvida rolando até o `hash` depois que os chunks montam.
- **Foco sob a barra:** fica só com `scroll-padding` em CSS. Um ajuste em JavaScript foi testado e descartado, porque a intermitência vinha da troca tardia de fonte, não da rolagem de foco.

## Riscos

- **LCP do retrato:** é a maior imagem da dobra. O retrato vai em WebP, com tamanho explícito, `fetchpriority="high"` e sem lazy.
- **`mix-blend-mode`** pode confundir o cálculo de contraste do axe. Se acusar, o texto usa cor sólida em `forced-colors` e a checagem considera o branco.
- **Barra fixa sobre âncoras:** `scroll-margin-top` igual à altura da barra no desktop e zero no celular, onde a barra fica embaixo.
- **Baseline de desempenho:** medir o Lighthouse mobile da versão atual antes da troca, para comparação em `verification.md`.
