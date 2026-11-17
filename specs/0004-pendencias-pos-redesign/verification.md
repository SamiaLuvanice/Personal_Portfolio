# Verificação — 0004 Pendências do redesign

Branch `feat/pendencias-pos-redesign`, sobre `main` em `29b4810`. Medições locais em 17/11/2026, no Windows 11 da autora.

## Comandos

| Comando | Resultado |
|---|---|
| `npx playwright test -g "spec 0004"` antes da implementação (Red) | 4 falhas pelo motivo esperado: requisições a `fonts.googleapis.com`/`fonts.gstatic.com` e ausência de `og:image` |
| `node .agents/scripts/gates.mjs --skip-install` | lint ✔, typecheck ✔, 23 testes unitários ✔, build ✔, E2E: 59 passaram e 1 foi pulado (intencional, só para celular, já existia) |
| `npx playwright test -g "cards abrem\|spec 0004\|foco de teclado" --repeat-each=5` | 40 de 40 passaram |
| `node scripts/generate-og-image.mjs` | `public/og-image.jpg`: 1200 × 630, 48 KB, conferido visualmente |
| `npx lhci collect --url=http://localhost:4173/ --numberOfRuns=3` (mobile, simulado) | ver a tabela abaixo |
| O mesmo, com `--settings.throttlingMethod=devtools` | ver a tabela abaixo |

### Lighthouse mobile local, build de produção (`vite preview`)

Cada linha resume 3 execuções seguidas da `main` (`29b4810`) e da branch, na mesma máquina.

| Throttling | Versão | Performance | Acessibilidade | LCP | FCP | CLS |
|---|---|---|---|---|---|---|
| Simulado (padrão) | `main` | 0,97–0,99 | 1,0 | 2,07–2,44 s | 1,48–1,57 s | 0,007–0,008 |
| Simulado (padrão) | branch | 0,95–0,97 | 1,0 | 2,25–2,57 s | 1,97–2,02 s | 0,008 |
| Real (`devtools`) | `main` | 0,64–0,71 | — | 3,10–3,45 s | 3,10–3,45 s | 0,008 |
| Real (`devtools`) | branch | 0,79–0,93 | — | 2,40–2,74 s | 2,40–2,74 s | 0,008 |

**Leitura dos números:**
- No modo simulado (Lantern), as requisições iniciadas antes do primeiro paint observado entram no grafo do FCP.
- Sem rede real, o evento `load` dispara muito cedo, então as fontes próprias (56 KB) começam por volta de 125 ms e entram nesse grafo. As fontes do Google começavam por volta de 500 ms e ficavam fora.
- Com throttling real, as fontes da branch começam depois do retrato (cerca de 2,5 s), e a branch é melhor que a `main` em todas as execuções.
- O critério da spec usa o modo simulado e é conferido em produção depois do merge, como foi feito na 0003.

## Critérios de aceite

| Critério | Estado | Evidência |
|---|---|---|
| Metadados de imagem grande; 1200 × 630, ≤ 300 KB, com alt; retrato, nome e cargo legíveis | Passou | E2E "prévia de link…" e imagem conferida |
| Imagem de prévia 200 em produção; validador mostra a prévia | Passou | `curl -I`: 200, `image/jpeg`, 48 694 bytes. O Post Inspector do LinkedIn mostra a imagem e o título "Sâmia Luvanice \| Full Stack Developer" (ver "Produção") |
| Retrato e capturas com cache de ≥ 7 dias; `/assets/` imutável | Passou | `curl -I` em produção: `max-age=604800, stale-while-revalidate=86400` no retrato, numa captura e na prévia; `max-age=31536000, immutable` em `/assets/` |
| Nenhuma requisição a fontes de terceiros; mesmas famílias | Passou | E2E "fontes vêm do próprio site…" (desktop e mobile) |
| Lighthouse mobile ≥ 90 / ≥ 95, LCP ≤ 2,5 s, CLS ≤ 0,1 | Passou | Produção, 6 execuções: 0,94–0,99 / 1,0 / 1,76–1,87 s / 0. Local simulado: 0,95–0,97 / 1,0 / 2,25–2,57 s / 0,008 (ver "Produção") |
| E2E sem serviço de fontes de terceiros | Passou | Nenhum teste depende mais de `fonts.googleapis.com` |
| Perguntas da 0003 decididas | Passou | `specs/0003-redesign-pagina-inicial/spec.md`, "Perguntas em aberto" |
| LinkedIn abre o perfil correto | Passou | Aberto no Chrome da autora em 17/11/2026: perfil "Sâmia Luvanice · Full Stack Developer", URL pública `linkedin.com/in/samialuvanice` |
| Portões verdes | Passou | Tabela de comandos |

## Achados durante a implementação

| Achado | Tratamento |
|---|---|
| O teste "cards abrem cada projeto…" falhou uma vez no mobile. `evaluateAll` não espera a lista montar ou o filtro atualizar | `expect.poll` nas 4 comparações (commit próprio). 40 de 40 em repetição |
| O import direto das fontes piorou o FCP e o LCP simulados | Import dinâmico depois do `load` (ver `plan.md`) |
| `document.fonts.check` devolve `true` para família inexistente | O E2E exige faces com `status === "loaded"` |

## Revisão independente (`code-reviewer`)

Nenhum achado bloqueante.

| Achado | Tratamento |
|---|---|
| A espera de fonte do teste WCAG 2.4.11 usava uma função `async`. A Promise é truthy e a espera terminava na hora | Função síncrona |
| `import('./fonts')` sem tratamento de rejeição (chunk antigo depois de um deploy) | `.catch(() => {})`; a fonte do sistema fica como fallback |
| O E2E só barrava o Google pelo nome | Toda requisição do tipo `font` tem de ser da mesma origem, e pelo menos uma precisa acontecer |
| O E2E não conferia as dimensões da imagem | `naturalWidth`/`naturalHeight` = 1200 × 630 |
| Script da prévia: espera por quantidade de faces, `decode()` de imagens preguiçosas, servidor aberto se o launch falhar, caminhos relativos ao diretório atual | Exige as duas famílias pelo nome, decodifica só o retrato, o launch fica dentro do `try` e os caminhos saem de `import.meta.url`. Rodado da raiz e de outra pasta: mesma imagem, sem diff |
| Nome do hero desenhado com a fonte do sistema antes da troca | Observado: em 390 px, com os `.woff2` bloqueados, o "E" de "LUVANICE" fica cortado na borda até a fonte carregar. A `main` já tinha esse comportamento (fontes do Google depois do `load`). A correção é uma fonte de fallback com métricas ajustadas, que mexe em layout e está fora desta spec. Fica como pendência (ver Limites) |
| Regra `/assets/(.*)` aplica `immutable` ao `index.html` servido no lugar de um asset que não existe mais | Problema anterior a esta spec. Fica como pendência |

Depois das correções, os portões passaram de novo: lint, typecheck, 23 testes unitários, build e E2E (59 passaram e 1 foi pulado, intencional).

## Produção

Medido em 17/11/2026, depois do merge do PR #11 (`f8e9cbc`), em https://samialuvanicedev.vercel.app/.

| Verificação | Resultado |
|---|---|
| `curl -I /og-image.jpg` | 200, `image/jpeg`, 48 694 bytes, `Cache-Control: public, max-age=604800, stale-while-revalidate=86400` |
| `curl -I /hero/portrait.webp` e `/projects/bestprice.webp` | 200, mesma regra de cache de 7 dias |
| `curl -I /assets/index-*.js` | `Cache-Control: public, max-age=31536000, immutable` |
| HTML publicado | metadados `og:image*`, `twitter:card=summary_large_image` e `twitter:image*` presentes; nenhuma referência a `fonts.googleapis`/`fonts.gstatic` |
| Post Inspector do LinkedIn | a prévia mostra a imagem do hero e o título "Sâmia Luvanice \| Full Stack Developer" |
| `npx lhci collect --url=https://samialuvanicedev.vercel.app/ --numberOfRuns=6` (mobile padrão) | tabela abaixo |

| Execução | Performance | Acessibilidade | SEO | LCP | FCP | CLS |
|---|---|---|---|---|---|---|
| 1ª | 0,95 | 1,0 | 1,0 | 1,86 s | 1,59 s | 0 |
| 2ª | 0,99 | 1,0 | 1,0 | 1,76 s | 1,63 s | 0 |
| 3ª | 0,96 | 1,0 | 1,0 | 1,79 s | 1,62 s | 0 |
| 4ª | 0,94 | 1,0 | 1,0 | 1,83 s | 1,66 s | 0 |
| 5ª | 0,98 | 1,0 | 1,0 | 1,87 s | 1,70 s | 0 |
| 6ª | 0,98 | 1,0 | 1,0 | 1,87 s | 1,65 s | 0 |

Todas as 6 execuções atendem à meta. A primeira execução depois do deploy, que na 0003 deu 3,0 s, desta vez ficou em 1,86 s.

## Limites

- **Preview da Vercel não verificado:** ele exige login. As medições de produção foram feitas depois do merge (ver "Produção").
- **Troca de fonte visível:** com fontes depois do `load`, o texto aparece primeiro na fonte do sistema e troca depois (CLS medido 0,008). É o mesmo comportamento das fontes do Google. No celular (390 px), o nome do hero fica cortado na borda direita até a troca. A pendência é uma fonte de fallback com métricas ajustadas.
- **`/assets/*` inexistente:** recebe o `index.html` pelo rewrite, com cache `immutable`. O problema é anterior a esta spec.
- **`nginx.conf` (Docker):** continua sem cabeçalhos de cache.
- **Redes sociais guardam a prévia em cache:** pode ser preciso forçar a releitura no Post Inspector do LinkedIn.
- **Currículo:** fora de escopo, aguardando o PDF novo da autora.
