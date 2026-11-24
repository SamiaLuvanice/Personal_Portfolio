---
numero: 0009
titulo: Performance mobile estável acima de 90
tipo: melhoria
prioridade: P2
status: implementada
toca: [interface]
depende_de: ["0004", "0005", "0006", "0008"]
issue: 26
---

# 0009 — Performance mobile estável acima de 90

## Problema

No Lighthouse mobile, a produção fica abaixo da meta de Performance ≥ 90 usada nas specs 0006 e
0008, ou oscila em volta dela. Em 20/11/2026 as 3 execuções deram 89, 90 e 89, com Total Blocking
Time (TBT) de 328 a 344 ms. Em 24/11/2026, sem mudança de código relevante, deram 87, 96 e 98, com
TBT de 416, 139 e 53 ms. As demais métricas ficam dentro da meta: Acessibilidade 100, LCP de cerca
de 2,1 s e CLS 0. O que derruba a nota é o tempo em que a página fica ocupada e não responde
durante o carregamento (issue #26).

Recrutadores costumam abrir o portfólio no celular, às vezes em aparelhos modestos. Uma página
que trava nos primeiros segundos parece lenta, mesmo com o retrato aparecendo rápido. A nota
também é usada como vitrine técnica.

Observado no trace mobile da produção (CPU 4x, 24/11/2026):

- A primeira montagem da página ocupa cerca de 280 ms de script contínuo. Parte desse tempo
  prepara utilitários que a primeira tela não precisa.
- As quatro seções abaixo da dobra são baixadas e montadas logo depois da primeira tela, todas de
  uma vez, numa tarefa só (cerca de 150 ms de script e layout).
- A troca da fonte do sistema pelas fontes do site refaz o layout da página inteira (64 a 139 ms
  por vez).

## Comportamento esperado

Para quem visita, nada muda no que se vê, lê ou faz: mesmo conteúdo, mesma aparência, mesmas
animações, mesma navegação por âncoras e mesmo comportamento de acessibilidade. A diferença é que
a página fica livre para responder ao toque e à rolagem mais cedo durante o carregamento no
celular.

As seções abaixo da dobra continuam chegando sozinhas, sem esperar rolagem: podem entrar uma de
cada vez, mas todo o conteúdo fica na página poucos segundos depois do carregamento. Assim a busca
do navegador e os robôs de busca encontram o mesmo texto de hoje. Quem chega por um link com
âncora (ex.: `/#contact`) ou segue uma âncora durante o carregamento continua indo direto à seção.

## Critérios de aceite

- [x] **Conteúdo sem esperar rolagem.** Sem nenhuma interação, as quatro seções abaixo da dobra
  (Projetos, Expertise, Experiência e Contato) estão completas na página em até 3 s depois do
  evento de carregamento, no desktop e no celular emulado.
- [x] **Âncoras.** Abrindo `/#contact` (e as demais âncoras), a página termina na seção pedida.
  Seguir uma âncora antes de todas as seções aparecerem também leva à seção pedida.
- [x] **Tarefas mais curtas, medido lado a lado.** Com os builds da `main` e da branch servidos na
  mesma máquina, celular emulado com CPU 4x e 5 cargas intercaladas de cada um, a mediana da maior
  tarefa longa da branch é pelo menos 30% menor que a da `main`.
- [x] **Lighthouse lado a lado.** Nos mesmos builds, com 9 execuções intercaladas do Lighthouse mobile
  padrão, a mediana do TBT da branch não é maior que a da `main`, e a mediana do LCP não é maior em
  mais de 300 ms (folga do ruído medido na spec 0008).
- [x] **Peso inicial.** O JavaScript baixado antes da primeira tela cresce no máximo 0,5 KB gzip em
  relação à `main`.
- [x] **Nada muda para quem visita.** Os testes de ponta a ponta existentes continuam passando sem
  mudança nas expectativas. Isso inclui seção ativa na barra, efeitos do hero e do título de
  Contato, movimento reduzido e axe sem violações sérias ou críticas. Capturas em 390 e 1280 px,
  feitas depois que a página assenta, não mostram diferença visível em relação à `main`.
- [x] **Página inexistente.** Um endereço que não existe (ex.: `/nao-existe`) continua mostrando a
  página "Página não encontrada" com o link de volta ao início.
- [x] **Meta em produção.** Depois do merge e do deploy (o preview da Vercel exige login, ver
  0008), o Lighthouse mobile na produção dá Performance ≥ 90 na mediana de 3 execuções seguidas.
  Nessas execuções, Acessibilidade continua 100, a mediana do LCP fica em até 2,5 s e o CLS em até
  0,1. Vale uma rodada, com no máximo uma repetição, e todas as execuções ficam registradas. Se a
  produção ficar abaixo de 90 com os critérios lado a lado aprovados, o critério fica **parcial**,
  com os números, como na 0008.
- [x] **Portões verdes.**

## Fora de escopo

- Mudar visual, textos, animações, imagens ou a estratégia de fontes das specs 0004 e 0005.
- Reduzir ou desligar a aurora do hero ou o efeito do título de Contato no celular.
- Remover componentes de interface que não são usados.
- Otimizar o desktop além do que vier junto.

## Perguntas em aberto

Decisão da dona do produto (24/11/2026):

- **Seções abaixo da dobra:** aparecem sem esperar rolagem. Podem entrar uma de cada vez, mas
  continuam na página logo após o carregamento, sem afetar a busca do navegador nem o SEO. A opção
  de montar só ao se aproximar na rolagem foi descartada.

Suposições assumidas:

- **Sem mudança visível.** A meta deve ser atingida sem trocar aparência ou comportamento. Se só
  der para chegar a 90 cortando efeito ou mudando a estratégia de fontes, isso volta para decisão
  da dona do produto antes de ser feito.
- **Ruído do Lighthouse.** A nota em produção oscila bastante entre execuções seguidas (87 a 98 no
  mesmo dia). Por isso o aceite combina a meta em produção com uma comparação lado a lado contra a
  `main`, que mostra se o bloqueio caiu de fato.
- **Troca de fonte.** Reduzir o custo da troca sem mudar a estratégia (mesmas fontes, mesmo
  fallback, mesmo momento) é permitido, mas não exigido.
- **Ferramenta de medida.** Vale o Lighthouse mobile padrão desta máquina, como nas specs 0006 e
  0008.
