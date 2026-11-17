# Verificação — 0006 Hero Liquid Aurora

Branch `feat/hero-liquid-aurora`, novembro de 2026, nesta máquina Windows.

## Portões

`node .agents/scripts/gates.mjs --skip-install`: lint, typecheck, test, build e e2e verdes.

- **Vitest:** 37 testes em 8 arquivos. Os testes novos do hero (`src/components/Hero.test.tsx`) e da lib (`src/lib/aurora.test.ts`) falharam pelo motivo esperado antes da implementação (módulo inexistente, `smoothingFactor is not a function`).
- **Playwright:** 72 testes passando e 4 pulados por dispositivo (testes só de desktop ou só de toque).
- **Reexecução:** a suíte E2E completa rodou mais 5 vezes depois das correções. Houve uma falha isolada em "primeira imagem pedida", que não reproduziu em 3 execuções seguidas. O teste novo foi endurecido para comparar a ordem retrato → aurora, em vez de exigir que o retrato seja a primeira imagem de todas (o favicon também é imagem).

## Critérios de aceite

| Critério | Resultado | Evidência |
| --- | --- | --- |
| Conteúdo do hero em 320/390/768/1280 px | Passou | E2E "hero leva a Projetos e ao Contato…" (desktop e Pixel 7: textos, destinos, quatro links, áreas ≥ 44 px) + "no celular, o nome não cobre o rosto…" (320 e 390) + unitários do `Hero` |
| Retrato novo, prioritário; aurora só depois do carregamento | Passou | E2E "imagens fora da dobra…" (retrato é a primeira imagem, sem `loading=lazy`) e "a aurora só é pedida depois do carregamento…". O retrato tem 720 × 958 px, WebP com alfa, 32 KB, e nome novo (`portrait-2026.webp`) por causa do cache de 7 dias em `/hero/*` |
| Revelação com mouse: centro ≤ 40 px em 1 s; apaga em 1,5 s | Passou | E2E "com mouse, a revelação segue o ponteiro…". Unitário com relógio simulado: um quadro depois o centro está entre os dois pontos; após 59 quadros, a < 1 px. Ressalva medida: no headless o rAF roda a cerca de 20 fps, e a suavização fixa por quadro não convergia; corrigido com suavização por tempo (`smoothingFactor`) |
| P&B fora da revelação; raio ≤ metade da altura | Passou | Mesmo E2E: sem revelação, opacidade das camadas de cor 0 e `grayscale(1)` no retrato; raio medido ≤ altura/2 |
| Movimento reduzido | Passou | E2E: nenhuma animação em execução no hero e `data-reveal` continua `false` ao mover o ponteiro |
| Toque: foco ambiente muda em 3 s, mais discreto | Passou | E2E (Pixel 7): foco A sobe e B desce entre duas leituras com 3 s; todas as opacidades < 1 |
| Animação pausa fora da tela | Passou | E2E: `data-paused="true"` depois de rolar até o fim, e 0 animações rodando |
| Rosto livre no celular | Passou | E2E em 320 e 390 px: o fim do nome fica acima do topo da foto; nada passa da largura. Capturas em 320/390/768 |
| Camadas decorativas ocultas | Passou | Unitário: só uma `img` acessível; aurora com `aria-hidden`; cópias da foto com `alt=""` e `aria-hidden` (E2E de texto alternativo) |
| Acessibilidade e contraste | Passou (após correções do QA) | axe sem violações sérias (E2E da home, desktop e mobile). Método do QA: cor computada do texto contra o pixel de fundo mais claro sob os glifos, numa captura com o texto transparente. **Revelação sobre o parágrafo, grade de 18 posições a 1440 px:** pior caso 5,82:1. **Foco ambiente no Pixel 7, 10,5 s:** pior caso 5,73:1. **Sem revelação, de 320 a 1440 px:** parágrafo ≥ 6,05:1 e "Full Stack Developer" ≥ 3,74:1 (texto grande). **Contorno de "SÂMIA":** 7,95–9,85:1. Histórico: a 1ª medição deu 3,42:1 com o cinza "muted". O QA achou 4,29–4,42:1 nos piores pontos e 1,43:1 entre 1024 e cerca de 1270 px, com a foto sob o texto. Correções: texto em `hsl(280 15% 88%)`, halo escuro suave nos textos da apresentação e foto posicionada com distância mínima do bloco de texto no desktop |
| Cores forçadas | Passou | E2E: depois de `data-motion="on"`, aurora e cópias coloridas ocultas; as duas linhas do nome com a cor de `CanvasText` e contorno 0 |
| Spec 0005 (nome com a fonte do sistema) | Passou | E2E existente da 0005, sem mudança |
| Lighthouse mobile ≥ 90 / ≥ 95, LCP ≤ 2,5 s, CLS ≤ 0,1 | **Pendente (produção)** | Ver "Lighthouse" abaixo. Acessibilidade 100, Boas práticas 100, SEO 100 e CLS 0 em todas as execuções locais |
| Portões verdes | Passou | Acima |

## Lighthouse

As medições locais desta máquina são muito ruidosas. Execuções idênticas da `main` variaram de 63 a 94 em Performance. Por isso a comparação foi feita com a `main` e o branch servidos lado a lado (`vite preview`) e intercalados, 5 execuções de cada, mobile padrão.

| Rodada | `main` Perf (mediana) | Branch Perf (mediana) | `main` TBT | Branch TBT | `main` LCP | Branch LCP |
| --- | --- | --- | --- | --- | --- | --- |
| Antes das otimizações | 91 | 72 | 281 ms | 862 ms | 2,61 s | 2,93 s |
| Final | 65 (surto de ruído) | 86 | 1954 ms | 328 ms | 2,70 s | 2,75 s |
| Rodada anterior estável | 91 | 89 | 250 ms | 226 ms | 2,35 s | 2,78 s |

**O que causou a regressão e como foi resolvida.** Identificado por bissecção em traces do Lighthouse e do Chrome com CPU 4× mais lenta:

- **Gradientes e máscaras de tela inteira:** gradientes de meia tela, faixas em SVG com `feGaussianBlur` e máscaras de tela inteira, rasterizados por software, geravam uma tarefa de 1–1,5 s na thread principal. Solução: aurora pré-renderizada em WebPs de 160 × 100, máscaras já recortadas no modo ambiente e decoração só depois do carregamento.
- **Animação de variáveis CSS:** animar `--mx/--my` registradas com `@property` recalculava o estilo da seção inteira a cada quadro. Solução: o foco ambiente virou alternância de opacidade entre dois focos fixos.
- **Máscara no contêiner da foto:** com filhos animados, era recomposta a cada quadro. Solução: a máscara passou para cada imagem, estática.

**Limite.** O LCP simulado local fica perto de 2,7 s nos dois builds da mesma rodada, porque esta máquina está mais lenta. No trace observado, o LCP coincide com o FCP nos dois. O critério só se fecha com a medição em produção, porque o preview da Vercel exige login, como já registrado nas specs 0003 e 0005.

## QA (agente `qa`)

Os scripts (Playwright) e as capturas ficaram no rascunho da sessão, fora do repositório.

1. **Revelação com mouse a 1440 × 900:** passou.
   - Sem ponteiro: croma médio do hero 2,7, e 0 no rosto.
   - Ponteiro em (900, 300): centro a 0 px dele, raio 0,34 da altura, croma 102 perto do ponteiro e cerca de 2–6 longe dele.
   - Ao sair: opacidade 0 em 1,18 s.
   - Ressalva: a intensidade da cor depende de haver manchas coloridas sob o ponteiro, como no Figma.
2. **Toque (Pixel 7):** passou. O centroide da cor muda entre capturas de 3 s em 3 s, a área colorida não passa de 22 % e há 7 animações em execução.
3. **Movimento reduzido:** passou. Nenhuma animação, conteúdo visível de imediato e capturas com 3 s de diferença idênticas byte a byte.
4. **Cores forçadas (emulação do Chromium):** passou. Aurora e cópias ocultas, nome em `CanvasText` e contorno 0.
5. **Larguras de 320 a 1440 px:** passou. Sem rolagem horizontal, nome acima da foto abaixo de 1024 px, alvos ≥ 44 px, ordem de Tab lógica e foco visível.
6. **Contraste:** falhou na 1ª rodada (ver tabela). Corrigido e remedido com os mesmos scripts do QA.

Observação fora do escopo: em 1024 px a barra de navegação superior quebra o selo e "Ver projetos" em duas linhas. A navbar não foi alterada nesta spec.

## Revisão independente

Agente `code-reviewer`: nenhum bloqueio. Itens tratados:

- **IntersectionObserver:** passou a usar a entrada mais recente.
- **Hash malformado (`#%`):** não derruba mais a página.
- **Realinhamento da âncora:** usa `behavior: "instant"`, para quando a pessoa clica ou arrasta a barra (`pointerdown`), e trata a falha de chunk.
- **E2E de cores forçadas:** agora verifica a cor do sistema no nome e espera as camadas existirem.
- **Teste da revelação:** usa relógio simulado e exercita a suavização.
- **Código morto e nomes:** removido o padrão de suavização sem uso, os exports desnecessários deixaram de ser exportados, `FOCUS_RING` renomeado e o hook movido para `use-hero-aurora.ts`.
- **Comentários:** fonte do nome, exceção da máscara no modo ponteiro e calibração dos focos para o celular.

Ficaram como considerações, sem ação:
- **Rolagem com o ponteiro parado:** não reposiciona a revelação até o próximo movimento.
- **Teste de toque:** depende do relógio de parede, com folga de meio ciclo de 6 s.

## Fora da spec, corrigido junto

`src/pages/Index.tsx`: o realinhamento até a âncora esperava dois quadros fixos depois de carregar os chunks. Com o hero novo, o E2E "em cores forçadas… seção ativa" no Pixel 7 falhava 1 vez em 4, e passava 8 de 8 na `main`. Reproduzido: a rolagem parava na posição em que a Expertise estava enquanto Projetos ainda era um espaço reservado. Depois da correção, passou 54 de 54 com repetição.

## Pendências

- **Lighthouse mobile em produção** depois do merge (critério ainda aberto).
- **`public/og-image.jpg`** ainda mostra o hero antigo. Regenerar exige nome novo por causa do cache; fica para uma tarefa à parte.
