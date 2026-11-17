---
numero: 0006
titulo: Hero Liquid Aurora — monocromático por padrão, cor pela interação
tipo: feature
prioridade: P1
status: pronta
toca: [interface, conteudo]
depende_de: ["0003", "0005"]
---

# 0006 — Hero Liquid Aurora: monocromático por padrão, cor pela interação

## Problema

O hero atual é limpo, mas estático: fundo escuro, retrato em preto e branco e nome gigante. Quem chega ao portfólio é principalmente recrutador ou pessoa da comunidade, e a primeira tela não mostra nenhum cuidado com experiência e interação. A foto do hero também ficou desatualizada: a versão aprovada agora é o recorte sem colares, com fundo transparente.

O redesign aprovado no Figma resolve isso com o conceito **"Monochrome by default. Color through interaction."**:

- **Onde está no Figma:** página "02 — Desktop + Prototype", seção "Hero — Liquid Aurora", e página "03 — Tablet & Mobile".
- **O que muda:** o fundo ganha formas fluidas em tons de cinza. As cores da marca e as cores naturais da foto aparecem só perto do ponteiro e somem quando ele sai.

## Comportamento esperado

**Composição (todas as larguras).**
- **Fundo:** o fundo escuro do site continua. Atrás do conteúdo há uma aurora de formas fluidas e faixas suaves, em tons de cinza e baixa opacidade.
- **Nome:** aparece em duas linhas, "SÂMIA" só com contorno e "LUVANICE" preenchido. Continua sendo o único título principal da página e é lido como "Sâmia Luvanice".
- **Foto:** é a nova, sem colares, em preto e branco, e se funde ao fundo pela base.
- **Apresentação:** abaixo do nome ficam "Full Stack Developer" e o texto "Transformo ideias em aplicações web completas, conectando interfaces intuitivas, soluções robustas e experiências digitais."
- **Ações:** "Explorar projetos" leva aos Projetos e "Entrar em contato" leva ao Contato.
- **Links profissionais:** GitHub, LinkedIn, Currículo em PDF e E-mail aparecem como ícones. Continuam sendo links com nome acessível e área de toque de pelo menos 44 × 44 px, e os externos continuam abrindo em nova aba.

**Layout, que depende da largura.**
- **A partir de 1024 px, editorial:** o nome é grande e fica parcialmente atrás da foto, levemente deslocada para a direita. A apresentação e as ações ficam embaixo à esquerda, e os links em coluna à direita.
- **Abaixo de 1024 px, empilhado:** o nome fica acima da foto, sem cobrir o rosto. Depois vêm a apresentação, as ações e os links em linha. O selo de disponibilidade e o botão "Ver projetos" do topo do hero continuam no celular e no tablet.

**Interação, que depende da capacidade do aparelho e vale em qualquer largura.**
- **Com mouse ou trackpad (hover e ponteiro fino):**
  - **Ao mover o ponteiro sobre o hero:** a cor aparece numa área circular de borda esfumada, com raio de cerca de um terço da altura do hero. A área segue o ponteiro com um atraso leve e fluido.
  - **Dentro da área:** a aurora ganha o magenta, o ciano e o laranja da marca, e a foto recupera as cores naturais.
  - **Fora da área:** tudo continua em preto e branco.
  - **Ao tirar o ponteiro do hero:** a cor desaparece aos poucos, em até 1,5 s.
- **Sem hover (toque):** um foco de cor mais discreto passeia devagar pela aurora e pela foto, sem precisar de interação. O hero nunca fica totalmente colorido.
- **Movimento constante:** em todos os casos, as formas da aurora derivam devagar e sem parar. A animação pausa quando o hero sai da tela ou quando a aba fica oculta.

**Movimento reduzido.** Com a preferência por movimento reduzido, nada se move:
- a aurora fica parada;
- o ponteiro não é seguido;
- um toque fixo e discreto de cor substitui a revelação;
- o conteúdo já aparece visível, sem esmaecimento.

**Entrada.** Ao carregar, a apresentação, as ações e os links aparecem com um esmaecimento curto. O nome e a foto não animam, para não atrasar a primeira pintura.

**Alto contraste (cores forçadas).** A aurora e o efeito de cor da foto somem, e as duas linhas do nome aparecem preenchidas com a cor de texto do sistema.

## Critérios de aceite

- [ ] **Conteúdo do hero.** Em 320, 390, 768 e 1280 px de largura, o hero mostra:
  - o nome como único `h1`, com nome acessível "Sâmia Luvanice";
  - "Full Stack Developer" e o texto de apresentação;
  - as ações "Explorar projetos" (para Projetos) e "Entrar em contato" (para Contato);
  - os quatro links profissionais com os destinos atuais, cada um com área de pelo menos 44 × 44 px, e os externos em nova aba.
- [ ] **Retrato.** O retrato exibido é a foto nova sem colares, com fundo transparente. Ele continua sendo a imagem prioritária: é a primeira imagem pedida e não é preguiçoso. As imagens decorativas da aurora só são pedidas depois que a página termina de carregar, sem competir com ele.
- [ ] **Revelação com mouse.** No desktop, depois de 1 s com o ponteiro parado sobre o hero, a revelação está ativa e o centro dela fica a até 40 px do ponteiro. Depois de 1,5 s com o ponteiro fora do hero, a revelação está totalmente apagada.
- [ ] **Preto e branco fora da revelação.** Sem revelação, a foto está em escala de cinza e a aurora não mostra as cores da marca. Com a revelação ativa, a área colorida tem raio de no máximo metade da altura do hero.
- [ ] **Movimento reduzido.** Mover o ponteiro não ativa a revelação, e nenhuma camada do hero tem animação em execução.
- [ ] **Toque.** Num aparelho sem hover e sem nenhuma interação, há um foco de cor visível que muda de posição entre dois instantes com 3 s de diferença. A intensidade dele é menor que a da revelação com o ponteiro.
- [ ] **Animação fora de vista.** Com o hero fora da tela, a deriva e o foco ambiente ficam pausados.
- [ ] **Rosto livre no celular.** Em 320 e 390 px, a caixa do nome não se sobrepõe ao terço superior da foto, e nenhum texto do hero ultrapassa a largura da tela.
- [ ] **Camadas decorativas.** A aurora e o efeito de cor da foto ficam ocultos para tecnologias assistivas e não recebem foco nem clique.
- [ ] **Acessibilidade e contraste.** A verificação automatizada de acessibilidade continua sem violações sérias ou críticas. Medido em captura, o texto de apresentação mantém contraste ≥ 4,5:1 também com a revelação centrada sobre ele. O contorno de "SÂMIA" tem pelo menos 3:1 em relação ao fundo.
- [ ] **Cores forçadas.** A aurora e o efeito de cor da foto ficam ocultos, e o nome aparece com a cor de texto do sistema.
- [ ] **Nome com a fonte do sistema.** Os critérios 1 e 2 da spec 0005 continuam valendo: o nome cabe e mantém o tamanho.
- [ ] **Lighthouse mobile.** No preview do PR e, depois do merge, em produção: Performance ≥ 90, Acessibilidade ≥ 95, LCP ≤ 2,5 s e CLS ≤ 0,1.
- [ ] **Portões verdes.**

## Relação com as specs anteriores

Esta spec substitui os seguintes pontos da 0003:
- o botão "Vamos conversar" do hero, que dá lugar a "Explorar projetos" e "Entrar em contato";
- a marca d'água "SÂMIA", porque "SÂMIA" agora é a primeira linha do título;
- o nome com mistura "difference" sobre o retrato;
- a ausência de links profissionais no hero do celular;
- a restrição do laranja às ações, porque no hero as cores da marca também aparecem na revelação;
- a ausência de animação de entrada, que agora existe no hero, mas não com movimento reduzido.

Da 0005, o critério 3 ("a aparência não muda") é substituído pelo novo layout. Os demais critérios das duas specs continuam valendo.

## Fora de escopo

- Mudar a barra de navegação, as demais seções ou o conteúdo de projetos.
- Usar o código-fonte do componente Liquid Aurora do 21st.dev. Ele exige chave de API e não foi inspecionado; a aurora é recriada a partir do visual aprovado no Figma.
- Efeitos com WebGL, canvas, partículas ou bibliotecas de animação novas.
- Seguir o dedo continuamente no toque.

## Perguntas em aberto

- **Menu:** o pedido falava em "competências", e o menu atual diz "Expertise". Assumido: o menu fica como está, porque a mudança está fora de escopo.
- **Fundo:** o Figma usa um preto levemente mais escuro. Fica o fundo escuro atual do site, para manter a alternância de seções da 0003.
- **Foto:** a autora forneceu o recorte sem colares (PNG transparente, 1087 × 1447). Ele é publicado em formato otimizado com 720 px de largura, como o retrato atual.
- **Teclado:** a revelação de cor é decorativa e não acompanha o foco do teclado. Quem navega pelo teclado vê o mesmo hero estático, com conteúdo e ações completos. Essa escolha é intencional.
