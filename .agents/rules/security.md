---
description: Segurança básica para a SPA estática (e para um backend, se voltar a existir).
---

# Segurança

- Hoje não há backend nem segredos no projeto. Se surgir algum, ele fica só em variável de ambiente:
  `.env` local (ignorado) e painel da Vercel; `.env.example` só com nomes e valores vazios.
  **Prefixo `VITE_` publica o valor no bundle do navegador**: nunca use esse prefixo para chave.
- Nada de chave de API no front: toda chamada a serviço com segredo exige um backend. Se um backend
  voltar (ex.: formulário de contato), a entrada é validada no servidor (schema, limite de tamanho),
  conteúdo do usuário é escapado antes de virar HTML e erros respondem mensagem genérica. A versão
  endurecida da antiga API de contato está no histórico do Git (PR #2) como referência.
- Cabeçalhos de segurança e cache ficam em `vercel.json`; links externos com `rel="noopener noreferrer"`.
- Varredura de segredos: gitleaks no pre-commit e no CI, além de `diagnose.mjs`. Segredo vazado é
  **revogado ou rotacionado** primeiro; reescrever histórico não basta.
- Dependências: leia `npm audit` e os alertas do GitHub; atualize lendo o changelog.
