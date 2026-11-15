---
numero: 0002
titulo: Cores do favicon na marca da navbar
tipo: melhoria
prioridade: P3
status: implementada
toca: [interface]
depende_de: ["0001"]
---

# 0002 — Cores do favicon na marca da navbar

## Problema

Quem visita o portfólio vê o monograma “SL” em cor sólida na navbar e em degradê rosa e azul no favicon. Essa diferença reduz a consistência visual entre a página e a aba do navegador.

## Comportamento esperado

As letras “SL” na navbar usam o mesmo degradê do monograma do favicon, do rosa `#EC4899` ao azul `#3B82F6`, na diagonal do canto superior esquerdo para o inferior direito. A marca continua funcionando como atalho para o início.

## Critérios de aceite

- [x] Em desktop e celular, nos temas claro e escuro, as letras “SL” exibem o degradê com as mesmas cores e direção do favicon.
- [x] Em ambos os temas, o monograma atende ao contraste WCAG AA contra a superfície atrás das letras nos estados normal, hover e foco. O indicador de foco permanece visível.
- [x] O link “SL, início” mantém seu nome acessível e leva ao início por clique, toque e Enter.

## Fora de escopo

Alterações no favicon, na paleta global e nos outros controles da navbar.

## Perguntas em aberto

O pedido foi interpretado como uma referência ao degradê das letras. A superfície atrás do monograma pode ser ajustada localmente para atender ao contraste.
