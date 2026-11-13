---
description: Evidência antes de hipótese — leia o erro registrado antes de explicar uma falha.
alwaysApply: true
---

# Evidência antes de hipótese

Leia a saída completa do comando que falhou antes de propor causa. Separe **observado** de **inferido**.
As fontes de evidência de cada camada estão nas regras do perfil (ex.: `frontend.md`).

Teste verde só vale quando executou (contagem maior que zero; skip não conta). Teste novo de
comportamento deve falhar pelo motivo esperado antes da correção. Registre comando, resultado e limites
na verificação da spec (`specs/<id>/verification.md`) ou na descrição do PR quando não houver spec.
Nunca relate como executado algo que não rodou.
