# Plano — 0009 Performance mobile estável acima de 90

## Diagnóstico (observado)

Traces mobile com CPU 4x, da produção (`b2d3fb4`) e do build local, em 24/11/2026:

| Tarefa longa | Custo a 4x | Origem |
| --- | --- | --- |
| Renderização inicial | ~280 ms de script contínuo | React montando a primeira tela. Dentro dela, ~57 ms preparam a mesclagem de classes (`tailwind-merge`, chamado só pelo selo de disponibilidade) e ~26 ms vêm do `react-router`, que só separa a raiz do 404 |
| Primeiro layout | 590 a 730 ms (trace local), 139 ms (produção) | Custa o mesmo escondendo qualquer parte do hero. Também não muda sem as faces de fallback `local()`. Uma página mínima já custa ~100 ms aqui. **Não explicado**: fica como pendência |
| Seções abaixo da dobra | ~150 ms numa tarefa | As quatro montam juntas assim que os chunks chegam |
| Troca de fonte | 64 a 139 ms por relayout | Estratégia das specs 0004/0005, mantida |

Além disso, o primeiro `measure()` de `useActiveSection` chamava `getBoundingClientRect` dentro do commit inicial. Isso forçava o layout na mesma tarefa da renderização.

A nota varia com a carga da máquina: o `benchmarkIndex` do Lighthouse foi de 763 a 1333 no mesmo dia, e a mesma build local deu TBT de 12 a 399 ms. Por isso o aceite mede o tamanho das tarefas lado a lado, e não só a nota.

## Arquivos e camadas

| Arquivo | Mudança |
| --- | --- |
| `src/App.tsx` (+ `App.test.tsx`) | Sem `react-router`: `pathname === "/"` mostra `Index`, qualquer outro caminho mostra `NotFound`. A Vercel já reescreve tudo para o `index.html`. |
| `src/pages/NotFound.tsx` | Lê `window.location.pathname` em vez de `useLocation`. |
| `package.json` / `package-lock.json` | Remove `react-router-dom`. |
| `src/components/AvailabilityBadge.tsx`, `Navbar.tsx` | O selo recebe `display` (padrão `inline-flex`) em vez de `className` mesclada com `cn()`. O `tailwind-merge` sai do bundle inicial e vai para o chunk compartilhado das seções. |
| `src/pages/Index.tsx` (+ `Index.test.tsx`) | Os chunks das seções começam a baixar juntos na montagem, mas cada seção só monta depois que a anterior terminou e houve um momento ocioso (`requestIdleCallback` com `timeout` de 300 ms, ou `setTimeout` onde ele não existe). A montagem também é uma transição. Com âncora no endereço, ou num `hashchange`, monta todas de uma vez. |
| `src/hooks/use-active-section.ts` | A primeira medida vai para o próximo quadro (`schedule()`), fora do commit. |

## Decisões

- **Escalonar a montagem, sem esperar a rolagem.** Decisão da dona do produto: o conteúdo continua na página logo após o carregamento, para a busca do navegador e o SEO. Descartada a montagem por proximidade (`IntersectionObserver`). Ela tiraria mais trabalho do carregamento, mas deixaria o texto fora do DOM até a rolagem.
- **Sinal de "seção montada" dentro do mesmo `Suspense`.** O irmão `SectionReady` só faz commit junto com a seção, depois que o chunk chegou. Assim, a próxima seção nunca entra no mesmo commit. Descartado: contar só por tempo, que juntaria seções quando os chunks chegam juntos.
- **`startTransition` só na montagem das seções, não na renderização inicial.** Testada na renderização inicial, a transição dividia o script em fatias, mas deixava o evento `load` disparar antes de o hero existir no DOM. O E2E do hero pegou isso. Como a spec não admite mudança de ordem, ela foi descartada na raiz. As seções montam depois da primeira tela, então ali a transição não muda nada visível.
- **Recarga e voltar no histórico montam tudo.** O QA viu que, com a montagem escalonada, recarregar no meio da página voltava ao topo (0 de 6 contra 2 de 4 na `main`), porque o navegador restaura a rolagem enquanto a página carrega. Com `reload` ou `back_forward` (Navigation Timing), as seções montam de uma vez, como antes. A primeira visita, que é o caso medido pelo Lighthouse, continua escalonada.
- **Âncora monta tudo.** Mantém o realinhamento por `ResizeObserver` que já existe para `/#secao`. Se a pessoa clicar numa âncora durante a montagem, o `hashchange` completa as seções, e o navegador rola até o destino, que já existe como placeholder com altura mínima.
- **Remover o roteador** em vez de carregá-lo sob demanda. A SPA tem uma rota e um 404. Se surgir uma segunda página, o roteador volta junto com ela. Essa decisão é barata de reverter.
- **Fontes:** a investigação do primeiro layout não achou uma causa atribuível ao código. A estratégia das specs 0004/0005 fica como está.

## Riscos

- **Ordem de pintura.** As seções aparecem uma por vez, em placeholders com a mesma altura mínima de hoje. Abaixo da dobra isso não se vê, mas as capturas comparam o estado final.
- **Testes E2E com âncora:** cobertos pelo caminho "âncora monta tudo".
- **Ruído de medida:** o aceite exige comparação intercalada. A produção só se verifica depois do merge.
