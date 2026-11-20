# Plano — 0008 Título interativo na seção Contato

## Contrato da interface

Não há API. O contrato é o DOM público do título, que os testes consultam:

- `h2#contact-title`: continua o único título da seção, com nome acessível "Vamos construir algo relevante?". O texto preenchido é o próprio conteúdo do `h2`.
- Dentro do `h2`, duas cópias decorativas do texto com `aria-hidden="true"` e sem eventos de ponteiro: `.contact-title-outline` (contorno da entrada) e `.contact-title-glow` (brilho).
- Estado em atributos do `h2`:
  - `data-drawn="true"`: a entrada já foi disparada e não volta a `false` na mesma visita.
  - `data-glow="true|false"`: o brilho está ativo.
- Variáveis CSS `--gx`/`--gy` no `h2`: centro do brilho em px, relativo ao canto do título.

## Arquivos e camadas

| Arquivo | Mudança |
| --- | --- |
| `src/components/ContactTitle.tsx` (+ `ContactTitle.test.tsx`) | `h2` com o texto e as duas cópias decorativas sobrepostas (mesmo texto, mesma fonte, `inset-0`). |
| `src/hooks/use-title-effects.ts` | `useDrawOnce`: `IntersectionObserver` marca `data-drawn` uma vez e desconecta. `usePointerGlow`: ponteiro → `--gx/--gy` com `requestAnimationFrame`, só com `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`. Reaproveita `localPoint`, `approach`, `smoothingFactor` e `isSettled` de `src/lib/aurora.ts`. |
| `src/components/Contact.tsx` | Troca o `h2` atual por `ContactTitle`. Atualiza o comentário da 0003 sobre o laranja. |
| `src/index.css` | Contorno com `-webkit-text-stroke`, entrada por `clip-path` animado, brilho com `background-clip: text`, cores forçadas e movimento reduzido. |
| `e2e/portfolio.spec.ts` | Entrada única e em até 4 s, brilho seguindo o ponteiro e apagando, toque, movimento reduzido, cores forçadas e alinhamento ao redimensionar. |

## Decisões

- **CSS e as funções que já existem, sem GSAP nem o componente de referência.**
  - O componente de referência desenha uma única linha de SVG numa caixa fixa de 300 × 100, e o título quebra em 2 a 4 linhas conforme a largura.
  - Para quebrar linhas em SVG, seria preciso medir onde o navegador quebra e redesenhar a cada redimensionamento e troca de fonte. Isso é frágil e vai contra o critério "contorno alinhado".
  - O GSAP (~25 KB gzip, mais `@gsap/react`) estoura o limite de 5 KB do carregamento inicial. Para caber, precisaria de import dinâmico, o que adiciona complexidade para uma animação de 3 s.
  - Descartados: SVG por linha com medição, e GSAP carregado sob demanda.
- **Cópias do texto no próprio `h2`, com `aria-hidden`.** Como a quebra e a fonte são as mesmas, as cópias acompanham a troca de fonte e o redimensionamento sem nenhum JS. O nome acessível do `h2` ignora filhos `aria-hidden`, então o título é lido uma vez. Descartado: um `h2` com `sr-only` mais um SVG visual, que daria dois elementos para manter em sincronia.
- **A entrada é uma varredura do contorno, não um traço que percorre cada letra.**
  - `-webkit-text-stroke` não aceita `stroke-dasharray`, que é o que permite o efeito de traço da referência.
  - O contorno aparece da esquerda para a direita, por `clip-path: inset()` animado: 2,4 s, uma vez.
  - É a diferença visual mais visível em relação à referência. Se a dona do produto quiser o traço letra a letra, a saída é o SVG por linha, com o custo descrito acima.
- **O brilho é um degradê radial da marca recortado no contorno.** A cópia `.contact-title-glow` usa `background-clip: text`, `color` igual ao preenchimento e `-webkit-text-stroke` transparente. Assim, o degradê só aparece na faixa do contorno, e o preenchimento continua com a cor e o contraste de hoje. Cores: laranja (`--primary`, `--primary-glow`) e magenta (`--accent`). Raio de `0.9em`, que é no máximo metade da altura de um título de duas linhas.
- **O ponteiro grava só variáveis CSS**, como no hero (0006), sem estado React por quadro. O laço de `requestAnimationFrame` para quando converge.
- **Movimento reduzido e cores forçadas por CSS.** As duas cópias ficam com `display: none`, e o título fica idêntico ao de hoje (em cores forçadas, `CanvasText`). O gancho do ponteiro não liga com movimento reduzido.

## Riscos

- **Contorno pouco visível.** O texto já é claro sobre fundo escuro. O contorno precisa de um tom que contraste com o preenchimento (cinza médio) para aparecer, e o ajuste é visual, nas quatro larguras.
- **Repintura** durante a varredura (2,4 s, uma vez) e enquanto o ponteiro se move sobre o título (só no desktop). As duas são locais ao `h2`.
- **`background-clip: text` com `-webkit-text-stroke`:** é suportado no Chromium, Firefox e Safari atuais. Em navegador antigo, o brilho simplesmente não aparece e o título continua legível.
- **Texto triplicado no DOM:** a busca do navegador e o texto bruto da página encontram o título três vezes. Descartado: gerar as cópias com `::before`/`::after` e `content: attr(data-text) / ""`. O texto alternativo vazio só existe no Chrome 77+, Safari 17.4+ e Firefox 128+; nos anteriores, o pseudo-conteúdo entraria no nome acessível. Também se perderia a medição de alinhamento por `Range` no E2E.
- **Adiado (revisão):** `usePointerGlow` repete o laço de `useAuroraPointer` (hero). Extrair um `useSmoothedPointer` comum mexe no hero e fica para uma tarefa própria. Também fica para depois: o brilho não se reposiciona ao rolar com o mouse parado, como já acontece no hero.
- **Caro de reverter:** nada. A mudança é local ao título do Contato e não traz dependência nova.
