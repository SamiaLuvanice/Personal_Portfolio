# Verificação — 0007 Copiar o e-mail na seção Contato

Branch `feat/copiar-email`, 20/11/2026, nesta máquina Windows.

## Portões

`node .agents/scripts/gates.mjs --skip-install`: lint, typecheck, test, build e e2e verdes (exit 0).

- **Vitest:** 44 testes em 9 arquivos. Os 6 de `CopyEmailButton.test.tsx` falharam antes da implementação pelo motivo esperado (módulo inexistente).
- **Playwright:** 75 passados e 5 pulados. Os 5 pulados são os testes só de desktop ou só de toque, que também são pulados na `main` (73 passados lá; os 2 a mais são o teste novo nos dois projetos).

## Critérios de aceite

| Critério | Resultado | Evidência |
| --- | --- | --- |
| Endereço visível e controle "Copiar e-mail" por mouse, toque e teclado, ≥ 44 × 44 px | Passou | E2E "contato copia o e-mail e confirma": Enter no desktop, toque no Pixel 7, caixa ≥ 44 px. Unitário de renderização |
| Cópia exata, "Copiado" e anúncio "E-mail copiado" | Passou | E2E lê a área de transferência real (Chromium com permissão) nos dois projetos. Unitário com `writeText` simulado |
| Volta a "Copiar" em ~2 s | Passou | Unitário com timers falsos; um novo clique reinicia a contagem. E2E espera "Copiar" em até 4 s |
| Erro: aviso visível e anunciado; endereço selecionado | Passou | Unitários com rejeição e com a API ausente: texto na região `status`, sem `sr-only`, seleção igual ao endereço |
| "Iniciar conversa" continua com assunto e corpo | Passou | E2E confere `mailto:` com `subject` e `body` |
| Axe sem violações sérias (desktop e celular) | Passou | E2E existente da home |
| Portões verdes | Passou | Acima |

## Revisão independente

Agente `code-reviewer`: nada bloqueia. Achados tratados:

- O E2E no celular aceitava sucesso ou erro. Agora concede a permissão e exige sucesso.
- O teste de erro passou a conferir que o aviso é visível.
- O aviso é repetido a cada nova cópia, com o nó recriado.
- Nenhum `setState` ou timer depois de o componente sair da tela.
- Testes de reinício e de limpeza do timer.
- O `body` do mailto passou a ser conferido no E2E, e o nome do teste antigo foi atualizado.

**Desvio aceito:** enquanto o botão mostra "Copiado" (cerca de 2 s), o texto visível não faz parte do nome acessível "Copiar e-mail" (WCAG 2.5.3). O impacto é pequeno: a confirmação também é anunciada pela região de status, e o nome volta a coincidir em seguida.

## Visual

Capturas da seção em 390 e 1280 px: o endereço e "Copiar" ficam numa linha, abaixo do botão laranja, no mesmo cinza de antes.

## Documentação

`node .agents/scripts/docs-impact.mjs` listou o `README.md`. O agente `doc-sync-onboarding` atualizou a descrição do Contact, a árvore de componentes e a seção "Contato". `docs/architecture.md` continua correto: o contato segue por `mailto:`.

## QA no fluxo real

Agente `qa`, com o Vite local e o Chromium headless. Todos os pontos passaram:

- **Só teclado:** o foco visível é um anel ciano de 2 px. Enter e Espaço copiam, o botão volta a "Copiar" em cerca de 2 s e o foco continua no botão.
- **Cópia sem a API ou sem permissão:** o aviso aparece e o endereço fica selecionado.
- **Larguras de 320, 390, 768 e 1280 px:** nenhuma tem rolagem horizontal, e o botão mede ≥ 44 × 44 px. Em 320 px, o "Copiar" desce para a linha de baixo, como esperado. Toque real a 320 e 390 px.
- **Contraste:** 7,22:1 no texto e no aviso, e 8,46:1 no hover.
- **Movimento reduzido e cores forçadas, nos temas claro e escuro:** o foco continua visível e a cópia funciona.

**Achado corrigido:** depois de um toque no celular, o hover ficava preso, com o texto sublinhado. Agora o hover só vale em dispositivos com mouse (`@media (hover: hover)`).

**Limites:** testado só no Chromium. Firefox, Safari e um leitor de tela real não foram testados. O anúncio foi conferido pelo conteúdo da região `status`.
