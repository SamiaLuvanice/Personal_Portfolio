---
name: po-intake
description: Refinar uma demanda de produto em uma spec verificável do portfólio. Use quando uma feature, melhoria ou bug precisa de escopo e critérios de aceite antes do planejamento.
---

# Intake de demanda

1. Identifique quem é afetado, o comportamento atual, o resultado esperado, o escopo, o impacto e as dependências. Para bugs, registre os passos de reprodução e o sintoma observado. Quando uma ambiguidade mudar o resultado, esclareça-a antes de fechar o aceite. Registre suposições menores na spec.
2. Aplique `spec-driven` para decidir se a demanda precisa de spec. Quando precisar, siga [o comando spec](../../commands/spec.md) e o [modelo do portfólio](../../../specs/0000-template/spec.md) para criar `specs/NNNN-<slug>/spec.md` com número sequencial e critérios demonstráveis. Considere acessibilidade, desempenho e SEO quando fizerem parte do comportamento afetado.
3. Vincule a Issue se a demanda já tiver uma. Quando a spec estiver pronta, encaminhe para revisão conforme o fluxo local. As decisões de implementação entram na etapa de plano.
