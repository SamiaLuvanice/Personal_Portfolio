# Verificação — 0008 Título interativo na seção Contato

Branch `feat/titulo-contato-interativo`, 20/11/2026, nesta máquina Windows.

## Portões

`node .agents/scripts/gates.mjs --skip-install`: lint, typecheck, test, build e e2e verdes (exit 0), rodados depois da última alteração de código.

- **Vitest:** 51 testes em 10 arquivos, 7 deles em `ContactTitle.test.tsx`.
  - Com um esboço do título estático, 3 dos 5 testes iniciais falharam pelo motivo esperado: sem cópias decorativas, sem `data-drawn` e sem `data-glow`. Os outros 2 verificam que nada acontece, e por isso já passavam.
  - Depois da revisão entraram mais 2 testes: troca da preferência de movimento com a página aberta e limpeza ao desmontar.
- **Playwright:** 87 passados e 7 pulados.
  - O bloco da spec 0008 tem 7 testes nos dois projetos: 12 execuções passadas e 2 puladas, porque o brilho só roda no desktop e o toque só no celular.
  - Sem a implementação (só `Contact.tsx` e `index.css` revertidos), 8 execuções falharam. As 4 que passaram verificam o que já valia na `main`: um único `h2` e o axe.
  - Mutação: com o traço do brilho zerado no CSS, o teste do brilho falha com 0 pixels coloridos perto do cursor, quando esperava mais de 50.

## Critérios de aceite

| Critério | Resultado | Evidência |
| --- | --- | --- |
| Título legível em 320/390/768/1280 px, sem cortar palavras nem rolagem horizontal, contraste ≥ 4,5:1 em repouso, na entrada e com brilho | Passou | E2E de largura (`scrollWidth`, borda direita e cópias com a mesma cor do texto). QA no Chrome local, com contraste medido pixel a pixel nas capturas: texto `rgb(243,240,245)` sobre `rgb(22,22,24)` = **16:1** nas quatro larguras, no meio da entrada (1,05 a 1,35 s) e com o brilho centrado. O brilho pinta só o anel externo; o preenchimento continua 100% na cor do texto |
| Entrada em todos os aparelhos, termina em até 4 s, não se repete | Passou | E2E nos dois projetos: `clip-path` chega a `inset(0 0 0 0)` em até 4 s depois de `data-drawn`, sem animação rodando depois de rolar para fora da seção e voltar. QA: `finished` em cerca de 3 s com mouse e com toque emulado |
| Brilho com hover fino: centro a até 40 px depois de 1 s, raio ≤ metade da altura, apaga até 1 s depois de sair | Passou | E2E desktop: posição do brilho a até 40 px. Captura com mais de 50 pixels nas cores da marca dentro de metade da altura e **0 fora**. Opacidade 0 e captura sem cor 1 s depois da saída. QA: raio de 86,4 px para metade da altura de 96 px, opacidade 0 em cerca de 0,5 s |
| Toque: rola normalmente, sem brilho | Passou | E2E Pixel 7: toque e gesto de rolagem sobre o título movem a página, e o brilho fica desligado. QA: sem listeners sem hover fino, `touch-action: auto` e cópias com `pointer-events: none` |
| Movimento reduzido: só preenchido, sem brilho nem animação | Passou | E2E: as duas cópias com `display: none`, sem `data-glow` e 0 animações. QA: captura sem cor e sem contorno |
| Cores forçadas: cópias ocultas, cor de texto do sistema | Passou | E2E: cópias ocultas e cor do `h2` igual a `CanvasText`. QA: `rgb(255,255,255)` sobre `rgb(0,0,0)` |
| Contorno alinhado depois da troca de fonte e ao redimensionar | Passou | E2E: retângulos de cada linha (por `Range`) iguais entre o texto e o contorno em 320/390/768/1280 px, com as fontes carregadas. QA: 0 px de diferença ao redimensionar sem recarregar e ao trocar a fonte para Arial e serif na página. A troca real com a rede lenta não foi reproduzida; as cópias herdam a fonte do `h2` |
| Um único `h2` lido uma vez, decoração não lida, axe sem violações sérias | Passou | E2E nos dois projetos com o efeito visível (contorno desenhado e, no desktop, brilho aceso). Teste de unidade do nome acessível. QA: árvore de acessibilidade sem as cópias |
| JS inicial cresce no máximo 5 KB gzip | Passou | `vite build` local: `index` com 66,15 KB gzip na `main` e 66,16 KB no branch (+0,01 KB). O efeito fica no chunk preguiçoso do Contato, que foi de 1,61 KB para 2,20 KB |
| Lighthouse mobile (Performance ≥ 90, Acessibilidade ≥ 95, LCP ≤ 2,5 s, CLS ≤ 0,1) | **Parcial: Performance 89** | Produção (`07dbdb5`), 3 execuções mobile: Performance 89, 90 e 89; Acessibilidade 100; LCP 2,12–2,19 s; CLS 0; TBT 328–344 ms. Ver "Lighthouse" abaixo: a diferença não vem desta spec |
| Portões verdes | Passou | Acima |

## Lighthouse

**Produção.** `npx lighthouse https://samialuvanicedev.vercel.app/` (mobile, padrão), em 20/11/2026, com a produção já servindo `07dbdb5`. Mediana:

- Performance 89, logo abaixo do limite de 90;
- Acessibilidade 100;
- LCP 2,17 s e CLS 0.

O que custa pontos é o TBT (cerca de 340 ms).

**Comparação para isolar o efeito da spec.** As URLs de cada deploy da Vercel exigem login, e as execuções nelas mediram a página de login; foram descartadas. Em vez disso, `vite preview` serviu lado a lado o build de `main` (`07dbdb5`) e o de antes do PR (`0fde6b5`), com 5 execuções intercaladas de cada:

| Build | Performance | Mediana | LCP | TBT |
| --- | --- | --- | --- | --- |
| Antes (`0fde6b5`) | 96, 92, 96, 95, 95 | **95** | 2,50–2,58 s | 26–209 ms |
| Depois (`07dbdb5`) | 96, 92, 91, 96, 94 | **94** | 2,49–2,80 s | 21–210 ms |

Empate dentro do ruído desta máquina, com o JS inicial praticamente igual (+0,01 KB gzip). Os 89 de produção vêm do TBT, que já existia antes desta spec; não foi possível medir a produção anterior para confirmar diretamente.

**Pendência fora desta spec:** investigar o TBT de cerca de 340 ms em produção para voltar a Performance ≥ 90.

## Revisão independente

Agente `code-reviewer`: nada bloqueia. Achados tratados:

- O axe passou a rodar com o efeito visível. Antes rodava com movimento reduzido, que esconde as camadas.
- O brilho passou a ser medido no que é pintado: pixels coloridos perto e longe do cursor. O raio deixou de ser copiado da constante do CSS.
- O teste de cores forçadas passou a conferir a cor `CanvasText`.
- A entrada só começa com 60% do título visível, para a varredura não terminar fora da vista.
- As cópias usam `color: inherit`.
- Entraram testes de unidade para a troca da preferência de movimento e para a desmontagem.

Decididos e registrados no plano:

- **Texto triplicado no DOM** (busca do navegador e texto bruto): mantido. Gerar as cópias com pseudo-elementos faria navegadores antigos lerem o título três vezes. A frase "buscadores: nada muda" saiu da spec.
- **Duplicação com o gancho do hero:** adiada para uma tarefa própria.
- **Brilho parado ao rolar com o mouse parado:** adiado. O hero tem o mesmo comportamento.

QA (agente `qa`, Chrome local): todos os critérios verificáveis no navegador passaram. Com base na observação de que o contorno ficava com cerca de 1 px visível no celular, o traço mínimo subiu de 2 para 3 px.

## Documentação

Rodado depois da última alteração de código: `node .agents/scripts/docs-impact.mjs` apontou `README.md`. O agente `doc-sync-onboarding` atualizou:

- a linha da seção Contact;
- a lista de hooks;
- as árvores de `components/` e `hooks/`.

## Limites

- O gesto de toque real só foi exercitado pelo Playwright (CDP `synthesizeScrollGesture`), não com dedo num aparelho físico.
- O prazo de 4 s é contado a partir de `data-drawn`, não do primeiro pixel visível da seção.
- O teste "só começa ao entrar na tela" está no teste de unidade. No E2E do celular, carregar as seções já as deixa visíveis.
- Safari e Firefox não foram testados localmente (`paint-order` em texto HTML e `background-clip: text` com traço). Conferir no preview.
