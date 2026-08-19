/* É função, e não literal solto, porque a tela 16 precisa voltar a este mesmo
   ponto quando alguém recomeça a demonstração. */
function estadoDeFabrica() {
  return { filtro: 'Todos', entrega: 'sedex', pagamento: 'pix', parcelas: 4, aba: 'catalogo',
    cor: '', tamanho: '', foto: 0, qtd: 1, descricao: false, tirados: [], editando: -1, reservaAte: 0, passo: 1,
    pedidos: 'Todos', viva: 'arroba', peca: 'A6',
    cartao: { numero: '', nome: '', validade: '', cvc: '', bandeira: '' } };
}

const ESTADO = estadoDeFabrica();

const PARCELAS_MAXIMAS = 6;

function brl(centavos) {
  return 'R$ ' + (centavos / 100).toFixed(2).replace('.', ',');
}

function valorDaParcela(totalCentavos, vezes) {
  return Math.ceil(totalCentavos / vezes);
}

function produtosFiltrados() {
  if (ESTADO.filtro === 'Tamanho único') return PRODUTOS.filter((p) => /ÚNICO/i.test(p.saldo));
  if (ESTADO.filtro === 'Até R$ 100') return PRODUTOS.filter((p) => p.centavos <= 10000);
  return PRODUTOS;
}

function entregaEscolhida() {
  return ENTREGAS.find((entrega) => entrega.id === ESTADO.entrega) || ENTREGAS[1];
}

function freteEscolhido() {
  return entregaEscolhida().centavos;
}

function totalComFrete() {
  return somaSacola() + freteEscolhido();
}

function bandeiraDoCartao(numero) {
  const so = (numero || '').replace(/\D/g, '');
  return so ? BANDEIRAS.find((b) => b.comeca.test(so)) : null;
}

/* A escolha da pessoa manda; sem escolha, o prefixo do número decide. */
function bandeiraAtiva() {
  return BANDEIRAS.find((b) => b.id === ESTADO.cartao.bandeira) || bandeiraDoCartao(ESTADO.cartao.numero);
}

function bandeiraVeioDoNumero() {
  return !ESTADO.cartao.bandeira && !!bandeiraDoCartao(ESTADO.cartao.numero);
}

function finalDoCartao() {
  const so = ESTADO.cartao.numero.replace(/\D/g, '');
  return so.length >= 4 ? '•••• ' + so.slice(-4) : PEDIDO_CARTAO.cartao;
}

function mascaraDoCartao(id, texto) {
  const so = texto.replace(/\D/g, '');
  if (id === 'numero') return so.slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  if (id === 'validade') return so.slice(0, 4).replace(/^(.{2})(.+)/, '$1/$2');
  if (id === 'cvc') return so.slice(0, 4);
  return texto.toUpperCase();
}

function descontoDoPix() {
  return Math.round(totalComFrete() * DESCONTO_PIX);
}

/* O total dos modelos 1 e 2 não muda: só o modelo 3 mostra o abatimento antes
   da tela de pagamento. */
function totalAPagar() {
  return ESTADO.pagamento === 'pix' ? totalComFrete() - descontoDoPix() : totalComFrete();
}

function rotuloDoFrete() {
  const entrega = entregaEscolhida();
  return entrega.centavos === 0 ? 'Frete' : `Frete (${entrega.nome})`;
}

function somaSacola() {
  return SACOLA.reduce((total, item) => total + item.centavos * item.qtd, 0);
}

function pecasNaSacola() {
  return SACOLA.reduce((total, item) => total + item.qtd, 0);
}

function variacoesDe(produto) {
  return produto.saldo.split('·').map((parte) => {
    const [rotulo, disponivel] = parte.split(':');
    return { rotulo: rotulo.trim(), disponivel: Number(disponivel.trim()) };
  });
}

function saldoDoItem(item) {
  const p = PRODUTOS.find((x) => x.codigo === item.codigo);
  const achado = p && variacoesDe(p).find((v) => v.rotulo === item.tamanho);
  return achado ? achado.disponivel : item.qtd;
}

function campoDoCadastro(id) {
  return CAMPOS_CADASTRO.find((c) => c.id === id);
}

function valorDoCliente(id) {
  return CLIENTE.campos[id] || '';
}

function faltandoNoCadastro(ids) {
  const lista = ids ? ids.map(campoDoCadastro) : CAMPOS_CADASTRO;
  return lista.filter((c) => !c.opcional && !valorDoCliente(c.id));
}

function segundosDaReserva() {
  if (!ESTADO.reservaAte) ESTADO.reservaAte = Date.now() + MINUTOS_DE_RESERVA * 60000;
  return Math.max(0, Math.round((ESTADO.reservaAte - Date.now()) / 1000));
}

function relogioDaReserva(segundos) {
  const m = Math.floor(segundos / 60);
  return String(m).padStart(2, '0') + ':' + String(segundos - m * 60).padStart(2, '0');
}

function coresDoItem(item) {
  return (CORES_POR_CODIGO[item.codigo] || []).map((id) => ({ id, ...CORES_DA_LOJA[id] }));
}

function corDoItem(item) {
  return CORES_DA_LOJA[item.cor];
}

function tamanhosDoItem(item) {
  const p = PRODUTOS.find((x) => x.codigo === item.codigo);
  return p ? variacoesDe(p) : [];
}

function trocarTamanhoDoItem(indice, tamanho) {
  const item = SACOLA[indice];
  if (!item) return;
  item.tamanho = tamanho;
  item.qtd = Math.max(1, Math.min(item.qtd, saldoDoItem(item)));
}

function trocarCorDoItem(indice, cor) {
  if (SACOLA[indice]) SACOLA[indice].cor = cor;
}

function mudarQtdDoItem(indice, passo) {
  const item = SACOLA[indice];
  if (!item) return;
  item.qtd = Math.max(1, Math.min(item.qtd + passo, saldoDoItem(item)));
}

/* Tirar é reversível de propósito: numa apresentação, um toque na lixeira não
   pode deixar a sacola sem a peça até alguém recarregar a página. */
function tirarDaSacola(indice) {
  if (!SACOLA[indice]) return;
  ESTADO.tirados.unshift({ indice, item: SACOLA[indice] });
  SACOLA.splice(indice, 1);
  ESTADO.editando = -1;
}

function devolverASacola() {
  while (ESTADO.tirados.length) {
    const { indice, item } = ESTADO.tirados.shift();
    SACOLA.splice(Math.min(indice, SACOLA.length), 0, item);
  }
}

function coresDaPeca(codigo) {
  return (CORES_POR_CODIGO[codigo] || []).map((id) => ({
    id,
    nome: CORES_DA_LOJA[id].nome,
    hex: CORES_DA_LOJA[id].hex,
    fotos: FOTOS_POR_COR[codigo + ':' + id] || [CORES_DA_LOJA[id].foto],
  }));
}

/* A peça aberta é a que foi tocada no catálogo. Tudo o que a tela de produto
   mostra sai do próprio catálogo: os tamanhos e o saldo saem do campo `saldo`,
   a descrição vem do produto. Só a cor é proposta de tela. */
function pecaAberta() {
  const p = PRODUTOS.find((item) => item.codigo === ESTADO.peca) || PRODUTOS[0];
  const variacoes = variacoesDe(p);
  const total = variacoes.reduce((soma, v) => soma + v.disponivel, 0);

  /* Vem escolhido o tamanho de maior saldo: é o que a loja tem mais para vender. */
  const maior = variacoes.reduce((a, b) => (b.disponivel > a.disponivel ? b : a), variacoes[0]);

  return {
    ...p,
    apoio: 'mostrado na live',
    tamanhos: variacoes.map((v) => v.rotulo),
    escolhido: maior ? maior.rotulo : '',
    disponivel: total + ' disp.',
    cores: coresDaPeca(p.codigo),
  };
}

function corEscolhida() {
  const cores = pecaAberta().cores;
  return cores.find((c) => c.id === ESTADO.cor) || cores[0];
}

function tamanhoEscolhido() {
  return ESTADO.tamanho || pecaAberta().escolhido;
}

function disponivelNoTamanho(tamanho = tamanhoEscolhido()) {
  const p = PRODUTOS.find((item) => item.codigo === ESTADO.peca) || PRODUTOS[0];
  const achado = variacoesDe(p).find((v) => v.rotulo === tamanho);
  return achado ? achado.disponivel : 0;
}

/* Um lugar só para o limite: o + pode passar do teto, e trocar de tamanho pode
   baixá-lo. Nos dois casos é a leitura que corta. */
function quantidadeEscolhida() {
  return Math.min(Math.max(1, ESTADO.qtd), Math.max(1, disponivelNoTamanho()));
}

function fotosDaPeca() {
  return corEscolhida().fotos;
}

function pedidosDaAba(aba) {
  const estados = PEDIDOS_POR_ABA[aba];
  return estados ? PEDIDOS.filter((p) => estados.includes(p.estado)) : PEDIDOS;
}

function pedidosFiltrados() {
  return pedidosDaAba(ESTADO.pedidos);
}

function etapasVencidas(pedido) {
  return ETAPAS_DO_PEDIDO.indexOf(pedido.estado) + 1;
}

/* O detalhe abre sempre o #4822 e lê a sacola de verdade: mexer nela muda o
   total lá dentro. Aqui na lista o número acompanha, senão as duas telas
   mostrariam valores diferentes para o mesmo pedido. */
function totalDoPedido(pedido) {
  return pedido.id === PEDIDO_CARTAO.id ? brl(totalComFrete()) : pedido.total;
}

/* A tela 16 mexe em dado de verdade: guarda peça na sacola e escreve no
   cadastro. Estes dois retratos são o que o "recomeçar" devolve. */
const SACOLA_DE_FABRICA = SACOLA.map((item) => ({ ...item }));
const CAMPOS_DE_FABRICA = { ...CLIENTE.campos };

function recomecarDemonstracao() {
  SACOLA.length = 0;
  SACOLA_DE_FABRICA.forEach((item) => SACOLA.push({ ...item }));
  CLIENTE.campos = { ...CAMPOS_DE_FABRICA };
  Object.assign(ESTADO, estadoDeFabrica());
}

/* Se a mesma peça no mesmo tamanho e cor já estiver na sacola, a quantidade
   sobe até o saldo daquele tamanho em vez de virar duas linhas iguais. */
function porNaSacola() {
  const p = pecaAberta();
  const tamanho = tamanhoEscolhido();
  const cor = corEscolhida();
  const quanto = quantidadeEscolhida();
  const igual = SACOLA.find((item) => item.codigo === p.codigo
    && item.tamanho === tamanho && item.cor === (cor ? cor.id : ''));

  if (igual) {
    igual.qtd = Math.min(igual.qtd + quanto, saldoDoItem(igual));
    return;
  }

  SACOLA.push({ codigo: p.codigo, nome: p.nome, centavos: p.centavos, tamanho,
    cor: cor ? cor.id : '', qtd: quanto, tipo: p.tipo });
}

function produtoNaCamera() {
  return PRODUTOS[0];
}

const TRACOS = {
  sacola: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  cadeado: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  direita: '<path d="M5 12h13"/><path d="m12 5 7 7-7 7"/>',
  seta: '<path d="M9 5l7 7-7 7"/>',
  voltar: '<path d="M15 5l-7 7 7 7"/>',
  fechar: '<path d="M6 6l12 12M18 6L6 18"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  menos: '<path d="M5 12h14"/>',
  lixeira: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  escudo: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/>',
  local: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  caminhao: '<path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>',
  cartao: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19"/><path d="M6 15h4"/>',
  alerta: '<path d="M12 3.5 2.4 20h19.2L12 3.5Z"/><path d="M12 10v4.2"/><path d="M12 17.4h.01"/>',
  chat: '<path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z"/>',
  check: '<path d="M5 13l4.5 4.5L19 7.5"/>',
  pix: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v9"/><path d="M9.4 9.6a2.6 2.6 0 0 1 2.6-2.1h.4a2.4 2.4 0 0 1 .3 4.8h-1.4a2.4 2.4 0 0 0 .2 4.8h.4a2.6 2.6 0 0 0 2.5-2"/>',
  filtro: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  casa: '<path d="m3 10 9-7 9 7"/><path d="M5.5 8.8V19a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8.8"/><path d="M9.5 21v-6h5v6"/>',
  grade: '<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  recibo: '<path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2Z"/><path d="M9.5 8h5M9.5 12h5"/>',
  pessoa: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.5a7.2 7.2 0 0 1 14.4 0"/>',
  lapis: '<path d="M4 20.5h4.2L19 9.7a2.9 2.9 0 0 0-4.1-4.1L4 16.3v4.2Z"/><path d="M13.6 6.9l4.1 4.1"/>',
  telefone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
};

function icone(nome, tamanho = 16, espessura = 2) {
  return `<svg class="icone" width="${tamanho}" height="${tamanho}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="${espessura}" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${TRACOS[nome] || ''}</svg>`;
}

function arquivoDaFoto(produto) {
  const cor = produto.cor && CORES_DA_LOJA[produto.cor];
  return FOTO_UNICA || (cor && cor.foto) || ARQUIVO_POR_CODIGO[produto.codigo] || '';
}

function foto(produto, opcoes = {}) {
  const { codigo = true, classe = '', tipo = produto.tipo || TIPO_POR_CODIGO[produto.codigo] || 'peça' } = opcoes;
  const semente = produto.codigo.charCodeAt(0) + produto.codigo.charCodeAt(1) * 7;
  const arquivo = arquivoDaFoto(produto);
  return `<div class="foto ${classe}" data-matiz="${semente % 6}">
    <span class="foto-texto">foto · ${tipo}</span>
    ${arquivo ? `<img class="foto-imagem" src="assets/${arquivo}" alt="${produto.nome || tipo}" loading="lazy" onerror="this.remove()">` : ''}
    ${codigo ? `<span class="cod">${produto.codigo}</span>` : ''}
  </div>`;
}

function selo(estado, tom) {
  const [frente, fundo] = TONS_DE_ESTADO[tom];
  return `<span class="selo" style="color:${frente};background:${fundo}">${estado}</span>`;
}

function linhaDeItem(item, opcoes = {}) {
  const { mostrarQtd = true } = opcoes;
  return `<div class="item-linha">
    ${foto(item, { classe: 'foto-mini' })}
    <div class="item-corpo">
      <div class="item-nome">${item.nome}</div>
      <div class="item-apoio">${item.tamanho} · ${brl(item.centavos)}</div>
    </div>
    <div class="item-valores">
      ${mostrarQtd ? `<span class="qtd-selo">${item.qtd}×</span>` : ''}
      <span class="item-total">${brl(item.centavos * item.qtd)}</span>
    </div>
  </div>`;
}

function blocoDeTotais(frete, opcoes = {}) {
  const { rodape = '', rotuloFrete = 'Frete' } = opcoes;
  const subtotal = somaSacola();
  const temFrete = typeof frete === 'number';
  const valorFrete = !temFrete ? 'calculado depois do endereço'
    : frete === 0 ? 'Grátis (retirada na loja)' : brl(frete);
  return `<div class="totais">
    <div class="totais-linha"><span>Subtotal (${pecasNaSacola()} peças)</span><span>${brl(subtotal)}</span></div>
    <div class="totais-linha"><span>${rotuloFrete}</span><span>${valorFrete}</span></div>
    <div class="regua"></div>
    <div class="totais-linha totais-final"><span>Total</span><span class="preco-grande">${brl(subtotal + (temFrete ? frete : 0))}</span></div>
    ${rodape ? `<div class="totais-rodape">${rodape}</div>` : ''}
  </div>`;
}

function andamento(etapas) {
  return `<ol class="andamento">${etapas.map((etapa, i) => {
    const ultima = i === etapas.length - 1;
    return `<li class="andamento-item est-${etapa.estado}">
      <div class="andamento-marca">
        <span class="andamento-bola">${etapa.estado === 'feito' ? icone('check', 12, 3) : ''}</span>
        ${ultima ? '' : '<span class="andamento-fio"></span>'}
      </div>
      <div class="andamento-texto">
        <div class="andamento-titulo">${etapa.titulo}</div>
        <div class="andamento-apoio">${etapa.apoio}</div>
      </div>
    </li>`;
  }).join('')}</ol>`;
}

function contatoDaLoja() {
  return `<a class="contato" href="${LOJA.whatsappLink}">
    <span class="contato-icone">${icone('chat', 18)}</span>
    <span class="contato-corpo">
      <span class="contato-titulo">Entre em contato com a loja caso precise</span>
      <span class="contato-apoio">WhatsApp da loja · ${LOJA.whatsapp}</span>
    </span>
    ${icone('seta', 16, 2.2)}
  </a>`;
}

function naoAfiliado() {
  return '<div class="nao-afiliado">Não afiliado à Meta ou ao Instagram</div>';
}

function selosDePrivacidade(texto = 'Seus dados ficam só com a loja') {
  return `<div class="pilula-apoio">${icone('cadeado', 13)}${texto}</div>`;
}

function cartaoDeEntrega(entrega) {
  return `<div class="cartao">
    <div class="linha-icone">
      <span class="quadro-icone">${icone('local', 16, 1.9)}</span>
      <div class="linha-corpo">
        <div class="linha-titulo">${CLIENTE.nome}</div>
        <div class="linha-apoio">${CLIENTE.endereco.join('<br>')}</div>
        <div class="linha-apoio">WhatsApp ${CLIENTE.whatsapp}</div>
      </div>
      <span class="acao-texto">Editar</span>
    </div>
    <div class="regua"></div>
    <div class="linha-icone">
      <span class="quadro-icone">${icone('caminhao', 16, 1.9)}</span>
      <div class="linha-corpo">
        <div class="linha-titulo">${entrega.nome}</div>
        <div class="linha-apoio">${entrega.apoio}</div>
      </div>
      <span class="linha-valor">${brl(entrega.centavos)}</span>
    </div>
  </div>`;
}

function avatarDaLoja(tamanho = 'medio', inicial = LOJA.inicial, miolo = 'gradiente') {
  return `<div class="avatar avatar-${tamanho} avatar-${miolo}"><span class="avatar-miolo">${inicial}</span></div>`;
}
