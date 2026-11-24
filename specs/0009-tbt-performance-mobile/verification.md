# Verificação — 0009 Performance mobile estável acima de 90

Executado em 24/11/2026 nesta máquina Windows, com Chrome local. Builds comparados lado a lado:

- `main` (`b2d3fb4`), servido com `vite preview` na porta 4174;
- build final da branch `fix/tbt-performance-mobile`, servido com `vite preview` na porta 4177.

A máquina estava com carga de fundo (Docker e outras sessões). Por isso toda comparação é intercalada.

## Critérios de aceite

| Critério | Resultado | Evidência |
| --- | --- | --- |
| Conteúdo sem esperar rolagem (≤ 3 s após o `load`) | Passou | E2E "sem interação, as seções abaixo da dobra ficam completas em até 3 s…" verde no desktop (1,6 s) e no mobile (1,5 s) |
| Âncoras | Passou | E2E existentes de `/#projects`, `/#expertise`, `/#experience` e `/#contact` verdes. E2E novo: com o momento ocioso desligado, clicar em "Contato" monta as seções e deixa o título de Contato na tela, inclusive 500 ms depois. Sem o tratamento de `hashchange`, esse E2E falha ("element(s) not found") |
| Tarefas mais curtas (maior tarefa longa, 5 cargas, CPU 4x, −30%) | Passou, no limite | Mediana da maior tarefa longa: `main` **448 ms** e branch **312 ms** (−30,4%). Por carga: `main` 508, 403, 773, 448 e 404 ms; branch 312, 263, 697, 425 e 204 ms |
| Lighthouse lado a lado (9 execuções) | Passou | TBT: `main` **157 ms** e branch **81 ms** (−48%); a pior execução da branch (117 ms) ficou abaixo da melhor da `main` (136 ms). LCP: 2,52 s contra 2,41 s. Performance: 93 contra 95. Acessibilidade 100 e CLS 0 nos dois |
| Peso inicial (≤ +0,5 KB gzip) | Passou | `index-*.js` caiu de **66,16 KB** para **54,17 KB** gzip (−11,99 KB). O `tailwind-merge` foi para o chunk compartilhado das seções, que é baixado depois da primeira tela (de 0,24 para 7,00 KB gzip) |
| Nada muda para quem visita | Passou | Todos os E2E existentes verdes, sem mudar expectativas: 91 passaram e 7 foram pulados por dispositivo, como antes. Capturas de página inteira em 390 e 1280 px, depois de rolar e assentar, com movimento reduzido: **0 pixels diferentes** em relação à `main` |
| Página inexistente | Passou | `App.test.tsx`: `/nao-existe` mostra "404" e "Página não encontrada." com o link "Voltar ao início" para `/` |
| Meta em produção | **Pendente** | Só dá para verificar depois do merge e do deploy. Ver "Produção" abaixo |
| Portões verdes | Passou | `node .agents/scripts/gates.mjs --skip-install` depois da última mudança de código: lint, typecheck, build e E2E com 91 passados e 7 pulados. Os 60 testes de unidade (12 arquivos) passaram em 6 execuções seguidas (ver "Falha intermitente") |

## Diagnóstico

O diagnóstico está em `plan.md`. Medidas antes da mudança:

- **Produção (`b2d3fb4`), 3 execuções:** Performance 87, 96 e 98; TBT 416, 139 e 53 ms; LCP de cerca de 2,1 s.
- **Ruído:** o `benchmarkIndex` variou de 763 a 1333 no mesmo dia.

## Abordagens testadas e descartadas

- **`startTransition` na renderização inicial.** Dividia o script inicial em fatias, mas deixava o `load` disparar antes de o hero existir no DOM. O E2E do hero (spec 0006) falhou com `#inicio` ainda ausente. Descartado.
- **Remover as faces de fallback `local()`.** Sem efeito mensurável no primeiro layout. Hipótese descartada; a estratégia de fontes ficou como estava.
- **Primeiro layout lento.** Custa centenas de ms com throttling de CPU via CDP, mesmo com `#root` oculto e as fontes bloqueadas. Por isso foi tratado como artefato do throttling e do ambiente, não do portfólio. Não foi otimizado.

## Testes que falham sem a mudança

- **`Index.test.tsx`, "uma por vez":** falhou antes da implementação. Com os módulos já carregados, as 4 seções entravam num mesmo commit (`expected 4 to be 1`).
- **"Com âncora…" e "ao seguir uma âncora…":** cada um falha quando a lógica correspondente é removida (âncora inicial ignorada; `hashchange` ignorado).
- **`App.test.tsx`:** é teste de caracterização e passa antes e depois da troca do roteador, como deve.

## Revisão independente

- **`spec-reviewer`:** um bloqueante e seis sugestões, todos tratados.
  - O bloqueante foi a escolha entre seções esperarem a rolagem ou não. A dona do produto decidiu: sem esperar.
  - As sugestões: comparação com 9 execuções, protocolo de produção, tolerância de peso, troca de fonte explicitada, nome de pasta removido e capturas.
- **`code-reviewer`:** nada bloqueante. Tratados:
  - os testes de âncora passaram a discriminar, com o momento ocioso desligado;
  - o realinhamento passou a valer também ao seguir uma âncora durante a montagem, com E2E;
  - o efeito do `SectionReady` ficou explícito;
  - a indentação foi corrigida;
  - o README foi atualizado.
- **Ajuste além da revisão:** o acompanhamento da âncora só age enquanto ainda faltam seções. Assim, os cliques comuns da barra mantêm a rolagem suave (`scroll-behavior: smooth`).

## QA (agente `qa`, Chrome local, 1280 px e 390 px com toque)

Passaram:

- seções completas sem interação (cerca de 0,75 s após o `load` no desktop);
- `/#contact`, `/#projects` e `/#experience`;
- clique na barra durante a montagem (CPU 6x) e depois dela, com a rolagem suave preservada (57 a 69 eventos de rolagem em cerca de 1 s, sem salto);
- `aria-current` acompanhando a rolagem;
- `/nao-existe`;
- selos de disponibilidade em 1023, 1024 e 390 px, iguais aos da `main`;
- console sem erros.

**Achado tratado: recarregar no meio da página.** Na branch, a página voltava ao topo em 6 de 6 tentativas; na `main`, em 5 de 7. Correção: em recarga ou ao voltar no histórico, todas as seções montam de uma vez (ver plano). Testes de unidade novos falharam antes e passaram depois. Medida depois da correção, com 6 recargas de 2600 px por build e dispositivo, contando as vezes em que a posição foi restaurada:

| | Desktop | Celular |
| --- | --- | --- |
| `main` | 2 de 6 | 1 de 6 |
| Branch | 2 de 6 | 3 de 6 |

A restauração já era instável na `main`, e a branch ficou igual ou melhor.

## Falha intermitente

Na penúltima rodada dos portões, a etapa de teste saiu com falha mesmo com a contagem "60 passed". A saída da falha não foi guardada.

- Não reproduziu em 6 execuções seguidas da suíte (5 diretas e 1 pelo portão isolado).
- Causa provável: o teste "uma por vez" espera até 5 s, que é o mesmo limite padrão de um teste no Vitest, e a máquina estava sob carga.
- Correção: `testTimeout` de 15 s em `Index.test.tsx`.

## E2E instáveis que já existiam

Na rodada final dos portões, com o estado commitado, dois E2E falharam e depois passaram isolados (15 de 15 com `--repeat-each=5`):

- **"no toque, a página rola e nenhum brilho aparece" (mobile, spec 0008).**
  - A falha se repetiu em outra rodada completa: 90 passados, 1 falho.
  - A cópia da `main` (`b2d3fb4`), com a suíte completa nesta máquina, **falha no mesmo teste** (86 passados, 1 falho). Não é regressão desta branch.
  - Sintoma: o `scrollY` fica em 3907, no fim da página, e o gesto para baixo não tem para onde rolar.
- **"imagens fora da dobra são preguiçosas…" (desktop).**
  - Falhou uma vez: a primeira imagem registrada foi `aurora-mono.webp`.
  - O listener de requisições é registrado antes do segundo `goto`, e a aurora da carga anterior é pedida 1,5 s depois do `load`. Corrida do próprio teste.

O CI roda com `retries: 1`. Ficam como pendência para uma correção própria dos testes, fora desta spec.

## Documentação

`node .agents/scripts/docs-impact.mjs` apontou `README.md` e `docs/architecture.md`. O agente `doc-sync-onboarding` atualizou:

- a stack e o status sem React Router;
- o comentário do `App.tsx`;
- o code splitting com montagem escalonada;
- os itens "SPA estática" e "Navegação" da arquitetura.

## Preview da Vercel (PR #28)

Conferido no Chrome local, com a sessão da Vercel autenticada, em 24/11/2026:

- hero e as quatro seções presentes 3 s após a abertura, sem interação;
- console sem erros;
- `/nao-existe` mostra o 404 com "Página não encontrada.";
- `/#contact` termina com o título de Contato na tela.

Checks do PR, todos verdes: Quality, E2E + acessibilidade, Lighthouse, Harness, Secrets, Commit policy e Vercel.

## Produção

Pendente até o merge. O protocolo está na spec: uma rodada de 3 execuções mobile padrão, com no máximo uma repetição, e todas as execuções registradas aqui. Se a mediana ficar abaixo de 90 com os critérios lado a lado aprovados, o critério fica parcial.

## Limites

- As medidas lado a lado são locais (`vite preview`, HTTP/1.1), não da Vercel (HTTP/2 e CDN).
- O throttling de CPU via CDP infla as durações das tarefas de forma irregular. Por isso o critério de tarefa longa usa mediana e comparação intercalada.
- Safari não foi testado. Ele não tem `requestIdleCallback`, então a montagem usa `setTimeout`. Esse caminho é o que roda no jsdom, nos testes de unidade.
