---
numero: 0008
titulo: Título interativo na seção Contato
tipo: melhoria
prioridade: P3
status: pronta
toca: [interface]
depende_de: ["0003", "0005", "0007"]
---

# 0008 — Título interativo na seção Contato

## Problema

A seção Contato é o último convite da página. O título "Vamos construir algo relevante?" é estático e não chama atenção. Ele chega depois do hero e dos cards de projeto, que já reagem ao cursor. Quem rola até o fim, principalmente recrutadores, não percebe nada novo no ponto em que a página pede uma ação. A ideia é que o título tenha um gesto visual próprio, sem perder a legibilidade nem atrasar a página.

Referência visual: um efeito de texto em que o contorno das letras se desenha na entrada e, com o cursor por cima, um gradiente colorido aparece em volta dele.

## Comportamento esperado

**Título.** O texto continua o mesmo, preenchido e legível como hoje, em todas as larguras. Ele continua quebrando em várias linhas como agora.

**Entrada (todos os aparelhos).** Quando a seção entra na tela pela primeira vez depois do carregamento da página, um contorno se desenha sobre as letras. Isso termina em até 4 s e o contorno fica parado. Se a pessoa sair da seção e voltar rolando, a animação não se repete.

**Com mouse ou trackpad (hover e ponteiro fino).** Com o cursor sobre o título, um brilho nas cores da marca, com o laranja de acento, aparece no contorno das letras em volta do cursor. Ele acompanha o movimento com um atraso leve. Quando o cursor sai, o brilho apaga aos poucos.

**Sem hover (toque e aparelhos híbridos sem ponteiro fino).** Só a entrada acontece. Tocar ou arrastar sobre o título não faz nada de diferente, e a página rola normalmente.

**Movimento reduzido.** O título aparece só preenchido, como hoje. Não há contorno animado nem brilho.

**Alto contraste (cores forçadas).** O contorno e o brilho somem, e o título usa a cor de texto do sistema.

**Leitores de tela.** Nada muda: o título continua nomeando a seção e é lido uma única vez.

## Critérios de aceite

- [ ] **Título legível.** Em 320, 390, 768 e 1280 px de largura, o título "Vamos construir algo relevante?" aparece preenchido, sem cortar palavras e sem rolagem horizontal. Medido em captura, o contraste do texto com o fundo é de pelo menos 4,5:1 em repouso, durante a entrada e com o brilho centrado sobre o título.
- [ ] **Entrada.** Sem pedido de menos movimento, tanto com cursor quanto no toque: quando a seção entra na tela, o contorno se desenha sobre as letras, termina em até 4 s e fica parado. Se a pessoa rolar para fora da seção e voltar na mesma visita, a animação não se repete.
- [ ] **Brilho com cursor.** Num aparelho com hover e ponteiro fino, depois de 1 s com o cursor parado sobre o título, o brilho está visível nas cores da marca e o centro dele fica a até 40 px do cursor. O raio do brilho é de no máximo metade da altura do título. Até 1 s depois de o cursor sair, o brilho está totalmente apagado.
- [ ] **Toque.** Num aparelho sem hover, tocar ou arrastar sobre o título rola a página normalmente e não faz aparecer nenhum brilho.
- [ ] **Movimento reduzido.** O título aparece só preenchido, sem contorno animado. Mover o cursor sobre ele não faz aparecer brilho, e nenhuma animação do título fica em execução.
- [ ] **Cores forçadas.** O contorno e o brilho ficam ocultos, e o título aparece com a cor de texto do sistema.
- [ ] **Contorno alinhado.** O contorno coincide com as letras depois da troca da fonte de fallback pela fonte final (spec 0005) e depois de redimensionar a janela entre 320 e 1280 px.
- [ ] **Acessibilidade.** A árvore de acessibilidade tem um único título de nível 2, "Vamos construir algo relevante?", que nomeia a seção. O título é anunciado uma única vez e nenhum conteúdo decorativo é lido. A verificação automatizada (axe) continua sem violações sérias ou críticas no desktop e no celular.
- [ ] **Peso inicial.** O JavaScript baixado no carregamento inicial da página cresce no máximo 5 KB gzip em relação à `main`.
- [ ] **Lighthouse mobile.** No preview do PR: Performance ≥ 90, Acessibilidade ≥ 95, LCP ≤ 2,5 s e CLS ≤ 0,1.
- [ ] **Portões verdes.**

## Relação com as specs anteriores

Esta spec substitui um ponto da 0003: a restrição do laranja ao botão na seção Contato. As cores da marca, com o laranja de acento, também passam a aparecer no brilho do título. O restante da 0003 e as specs 0005 e 0007 continuam valendo.

## Fora de escopo

- Mudar o texto, o tamanho, a fonte ou o layout do título e do restante da seção Contato.
- Aplicar o efeito em outros títulos ou na palavra decorativa "CONTATO" ao fundo.
- Reação ao toque no celular.
- Tema claro: o efeito é pensado para o fundo escuro da seção.

## Perguntas em aberto

Decisões tomadas com a dona do produto em 20/11/2026:

- **Legibilidade:** o título fica preenchido. O contorno e o brilho são uma camada extra por cima, ao contrário da referência, em que as letras são só contorno.
- **Cores:** paleta da marca, com o laranja de acento. As cores da referência (amarelo, vermelho, azul, ciano e violeta) não serão usadas.
- **Celular:** só a animação de entrada. A referência bloqueia a rolagem quando a pessoa toca no texto, e isso não será reproduzido.

Suposições menores:

- **Repetição da entrada:** acontece uma vez por carregamento da página, não toda vez que a seção volta à tela. Repetir chamaria atenção demais para um elemento já visto.
- **Movimento reduzido:** o título fica só preenchido, sem o contorno estático, para ficar idêntico ao de hoje.
- **Teclado:** o brilho é decorativo e não acompanha o foco do teclado. Quem navega pelo teclado vê o título com o contorno da entrada, sem brilho. Essa escolha é intencional.
- **Peso inicial:** o limite de 5 KB gzip permite que o efeito exista sem atrasar a primeira tela, que não mostra a seção Contato.
- **Texto repetido fora da árvore de acessibilidade:** as camadas decorativas repetem o texto do título. Leitores de tela leem o título uma vez, mas a busca do navegador (Ctrl+F) e o texto bruto da página podem encontrá-lo três vezes. A alternativa sem repetição faria leitores de tela de navegadores mais antigos lerem o título três vezes, o que é pior. Revisão de 20/11/2026.
