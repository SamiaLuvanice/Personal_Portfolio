---
name: react-feature
description: Criar ou alterar componente, seção ou fluxo React + TypeScript nesta SPA.
---

# Feature React

Leia o contrato (se houver API) e `.agents/rules/frontend.md`. Comece pelo teste do estado visível
(Vitest + Testing Library, consultas por papel e rótulo). Chamadas HTTP em módulo tipado de `src/lib/`
com URL relativa; valide dados `unknown` antes de tratá-los como sucesso. O componente apresenta
carregamento, sucesso e falha compreensível; teste resposta inválida, erro HTTP e falha de rede.
Para seção nova da página, cubra também o smoke e2e (presença, âncora e axe). Rode os portões.
