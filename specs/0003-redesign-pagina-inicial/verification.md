# Verificação da spec 0003

Branch `feat/redesign-pagina-inicial`. Verificação local em Windows: Chromium headless do Playwright 1.65, build de produção servido por `vite preview`. Não inclui o preview da Vercel (ver Limites).

## Comandos e resultados

| Comando | Resultado |
|---|---|
| `node .agents/scripts/gates.mjs --skip-install` | lint ✔, typecheck ✔, test ✔ (6 arquivos, **23 testes**), build ✔, e2e ✔ (**55 passaram**, 1 pulado de propósito: o teste de alvos de toque só roda no projeto mobile) |
| `npx playwright test` (2 execuções extras seguidas) | 55 passaram nas duas, sem intermitência |
| Red dos testes de unidade e de componente | Módulos inexistentes (`portfolio`, `filter-projects`, `active-section`, `Expertise`) e `Projects` antigo sem filtro: 4 testes de componente e 3 arquivos falhando antes da implementação |
| Red do E2E novo contra `main` (worktree temporária) | **38 de 41 falharam**. Passaram só a rota 404 e itens que já existiam |
| `npx lhci collect --url=http://localhost:4173/` (mobile, 3 execuções) | ver a tabela abaixo |

### Lighthouse mobile em `/`, 3 execuções cada

| Versão | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `main` (baseline) | 0,76–0,77 | 0,98 | 1,0 | 1,0 | 4,4–4,6 s | 0–0,045 | 10–30 ms |
| Branch | **0,99** | **1,0** | 1,0 | 1,0 | **2,0–2,1 s** | 0–0,008 | 40–60 ms |

A primeira medição caiu em `/index.html`, que a SPA trata como 404, e foi descartada. As duas tabelas acima medem a home.

### Lighthouse mobile em produção

Medido após o merge do PR #8 (`228b9da`), em https://samialuvanicedev.vercel.app/. O preview do PR exigia login na Vercel e não pôde ser medido sem credenciais. Comando: `npx lhci collect --url=https://samialuvanicedev.vercel.app/`, configuração mobile padrão, 6 execuções.

| Execução | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| 1ª (cache frio) | 0,89 | 1,0 | 1,0 | 1,0 | 3,0 s | 0 | 0 ms |
| 2ª a 6ª | **0,96–0,99** | **1,0** | 1,0 | 1,0 | **1,6–1,8 s** | 0–0,007 | 20–210 ms |

- **Por que a 1ª ficou abaixo da meta:**
  - O retrato levou 360 ms para baixar, contra 63–71 ms nas demais. A fase de carga do LCP foi de 1,1 s, contra 0,2 s.
  - Foi a primeira requisição depois do deploy, antes de a imagem estar no cache da borda da Vercel. Nas seguintes, o cabeçalho veio como `X-Vercel-Cache: HIT`.
- **Conclusão:** com cache da borda, o critério é atendido (Performance ≥ 90, Acessibilidade ≥ 95, LCP ≤ 2,5 s, CLS ≤ 0,1).
- **Melhoria futura (fora desta spec):** os arquivos de `public/hero/` e `public/projects/` saem com `Cache-Control: public, max-age=0, must-revalidate`, porque `vercel.json` só dá cache longo a `/assets/`. Com isso, o navegador revalida a imagem a cada visita.

### `/verify` antes do commit

- **Portões:** `node .agents/scripts/gates.mjs --skip-install` no estado final passou: lint, typecheck, 23 testes unitários, build e 55 E2E (1 pulado de propósito).
- **Harness e CI:** nada em `.agents/`, `.github/` nem `harness.yaml` mudou, então os testes do harness e o `diagnose` não se aplicam.
- **Segurança:**
  - Sem segredos no código.
  - Sem entrada externa nem `innerHTML` novo; o `ui/chart.tsx` do shadcn não mudou.
  - Todos os `target="_blank"` têm `rel="noopener noreferrer"`.
  - O único endereço é o `mailto:` montado por `src/lib/contact.ts`, já testado.

## Critérios de aceite

| Critério | Situação | Evidência |
|---|---|---|
| Ordem das seções e fundos alternados, com um tom escuro único | Passou | E2E "seções na ordem certa…": ordem no DOM e posição, fundos `rgb(22, 22, 24)` nas escuras |
| Um `h1` com "Sâmia Luvanice", legível independentemente do blend | Passou | E2E: nome acessível do `h1`. QA: em `forced-colors`, o blend vira `normal` |
| Sobre, Certificados e tema removidos, sem links | Passou | E2E "seções Sobre e Certificados…" |
| "Vamos conversar" leva ao Contato; links do hero no desktop e tablet | Passou | E2E do hero (desktop e mobile) e de 768 px |
| Quatro cards com categoria, título, duas tags e sem descrição | Passou | Teste de componente (sem `<p>`) e E2E |
| Card abre o destino em nova aba, por clique e teclado; destinos respondem | Passou, com limite | E2E (`href` e `target`). QA: clique, Enter e toque abriram os destinos; as 4 URLs e o GitHub responderam 200. O LinkedIn bloqueia robôs (999/405) e não foi confirmado automaticamente |
| P&B com ponteiro, cor no hover/foco, cor em toque | Passou | E2E (filtro computado). QA em `hover:none` e `pointer:coarse` |
| Filtro Autorais/Comerciais/Todos com anúncio | Passou | Teste de componente (`aria-pressed`, `role=status`) e E2E |
| "Mais no GitHub" | Passou | Teste de componente e E2E |
| Expertise: primeiro aberto, vários abertos, Enter/Espaço, `aria-expanded` | Passou | Testes de componente e E2E |
| Cada item mostra as tecnologias e a prévia | Passou | E2E "cada item da Expertise…" (5 itens) |
| Experiência só com Sound House (Atual) e Governo do Ceará | Passou | E2E |
| "Iniciar conversa" abre e-mail e o endereço aparece | Passou | E2E (`mailto:` com assunto) |
| Barra superior em 1440 com [04] [05] [02]; inferior em 768/390/320 com 4 links | Passou | E2E (1440 forçado no desktop; 768; Pixel 7). QA: troca exata em 1023 → 1024 |
| Links e "Ver projetos" levam à seção sem cobrir o título | Passou | E2E para os quatro destinos e "Ver projetos". QA em 6 larguras |
| Seção ativa visual e para tecnologias assistivas; Contato no fim | Passou | E2E (`aria-current`). Depois da QA: linha de leitura a 35% da altura em todas as larguras e nova medição com `ResizeObserver` |
| Sem rolagem horizontal nem conteúdo sob a barra em 320/360/390/768/1440 | Passou | E2E, incluindo os links da barra dentro da viewport e sem corte |
| Alvos de toque ≥ 44 × 44 no celular | Passou | E2E (Pixel 7) e QA em todas as larguras |
| Contraste AA, teclado e foco visível | Passou | axe sem violações sérias (desktop e mobile, com a página carregada inteira). Lighthouse Acessibilidade 1,0. QA: ordem de Tab completa e `:focus-visible` em todos os itens |
| Retrato e screenshots com `alt`; marcas d'água ocultas | Passou | E2E |
| Movimento reduzido sem deslocamentos animados | Passou | E2E: o accordion não anima com `reduce`. QA: âncora sem rolagem suave e card sem `transform` |
| SEO: title, description e OG como Full Stack Developer | Passou | E2E dos metadados. Lighthouse SEO 1,0 |
| Lighthouse mobile ≥ 90 / ≥ 95, LCP ≤ 2,5 s, CLS ≤ 0,1 | Passou | Local: 0,99 / 1,0 / 2,0 s. Produção: 0,96–0,99 / 1,0 / 1,6–1,8 s em 5 de 6 execuções; a 1ª, com cache frio, deu 0,89 e 3,0 s (ver "Lighthouse mobile em produção") |
| Imagens fora da dobra preguiçosas, sem competir com o retrato | Passou | E2E: retrato com `fetchpriority=high` e primeiro pedido de imagem; demais com `loading=lazy` |
| Portões passam | Passou | Tabela de comandos |

## Achados da revisão e da QA

| Achado | Tratamento |
|---|---|
| D1/R1: barra inferior estourava abaixo de ~382 px ("Contato" cortado) | Barra com largura total e quatro colunas iguais. Novo E2E em 320 e 360 px confere cada link dentro da tela e sem corte |
| D2: foco de teclado sob a barra | `scroll-padding` no `html`. E2E com Tab garante o critério 2.4.11 (AA). Ver Limites |
| D3/R3: accordion e hover animando com movimento reduzido | `motion-reduce:!animate-none` e `motion-reduce:transition-none`. Novo E2E |
| R4: contraste da barra superior sobre seções claras | Opacidade 0,62 → 0,9 |
| D4/R7: atraso da seção ativa; sem nova medição após a montagem | Linha a 35% e `ResizeObserver` |
| D5/D6: cores forçadas | Ativo sublinhado e com contorno; marcas d'água ocultas; botões com borda transparente. Novo E2E |
| R2: degradê no nome do rodapé | Só no "SL". E2E confere o nome sem degradê |
| R6: âncora direta com placeholders | Rolagem até o `hash` depois que os chunks montam. Novo E2E. A importação direta das seções foi testada e descartada: piorou o LCP para 2,4–3,3 s |
| R8: `fetchPriority` no React 18 | Atributo minúsculo via spread |
| R9: laranja fora de ações | Categorias em magenta e ciano; prévias sem laranja |
| R10: código morto | gsap, @gsap/react, framer-motion e react-icons desinstalados; fotos antigas, ícones e CSS sem uso removidos |
| R11: rodapé sem aviso de nova aba; contorno no hero | Aviso `sr-only` e `focus:outline-none` no `#inicio` |
| R11: nome longo dos cards | **Mantido**: com `aria-labelledby`, o axe acusou `label-content-name-mismatch` (WCAG 2.5.3), porque o nome precisa conter o texto visível |
| Página 404 com contraste insuficiente | Superfície escura e botão primário |

## Limites

- **Preview da Vercel não verificado:** ele exige login. A medição foi feita em produção, depois do merge. O `lighthouserc.json` do CI continua com preset desktop e limites mais baixos (piso, não a meta da spec).
- **LinkedIn não confirmado** automaticamente (bloqueio anti-robô); conferir no navegador.
- **Foco sob a barra inferior:** com `scroll-padding`, o item focado costuma ficar todo visível. Em cerca de 1 a cada 5 execuções, o Chrome ignora o padding e o item fica parcialmente visível (20 de 44 px em "Todos"). Isso atende ao WCAG 2.4.11 (AA, meta da spec), mas não ao 2.4.12 (AAA).
- **Fontes do Google** carregam sem bloquear. Pode haver troca de fonte visível em rede lenta (CLS medido ≤ 0,008). Hospedar as fontes no próprio site fica como melhoria futura.
- **Testes E2E** buscam as fontes no Google (rede externa), como antes desta mudança.
- **Não testado:** leitor de tela real, dispositivo de toque físico e alto contraste real do Windows (usada a emulação `forcedColors` do Chromium).
- **Pendências de conteúdo** (spec, "Perguntas em aberto"): Lopes Tech, autoria, "2+ anos" e currículo atualizado.
- `og:image` continua pendente (`docs/architecture.md`).
- **Documentação:**
  - `node .agents/scripts/docs-impact.mjs` listou `docs/architecture.md` e `README.md`. Os dois foram atualizados pelo `doc-sync-onboarding`, junto com o `docs/LEARNINGS.md`.
  - O script segue mostrando `README.md` como "revisar" por um defeito próprio, fora do escopo desta spec. `git()` em `.agents/scripts/lib.mjs` aplica `.trim()` à saída, e a primeira linha do `git status --porcelain` perde o espaço inicial: `slice(3)` lê `EADME.md`.
