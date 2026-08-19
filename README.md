# A Sala de hoje e os desenhos propostos

As **quinze telas** da jornada da cliente, do @ na porta de entrada ao pedido entregue,
em três versões:

- **Modelo 1 — Front Atual.** Não é proposta: é o app de verdade (`apps/sala` do
  repositório `GSoaresTech/livequevende`), com o DOM de cada componente reproduzido
  classe por classe e o `estilos.css` do app por trás, apenas escopado.
- **Modelo 2 — Feito na mão.** O desenho já feito, o dos arquivos `.dc.html` exportados
  da ferramenta de design, reescrito sem o runtime `<x-dc>` / `DCLogic`.
- **Modelo 3 — BeHancer.** Desenho novo, feito do zero a partir das imagens
  enviadas: a Sala com cara de aplicativo — página branca com muito ar, composição
  centrada e uma barra escura flutuando na base. A barra tem cinco lugares — Catálogo,
  Sacola, Suporte, Pedidos e Meus dados — com o Suporte no meio; o círculo do gradiente
  desliza até a fatia tocada, e é ele que diz onde se está.

Mesmos preços, mesmas peças e mesmos pedidos nos três: o que muda é a estrutura.

### De onde vem o modelo 3

O **BeHancer** não saiu de uma folha em branco. Os protótipos e as ideias de estrutura que
lhe deram forma — a página branca com muito ar, a barra escura flutuando na base, a
composição centrada — vêm de trabalhos de UX/UI publicados por designers no **Behance**, e é
daí que vem o nome. Os três projetos usados como referência:

| Projeto | Autoria |
|---|---|
| [Urban Threads \| Fashion E-Commerce Web & App Design](https://www.behance.net/gallery/251688415/Urban-Threads-Fashion-E-Commerce-Web-App-Design) | Abdullah Sajol e Md Saidur |
| [Myclass UX UI \| Mobile App](https://www.behance.net/gallery/240420607/Myclass-UX-UI-Mobile-App) | PixellCode, Mahmoud Essam e Usf Satoor |
| [WeRate — Discover, Review & Earn \| UX Case Study](https://www.behance.net/gallery/253700747/WeRate-Discover-Review-Earn-UX-Case-Study) | Md Sakibur Hasan, ILmix Design Agency, UI Mahi, UI Nuruzzaman e UI Sabbir |

Além deles, dois **pins do Pinterest** — imagens soltas, não projetos inteiros:

| Pin | Serviu para |
|---|---|
| [br.pinterest.com/pin/25684660370421610](https://br.pinterest.com/pin/25684660370421610/) | o cartão que recebe os dados na tela 09 (escrever dentro do cartão, bandeira no canto, CVC no verso) |
| [br.pinterest.com/pin/420945896446485691](https://br.pinterest.com/pin/420945896446485691/) | o estilo geral das telas: página clara com muito ar, cantos arredondados, botão cheio |

Pin não é autoria: o Pinterest republica o desenho de outra pessoa e quase nunca diz de quem
é. Os dois estão registrados pelo link e pela finalidade — achar o autor original é tarefa
para antes da produção.

Nenhum arquivo desses projetos foi copiado para cá: o HTML e o CSS do modelo 3 são escritos
do zero, com os dados, os textos e as cores da Live que Vende. O que veio de lá é referência
visual e de estrutura.

**Se o modelo 3 for o escolhido, conferir os direitos de cada projeto antes de levar o
desenho para produção.** Referência para apresentar é uma coisa; base de um produto que vai
ao ar é outra.

> **O modelo 3 está sendo desenhado tela a tela.** Hoje existem a *Sacola da Live @*, o
> *Catálogo da Live*, o *Produto* e o *Cadastro*, mais a página *00 · Referências*; as
> outras sete aparecem no comparativo como lacuna assumida, com o bloco tracejado dizendo o
> que falta. É de propósito: numa apresentação, lacuna declarada é melhor que tela
> improvisada.
>
> **A barra flutuante só existe de dentro para dentro.** Na porta de entrada ela não
> aparece: antes do @ não há para onde navegar, e a barra ali só prometeria lugares que
> ainda não abriram. A primeira tela que a tem é o catálogo.
>
> **O catálogo abre pelo que está no ar.** A peça na câmera sai da grade e vira um cartão
> grande no topo, acima do título e dos filtros — primeiro “o que ela está mostrando?”,
> depois “o que eu perdi?”. Filtrar a lista não esconde esse cartão, e a peça não se
> repete lá embaixo. Qual peça está no ar é decidido por `produtoNaCamera()`, que devolve
> a primeira do catálogo — a mesma regra que o app usa para pôr o selo “Na câmera agora”.
>
> **O cadastro do modelo 3 não é um cadastro.** Nos modelos 1 e 2 ele é o formulário em
> branco do checkout: você digita tudo para ver o frete. No 3 ele é *Informações pessoais*,
> uma aba permanente com os dados já salvos e editáveis — o CPF, único campo em branco,
> aparece marcado no topo. É a diferença que o modelo de abas permite: os dados moram em
> algum lugar em vez de serem pedidos de novo a cada compra. Os valores saem de
> `CLIENTE.campos`, no `dados.js`, que é o mesmo endereço que os outros dois modelos já
> mostram no cartão de entrega.
>
> **A fatia do meio é o Suporte**, e é um link de verdade para o WhatsApp da loja, aberto
> em outra aba — em outra aba porque sair da página no meio de uma demonstração seria pior
> do que não abrir nada. O clique comum não sai na hora: sobe uma camada dizendo para onde
> se vai, conta 5-4-3-2-1 e então abre, com **Ir agora** para não esperar e **Cancelar**
> para desistir. O `data-sem-redesenho` do `app.js` sai antes do `preventDefault` para que
> o link continue real — abrir em nova aba pelo teclado ou pelo botão do meio do mouse pula
> a contagem e vai direto.

> Não afiliado à Meta ou ao Instagram.

---

## Como abrir

Sem build, sem dependência, sem servidor. HTML, CSS e JavaScript sem framework.

```bash
start index.html         # Windows
open index.html          # macOS
xdg-open index.html      # Linux
```

Se o navegador implicar com `file://`:

```bash
npx serve .
```

**Recarregue com `Ctrl` + `Shift` + `R`** depois de qualquer mudança: com `file://` o Chrome
guarda CSS e JS com unha e dente, e um reload normal mostra a versão velha.

---

## O que tem dentro

| Página | O que é |
|---|---|
| **`index.html`** | O início: o que muda entre os modelos e as quinze telas listadas |
| **`comparativo.html`** | As quinze telas, uma por faixa, com os modelos lado a lado |
| **`modelo-1.html`** | O Front Atual, tela por tela |
| **`modelo-2.html`** | O desenho feito na mão, tela por tela |
| **`modelo-3.html`** | O BeHancer, tela por tela · as quinze, mais a 16 para usar de verdade |

Nas páginas de fluxo, `←` e `→` navegam, `Home` e `End` vão às pontas, cada tela tem
endereço próprio (`#carrinho`), e trocar de modelo pelo topo **mantém a tela atual** — que é
o gesto que a comparação pede.

### O que dá para clicar

As escolhas são de verdade, e os valores se refazem na hora:

| Onde | O que muda | Em quais |
|---|---|---|
| **Catálogo** | Todos / Tamanho único / Até R$ 100 — filtra a grade e o contador | 2 e 3 |
| **Catálogo do modelo 3** | qualquer peça abre — a da câmera e as sete da grade. A tela de produto se monta com o nome, o preço, os tamanhos, o saldo e a descrição daquela peça | 3 |
| **Produto do modelo 3** | tamanhos e cores da peça aberta, e as miniaturas — a cor troca a foto e a tira de miniaturas | 3 |
| **Produto · quantidade** | − e + andam de um em um e param no saldo do tamanho escolhido (`variacoesDe`), como o `select` do app faz | 3 |
| **Carrinho do modelo 3** | − e + por item (param no saldo daquele tamanho), lixeira tira a peça e o **Desfazer** devolve — subtotal, total e o contador da barra acompanham | 3 |
| **Cadastro** | os três passos — contato, endereço e confirmação. O trilho do topo anda, o **Editar** da confirmação volta ao passo certo, e o que é digitado fica guardado ao trocar de passo | 3 |
| **Cadastro · confirmar** | o botão fica travado enquanto faltar dado obrigatório (hoje o CPF), com o motivo escrito acima | 3 |
| **Ir para a entrega** | o botão da sacola leva à tela de cadastro: troca de tela no fluxo, rola até a faixa no comparativo | 3 |
| **Carrinho com prazo** | o relógio anda sozinho de 15:00 até 00:00; no último minuto vira vermelho, e no zero a reserva cai — as peças desbotam e o botão passa a **Reservar de novo**, que devolve os 15 minutos | 3 |
| **Carrinho · Editar** | abre no cartão a troca de tamanho (com o saldo de cada um) e de cor — trocar a cor troca a foto, e trocar para um tamanho de saldo menor corta a quantidade | 3 |
| **Barra do modelo 3** | Catálogo / Sacola / Suporte / Pedidos / Meus dados — o círculo desliza até a fatia tocada | 3 |
| **Barra · Suporte** | avisa, conta 5-4-3-2-1 e abre o WhatsApp da loja em outra aba | 3 |
| **Desfechos do modelo 3** | `pix`, `cartao` e `recusado` leem a sacola e as escolhas de verdade: trocar peça, frete ou parcela muda o valor mostrado no comprovante | 3 |
| **Pagamento recusado** | leva de volta ao pagamento, e a saída pelo Pix já deixa o Pix escolhido ao chegar lá | 3 |
| **Frete e total** | Retirada, Sedex ou PAC — frete, total, rótulo do resumo e texto do rodapé | 1, 2 e 3 |
| **Frete e total · modelo 3** | a mesma tela também escolhe Pix ou cartão e mostra o desconto do Pix entrando no total; o **Alterar** do endereço vai direto ao passo 2 do cadastro | 3 |
| **Pagamento** | Pix ou cartão — o cartão abre o formulário | 1 e 2 |
| **Pagamento · modelo 3** | o atalho no alto pula direto para a outra forma: do Pix para o cartão e de volta | 3 |
| **Cartão do modelo 3** | os campos ficam no próprio plástico: o número se formata em blocos de quatro e o cartão gira para o verso quando o CVC recebe o foco | 3 |
| **Bandeira do cartão** | cinco placas iguais, Visa a Hipercard — a escolhida acende e vai para o canto do cartão, e a linha abaixo diz qual é e de onde veio. Sem escolha, o prefixo do número decide; tocar de novo na escolhida devolve o reconhecimento automático | 3 |
| **Pagamento · cartão** | 1x a 6x — valor da parcela, resumo e rótulo do botão | 1, 2 e 3 |
| **Live que Vende (tela 16)** | o aparelho inteiro: entra pelo @, abre o moletom, guarda na sacola, cadastra, paga e vê o pedido — as telas se chamam entre si sem sair da 16 | 3 |
| **Meus pedidos · modelo 3** | Todos / Em andamento / Entregues / Cancelados — o recorte muda a lista e cada aba já mostra quantos pedidos tem | 3 |
| **Detalhe do pedido · modelo 3** | lê a sacola de verdade: mexer nela muda os itens, o total do detalhe e o total do #4822 na lista | 3 |

**O pagamento são duas telas, não uma que troca.** `pagamento` é o Pix e `pagamentoCartao` é o
cartão; cada uma entra pelo próprio nome na barra lateral e tem faixa própria no comparativo.
Nenhuma função foi duplicada: a segunda é a mesma tela da primeira, e quem decide a forma é o
campo `fixo` da entrada em `TELAS` (`{ pagamento: 'cartao' }`), aplicado antes de desenhar.
Vale para os três modelos — o 1 e o 2 têm uma tela só que muda com a escolha, e cada faixa a
mostra na forma daquela faixa.

O estado viaja com a tela num `data-fixo`, então **um toque dentro dela não a vira na outra**:
tocar em "Cartão de crédito" dentro do Pix do modelo 2 não muda a tela, de propósito — quem
troca é a barra lateral, ou o atalho no alto da tela do modelo 3. O resto (parcelas, entrega,
filtros) continua respondendo normal.

**A tela 16 não é uma tela nova.** `app` mostra a *tela viva* do aparelho — o que ela
desenha é sempre uma das quinze. Um toque num link de dentro não mexe no endereço da
apresentação: troca a tela viva e redesenha o mesmo quadro, com a rolagem no topo, como um
toque de aplicativo faz. O `fixo` da entrada em `TELAS` viaja junto, senão o atalho do cartão
chegaria lá desenhado como Pix. Ela só existe no modelo 3, e fora dele os links continuam
levando pelo endereço, como sempre.

**Qualquer peça abre.** Não existe mais uma "peça aberta" fixa: `ESTADO.peca` guarda o
código tocado e `pecaAberta()` monta o resto a partir do próprio catálogo — os tamanhos e o
saldo saem do campo `saldo` (o mesmo que o modelo 1 lê), e vem escolhido o tamanho de maior
saldo. Abrir outra peça zera tamanho, cor, foto e quantidade da anterior. As cores continuam
sendo proposta de tela, e as descrições são texto de encher, como as fotos.

**O aparelho encolhe para caber.** Nas páginas de fluxo o quadro de 430 × 900 é medido
contra a janela: se não couber inteiro, encolhe na proporção — até a metade — em vez de sair
pela base, que é justo onde ficam a barra e o botão que fecha a compra. Em janela alta ele
fica no tamanho real. Vale para as três páginas de modelo, não só para a 16.

**Ela mexe em dado de verdade.** Guardar o moletom na sacola guarda mesmo: o carrinho, o
frete, o pagamento e o comprovante passam a contar quatro peças, e isso vale para as outras
faixas e para o comparativo, que leem a mesma sacola. O que estava escrito no cadastro fica
escrito. O **recomeçar do @**, na linha de apoio acima do aparelho, devolve a sacola de
fábrica, limpa o cadastro e volta para a porta de entrada — é controle da apresentação, por
isso mora fora do aparelho.

**Só o #4822 abre.** Na lista do modelo 3, o pedido de hoje é o único que vira link: é o
único que tem itens no protótipo, porque o detalhe monta a lista a partir da sacola. Os
outros quatro são linha de histórico — têm estado, valor e rastreio, não têm peças. Virar
link levaria a cliente para o pedido errado, então eles não são clicáveis.

A régua de quatro etapas no cartão (Pago · Separando · Enviado · Entregue) é leitura do
estado que já estava nos dados, não dado novo. O cancelado não tem régua: não parou no meio
do caminho, saiu dele.

O catálogo não filtra no modelo 1 porque o `Vitrine.tsx` do app **não tem filtros** — a
vitrine lista tudo o que a live já mostrou.

**Cuidado com o filtro "Até R$ 100":** ele não casa com nenhuma peça, porque a mais barata
do catálogo é o vestido midi preto a R$ 139,90. O rótulo veio dos arquivos `.dc.html` e os
preços também — a incoerência já estava no desenho original. As telas mostram um estado
vazio explicando, em vez de uma grade em branco. Trocar o rótulo para "Até R$ 200" em
`FILTROS`, no `dados.js`, resolve e passa a casar com três peças.

O estado mora em `ESTADO`, no `comum.js`; quem reage ao clique é o `app.js`, com um ouvinte
só por delegação para todas as telas.

---

## Os três

| Eixo | Modelo 1 · Front Atual | Modelo 2 · Feito na mão | Modelo 3 · BeHancer |
|---|---|---|---|
| O que é | o app de hoje, DOM e CSS reais | o desenho dos `.dc.html` | desenho novo, do zero |
| Estrutura | vitrine clara ao fundo, camadas sobre ela | camada branca sobre o escuro da live | página branca inteira, com barra na base |
| Ação primária | fixa na base da camada | fixa na base, largura total | sem casa hoje: o campo de código foi removido |
| Onde se está | pelo título da camada | pelo título da camada | pelo círculo que desliza até a fatia |
| Listas longas | rolam dentro da camada | rolam dentro da camada | rolam na página, por baixo das camadas |
| Forma | cantos 24px, gradiente de dois tons | cantos 22px, pílulas, gradiente de três tons | tudo em pílula, cantos 999px |
| Fonte | pilha de sistema, zero webfont | DM Sans | DM Sans |
| Aposta | nunca tirar a cliente da live | a mesma da Sala, com acabamento mais caprichado | parecer aplicativo, não página do Instagram |

**Os dois primeiros apostam na mesma coisa:** camada sobre a live, ação fixa na base. A
diferença entre eles é de acabamento, não de fluxo — o que significa que, sozinhos, eles não
ofereciam nenhuma decisão de *estrutura*. O modelo 3 é o que recoloca esse contraste: navega
por abas persistentes em vez de camadas empilhadas, e põe o contato com a loja a um toque de
distância em qualquer tela.

---

## Onde o Front Atual e o desenho não batem

Isto importa na hora de escolher, porque vira trabalho de backend, não de tela.

**O Front Atual tem menos telas.** Não existem "Frete", "Pix Enviado", "Cartão Aprovado" nem
"Detalhe do Pedido" como telas separadas: são estados dentro de `Cadastro`, `Pagamento` e
`Pedidos`. Nas faixas correspondentes, o modelo 1 mostra o componente real naquele estado —
nunca uma tela inventada.

**O Front Atual tem duas telas que o desenho não tem:** `ConferirWhatsapp` (a escada de
resgate da sacola) e `SemSala` (slug que não existe). Não entraram nas faixas porque não têm
correspondente do outro lado.

**O Front Atual tem menos estados de pedido.** O app só escreve "Aguardando pagamento",
"Pagamento confirmado", "Enviado" e "Cancelado". Os "Separando" e "Entregue" que o modelo 2
mostra **não existem no sistema hoje**.

---

## As quinze telas

`arroba` · `catalogo` · `produto` · `carrinho` · `carrinhoPrazo` · `cadastro` · `frete` ·
`pagamento` · `pagamentoCartao` · `pix` · `cartao` · `recusado` · `pedidos` · `detalhe` ·
`dados`

A `recusado` é o desfecho que faltava: `pix` e `cartao` mostram o pagamento que deu certo, e
ela mostra o que deu errado. Não existe no app hoje — ver o aviso do índice. Só o modelo 3 tem.

A `dados` é a última porque não é passo da compra: é a tela da aba **Meus dados**, onde a
pessoa edita contato e endereço fora do fluxo. Os mesmos dois blocos que o `cadastro` pede em
sequência, aqui ficam lado a lado para consulta e correção. Só o modelo 3 tem.

São duas sacolas de propósito: `carrinho` é a reserva **sem prazo**, que vale enquanto a live
estiver no ar, e `carrinhoPrazo` é a reserva **com relógio**, de `MINUTOS_DE_RESERVA` minutos
contando até zero. Só o modelo 3 tem a segunda.

No modelo 3 a tela `frete` faz mais do que nos outros dois: além da entrega, ela confirma o
endereço e escolhe a forma de pagamento, deixando para `pagamento` só o QR do Pix ou o
formulário do cartão. Por isso o total dela pode não bater com o dos modelos 1 e 2 na mesma
faixa do comparativo: quando o Pix está escolhido, o modelo 3 já mostra os 5% abatidos.

Nos modelos 1 e 2, `produto` até `pagamento` acontecem em camada sobre a vitrine; `arroba`,
`catalogo`, `pix`, `cartao`, `pedidos` e `detalhe` são página inteira.

---

## Estrutura

```
modelos/
├── index.html          o início
├── comparativo.html    15 faixas × 3 colunas
├── modelo-1.html       o Front Atual, navegável
├── modelo-2.html       o desenho feito na mão
├── modelo-3.html       o BeHancer, em desenho
├── _foto.html          ferramenta: renderiza uma tela nos modelos, para tirar foto
├── _barra.html         ferramenta: a barra do modelo 3 nas cinco posições
├── assets/img/         as fotos como você enviou
├── assets/pecas/       as mesmas, recortadas e centradas no mesmo quadro
├── css/
│   ├── base.css        tokens, moldura de celular, fragmentos compartilhados
│   ├── sala-real.css   CSS REAL da Sala, gerado e escopado — não editar à mão
│   ├── modelo-1.css    só o arnês que faz o app caber na moldura
│   ├── modelo-2.css    a forma do desenho feito na mão
│   ├── modelo-3.css    a forma do BeHancer
│   └── apresentacao.css  o material em volta das telas
└── js/
    ├── dados.js        produtos, sacola, pedidos, endereço, valores
    ├── comum.js        estado, dinheiro, ícones, foto, fragmentos compartilhados
    ├── modelo-1.js     o DOM real do app, componente por componente
    ├── modelo-2.js     as telas no desenho feito na mão
    ├── modelo-3.js     o desenho novo, tela a tela (4 de 11)
    └── app.js          monta o comparativo e os fluxos navegáveis
```

**A moldura de celular usa a classe `.celular`, e não `.tela`**, porque `.tela` é a classe
raiz do app de verdade: dentro da mesma página as duas se atropelariam.

### Para acrescentar uma tela ao modelo 3

Uma função a mais em `MODELO_3`, dentro de `js/modelo-3.js`, com o **id da tela** como nome
(`catalogo`, `produto`, `carrinho`…, a lista está em `TELAS`), e a forma dela em
`css/modelo-3.css`, escopada em `.m3`. Mais nada: o comparativo e o fluxo navegável passam
a mostrá-la sozinhos, e a lacuna tracejada some.

O `app.js` monta o registro com o que existir, então nada quebra no meio do caminho, e os
scripts de conferência descobrem sozinhos os modelos que estão na pasta.

**A moldura do modelo 3** é a função `m3Tela({ corpo, aba })`: ela devolve a página branca
com o corpo rolando por baixo e a barra flutuante por cima, já com a aba certa acesa. Quem
vai escrever uma tela nova chama ela e cuida só do miolo.

---

## Como o `sala-real.css` é gerado

Ele sai de `apps/sala/src/estilos.css` com **todo seletor prefixado por `.sala-real`**,
para o estilo do app não vazar na página de apresentação. `:root`, `html` e `body` viram o
próprio `.sala-real`; `@keyframes` fica intocado. Nada é reescrito à mão.

**Quando o app mudar, este arquivo fica desatualizado** — regerar é reaplicar o prefixo.

O `modelo-1.css` é só o arnês: prende os `position: fixed` do app dentro da moldura (via
`transform`, que cria bloco de contenção) e troca as unidades de viewport (`100dvh`, `86dvh`,
`100vw`) pela medida do retângulo de 430×900. Toda regra ali tem o motivo escrito; se uma
puder sair, deve sair.

**O `App.tsx` também pinta o fundo por fora do CSS:** ele alterna as classes
`fundo-entrada-arroba` e `fundo-vitrine-clara` no `<body>`, e as duas deixam o fundo branco.
O `modelo-1.js` põe essas classes no `.sala-real` conforme a tela. Sem elas sobra o
`--bg-base` escuro por baixo e a tela ganha tarjas pretas nas laterais que o app não tem.

---

## Onde o modelo 1 deixa de ser o app

O modelo 1 é a régua da comparação, então toda vez que ele se afasta do `apps/sala` isso tem
de estar escrito. Hoje há **uma** correção proposta, no fim do `modelo-1.css`, abaixo do
aviso `ATENÇÃO: daqui para baixo NÃO é o app`:

**O selo "Na câmera agora".** No app ele é absoluto no canto superior esquerdo do cartão,
com `max-width: calc(100% - 56px)` para não bater na pílula do código. Na vitrine clara o
cartão tem três colunas — sobram ~62px, e a frase quebra em três linhas dentro de um raio de
999px, virando um borrão por cima da foto. É justamente o elemento que existe para ser *lido*
por quem não distingue a borda rosa (GUIA §10). A correção devolve o selo ao fluxo (no DOM ele
já vem entre a foto e os dados) e o deixa ocupar a largura do cartão: uma linha, sem colisão.

**É candidata a virar correção no app.** Se entrar lá, esta seção some e a regra sai do arnês.

---

## Como conferir uma mudança

Ler o HTML gerado não pega defeito de layout — dois deles passaram por três verificações
antes de alguém olhar a tela. `_foto.html` existe para isso: renderiza uma tela nos modelos
lado a lado, e o Chrome tira a foto sem abrir janela.

```bash
chrome --headless=new --hide-scrollbars --virtual-time-budget=4000 \
  --window-size=1340,940 --screenshot=carrinho.png \
  "file:///.../modelos/_foto.html?t=carrinho"
```

`t` aceita qualquer um dos onze ids de tela; `f`, `e`, `p` e `n` forçam filtro, entrega,
forma de pagamento e parcelas, para fotografar o outro lado de cada escolha sem clicar; e
`c` dispara um clique de verdade num gatilho (`?t=catalogo&c=pedidos`), para fotografar o
**depois** do toque. Os arquivos começam com `_` porque não fazem parte da apresentação:
são ferramenta.

`_barra.html` mostra a barra do modelo 3 nas cinco posições de uma vez, e com
`?clique=perfil` dispara o toque e imprime o `ESTADO.aba` resultante — é o jeito de
conferir que o círculo anda de verdade, e não só que o CSS sabe onde pô-lo.

**Não editar estes arquivos com `Get-Content`/`Set-Content` do PowerShell 5.1:** ele lê
UTF-8 como ANSI e grava de volta em dupla codificação, o que corrompe todo acento do
arquivo de uma vez.

---

## Onde isto ainda não está pronto

**As fotos de produto são de exemplo.** Em `modelos/assets/pecas/` há quatro imagens — dois
moletons pretos (frente e costas), um moletom vermelho e um jeans —, distribuídas pelos sete
códigos do catálogo por `ARQUIVO_POR_CODIGO`, no `dados.js`. **Fora o A6, os nomes das peças
não batem com as fotos:** as imagens entraram para ver o desenho com foto de verdade, não para
casar com o catálogo. Trocar cada peça pela sua foto é mexer só nesse mapa. Preenchendo
`FOTO_UNICA` no mesmo arquivo, uma foto só vale para todas as peças de uma vez.

A peça aberta (A6) é o caso completo: `PRODUTO_ABERTO.cores` guarda, por cor, os arquivos que
a tira de miniaturas mostra — o preto tem frente e costas, o vermelho só a frente, porque é a
única foto vermelha que existe. Uma segunda foto vermelha entra como mais um item da lista.

O modelo 1 não entra nisso: sem foto cadastrada o app mostra a inicial do nome do produto, e é
isso que ele mostra — comportamento real, não espera minha.
**Sem QR do Pix.** O app recebe o QR do Mercado Pago em base64, em tempo real. No lugar dele
há um aviso dizendo o que entra ali; desenhar um QR falso seria pior.

**Os números são de exemplo,** e vieram dos arquivos `.dc.html`. Se um valor mudar, muda em
`dados.js` e atravessa os modelos de uma vez.

**As datas dos pedidos foram reformatadas** para o formato que o app usa (`17/08/2026 14:02`),
porque o `formatarData` real é `Intl.DateTimeFormat('pt-BR')` e não aceita "hoje, 14:02".

---

## Ao mexer

**Mudou um dado?** `dados.js`, e os modelos acompanham.

**Mudou o app?** Regerar o `sala-real.css` e conferir o DOM em `modelo-1.js` contra os
componentes. Uma classe emitida sem regra no CSS quase sempre é erro de digitação, e é
silenciosa: a tela renderiza igual, só sem estilo. (Hoje há uma só, `campo-com-status`, e ela
também não tem regra no app — é classe morta lá.)

**Uma tela nova?** Uma função com o mesmo nome em cada `modelo-*.js`, mais uma linha em
`TELAS` no `dados.js`. Faltando num modelo, a moldura mostra o aviso em vez de quebrar.
