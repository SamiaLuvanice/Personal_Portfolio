---
numero: 0007
titulo: Copiar o e-mail na seção Contato
tipo: melhoria
prioridade: P2
status: implementada
toca: [interface]
depende_de: ["0003"]
---

# 0007 — Copiar o e-mail na seção Contato

## Problema

O botão "Iniciar conversa" abre o programa de e-mail do computador. Quem usa o e-mail só no navegador, como no Gmail ou no Outlook web, muitas vezes não tem esse programa configurado. Aí o clique não faz nada e não aparece nenhum aviso. Recrutadores, que são o público principal, podem achar que o contato está quebrado e desistir. Hoje, para levar o endereço, a pessoa precisa selecionar o texto à mão.

## Comportamento esperado

O botão "Iniciar conversa" continua como está. Logo abaixo dele, o endereço de e-mail aparece como texto, com uma ação "Copiar" ao lado. Com um clique ou uma tecla, o endereço vai para a área de transferência. A ação confirma de forma visível e é anunciada por leitores de tela. Depois de alguns segundos, volta ao estado inicial.

Se o navegador não permitir copiar, a pessoa vê um aviso, também anunciado, para copiar o endereço manualmente, e o endereço fica selecionado para facilitar.

## Critérios de aceite

- [x] Dado que a pessoa está na seção Contato, então ela vê o endereço `samia.luvanice.dev@gmail.com` e um controle com nome acessível "Copiar e-mail", operável por mouse, toque e teclado, com área de toque ≥ 44 × 44 px.
- [x] Dado que copiar é permitido, quando a pessoa aciona "Copiar e-mail", então a área de transferência passa a conter exatamente o endereço, o controle mostra "Copiado" e um leitor de tela anuncia "E-mail copiado".
- [x] Dado que o endereço foi copiado, quando passam cerca de 2 s, então o controle volta a mostrar "Copiar".
- [x] Dado que o navegador recusa ou não oferece a cópia, quando a pessoa aciona "Copiar e-mail", então aparece e é anunciado um aviso pedindo para copiar manualmente, e o endereço fica selecionado.
- [x] O botão "Iniciar conversa" continua abrindo o e-mail com assunto e corpo preenchidos.
- [x] A página continua sem violações sérias de acessibilidade (axe) no desktop e no celular.
- [x] Portões verdes.

## Fora de escopo

- Formulário de contato, link direto para o Gmail ou WhatsApp.
- Mudar o texto, a cor ou o layout do restante da seção Contato.
- Ação de copiar no hero.

## Perguntas em aberto

- **Endereço como link ou texto:** hoje o endereço também é um `mailto:`, o que repete o botão "Iniciar conversa". Assumido: ele passa a ser só texto, e a ação ao lado copia. O `mailto:` fica só no botão.
- **Duração da confirmação:** assumido cerca de 2 s, o padrão comum para esse tipo de aviso.
