const LOJA = {
  nome: 'belissima-atacadista',
  nomeCaixaAlta: 'BELISSIMA-ATACADISTA',
  inicial: 'B',
  situacao: 'ao vivo agora',
  whatsapp: '(11) 98888-7777',
  whatsappLink: 'https://wa.me/5511988887777',
};

const CLIENTE = {
  arroba: '@maria.silva',
  nome: 'Maria Silva',
  inicial: 'M',
  endereco: ['Av. Paulista, 1000 — apto 52', 'Bela Vista, São Paulo — SP', 'CEP 01310-100'],
  enderecoLinha: 'Av. Paulista, 1000 — apto 52 · Bela Vista, São Paulo — SP · CEP 01310-100',
  whatsapp: '(11) 98888-7777',
  /* O mesmo endereço acima, campo a campo. CPF em branco de propósito: é o
     único dado que falta, e é o que dá o que fazer na tela. */
  campos: {
    nome: 'Maria Silva',
    cpf: '',
    zap: '(11) 98888-7777',
    cep: '01310-100',
    rua: 'Av. Paulista',
    num: '1000',
    bairro: 'Bela Vista',
    compl: 'apto 52',
    cidade: 'São Paulo',
    uf: 'SP',
  },
};

const PRODUTOS = [
  { codigo: 'A1', nome: 'Vestido longo listrado off white', centavos: 18990, saldo: 'P: 6 · M: 7 · G: 7', tipo: 'vestido',
    descricao: 'Vestido longo em viscose leve, listras finas, alças ajustáveis e fenda lateral discreta.' },
  { codigo: 'A2', nome: 'Calça wide leg pesponto branco', centavos: 22990, saldo: '38: 4 · 40: 6 · 42: 3', tipo: 'calça',
    descricao: 'Calça de cintura alta em sarja, pernas largas e pesponto branco aparente. Bolsos embutidos na lateral.' },
  { codigo: 'A3', nome: 'Conjunto tricot caramelo', centavos: 21990, saldo: 'ÚNICO: 8', tipo: 'conjunto',
    descricao: 'Conjunto de tricot canelado: blusa de manga curta e short de cós elástico. Tamanho único, veste do P ao G.' },
  { codigo: 'A4', nome: 'Conjunto linho cropped e short', centavos: 19990, saldo: 'P: 5 · M: 5 · G: 4', tipo: 'conjunto',
    descricao: 'Conjunto de linho com blusa cropped de botões e short de cós alto. O short é forrado.' },
  { codigo: 'A5', nome: 'Conjunto alfaiataria marrom', centavos: 24990, saldo: 'M: 4 · G: 4', tipo: 'conjunto',
    descricao: 'Conjunto de alfaiataria em tecido encorpado: blazer de botão único e calça de pregas com caimento reto.' },
  { codigo: 'A6', nome: 'Moletom capuz oversized', centavos: 17990, saldo: 'P: 3 · M: 4 · G: 3 · GG: 1', tipo: 'moletom',
    descricao: 'Moletom flanelado por dentro, capuz forrado com cordão e bolso canguru. Punho e barra em ribana, caimento oversized.' },
  { codigo: 'A7', nome: 'Vestido midi preto', centavos: 13990, saldo: 'P: 5 · M: 5 · G: 4', tipo: 'vestido',
    descricao: 'Vestido midi de malha canelada, manga curta e fenda atrás. Cai bem com tênis ou com salto.' },
];

const FILTROS = ['Todos', 'Tamanho único', 'Até R$ 100'];

/* Qual peça abre é escolha de quem toca no catálogo — está em ESTADO.peca, e
   quem monta a peça inteira é pecaAberta(), no comum.js. */

const CORES_DA_LOJA = {
  preto: { nome: 'Preto', hex: '#1B1B1C', foto: 'pecas/1.png' },
  vermelho: { nome: 'Vermelho', hex: '#8B2F3C', foto: 'pecas/3.png' },
  jeans: { nome: 'Jeans', hex: '#5F7490', foto: 'pecas/4.png' },
};

const CORES_POR_CODIGO = {
  A1: ['preto', 'vermelho'],
  A2: ['jeans'],
  A3: ['vermelho', 'preto'],
  A4: ['preto', 'vermelho'],
  A5: ['vermelho', 'preto'],
  A6: ['preto', 'vermelho'],
  A7: ['preto', 'vermelho'],
};

/* Quando uma cor tem mais de uma foto — o moletom preto tem frente e costas. */
const FOTOS_POR_COR = {
  'A6:preto': ['pecas/1.png', 'pecas/2.png'],
};

/* Quanto tempo a loja segura a sacola quando a reserva tem prazo. Baixe para 1
   se quiser ver o fim da contagem numa demonstração. */
const MINUTOS_DE_RESERVA = 15;

const SACOLA = [
  { codigo: 'A1', nome: 'Vestido longo listrado off white', centavos: 18990, tamanho: 'M', cor: 'preto', qtd: 1, tipo: 'vestido' },
  { codigo: 'A3', nome: 'Conjunto tricot caramelo', centavos: 21990, tamanho: 'ÚNICO', cor: 'vermelho', qtd: 1, tipo: 'conjunto' },
  { codigo: 'A2', nome: 'Calça wide leg pesponto branco', centavos: 22990, tamanho: '40', cor: 'jeans', qtd: 1, tipo: 'calça' },
];

const ENTREGAS = [
  { id: 'retirada', nome: 'Retirada na loja', apoio: 'Pronto em até 2h · combinar no WhatsApp', centavos: 0 },
  { id: 'sedex', nome: 'Sedex', apoio: 'Chega em 2 a 4 dias úteis', centavos: 3290 },
  { id: 'pac', nome: 'PAC', apoio: 'Chega em 6 a 10 dias úteis', centavos: 1890 },
];

/* O desconto do Pix já estava embutido no valor do PEDIDO_PIX. Agora é um
   número só, e o selo sai dele. */
const DESCONTO_PIX = 0.05;

const PAGAMENTOS = [
  { id: 'pix', nome: 'Pix', apoio: 'Aprovação na hora', selo: `${DESCONTO_PIX * 100}% off` },
  { id: 'cartao', nome: 'Cartão de crédito', apoio: 'Em até 6x', selo: '' },
];

/* Prefixos suficientes para a tela reconhecer a bandeira enquanto se digita.
   Não é validação de cartão: é o desenho reagindo ao número. */
const BANDEIRAS = [
  { id: 'visa', nome: 'Visa', comeca: /^4/ },
  { id: 'master', nome: 'Mastercard', comeca: /^(5[1-5]|2[2-7])/ },
  { id: 'amex', nome: 'American Express', comeca: /^3[47]/ },
  { id: 'elo', nome: 'Elo', comeca: /^(4011|4312|4389|5041|5067|6277|6362|6363)/ },
  { id: 'hiper', nome: 'Hipercard', comeca: /^(606282|3841)/ },
];

const CAMPOS_DO_CARTAO = [
  { id: 'numero', rotulo: 'Número do cartão', dica: '0000 0000 0000 0000', tam: 19 },
  { id: 'nome', rotulo: 'Nome impresso', dica: 'como está no cartão', tam: 26 },
  { id: 'validade', rotulo: 'Validade', dica: 'MM/AA', tam: 5 },
  { id: 'cvc', rotulo: 'CVC', dica: '000', tam: 4 },
];

const CAMPOS_CADASTRO = [
  { id: 'nome', rotulo: 'Nome completo', porque: 'quem recebe a encomenda', larg: 'cheia' },
  { id: 'cpf', rotulo: 'CPF', porque: 'exigido pela transportadora para emitir a etiqueta', dica: '000.000.000-00', larg: 'cheia' },
  { id: 'zap', rotulo: 'WhatsApp', porque: 'para a loja combinar a entrega', dica: '(11) 98888-7777', larg: 'cheia' },
  { id: 'cep', rotulo: 'CEP', porque: 'é ele que calcula o frete', dica: '01310-100', larg: 'cheia', destaque: true },
  { id: 'rua', rotulo: 'Rua', larg: 'ampla' },
  { id: 'num', rotulo: 'Número', larg: 'estreita' },
  { id: 'bairro', rotulo: 'Bairro', larg: 'meia' },
  { id: 'compl', rotulo: 'Complemento', porque: 'se tiver', dica: 'apto, bloco', larg: 'meia', opcional: true },
  { id: 'cidade', rotulo: 'Cidade', larg: 'ampla' },
  { id: 'uf', rotulo: 'UF', larg: 'estreita' },
];

const PEDIDO_PIX = {
  id: '#4821',
  valor: 63897,
  entrega: 'Sedex · 2 a 4 dias úteis',
  etapas: [
    { titulo: 'Comprovante recebido', apoio: 'agora mesmo', estado: 'feito' },
    { titulo: 'Loja confirmando o pagamento', apoio: 'costuma levar até 10 minutos', estado: 'agora' },
    { titulo: 'Pedido enviado', apoio: 'você recebe o código de rastreio no WhatsApp', estado: 'depois' },
  ],
};

const PEDIDO_CARTAO = {
  id: '#4822',
  cartao: '•••• •••• •••• 4218',
  subtotal: 63970,
  frete: 3290,
  total: 67260,
  parcelas: '4x de R$ 168,15 sem juros',
  etapas: [
    { titulo: 'Pagamento aprovado', apoio: 'agora mesmo', estado: 'feito' },
    { titulo: 'Loja separando suas peças', apoio: 'envio em até 1 dia útil', estado: 'agora' },
    { titulo: 'Pedido enviado', apoio: 'você recebe o código de rastreio no WhatsApp', estado: 'depois' },
  ],
};

/* A recusa não existe no app hoje: ele só tem "Aguardando pagamento" e
   "Cancelado". É proposta de tela, como a cor e o prazo da sacola. */
const PAGAMENTO_RECUSADO = {
  id: '#4823',
  motivo: 'O banco não autorizou a compra',
  detalhe: 'A operadora não conta o motivo para a loja. Costuma ser limite disponível, cartão bloqueado para compras pela internet, ou algum dado digitado diferente do que o banco tem no cadastro.',
  tentativa: 'agora mesmo',
};

const ABAS_PEDIDOS = ['Todos', 'Em andamento', 'Entregues', 'Cancelados'];

/* Cada aba é um recorte por estado. "Todos" não entra: é a ausência de recorte. */
const PEDIDOS_POR_ABA = {
  'Em andamento': ['Separando', 'Enviado'],
  Entregues: ['Entregue'],
  Cancelados: ['Cancelado'],
};

/* A régua do cartão de pedido: quantas destas quatro o pedido já venceu.
   O cancelado fica fora dela — não parou no meio do caminho, saiu do caminho. */
const ETAPAS_DO_PEDIDO = ['Pago', 'Separando', 'Enviado', 'Entregue'];

const PEDIDOS = [
  {
    id: '#4822', data: 'hoje, 14:02', estado: 'Separando', tom: 'rosa',
    codigos: ['A1', 'A3', 'A2'], resumo: 'Vestido longo listrado + 2 peças', qtd: 3,
    total: 'R$ 672,60', pagamento: 'cartão 4x', rastreio: 'Envio em até 1 dia útil',
  },
  {
    id: '#4790', data: '12 ago', estado: 'Enviado', tom: 'azul',
    codigos: ['B4', 'B7'], resumo: 'Conjunto linho + 1 peça', qtd: 2,
    total: 'R$ 289,80', pagamento: 'Pix', rastreio: 'Rastreio BR9284517 — a caminho',
  },
  {
    id: '#4711', data: '28 jul', estado: 'Entregue', tom: 'verde',
    codigos: ['C2'], resumo: 'Vestido longo floral azul', qtd: 1,
    total: 'R$ 169,90', pagamento: 'Pix', rastreio: 'Entregue em 31 jul',
  },
  {
    id: '#4602', data: '9 jul', estado: 'Entregue', tom: 'verde',
    codigos: ['D1', 'D5', 'D9'], resumo: 'Vestido midi preto + 2 peças', qtd: 3,
    total: 'R$ 549,70', pagamento: 'cartão 3x', rastreio: 'Entregue em 14 jul',
  },
  {
    id: '#4488', data: '21 jun', estado: 'Cancelado', tom: 'cinza',
    codigos: ['E3'], resumo: 'Vestido longo listrado off white', qtd: 1,
    total: 'R$ 229,90', pagamento: 'Pix não pago', rastreio: 'Reserva expirada em 30 min',
  },
];

const TIPO_POR_CODIGO = {
  A1: 'vestido', A2: 'calça', A3: 'conjunto', A4: 'conjunto', A5: 'conjunto',
  A6: 'moletom', A7: 'vestido', B4: 'conjunto', B7: 'conjunto',
  C2: 'vestido', D1: 'vestido', D5: 'conjunto', D9: 'calça', E3: 'vestido',
};

/* Preenchido, vale uma foto só em todas as peças; vazio, vale o arquivo de
   cada código em ARQUIVO_POR_CODIGO. */
const FOTO_UNICA = '';

const ARQUIVO_POR_CODIGO = {
  A1: 'pecas/1.png',
  A2: 'pecas/4.png',
  A3: 'pecas/3.png',
  A4: 'pecas/2.png',
  A5: 'pecas/3.png',
  A6: 'pecas/1.png',
  A7: 'pecas/2.png',
  B4: 'pecas/2.png',
  B7: 'pecas/3.png',
  C2: 'pecas/1.png',
  D1: 'pecas/1.png',
  D5: 'pecas/3.png',
  D9: 'pecas/4.png',
  E3: 'pecas/2.png',
};

const TONS_DE_ESTADO = {
  rosa: ['#EC4899', '#FFF7FD'],
  azul: ['#3B82F6', '#EAF1FD'],
  verde: ['#16A34A', '#E9F8EF'],
  cinza: ['#6B6B7A', '#F1F5F9'],
};

const ANDAMENTO_4822 = [
  { titulo: 'Pedido feito na live', apoio: 'hoje, 14:02', estado: 'feito' },
  { titulo: 'Pagamento aprovado', apoio: 'cartão de crédito · 14:03', estado: 'feito' },
  { titulo: 'Loja separando suas peças', apoio: 'envio em até 1 dia útil', estado: 'agora' },
  { titulo: 'Pedido enviado', apoio: 'rastreio chega no WhatsApp', estado: 'depois' },
  { titulo: 'Entregue', apoio: 'previsão 2 a 4 dias úteis após o envio', estado: 'depois' },
];

const REFERENCIAS = [
  {
    titulo: 'Urban Threads | Fashion E-Commerce Web & App Design',
    autoria: 'Abdullah Sajol e Md Saidur',
    link: 'https://www.behance.net/gallery/251688415/Urban-Threads-Fashion-E-Commerce-Web-App-Design',
    url: 'behance.net/gallery/251688415/Urban-Threads',
    oque: 'Plataforma de e-commerce de moda para web e celular. Mostra as telas de descoberta de produto e de finalização da compra em versão responsiva, com pesquisa de usuário, wireframes e sistema de design por trás.',
    ferramentas: 'Figma e Photoshop',
    marcas: ['E-commerce', 'Moda', 'App', 'Estudo de caso'],
  },
  {
    titulo: 'Myclass UX UI | Mobile App',
    autoria: 'PixellCode, Mahmoud Essam e Usf Satoor',
    link: 'https://www.behance.net/gallery/240420607/Myclass-UX-UI-Mobile-App',
    url: 'behance.net/gallery/240420607/Myclass-UX-UI-Mobile-App',
    oque: 'Aplicativo de educação para alunos e professores. É uma sequência longa de telas de celular cuidando de turma, conversa entre aluno e professor e atividades — o repertório de navegação por abas do qual saiu a barra da base.',
    ferramentas: 'Adobe XD, Photoshop e After Effects',
    marcas: ['App', 'Educação', 'UI/UX'],
  },
  {
    titulo: 'WeRate — Discover, Review & Earn | UX Case Study',
    autoria: 'Md Sakibur Hasan, ILmix Design Agency, UI Mahi, UI Nuruzzaman e UI Sabbir',
    link: 'https://www.behance.net/gallery/253700747/WeRate-Discover-Review-Earn-UX-Case-Study',
    url: 'behance.net/gallery/253700747/WeRate',
    oque: 'Estudo de caso de um app iOS de descobrir lugares, avaliar e ganhar por isso. Trabalha muito espaço em branco, composição centrada e cartão de destaque — a gramática visual que este modelo segue.',
    ferramentas: 'Figma, Photoshop e React',
    marcas: ['App iOS', 'Estudo de caso', 'UI/UX'],
  },
];

/* Duas imagens soltas do Pinterest, não projetos inteiros como os do Behance.
   O pin republica desenho de outra pessoa e não diz de quem é, então aqui fica
   registrado o link e para que cada um serviu — a autoria não dá para afirmar. */
const REFERENCIAS_PIN = [
  {
    titulo: 'O cartão que recebe os dados',
    onde: 'tela 09 · Pagamento · Cartão',
    link: 'https://br.pinterest.com/pin/25684660370421610/',
    url: 'br.pinterest.com/pin/25684660370421610',
    oque: 'De onde veio a ideia de escrever dentro do cartão em vez de num formulário embaixo dele: número no meio em fonte de máquina, bandeira num canto, nome e validade na base e o CVC aparecendo quando o cartão vira.',
  },
  {
    titulo: 'O estilo da página',
    onde: 'todas as telas',
    link: 'https://br.pinterest.com/pin/420945896446485691/',
    url: 'br.pinterest.com/pin/420945896446485691',
    oque: 'Referência do jeito geral das telas — a página clara com muito ar, os cantos bem arredondados, o texto de apoio miúdo em cinza e o botão cheio ocupando a largura toda.',
  },
];

const TELAS = [
  { id: 'arroba', titulo: 'Sacola da Live @', apoio: 'entrada pelo @, antes da vitrine' },
  { id: 'catalogo', titulo: 'Catálogo da Live', apoio: 'as peças já mostradas na live' },
  { id: 'produto', titulo: 'Produto', apoio: 'a peça aberta, tamanho e quantidade' },
  { id: 'carrinho', titulo: 'Carrinho', apoio: 'o que está guardado até o fim da live' },
  { id: 'carrinhoPrazo', titulo: 'Carrinho com prazo', apoio: `reserva de ${MINUTOS_DE_RESERVA} minutos correndo até zero` },
  { id: 'cadastro', titulo: 'Cadastro', apoio: 'em três passos: contato, endereço e confirmação' },
  { id: 'frete', titulo: 'Frete e Total', apoio: 'endereço, entrega, total com frete e forma de pagamento' },
  /* Duas telas em vez de uma que troca: cada uma entra pela barra lateral com o
     nome dela, e o `fixo` diz em que forma de pagamento ela é desenhada. */
  { id: 'pagamento', titulo: 'Pagamento · Pix', apoio: 'o QR e o copia e cola', fixo: { pagamento: 'pix' } },
  { id: 'pagamentoCartao', titulo: 'Pagamento · Cartão', apoio: 'os dados do cartão e as parcelas', fixo: { pagamento: 'cartao' } },
  { id: 'pix', titulo: 'Pix Enviado', apoio: 'comprovante recebido, loja confirmando' },
  { id: 'cartao', titulo: 'Cartão Aprovado', apoio: 'pagamento aprovado na hora' },
  { id: 'recusado', titulo: 'Pagamento Recusado', apoio: 'o que fazer quando o cartão não passa' },
  { id: 'pedidos', titulo: 'Meus Pedidos', apoio: 'histórico pelo @' },
  { id: 'detalhe', titulo: 'Detalhe do Pedido', apoio: 'andamento, itens e entrega' },
  { id: 'dados', titulo: 'Meus dados', apoio: 'contato e endereço, para editar quando mudar' },
];

const MODELOS = [
  { id: 1, nome: 'Front Atual', apoio: 'o app como ele é hoje' },
  { id: 2, nome: 'Feito na mão', apoio: 'camada que sobe sobre a live' },
  { id: 3, nome: 'BeHancer', apoio: 'cara de aplicativo, barra flutuante com o Suporte no meio' },
];
