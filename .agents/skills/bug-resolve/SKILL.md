---
name: bug-resolve
description: Reproduzir falha, escrever teste de regressão, corrigir causa raiz e verificar.
---

# Resolver bug

Reproduza e guarde a evidência real (erro, log, resposta HTTP, captura). Delimite a camada que falhou
usando as fontes listadas nas regras do perfil. Escreva um teste que falha pelo sintoma, corrija a causa
(não o sintoma) e rode os portões da parte tocada. Registre observado e inferido separadamente e
capture o aprendizado com a skill `learnings` se ele generalizar.
