---
numero: 0005
titulo: Nome do hero inteiro enquanto a fonte carrega
tipo: bug
prioridade: P2
status: implementada
toca: [interface]
depende_de: ["0004"]
---

# 0005 — Nome do hero inteiro enquanto a fonte carrega

## Problema

As fontes do site carregam depois do primeiro carregamento da página, para não atrasar o retrato. Enquanto isso, o texto aparece com a fonte do sistema, que é mais larga.

No celular, o nome "SÂMIA LUVANICE" é dimensionado para ocupar a largura da tela. Com a fonte do sistema, ele passa da borda e a última letra fica cortada. Em rede móvel lenta isso dura cerca de 2 a 3 s, justamente na primeira impressão de quem chega ao portfólio. Quando a fonte chega, o texto muda de tamanho de forma visível.

## Como reproduzir

1. Abra o site numa largura de 390 px, com os arquivos de fonte bloqueados ou em rede lenta.
2. Observe o nome no topo: o "E" final de "LUVANICE" aparece cortado na borda direita.
3. Libere as fontes: o nome encolhe e passa a caber.

## Comportamento esperado

Enquanto a fonte do site não carrega, o texto usa uma fonte do sistema ajustada para ocupar praticamente o mesmo espaço. O nome cabe inteiro em qualquer largura suportada, e a troca de fonte quase não muda o tamanho do texto. Depois que a fonte carrega, a página fica exatamente como hoje.

## Critérios de aceite

- [x] Com as fontes do site bloqueadas, nas larguras de 320, 360, 390, 768, 1024 e 1280 px, nenhuma linha do nome do hero ultrapassa a largura do título nem a da tela.
- [x] Com as fontes do site bloqueadas, a largura do nome fica a até 5% da largura com a fonte carregada, nas mesmas larguras de tela.
- [x] Com a fonte carregada, a aparência não muda em relação à versão atual: famílias, tamanhos e quebras de linha do hero são os mesmos.
- [x] O Lighthouse mobile em produção mantém Performance ≥ 90, Acessibilidade ≥ 95, LCP ≤ 2,5 s e CLS ≤ 0,1.
- [x] Portões verdes.

## Fora de escopo

- Trocar as famílias tipográficas ou o layout do hero.
- Voltar a carregar as fontes antes do retrato.

## Perguntas em aberto

- **Fontes do sistema:** variam por plataforma (Windows e macOS têm Arial; Android tem Roboto; Linux costuma ter Liberation Sans ou DejaVu). Assumido: o ajuste cobre as fontes compatíveis com Arial (Arial e Liberation Sans) e a Roboto. Nas demais, vale a fonte genérica do sistema, como hoje.
