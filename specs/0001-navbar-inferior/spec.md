---
numero: 0001
titulo: Navbar inferior translúcida
tipo: melhoria
prioridade: P2
status: implementada
toca: [interface]
depende_de: []
---

# 0001 — Navbar inferior translúcida

## Problema

A navegação atual ocupa o topo da tela. A atualização deve levar a navegação para uma barra flutuante na parte inferior, seguindo a posição e a translucidez descritas na referência visual e mantendo a identidade do portfólio.

## Comportamento esperado

A pessoa encontra uma barra compacta, centralizada e fixa perto da borda inferior enquanto percorre a página. A superfície translúcida usa as cores, os contornos, o arredondamento e a tipografia do portfólio. A marca SL leva ao início, os atalhos levam às seções atuais e o controle de tema continua disponível. Em telas estreitas, o menu compacto se expande para cima.

## Critérios de aceite

- [x] No desktop e no celular, a barra permanece visível perto da borda inferior desde o carregamento inicial e durante a rolagem, com margem que respeita a área segura do dispositivo.
- [x] Nos temas claro e escuro, a superfície deixa o conteúdo de fundo aparecer de forma sutil e os textos, ícones e indicadores de foco atendem ao contraste WCAG AA.
- [x] A marca SL leva ao início. Tecnologias, Certificados, Projetos e Contato levam às respectivas seções. A alternância de tema funciona com a barra visível.
- [x] Em uma tela com 320 px de largura, a barra cabe sem rolagem horizontal. O menu abre para cima, informa seu estado expandido a tecnologias assistivas e fecha ao escolher uma seção ou pressionar Escape.
- [x] Todos os controles funcionam pelo teclado e exibem foco visível. Ao alcançar o fim da página, os links e controles do rodapé ficam acessíveis sem sobreposição com a barra.
- [x] Com a preferência por movimento reduzido ativa, a navegação respeita essa preferência.

## Fora de escopo

Redesign das seções, troca de identidade visual e novos destinos de navegação.

## Perguntas em aberto

A posição centralizada e o menu compacto que abre para cima são escolhas iniciais para adaptar a navegação atual. A referência externa ficou inacessível durante o intake. A proposta usa a posição inferior e a translucidez descritas no pedido.
