---
numero: 0004
titulo: Pendências do redesign — prévia de link, cache de imagens e fontes próprias
tipo: melhoria
prioridade: P2
status: rascunho
toca: [interface, infraestrutura, conteudo]
depende_de: ["0003"]
---

# 0004 — Pendências do redesign

## Problema

A verificação da spec 0003 deixou limites que afetam quem recebe ou visita o portfólio:

- **Link compartilhado sem imagem.** No LinkedIn, no WhatsApp ou no Slack, o link aparece só com título e texto. Para recrutadores, uma prévia com rosto, nome e cargo chama mais atenção e passa mais confiança.
- **Imagens revalidadas a cada visita.** O retrato e as capturas dos projetos não têm validade de cache. O navegador consulta o servidor de novo a cada carregamento, e a primeira visita depois de um deploy ficou abaixo da meta de LCP (3,0 s).
- **Fontes de terceiros.** As fontes vêm de um serviço externo. Isso acrescenta conexões a outro domínio, pode causar troca de fonte visível em rede lenta, expõe a visita a esse terceiro e faz os testes ponta a ponta dependerem de rede externa.

Também ficaram perguntas de conteúdo, que a autora respondeu em 17/11/2026.

## Comportamento esperado

Ao colar o link do portfólio numa rede social ou num aplicativo de mensagens, aparece uma prévia grande com o retrato, o nome "Sâmia Luvanice" e o cargo "Full Stack Developer", com a identidade visual do site.

Em visitas repetidas, o retrato e as capturas dos projetos vêm do cache do navegador, sem nova consulta ao servidor durante o período de validade.

O texto continua com as mesmas famílias tipográficas, agora servidas pelo próprio domínio. Nenhuma requisição sai para serviços de fontes de terceiros.

## Critérios de aceite

- [ ] A página publica metadados Open Graph e Twitter de imagem grande. A imagem absoluta tem 1200 × 630 px, até 300 KB, e um texto alternativo. Ela mostra o retrato, o nome e o cargo legíveis.
- [ ] A URL da imagem de prévia responde 200 com tipo de imagem em produção. Um validador de prévia (ex.: o Post Inspector do LinkedIn ou um equivalente) mostra a imagem.
- [ ] O retrato do hero e as capturas dos projetos respondem com validade de cache de pelo menos 7 dias. Os arquivos com hash do build mantêm o cache longo e imutável.
- [ ] Ao carregar a página, nenhuma requisição vai para domínios de fontes de terceiros. Títulos e texto usam as mesmas famílias de antes.
- [ ] O Lighthouse mobile mantém a meta da 0003: Performance ≥ 90, Acessibilidade ≥ 95, LCP ≤ 2,5 s e CLS ≤ 0,1.
- [ ] Os testes ponta a ponta passam sem acesso a serviços de fontes de terceiros.
- [ ] As perguntas em aberto da 0003 estão registradas como decididas: Lopes Tech mantida como está; BestPrice IA e StudyNice confirmados como autorais.
- [ ] O link do LinkedIn exibido no site abre o perfil correto, conferido num navegador real.
- [ ] Portões verdes.

## Fora de escopo

- Troca do currículo em PDF. A autora vai enviar uma versão nova, que entra numa mudança separada.
- Retrato recortado com fundo transparente.
- Mudanças de layout, cor ou texto da página.

## Perguntas em aberto

- **Validade do cache das imagens:** os nomes desses arquivos não mudam a cada versão. Uma imagem substituída sem mudar o nome pode levar até o fim da validade para chegar a quem já visitou. Assumido: aceitável para um portfólio, desde que um arquivo substituído ganhe nome novo.
- **"2+ anos":** continua correto até mai/2027. Nenhuma ação agora.
