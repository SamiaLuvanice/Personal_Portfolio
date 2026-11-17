# Verificação — 0005 Nome do hero inteiro enquanto a fonte carrega

Branch `fix/fallback-fonte-hero`. Medições locais em 17/11/2026, no Chromium do Playwright, Windows 11.

## Comandos

| Comando | Resultado |
|---|---|
| `npx playwright test -g "spec 0005" --project=desktop` antes da correção (Red) | Falhou pelo motivo esperado: em 320 px, a linha do nome ia até 332 px, e o limite era 300 |
| O mesmo, com o ajuste pela média de "SÂMIA LUVANICE" (91,44%) | Falhou: 304 px. Ajuste refeito pela linha mais longa (ver `plan.md`) |
| O mesmo, com o valor final | Passou |
| `node .agents/scripts/gates.mjs --skip-install` | lint ✔, typecheck ✔, 23 testes unitários ✔, build ✔, E2E: 60 passaram e 2 foram pulados (intencionais: um só para celular, que já existia, e o teste novo, que define as larguras e roda no projeto desktop) |
| Screenshots com a fonte carregada, `origin/main` × branch, em 390 e 1280 px: página inteira e cada item do acordeão da Expertise aberto | Idênticos byte a byte (12 de 12) em 2 de 3 rodadas. A primeira rodada divergiu em 390 px, e o diff de pixels das rodadas seguintes deu 0. Provável instabilidade de captura (animação ou carregamento); a causa não foi confirmada |
| `npx lhci collect --url=http://localhost:4173/ --numberOfRuns=3` (mobile, simulado) | 0,95 / 1,0 / LCP 2,37–2,65 s / CLS 0,001. Na 0004, no mesmo modo: CLS 0,008 |

### Largura do nome com a fonte do sistema × fonte carregada

Medida pelo texto (`Range`). A fonte carregada foi identificada pelo nome exato "Space Grotesk Variable".

| Tela | Fallback (SÂMIA + LUVANICE) | Carregada | Diferença | LUVANICE × limite do título |
|---|---|---|---|---|
| 320 px | 178,4 + 278,5 | 186,9 + 279,5 | −2,0% | 299,3 ≤ 300 |
| 360 px | 203,9 + 318,4 | 213,6 + 319,4 | −2,0% | 339,2 ≤ 340 |
| 390 px | 223,0 + 348,2 | 233,6 + 349,3 | −2,0% | 369,1 ≤ 370 |
| 768 px | 241,9 + 382,2 | 255,4 + 383,5 | −2,3% | 705,8 ≤ 728 |
| 1024 px | 331,8 + 524,5 | 350,4 + 526,2 | −2,3% | 953,6 ≤ 984 |
| 1280 px | 421,9 + 666,8 | 445,4 + 668,9 | −2,3% | 1201,4 ≤ 1240 |

## Critérios de aceite

| Critério | Estado | Evidência |
|---|---|---|
| Com as fontes bloqueadas, o nome cabe em 320–1280 px | Passou | E2E e tabela acima |
| Largura a até 5% da largura com a fonte carregada | Passou | De 2,0% a 2,3% (tabela) |
| Com a fonte carregada, a aparência não muda | Passou | Screenshots idênticos (ver Comandos) |
| Lighthouse mobile em produção ≥ 90 / ≥ 95, LCP ≤ 2,5 s, CLS ≤ 0,1 | Pendente | Depois do merge |
| Portões verdes | Passou | Tabela de comandos |

## Revisão independente (`code-reviewer`)

| Achado | Tratamento |
|---|---|
| **B1 (bloqueante):** a espera pela "fonte carregada" no E2E também aceitava as faces de fallback, cujo nome contém "Space Grotesk". O critério dos 5% podia comparar fallback com fallback | Espera pelo nome exato "Space Grotesk Variable". A tabela acima foi medida de novo do mesmo jeito |
| **S1:** o lado do fallback não confirmava o cenário | O E2E exige que a fonte do site não tenha carregado e que o fallback local do hero esteja em uso, com mensagem própria se faltar fonte local compatível |
| **S2:** folga de 0,3% calibrada só no Windows | O primeiro CI (Ubuntu, Liberation Sans) é a evidência. Se falhar em 320 px, a folga sobe para 1–1,5% |
| **S3:** caracteres fora do `unicode-range` do Fontsource ("→" na Expertise) passariam a usar a Arial ampliada mesmo com a fonte carregada | As faces de fallback repetem o `unicode-range` dos pacotes. A comparação visual inclui os itens abertos do acordeão |
| **S4:** o caminho da Roboto (Android) não é exercitado por nenhum teste | Registrado em Limites |
| **S5:** nomes `local()` corretos | Acrescentados os nomes PostScript da Liberation Sans |
| **S6:** spec sem versionamento e sem verificação | Este arquivo. A spec entra no commit de docs |

## Limites

- **Android não verificado:** a Roboto foi medida com o `.woff2` do Fontsource no Chromium de desktop. O nome `local("Roboto Bold")` não foi testado num Android real. No Android 12 ou mais novo, a Roboto do sistema é variável, e uma instância bold sem esse nome faria o hero cair no `sans-serif` sem ajuste, como antes desta spec.
- **Outras fontes do sistema** (por exemplo DejaVu Sans) seguem sem ajuste.
- **Lighthouse em produção:** pendente até o merge.
