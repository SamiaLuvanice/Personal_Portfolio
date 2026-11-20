# Plano — 0007 Copiar o e-mail na seção Contato

## Camadas tocadas

Só interface: um componente novo `src/components/CopyEmailButton.tsx` com o teste `CopyEmailButton.test.tsx`, a troca do link do endereço em `src/components/Contact.tsx` e o E2E de contato em `e2e/portfolio.spec.ts`.

## Decisões

- **Cópia:** `navigator.clipboard.writeText`. Se a API não existir ou a promessa for rejeitada (contexto inseguro, permissão negada), cai no estado de erro. Sem `document.execCommand("copy")`: está obsoleto, e o erro com seleção do texto já resolve o caso raro.
- **Estados:** `idle → copied → idle` (timer de 2 s, limpo ao desmontar e a cada novo clique) e `idle → error`. O erro fica até o próximo clique.
- **Anúncio:** uma região `role="status"` (`aria-live="polite"`) sempre presente no DOM e visualmente oculta (`sr-only`), com "E-mail copiado". O aviso de erro é texto visível dentro da mesma região, porque quem vê a tela também precisa dele.
- **Nome acessível:** `aria-label="Copiar e-mail"` fixo. O texto visível "Copiar"/"Copiado" está contido no nome ou é confirmado pela região de status (WCAG 2.5.3 *label in name*: "Copiar" está em "Copiar e-mail").
- **Seleção no erro:** `Selection.selectAllChildren` no elemento do endereço. O endereço também recebe `select-all`, para que um toque o selecione inteiro.
- **Estilo:** o mesmo da linha atual do endereço (cinza `muted`, sublinhado no hover), com os ícones `Copy`/`Check` do lucide, que já é dependência. `min-h-11 min-w-11` para a área de toque.

### Alternativas descartadas

- **Toast (sonner):** carrega e monta um provedor global só para um aviso, e o toast aparece longe do controle.
- **Manter o endereço como `mailto:`:** fica duplicado com o botão e não resolve o caso de quem não tem programa de e-mail.

## Testes

- **Unitário (Vitest + Testing Library):** sucesso (`writeText` chamado com o endereço, "Copiado", anúncio, volta a "Copiar" após 2 s com timers falsos); erro com rejeição e com a API ausente (aviso visível e endereço selecionado).
- **E2E:** desktop Chromium com permissão de clipboard: aciona o controle e lê a área de transferência. Nos demais projetos: só a presença e o nome. Axe já roda na home.

## Riscos

- A leitura da área de transferência no E2E depende de permissões do Chromium. Fora dele, o teste confere só o estado visível.
