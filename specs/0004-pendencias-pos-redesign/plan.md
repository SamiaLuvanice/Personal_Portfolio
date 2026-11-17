# Plano — 0004 Pendências do redesign

## Camadas tocadas

Só a estática da SPA: `index.html`, CSS e Tailwind, `vercel.json`, `public/`, E2E e documentação. Sem mudança de componente React.

## Decisões

### Fontes no próprio domínio

- **Pacotes:** `@fontsource-variable/sora` e `@fontsource-variable/space-grotesk` (5.3.0), importados em `src/main.tsx`.
  - O Vite empacota os `.woff2` em `/assets/` com hash, então eles herdam o cache imutável que já existe.
  - Cada `@font-face` vem com `font-display: swap` e `unicode-range`. O navegador só baixa os subconjuntos que a página usa (latin e latin-ext).
- **Nomes:** as famílias passam a se chamar `"Sora Variable"` e `"Space Grotesk Variable"`. `tailwind.config.ts` e `src/index.css` são atualizados, mantendo o fallback `sans-serif`.
- **`index.html`:** saem os `preconnect` e o `preload`/`noscript` do serviço de fontes.
- **Alternativa descartada:** baixar os `.woff2` à mão para `public/fonts/`. Daria mais trabalho de manutenção, os arquivos ficariam sem hash e exigiriam uma regra de cache própria. Os pacotes variáveis são uma dependência pequena e versionada.
- **Risco:** o CSS das fontes passa a fazer parte do CSS principal, que bloqueia a renderização, mas é local e pequeno. As fontes continuam com `swap`, e o LCP é o retrato. A medição do Lighthouse confirma ou derruba isso.
- **Revisão durante a implementação:** a medição derrubou o import direto. Os `.woff2` (56 KB, prioridade VeryHigh) eram descobertos no CSS principal e baixados junto com o retrato. No Lighthouse simulado, o FCP subiu de 1,5 para 1,9 s e o LCP de 2,1 para 2,4 s.
  - **Nova decisão:** `src/fonts.ts` importa os pacotes, e `src/main.tsx` carrega esse módulo por import dinâmico depois do evento `load`. É o mesmo desenho de antes, em que as fontes não competem com o primeiro carregamento.
  - **Resultado com throttling real:** as fontes começam depois do retrato, e o LCP cai de 3,1–3,5 s (`main`) para 2,4–2,7 s.

### Cache das imagens

- **`vercel.json`:** recebe uma regra para `/hero/(.*)`, `/projects/(.*)` e `/og-image.jpg`, com `Cache-Control: public, max-age=604800, stale-while-revalidate=86400`. São 7 dias de validade e mais 1 dia servindo a versão antiga enquanto revalida.
- **Alternativa descartada:** importar as imagens pelo Vite para ganhar hash e cache imutável. O retrato é pré-carregado no `index.html` por caminho fixo, e importá-lo pelo Vite obrigaria a gerar esse preload no build. É complexidade demais para o ganho.
- **Convenção:** imagem substituída ganha nome novo. Fica registrado em `docs/architecture.md`.
- **`nginx.conf`:** a alternativa local em Docker continua sem cabeçalhos de cache, como antes. Fica fora desta spec.

### Imagem de prévia (og:image)

- **Geração:** o script `scripts/generate-og-image.mjs` usa o Chromium do Playwright, que já é dependência do projeto. Ele abre o `vite preview` em 1200 × 630, esconde as barras de navegação e o selo de disponibilidade, espera fontes e imagem e salva `public/og-image.jpg` em JPEG com qualidade 85. Assim a prévia sai do próprio hero e pode ser gerada de novo quando ele mudar.
- **Metadados no `index.html`:**
  - Novos: `og:image` (URL absoluta), `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt` e `twitter:image` com `twitter:image:alt`.
  - Alterado: `twitter:card` passa de `summary` para `summary_large_image`.
- **Alternativa descartada:** desenhar um card próprio em HTML ou SVG. Seria uma segunda peça visual para manter, fora da identidade do hero.

### Conteúdo da 0003

As perguntas em aberto da 0003 são marcadas como decididas, com data e resposta da autora. O "2+ anos" fica como está.

## Testes

- **E2E dos metadados:** passa a exigir `og:image` absoluta, as dimensões, o `alt` e `twitter:card=summary_large_image`. Também confere que `/og-image.jpg` responde 200 com `image/jpeg`.
- **E2E das fontes:**
  - Teste novo: nenhuma requisição a `fonts.googleapis.com` ou `fonts.gstatic.com`, e as famílias computadas de `h1` e `body` contêm Space Grotesk e Sora.
  - O teste de foco (WCAG 2.4.11), que hoje espera a folha de estilo externa, passa a esperar só `document.fonts`.
- **Cache:** é cabeçalho da Vercel e não aparece no `vite preview`. Será conferido em produção com `curl -I`.
- **Lighthouse mobile:** `lhci collect` no build local e em produção depois do merge.
- **LinkedIn:** conferido manualmente no Chrome da autora.

## Riscos

- A troca de fonte pode alterar levemente as métricas de texto, porque a versão variável não é idêntica à estática. Isso é conferido nos screenshots e no E2E de layout.
- Os metadados de prévia ficam em cache nas redes sociais. Pode ser preciso forçar a releitura no Post Inspector do LinkedIn depois do deploy.
