---
numero: 0003
titulo: Redesign da página inicial
tipo: melhoria
prioridade: P1
status: implementada
toca: [interface, conteudo]
depende_de: ["0001", "0002"]
---

# 0003 — Redesign da página inicial

## Problema

A página inicial apresenta a autora como estudante: certificados e listas de tecnologias aparecem antes do trabalho, e só um projeto é mostrado. Recrutadores e líderes técnicos precisam entender em poucos segundos quem ela é, o que já construiu e em quais projetos comerciais atuou.

A referência visual aprovada é o arquivo do Figma "Sâmia Luvanice — Portfolio Redesign | Full Stack Developer" (https://www.figma.com/design/YNyHJNS6UGcAqZjFOJP5pB). Os quadros de referência são:

- "Desktop — Home" (página 02);
- "Tablet — Home (768)" e "Mobile — Home (390)" (página 03);
- os componentes da página 01.

A página fica minimalista, com pouco texto e cards de projeto clicáveis.

## Comportamento esperado

### Faixas de largura

- **Celular:** abaixo de 768 px.
- **Tablet:** de 768 a 1023 px.
- **Desktop:** a partir de 1024 px.

### Seções

A página é única e tem cinco seções, nesta ordem, alternando fundo escuro e claro.

**1. Hero (escuro, monocromático)**

- Retrato em preto e branco ao centro, com "SÂMIA" em marca d'água no fundo e o nome completo em letras grandes sobre a foto.
- Ao lado ficam "Full Stack Developer", a frase "Aplicações web completas — da interface ao banco de dados." e o botão "Vamos conversar", que leva ao Contato.
- No desktop e no tablet, o hero também tem links para GitHub, LinkedIn, currículo (PDF) e e-mail. No celular, esses links aparecem só no Contato.

**2. Projetos (claro)**

- Título "/PROJETOS", filtros Todos, Autorais e Comerciais e quatro cards grandes com screenshot real de cada projeto.
- Cada card mostra só a imagem, a categoria, um título curto e duas tags.
- Abaixo da grade, um link "Mais no GitHub" abre a lista de repositórios.
- O card inteiro é clicável e abre o projeto ao vivo em nova aba. Os destinos são:

| Card | Categoria | Título | Tags | Destino |
|---|---|---|---|---|
| BestPrice IA | Autoral | BestPrice IA — Monitor de preços com IA | SaaS · Full Stack | https://bestprice-stage.pages.dev/ |
| StudyNice | Autoral | StudyNice — Hábitos de estudo | Web App · Full Stack | https://studynice.vercel.app/ |
| Sound House | Comercial | Sound House — Aulas de música | Plataforma · Full Stack | https://www.soundhouse.com.br/ |
| Lopes Tech | Comercial | Lopes Tech — Software sob medida | Site institucional · Full Stack | https://lopestech.abeesys.com/ |

- Link de repositórios: https://github.com/SamiaLuvanice
- **Cor das imagens:**
  - Em telas com ponteiro, a imagem fica em preto e branco e ganha cor quando o card recebe o ponteiro ou o foco de teclado.
  - Em telas sem ponteiro (toque), a imagem aparece colorida.

**3. Expertise (escuro)**

- Título "/EXPERTISE" e cinco itens expansíveis com o nome em caixa alta. O primeiro começa aberto.
- Vários itens podem ficar abertos ao mesmo tempo.
- Ao abrir, um item mostra só as tecnologias e uma prévia visual, sem parágrafos:

| Item | Tecnologias | Prévia |
|---|---|---|
| Frontend | React, TypeScript, Next.js, Vite, Tailwind CSS, shadcn/ui, React Query, Recharts | screenshot do BestPrice IA |
| Backend | Python, FastAPI, SQLAlchemy, Alembic, PostgreSQL, Node.js, Django, MongoDB | quadro "regras na API" do BestPrice IA (respostas 201/200, 400, 409, 429, 503 e verificação de saúde) |
| Arquitetura & Integrações | REST, OAuth 2.0, Workers, Supabase, Gemini API, n8n | diagrama do BestPrice IA: interface → API → banco; worker → API do Mercado Livre; assistente de IA opcional |
| DevOps & Workflow | Git/GitHub, Docker, Pytest, Vitest, Playwright, CI no GitHub, Vercel, Cloudflare Pages, Render | quadro com os comandos dos portões de qualidade do BestPrice IA |
| IA no fluxo de engenharia | Claude Code, Codex, Cursor, Spec-driven, TDD | fluxo spec → plano → implementação → verificação |

As prévias reproduzem os quadros "Preview/Backend", "Preview/Arquitetura", "Preview/DevOps" e "Preview/IA" da página 01 do Figma.

**4. Experiência (claro, compacta)**

- Título "/EXPERIÊNCIA" e o texto fixo "2+ anos em desenvolvimento full stack".
- Uma linha por vínculo:
  - Sound House — Desenvolvedora Full Stack — mai 2024 — atual, com o selo "Atual";
  - Governo do Estado do Ceará — Suporte Técnico em Hardware e Software — set 2017 — atual.

**5. Contato (escuro)**

- "CONTATO" em marca d'água e o selo "Disponível para oportunidades".
- O título "VAMOS CONSTRUIR ALGO RELEVANTE?" e a linha "Aberta a oportunidades em desenvolvimento Full Stack.".
- O botão "Iniciar conversa", que abre um e-mail para samia.luvanice.dev@gmail.com. O endereço também aparece em texto.
- No rodapé ficam a marca SL e os links GitHub, LinkedIn e Currículo.

### Navegação

A navegação acompanha a rolagem nas duas versões.

- **Desktop:** barra fixa no topo com:
  - o selo de disponibilidade;
  - os links Projetos [04], Expertise [05], Experiência [02] e Contato, em que o número entre colchetes é a quantidade de itens da seção e não muda com o filtro;
  - o botão "Ver projetos", que leva à seção Projetos.
- **Tablet e celular:** barra fixa na parte inferior, com quatro links lado a lado (Projetos, Expertise, Experiência e Contato). Não tem marca SL nem menu compacto.
- **Seção atual:** nas duas versões, a seção visível fica indicada visualmente e para tecnologias assistivas.

### Relação com as specs anteriores

Esta spec substitui os critérios da 0001 sobre estes pontos:
- posição da barra no desktop;
- controle de tema;
- destinos Tecnologias e Certificados;
- marca SL na barra;
- menu compacto.

Da 0001, continuam valendo:
- a barra inferior translúcida no tablet e no celular, com margem da área segura;
- o foco visível;
- o respeito ao movimento reduzido.

O degradê da marca definido na 0002 continua no monograma SL, que agora aparece só no rodapé.

### Identidade

As famílias tipográficas e a paleta laranja, magenta e ciano do portfólio atual continuam.
- Todas as seções escuras usam o mesmo tom.
- O laranja aparece só em ações: botões principais e o controle de um item de Expertise aberto.
- O degradê aparece só no monograma.
- A página usa um esquema de cores fixo, sem alternância de tema.

Não há animação de entrada ao rolar. As transições ficam restritas a passar o ponteiro, focar e expandir.

## Critérios de aceite

**Estrutura e conteúdo**
- [ ] Ao abrir a página, as seções aparecem na ordem Hero, Projetos, Expertise, Experiência e Contato, com fundos escuro, claro, escuro, claro e escuro. Todas as seções escuras usam o mesmo tom.
- [ ] A página tem um único título principal com o nome "Sâmia Luvanice", legível por leitores de tela independentemente do efeito visual aplicado.
- [ ] As seções Sobre e Certificados e o botão de tema não existem mais. Nenhum link da página aponta para elas ou para os certificados.

**Hero**
- [ ] "Vamos conversar" leva ao Contato.
- [ ] No desktop e no tablet, os links de GitHub, LinkedIn, currículo e e-mail abrem os destinos corretos.

**Projetos**
- [ ] A seção mostra quatro cards com screenshot, categoria, título e as tags da tabela. Os cards não têm descrições longas nem listas de tecnologias.
- [ ] Clicar em um card, ou ativá-lo pelo teclado, abre em nova aba o destino da tabela. Cada destino responde.
- [ ] Com ponteiro, as imagens aparecem em preto e branco e ficam coloridas no ponteiro ou no foco de teclado. Em tela de toque, aparecem coloridas.
- [ ] "Autorais" mostra só BestPrice IA e StudyNice. "Comerciais" mostra só Sound House e Lopes Tech. "Todos" mostra os quatro. O filtro ativo é anunciado a tecnologias assistivas.
- [ ] "Mais no GitHub" abre a lista de repositórios em nova aba.

**Expertise**
- [ ] Os cinco itens aparecem com o primeiro aberto.
- [ ] Cada item abre e fecha por clique, Enter ou Espaço, sem fechar os demais, e informa se está expandido.
- [ ] Aberto, cada item mostra as tecnologias e a prévia da tabela.

**Experiência e Contato**
- [ ] Experiência lista só Sound House e Governo do Estado do Ceará, com cargo e período. Sound House mostra o selo "Atual". Lopes Tech não aparece nessa seção.
- [ ] "Iniciar conversa" abre um novo e-mail para samia.luvanice.dev@gmail.com, e o endereço aparece em texto.

**Navegação**
- [ ] No desktop (1440 px), a barra superior fica visível durante a rolagem, com as contagens [04], [05] e [02].
- [ ] No tablet (768 px) e no celular (390 e 320 px), a barra inferior fica visível com quatro links.
- [ ] Cada link e o botão "Ver projetos" levam à seção correspondente, e o título dela aparece sem ficar coberto pela barra.
- [ ] A seção visível aparece indicada visualmente e para tecnologias assistivas. Ao chegar ao fim da página, Contato fica indicado.

**Responsividade e acessibilidade**
- [ ] Em 320, 390, 768 e 1440 px, não há rolagem horizontal e nenhum conteúdo fica sobreposto à barra.
- [ ] No celular, as áreas de toque têm pelo menos 44 × 44 px.
- [ ] Textos e controles atendem ao contraste WCAG AA. Todo elemento interativo funciona pelo teclado e mostra foco visível.
- [ ] O retrato e os screenshots têm texto alternativo descritivo. As marcas d'água "SÂMIA" e "CONTATO" ficam ocultas para leitores de tela.
- [ ] Com a preferência por movimento reduzido, não há deslocamentos animados. Transições de cor e opacidade continuam permitidas.

**SEO e desempenho**
- [ ] O título da página, a descrição e os metadados de compartilhamento descrevem a autora como Full Stack Developer, sem referência às seções removidas.
- [ ] No preview do PR, o Lighthouse mobile mostra Performance ≥ 90, Acessibilidade ≥ 95, LCP ≤ 2,5 s e CLS ≤ 0,1.
- [ ] Imagens fora da primeira dobra carregam de forma preguiçosa e não competem com o retrato do hero, que é o primeiro recurso de imagem pedido. *(Ajustado na implementação: o navegador antecipa imagens preguiçosas a cerca de 1.250 px da tela, e Projetos começa logo abaixo da dobra. Por isso "não baixar na abertura" não é verificável sem adiar a montagem das seções, o que deslocaria as âncoras.)*
- [ ] Os portões do projeto passam.

## Fora de escopo

- A página de case study do BestPrice IA e sua rota, que ficam para a spec seguinte. Até lá, o card abre o projeto ao vivo.
- Novas fotografias. Capturar os screenshots dos quatro projetos e produzir as prévias da Expertise faz parte da entrega.
- Apagar os arquivos de certificado já publicados. Eles deixam de ser referenciados pela página, mas a remoção dos arquivos fica para depois.
- Versão do conteúdo em outro idioma.
- Animações de entrada ao rolar, parallax e efeitos pesados.

## Perguntas em aberto

- **Lopes Tech:** escopo, período e tecnologias ainda não foram confirmados. O card usa só a categoria "Comercial" e as tags da tabela. **Decidido em 17/11/2026 (spec 0004):** a autora mantém o card como está.
- **Autoria:** suposição de que BestPrice IA e StudyNice foram desenvolvidos individualmente. A categoria exibida é "Autoral". **Confirmado em 17/11/2026 (spec 0004):** os dois foram feitos só pela autora.
- **"2+ anos":** texto fixo, contado a partir de mai/2024 na Sound House. Revisar quando completar 3 anos.
- **Currículo:** suposição de que o PDF atual está atualizado. **17/11/2026:** a autora vai enviar uma versão nova, que entra numa mudança separada.
- **Retrato:** um recorte com fundo transparente melhoraria o hero. Sem ele, a foto escura atual é usada com as bordas esfumadas.
