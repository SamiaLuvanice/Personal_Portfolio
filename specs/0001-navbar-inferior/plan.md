# Plano da spec 0001

A barra usa a superfície translúcida e os tokens existentes. O layout fixo troca a posição superior pela inferior desde a primeira renderização, dispensando o listener de rolagem. Em larguras menores, preserve o botão de menu e ancore o painel acima da barra para manter os quatro destinos legíveis.

Use links de fragmento para manter a navegação por teclado e o comportamento nativo de URL. Garanta que as seções carregadas sob demanda continuem acessíveis ao navegar na montagem. A tecla Escape fecha o menu e devolve o foco ao botão. A escolha de uma seção fecha o painel e deve levar o foco ao destino.

Coordene altura da barra, margem inferior e área segura com o espaço reservado no fim da página. Ajuste o comportamento de rolagem e as transições da navbar para movimento reduzido. Valide contraste com atenção à composição da superfície translúcida sobre fundos variados.

A navbar, o alternador de tema e os estilos globais cuidam da apresentação. A página mantém as âncoras das seções assíncronas disponíveis durante o carregamento. A meta viewport habilita o uso da área segura, e o layout acomoda o endereço de e-mail em telas de 320 px. Playwright verifica navegação, menu, posicionamento e rodapé. A mudança fica na branch `feat/navbar-inferior`.
