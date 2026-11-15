# Verificação da spec 0002

- `npm run test:e2e -- --grep "monograma usa o degradê"` falhou nos dois projetos antes da alteração. O estilo computado não tinha degradê.
- O mesmo comando passou em Chromium desktop e mobile após a mudança, com duas execuções. O teste conferiu cores e direção, estados de interação, contraste e navegação por clique, toque e Enter.
- A revisão independente calculou contraste mínimo de 4,66:1 na interpolação sRGB e 4,63:1 com arredondamento de canais. O fundo opaco local preserva o tamanho das letras nos dois temas. O modo de cores forçadas usa a cor do texto e o contorno de foco do sistema.
- O QA reproduziu o degradê computado numa superfície de 300 × 300 px no Chromium e mediu 4,60:1 no ponto de menor contraste. Conferiu os estados normal e foco nos dois temas, hover no desktop e o contorno no modo de cores forçadas. Também validou a navegação para o início e o foco no destino. A rodada usou emulação mobile, com Safari e dispositivo físico fora da verificação.
- `node .agents/scripts/docs-impact.mjs` indicou o README. A revisão confirmou que a descrição da navbar continua aplicável.
- `git diff --check` passou.
- `node .agents/scripts/gates.mjs --skip-install` passou. Lint, tipos, build, Vitest 3/3 e Playwright 14/14, com sete testes em cada projeto Chromium. A execução usou o cache local do Playwright e `NODE_OPTIONS=--dns-result-order=ipv4first`.
