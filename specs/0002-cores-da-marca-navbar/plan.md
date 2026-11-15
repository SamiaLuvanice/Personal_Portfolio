# Plano da spec 0002

Aplicar ao texto do link de início o degradê diagonal do favicon, sobre uma superfície escura limitada ao monograma. Manter a tipografia da navbar, o nome acessível e o foco no link atual. A superfície local oferece contraste previsível sobre o vidro nos dois temas. Aplicar o degradê diretamente sobre a navbar deixaria o contraste sujeito ao conteúdo atrás da barra.

A mudança fica em `src/components/Navbar.tsx` e nos estilos associados. O Playwright verifica as cores, a direção, o contraste e a navegação no componente renderizado. Branch `feat/cores-da-marca-navbar`.
