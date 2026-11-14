# Verificação da spec 0001

Os dois testes novos do Playwright falharam antes da mudança. A barra antiga não tinha o nome acessível esperado e o menu correspondente não estava disponível. Depois da implementação, os dois testes passaram nos projetos Chromium desktop e mobile, com quatro execuções bem-sucedidas. Os testes cobrem posição durante a rolagem, acesso ao rodapé, largura de 320 px, abertura para cima, fechamento por Escape e navegação por teclado.

| Comando | Resultado observado |
| --- | --- |
| `npm run lint` e `npm run typecheck` | Passaram após corrigir a tipagem do teste |
| `node .agents/scripts/gates.mjs --skip-install` | Lint, tipos e build passaram. Vitest 3/3 e Playwright 12/12, com seis cenários por projeto e axe incluído. Chromium do cache local e `NODE_OPTIONS=--dns-result-order=ipv4first` |
| `node --test ".agents/scripts/*.test.mjs"` | 18 passaram fora do sandbox, que impedia a criação de links simbólicos temporários |
| `node .agents/scripts/diagnose.mjs` | Harness válido |
| `git diff --check` | Passou |
| `node .agents/scripts/docs-impact.mjs` | README e arquitetura revisados e atualizados |

## Critérios de aceite em Chromium

- A barra permaneceu fixa desde o carregamento até o rodapé. A margem inferior foi de 16 px e passou a 44 px com um inset simulado de 28 px via CDP.
- A superfície apresentou opacidade de 85% e desfoque nos dois temas. A composição nos extremos simulados deu 10,67:1 no tema escuro e 11,47:1 no claro para texto e foco no estado normal.
- Os cinco destinos foram acionados por Enter e receberam foco. O acesso direto a `/#contact` e a alternância entre temas também funcionaram.
- Em 320 px, o menu abriu para cima sem rolagem horizontal, fechou com Escape ou seleção e informou o estado expandido. Escape devolveu o foco ao botão.
- Tab percorreu os controles e fechou o menu ao sair da barra. Os três links do rodapé estavam desobstruídos e passaram na checagem de clique do Playwright.
- Em movimento reduzido, a rolagem computada foi imediata e os ícones desativaram as transições. Com a preferência padrão, a rolagem permaneceu suave.

A revisão independente identificou fechamento do menu ao sair com Tab, foco após clique, coerência do breakpoint e insets laterais. O QA detectou a divergência entre o texto visível “SL” e o nome acessível da marca com axe, além da transição residual dos ícones em movimento reduzido. Os ajustes foram incorporados.

O QA usou Chromium e uma área segura simulada. WebKit, aparelho físico com recorte e comparação visual com a referência externa ficaram fora da verificação local. O script de documentação sinaliza o README como pendente quando seu caminho é a primeira entrada modificada na saída de `git status --porcelain`. A atualização foi conferida no diff.
