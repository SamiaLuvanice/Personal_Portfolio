---
description: Segurança básica para SPA + funções serverless.
---

# Segurança

- Segredos só em variáveis de ambiente: `.env` local (ignorado) e painel da Vercel. `.env.example`
  só tem nomes e valores vazios. **Prefixo `VITE_` publica o valor no bundle do navegador**: nunca use
  esse prefixo para chave de serviço.
- Toda entrada externa é validada no servidor (schema), com limite de tamanho. Conteúdo do usuário é
  escapado antes de virar HTML (e-mail inclusive). Erros respondem mensagem genérica; detalhes vão
  para o log, sem segredos.
- CORS só com origens explícitas quando necessário; same-origin (`/api`) é o padrão.
- Varredura de segredos: gitleaks no pre-commit e no CI, além de `diagnose.mjs`. Segredo vazado é
  **rotacionado** primeiro; reescrever histórico não basta.
- Dependências: leia `npm audit` e os alertas do GitHub; atualize lendo o changelog.
