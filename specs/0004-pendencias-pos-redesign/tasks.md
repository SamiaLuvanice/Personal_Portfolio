# Tarefas — 0004 Pendências do redesign

- [x] **T1 — Fontes próprias.**
  - Red: E2E sem requisição a serviço de fontes, e com as famílias Sora e Space Grotesk aplicadas.
  - Green: instalar os pacotes, importar, trocar as famílias e tirar os links do `index.html`. Ajustar a espera do teste de foco.
  - Pronto quando: E2E verde e build sem requisição externa de fonte.
- [x] **T2 — Cache das imagens.**
  - Regra no `vercel.json`, com JSON válido.
  - Pronto quando: em produção, `curl -I` no retrato e numa captura mostra `max-age=604800`, e `/assets/` continua `immutable`.
- [x] **T3 — Imagem de prévia.**
  - Red: E2E dos metadados de imagem e da resposta 200 do arquivo.
  - Green: script de geração, `public/og-image.jpg` (1200 × 630, até 300 KB) e metadados.
  - Pronto quando: E2E verde e a imagem conferida visualmente.
- [x] **T4 — Conteúdo da 0003.** Marcar as perguntas em aberto como decididas.
- [x] **T5 — LinkedIn.** Abrir o link do site no Chrome e confirmar o perfil.
- [x] **T6 — Verificação.**
  - Portões completos.
  - Lighthouse mobile local.
  - Revisão independente, QA e `docs-impact`.
  - Depois do merge: Lighthouse, `curl -I` e validador de prévia em produção.
