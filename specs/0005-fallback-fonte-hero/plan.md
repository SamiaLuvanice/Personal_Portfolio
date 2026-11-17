# Plano — 0005 Nome do hero inteiro enquanto a fonte carrega

## Camadas tocadas

Só estilo: `src/index.css` (`@font-face` de fallback e pilhas de fontes), `tailwind.config.ts` (pilhas `sans`, `display` e a nova `hero`), `src/components/Hero.tsx` (`font-display` → `font-hero` no nome e na marca d'água) e o E2E.

## Decisões

### Fallbacks ajustados por métricas

Faces `@font-face` com `src: local(...)` e `size-adjust`, `ascent-override`, `descent-override` e `line-gap-override`. Elas ficam entre a fonte do site e o `sans-serif` genérico. Não fazem requisição de rede e só são usadas enquanto a fonte do site não carrega, ou se ela falhar. O `unicode-range` de cada face repete o dos pacotes Fontsource. Assim, caracteres que a fonte do site não cobre (ex.: "→") continuam no `sans-serif`, como antes, e não em uma Arial ampliada (achado S3 da revisão).

- **Plataformas:**
  - Arial e as fontes com métricas compatíveis com ela (Liberation Sans no Linux e no CI, Helvetica): Windows, macOS e Linux.
  - Roboto: Android.
  - Em outras fontes, vale o `sans-serif`, como hoje.
- **Pesos:** cada família tem uma face regular (100–599) e uma bold (600–900). Sem a face bold, o navegador sintetiza o negrito a partir da regular, e a largura muda.
- **Três famílias:**
  - Títulos e texto misto: `Space Grotesk Fallback`.
  - Corpo: `Sora Fallback`.
  - Nome do hero e marca d'água: `Space Grotesk Hero Fallback`. O nome é só em maiúsculas, e em maiúsculas a Arial Bold sai cerca de 9% mais larga que a Space Grotesk. Em texto misto, as larguras ficam quase iguais. Com uma única família, ou o nome passaria da borda ou os títulos encolheriam cerca de 9%.
- **Medição:**
  - Feita no Chromium, com o `measureText` do canvas, a partir do build carregado.
  - `size-adjust` = largura da fonte do site ÷ largura da fonte do sistema, na mesma amostra.
  - Os overrides verticais são a métrica da fonte do site dividida pelo `size-adjust`.
  - A Roboto foi medida carregando o `.woff2` do pacote `@fontsource/roboto` 5.2.8 só durante a medição, porque ela não está instalada no Windows.

| Família | Arial regular | Arial bold | Roboto regular | Roboto bold |
|---|---|---|---|---|
| Space Grotesk Fallback | 107,23% | 100,17% | 108,87% | 107,14% |
| Space Grotesk Hero Fallback | — | 89,7% | — | 96,4% |
| Sora Fallback | 113,40% | 107,16% | 113,46% | 114,10% |

- **Ajuste do hero:** o nome vai de borda a borda. Com a fonte carregada, "LUVANICE" ocupa 279,5 dos 280 px do título em 320 px de tela.
  - **Primeira tentativa:** ajuste pela média de "SÂMIA LUVANICE" (91,44%). "LUVANICE" ficou 1,7% mais largo e passou 4 px da borda.
  - **Valor final:** ajuste só por "LUVANICE" (Arial 89,97%, Roboto 96,69%), menos 0,3% de folga.

### Alternativa descartada

- **Voltar a carregar as fontes antes do retrato:** pioraria o LCP, que é o motivo da spec 0004.
- **Diminuir o nome:** muda o layout, e a spec deixa isso fora de escopo.
- **`font-display: block`:** esconderia o texto por até 3 s.

## Testes

- **E2E novo (desktop):**
  - Com os `.woff2` bloqueados, em 320, 360, 390, 768, 1024 e 1280 px, cada linha do nome fica dentro do título e da tela.
  - A largura total fica a até 5% da largura com a fonte carregada.
  - Mede o texto por `Range`, porque os spans são `block` no celular.
- **Aparência com a fonte carregada:** screenshot da página inteira antes e depois, em 390 e 1280 px, com comparação byte a byte.
- **Lighthouse mobile:** local e em produção.

## Riscos

- Os valores dependem das fontes do sistema. Uma fonte com o mesmo nome e métricas diferentes daria um ajuste errado, mas só durante o carregamento.
- O CI (Ubuntu) usa Liberation Sans, se instalada pelo `playwright install --with-deps`. Se não houver nenhuma das fontes locais, o E2E novo acusa.
