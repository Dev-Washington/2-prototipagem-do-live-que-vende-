/* Reprodução do app de verdade (apps/sala). Não redesenhar: se parecer
   errado, é o app que está assim. */
const SLUG = LOJA.nome;
const INICIAL_DA_LOJA = SLUG.charAt(0).toUpperCase();

function salaReal(conteudo, classeDaTela = '', classeDeFundo = '') {
  return `<div class="sala-real ${classeDeFundo}"><main class="tela ${classeDaTela}">${conteudo}</main></div>`;
}

function cabecalhoDaLoja(recado = '') {
  return `<header class="cabecalho-da-loja">
    <button type="button" class="avatar-da-loja botao-do-avatar" aria-label="Voltar para informar o arroba">${INICIAL_DA_LOJA}</button>
    <div>
      <div class="nome-da-loja">${SLUG}<span class="selo-de-verificada" role="img" aria-label="Loja verificada pela Live que Vende" title="Loja verificada pela Live que Vende"></span></div>
      ${recado ? `<div class="recado-do-cabecalho">${recado}</div>` : ''}
    </div>
  </header>`;
}


function saldoComoOAppEscreve(produto) {
  return variacoesDe(produto).map((v) => `${v.rotulo}: ${v.disponivel}`).join(' - ');
}

function inicialDoProduto(nome) {
  return nome.charAt(0);
}

function fotoDoApp(classe, produto) {
  const arquivo = arquivoDaFoto(produto);
  return arquivo
    ? `<img class="${classe}" src="assets/${arquivo}" alt="${inicialDoProduto(produto.nome)}">`
    : `<span class="${classe}" aria-hidden="true">${inicialDoProduto(produto.nome)}</span>`;
}

function barraDeCodigo() {
  return `<div class="barra-de-codigo">
    <input class="pilula-de-codigo" placeholder="Digite o código · ex.: A1 M" autocapitalize="characters" autocorrect="off" aria-label="Código do produto">
    <button class="enviar-codigo" aria-label="Guardar este código"><span class="icone-enviar" aria-hidden="true"></span></button>
  </div>
  <p class="aviso-de-nao-afiliacao">Não afiliado à Meta ou ao Instagram</p>`;
}

const FUNDO_DA_SHEET = '<div class="fundo-da-sheet" aria-hidden="true"></div>';

function vitrineDaLive() {
  return `<section class="vitrine-da-live" aria-label="Produtos que já foram mostrados na live">
    <div class="cabecalho-da-vitrine">
      <span class="linha-decorativa" aria-hidden="true"></span>
      <div>
        <h1 class="titulo-da-vitrine">Últimas ofertas da live</h1>
        <p>Produtos que já foram mostrados na live</p>
      </div>
      <span class="linha-decorativa" aria-hidden="true"></span>
    </div>

    <div class="grade-da-vitrine">
      ${PRODUTOS.map((produto, i) => {
        const emDestaque = i === 0;
        return `<button type="button" class="cartao-de-produto ${emDestaque ? 'em-destaque' : ''}" aria-label="Escolher ${produto.nome}, código ${produto.codigo}">
          ${fotoDoApp('foto-do-produto', produto)}
          ${emDestaque ? '<span class="selo-do-destaque">Na câmera agora</span>' : ''}
          <div class="dados-do-produto">
            <span class="nome-do-produto">${produto.nome}</span>
            <span class="preco">${brl(produto.centavos)}</span>
            <span class="saldo-da-variacao">${saldoComoOAppEscreve(produto)}</span>
          </div>
          <span class="codigo-do-produto">${produto.codigo}</span>
        </button>`;
      }).join('')}
    </div>

    <div class="chamada-do-codigo">
      <div class="icone-da-chamada" aria-hidden="true">Sacola</div>
      <div>
        <strong>Gostou de algum item?</strong>
        <p>Digite o código do produto para comprar agora.</p>
      </div>
    </div>
  </section>`;
}

function salaComVitrine(sheet = '', comContador = true) {
  return salaReal(`
    ${cabecalhoDaLoja()}
    ${comContador ? `<button class="contador-da-sacola" data-quantidade="${pecasNaSacola()}" aria-label="Abrir sacola com ${pecasNaSacola()} itens"><span class="quantidade-da-sacola" aria-hidden="true">${pecasNaSacola()}</span></button>` : ''}
    ${vitrineDaLive()}
    ${barraDeCodigo()}
    ${sheet}
  `, 'tela-vitrine-clara', 'fundo-vitrine-clara');
}

function linhasDeTotal(freteCents, prazoDias) {
  const subtotal = somaSacola();
  const temFrete = typeof freteCents === 'number';
  return `<div class="linha-de-total">
      <span>Frete</span>
      <span class="valor">${temFrete ? `${brl(freteCents)}${prazoDias ? ` · até ${prazoDias} dias úteis` : ''}` : 'calculado depois do endereço'}</span>
    </div>
    <div class="linha-de-total subtotal">
      <span>SubTotal</span>
      <span class="valor">${brl(subtotal)}</span>
    </div>
    <div class="linha-de-total principal">
      <span>Total</span>
      <span class="valor destaque">${brl(subtotal + (temFrete ? freteCents : 0))}</span>
    </div>`;
}

const PEDIDOS_COMO_O_APP_MOSTRA = [
  { codigo: 'PED-4822', data: '17/08/2026 14:02', estado: 'Pagamento confirmado', aba: 'andamento', codigos: ['A1', 'A3', 'A2'], total: 'R$ 672,60', metodo: 'Cartão' },
  { codigo: 'PED-4790', data: '12/08/2026 10:31', estado: 'Enviado', aba: 'enviados', codigos: ['B4', 'B7'], total: 'R$ 289,80', metodo: 'Pix' },
  { codigo: 'PED-4711', data: '28/07/2026 19:04', estado: 'Enviado', aba: 'enviados', codigos: ['C2'], total: 'R$ 169,90', metodo: 'Pix' },
  { codigo: 'PED-4602', data: '09/07/2026 15:22', estado: 'Enviado', aba: 'enviados', codigos: ['D1', 'D5', 'D9'], total: 'R$ 549,70', metodo: 'Cartão' },
  { codigo: 'PED-4488', data: '21/06/2026 20:10', estado: 'Cancelado', aba: 'cancelados', codigos: ['E3'], total: 'R$ 229,90', metodo: 'Pix' },
];

const MODELO_1 = {

  arroba() {
    return salaReal(`
      ${cabecalhoDaLoja('Acompanhe seus pedidos da live')}
      <form class="entrada">
        <div>
          <h1 class="titulo-da-entrada">Comentou na live?</h1>
          <p class="apoio-da-entrada">Insira seu @ abaixo para gerenciar a sua sacola da live de ${SLUG}.</p>
        </div>
        <input class="campo" placeholder="@nome_de_usuario" autocapitalize="none" autocorrect="off" aria-label="Seu @ do Instagram">
        <button class="botao-primario" type="submit" disabled>Acessar minha sacola</button>
        <p class="selo-de-privacidade">seus dados ficam só com a loja</p>
      </form>
    `, 'tela-entrada-arroba', 'fundo-entrada-arroba');
  },

  catalogo() {
    return salaComVitrine();
  },

  produto() {
    const p = PRODUTOS.find((item) => item.codigo === ESTADO.peca) || PRODUTOS[5];
    const variacoes = variacoesDe(p);
    const selecionada = variacoes[0];

    const sheet = `${FUNDO_DA_SHEET}
      <section class="sheet sheet-de-produto" role="dialog" aria-label="Escolher ${p.nome}">
        <div class="alca-da-sheet" aria-hidden="true"></div>
        <div class="cabecalho-da-escolha">
          ${fotoDoApp('foto-da-escolha', p)}
          <div>
            <span class="codigo-do-produto">${p.codigo}</span>
            <h2 class="titulo-da-sheet">${p.nome}</h2>
            <p class="preco">${brl(p.centavos)}</p>
          </div>
        </div>

        <fieldset class="grupo-de-escolha">
          <legend>Tamanho</legend>
          <div class="opcoes-de-variacao">
            ${variacoes.map((v, i) => `<label class="opcao-de-variacao ${i === 0 ? 'selecionada' : ''} ${v.disponivel === 0 ? 'indisponivel' : ''}">
              <input type="radio" name="variacao-${p.codigo}" value="${v.rotulo}" ${i === 0 ? 'checked' : ''}>
              <span>${v.rotulo}</span>
              <small>${v.disponivel === 0 ? 'sem estoque' : `${v.disponivel} disp.`}</small>
            </label>`).join('')}
          </div>
        </fieldset>

        <label class="grupo-de-escolha">
          <span>Quantidade</span>
          <select class="seletor-de-quantidade">
            ${Array.from({ length: Math.min(selecionada.disponivel, 11) }, (_, i) => `<option${i === 0 ? ' selected' : ''}>${i + 1}</option>`).join('')}
          </select>
        </label>

        <button class="botao-primario">Guardar 1</button>
        <button class="botao-discreto">Voltar para a vitrine</button>
      </section>`;

    return salaComVitrine(sheet, false);
  },

  carrinho() {
    const sheet = `${FUNDO_DA_SHEET}
      <section class="sheet" role="dialog" aria-label="Sua sacola">
        <div class="alca-da-sheet" aria-hidden="true"></div>
        <div class="cabecalho-da-sacola">
          <h2 class="titulo-da-sheet">Seu carrinho (${SACOLA.length})</h2>
          <button type="button" class="fechar-sheet" aria-label="Fechar carrinho">X</button>
        </div>

        ${SACOLA.map((item) => `<div class="item-da-sacola">
          <div class="miniatura-do-item" aria-hidden="true">${item.codigo}</div>
          <div class="detalhes-do-item">
            <div class="nome-do-item">${item.nome}</div>
            <div class="preco valor">${brl(item.centavos)}</div>
            <div class="apoio-do-item">${item.tamanho} · Guardado para você</div>
            <span class="selo-cumulativo">guardado até o fim da live</span>
          </div>
          <div class="acoes-do-item">
            <button type="button" class="remover-item" aria-label="Remover ${item.nome}"></button>
            <div class="controle-de-quantidade" aria-label="Quantidade de ${item.nome}">
              <button type="button" class="ajustar-quantidade" aria-label="Adicionar mais um ${item.nome}">+</button>
              <span>${item.qtd}</span>
              <button type="button" class="ajustar-quantidade" aria-label="Diminuir um ${item.nome}">-</button>
            </div>
            <span class="codigo-do-item">${item.codigo} ${item.tamanho}</span>
          </div>
        </div>`).join('')}

        ${linhasDeTotal(null)}

        <button class="botao-primario botao-finalizar-pagamento">
          <span class="icone-de-pagamento" aria-hidden="true"></span>
          Continuar para a entrega
        </button>
        <p class="selo-de-seguranca">Ambiente 100% seguro</p>
      </section>`;

    return salaComVitrine(sheet, false);
  },

  cadastro() {
    const sheet = `${FUNDO_DA_SHEET}
      <section class="sheet" role="dialog" aria-label="Cadastro de entrega">
        <div class="alca-da-sheet" aria-hidden="true"></div>
        <h2 class="titulo-da-sheet">Rápido: só o necessário para reservar e entregar</h2>

        <form class="formulario">
          <label>
            <span class="rotulo-do-campo">Nome completo, quem recebe a encomenda</span>
            <input class="campo" autocomplete="name" aria-label="Nome completo">
          </label>
          <label>
            <span class="rotulo-do-campo">CPF, exigido pela transportadora para emitir a etiqueta</span>
            <input class="campo" inputmode="numeric" placeholder="000.000.000-00" aria-label="CPF">
          </label>
          <label>
            <span class="rotulo-do-campo">WhatsApp, para a loja combinar a entrega</span>
            <input class="campo" inputmode="tel" placeholder="(11) 98888-7777" aria-label="WhatsApp">
          </label>
          <label>
            <span class="rotulo-do-campo">CEP, é ele que calcula o frete</span>
            <input class="campo campo-com-status" inputmode="numeric" placeholder="01310-100" aria-label="CEP">
          </label>
          <div class="lado-a-lado">
            <label>
              <span class="rotulo-do-campo">Rua</span>
              <input class="campo" autocomplete="address-line1" aria-label="Rua">
            </label>
            <label style="max-width:96px">
              <span class="rotulo-do-campo">Número</span>
              <input class="campo" aria-label="Número">
            </label>
          </div>
          <div class="lado-a-lado">
            <label>
              <span class="rotulo-do-campo">Bairro</span>
              <input class="campo" aria-label="Bairro">
            </label>
            <label>
              <span class="rotulo-do-campo">Complemento, se tiver</span>
              <input class="campo" placeholder="apto, bloco" aria-label="Complemento">
            </label>
          </div>
          <div class="lado-a-lado">
            <label>
              <span class="rotulo-do-campo">Cidade</span>
              <input class="campo" aria-label="Cidade">
            </label>
            <label style="max-width:96px">
              <span class="rotulo-do-campo">UF</span>
              <input class="campo" maxlength="2" aria-label="UF">
            </label>
          </div>
          <button class="botao-primario" type="submit">Salvar endereço</button>
        </form>
      </section>`;

    return salaComVitrine(sheet, false);
  },

  frete() {
    const escolhida = entregaEscolhida();

    const opcoes = ENTREGAS;
    const prazos = { sedex: 4, pac: 10 };

    const sheet = `${FUNDO_DA_SHEET}
      <section class="sheet" role="dialog" aria-label="Cadastro de entrega">
        <div class="alca-da-sheet" aria-hidden="true"></div>
        <h2 class="titulo-da-sheet">Revise a entrega</h2>

        <div class="revisao-da-entrega">
          <div class="cartao-endereco-revisao">
            <span class="icone-endereco" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d="M12 21s7-6.1 7-12a7 7 0 0 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg>
            </span>
            <div class="texto-endereco-revisao">
              <strong>Endereço da entrega</strong>
              <span>Endereço confirmado ✓</span>
              <span>Toque em "Editar endereço" para trocar.</span>
            </div>
          </div>

          <div class="linha-de-total">
            <span>Frete</span>
            <span class="valor">${brl(escolhida.centavos)}${prazos[escolhida.id] ? ` · até ${prazos[escolhida.id]} dias úteis` : ''}</span>
          </div>
          <div class="linha-de-total subtotal">
            <span>SubTotal</span>
            <span class="valor">${brl(somaSacola())}</span>
          </div>
          <div class="linha-de-total principal">
            <span>Total</span>
            <span class="valor destaque">${brl(totalComFrete())}</span>
          </div>

          <div class="opcoes-de-frete">
            <strong>Escolha a entrega</strong>
            ${opcoes.map((opcao) => {
              const on = opcao.id === ESTADO.entrega;
              return `<label class="opcao-de-frete ${on ? 'selecionada' : ''}" data-acao="entrega" data-valor="${opcao.id}">
                <input type="radio" name="frete" ${on ? 'checked' : ''}>
                <span class="nome-do-frete">${opcao.nome}</span>
                <strong class="valor-do-frete">${brl(opcao.centavos)}</strong>
                <small>${prazos[opcao.id] ? `até ${prazos[opcao.id]} dias úteis` : 'prazo a confirmar'}</small>
              </label>`;
            }).join('')}
          </div>

          <button class="botao-primario" type="button">USAR ESTE FRETE</button>
          <button class="botao-secundario" type="button">Editar endereço</button>
        </div>
      </section>`;

    return salaComVitrine(sheet, false);
  },

  pagamento() {
    const total = totalComFrete();
    const noCartao = ESTADO.pagamento === 'cartao';

    const escolha = `<div class="escolha-de-pagamento">
      <p class="apoio-do-pagamento">Escolha como quer pagar. A reserva segue guardada enquanto a cobrança é criada.</p>
      <button class="botao-primario" data-acao="pagamento" data-valor="pix">Pix · confirma na hora</button>
      <button class="botao-secundario" data-acao="pagamento" data-valor="cartao">Cartão de crédito</button>
    </div>`;

    const formulario = `<form class="formulario-do-cartao">
      <input class="campo" inputmode="numeric" placeholder="Número do cartão" aria-label="Número do cartão">
      <input class="campo" placeholder="Nome como está no cartão" aria-label="Nome no cartão">
      <div class="linha-de-campos">
        <input class="campo" inputmode="numeric" placeholder="MM/AA" maxlength="5" aria-label="Validade">
        <input class="campo" inputmode="numeric" placeholder="CVV" maxlength="4" aria-label="CVV">
      </div>
      <input class="campo" inputmode="numeric" placeholder="CPF do titular" aria-label="CPF do titular">
      <select class="campo" aria-label="Parcelas" data-acao="parcelas-select">
        ${Array.from({ length: PARCELAS_MAXIMAS }, (_, i) => i + 1).map((n) =>
          `<option value="${n}" ${n === ESTADO.parcelas ? 'selected' : ''}>${n}x de ${brl(valorDaParcela(total, n))}</option>`).join('')}
      </select>
      <button class="botao-primario" type="button">Pagar ${brl(total)}</button>
      <p class="selo-de-privacidade">🔒 os dados do cartão vão direto ao Mercado Pago</p>
      <button class="botao-discreto" type="button" data-acao="pagamento" data-valor="pix">Voltar para as formas de pagamento</button>
    </form>`;

    const sheet = `<div class="fundo-da-sheet fundo-do-pagamento" aria-hidden="true"></div>
      <section class="sheet sheet-de-pagamento" role="dialog" aria-label="Pagamento">
        <header class="cabecalho-do-pagamento">
          <h2 class="titulo-da-sheet">Pagar ${brl(total)}</h2>
          <button class="fechar-sheet" type="button" aria-label="Fechar pagamento">X</button>
        </header>
        ${noCartao ? formulario : escolha}
      </section>`;

    return salaComVitrine(sheet, false);
  },

  /* Mesma tela do Pix: quem decide a forma é o `fixo` da entrada em TELAS. */
  pagamentoCartao() {
    return MODELO_1.pagamento();
  },

  pix() {
    const total = totalComFrete();
    const sheet = `<div class="fundo-da-sheet fundo-do-pagamento" aria-hidden="true"></div>
      <section class="sheet sheet-de-pagamento" role="dialog" aria-label="Pagamento">
        <header class="cabecalho-do-pagamento">
          <h2 class="titulo-da-sheet">Pagar ${brl(total)}</h2>
          <button class="fechar-sheet" type="button" aria-label="Fechar pagamento">X</button>
        </header>

        <div class="pagamento-aprovado">
          <div class="icone-aprovado" aria-hidden="true"><span></span></div>
          <h3>Pagamento concluído!</h3>
          <p class="apoio-aprovado">Seu pedido foi aprovado com sucesso.</p>

          <dl class="dados-do-pedido-aprovado">
            <div>
              <dt><span class="icone-recibo pedido" aria-hidden="true"></span>Pedido</dt>
              <dd>PED-4821</dd>
            </div>
            <div>
              <dt><span class="icone-recibo data" aria-hidden="true"></span>Data</dt>
              <dd>17/08/2026 14:01</dd>
            </div>
            <div>
              <dt><span class="icone-recibo metodo" aria-hidden="true"></span>Forma de pagamento</dt>
              <dd>Pix</dd>
            </div>
          </dl>

          <div class="agradecimento-do-pedido">
            <span class="icone-caixa" aria-hidden="true"></span>
            <div>
              <strong>Obrigado(a) pela sua compra!</strong>
              <p>Em instantes você será redirecionado para live.</p>
            </div>
          </div>

          <button class="botao-primario botao-voltar-live">Volte para live</button>
          <button class="link-meus-pedidos" type="button">Ver meus pedidos</button>
        </div>
      </section>`;

    return salaComVitrine(sheet, false);
  },

  cartao() {
    const p = PEDIDO_CARTAO;
    const sheet = `<div class="fundo-da-sheet fundo-do-pagamento" aria-hidden="true"></div>
      <section class="sheet sheet-de-pagamento" role="dialog" aria-label="Pagamento">
        <header class="cabecalho-do-pagamento">
          <h2 class="titulo-da-sheet">Pagar ${brl(p.total)}</h2>
          <button class="fechar-sheet" type="button" aria-label="Fechar pagamento">X</button>
        </header>

        <div class="pagamento-aprovado pagamento-aprovado-cartao">
          <div class="icone-aprovado" aria-hidden="true"><span></span></div>
          <h3>Compra finalizada!</h3>
          <p class="apoio-aprovado">Seu pagamento via cartão foi aprovado com sucesso.</p>

          <div class="alerta-cartao-aprovado" role="status">
            <span class="mini-check" aria-hidden="true"></span>
            <div>
              <strong>Pagamento aprovado</strong>
              <small>Seu pedido foi confirmado e o pagamento foi processado com segurança.</small>
            </div>
          </div>

          <dl class="dados-do-pedido-aprovado">
            <strong class="titulo-resumo-pedido">Resumo do pedido</strong>
            <div>
              <dt><span class="icone-recibo pedido" aria-hidden="true"></span>Pedido</dt>
              <dd>PED-4822</dd>
            </div>
            <div>
              <dt><span class="icone-recibo data" aria-hidden="true"></span>Data</dt>
              <dd>17/08/2026 14:03</dd>
            </div>
            <div>
              <dt><span class="icone-recibo metodo" aria-hidden="true"></span>Forma de pagamento</dt>
              <dd>Cartão de crédito<span class="bandeira-cartao">Cartão aprovado</span></dd>
            </div>
            <div>
              <dt><span class="icone-recibo valor-pago" aria-hidden="true"></span>Valor pago</dt>
              <dd>${brl(p.total)}<span class="parcelas-do-cartao">4x de ${brl(Math.ceil(p.total / 4))}</span></dd>
            </div>
          </dl>

          <div class="agradecimento-do-pedido">
            <span class="icone-caixa" aria-hidden="true"></span>
            <div>
              <strong>Obrigado(a) pela sua compra!</strong>
              <p>Em instantes você será redirecionado para live.</p>
            </div>
          </div>

          <button class="botao-primario botao-voltar-live">Volte para live</button>
          <button class="link-meus-pedidos" type="button">Ver meus pedidos</button>
        </div>
      </section>`;

    return salaComVitrine(sheet, false);
  },

  pedidos() {
    return salaReal(`
      ${cabecalhoDaLoja()}
      <section class="tela-de-pedidos" aria-label="Meus pedidos">
        <header class="cabecalho-pedidos-loja">
          <div class="avatar-da-loja">${INICIAL_DA_LOJA}</div>
          <div>
            <div class="nome-da-loja">${SLUG}</div>
            <div class="selo-de-privacidade">seus dados ficam só com a loja</div>
          </div>
        </header>
        <button class="voltar-dos-pedidos" type="button"><span aria-hidden="true">←</span> Meus pedidos</button>
        <p class="apoio-dos-pedidos">Acompanhe o status dos seus pedidos</p>

        <div class="abas-dos-pedidos" role="tablist" aria-label="Filtrar pedidos">
          ${[['todos', 'Todos'], ['andamento', 'Em Andamento'], ['enviados', 'Enviados'], ['cancelados', 'Cancelados']]
            .map(([valor, rotulo], i) => `<button type="button" role="tab" class="${i === 0 ? 'ativa' : ''}" aria-selected="${i === 0}">${rotulo}</button>`).join('')}
        </div>

        <div class="lista-de-pedidos">
          ${PEDIDOS_COMO_O_APP_MOSTRA.map((pedido) => {
            const extras = Math.max(0, pedido.codigos.length - 3);
            return `<article class="card-do-pedido">
              <div class="resumo-do-pedido">
                <strong>Pedido</strong>
                <span>${pedido.codigo}</span>
                <small>${pedido.data}</small>
              </div>
              <div class="fotos-do-pedido" aria-label="Produtos do pedido">
                ${pedido.codigos.slice(0, 3).map((c) => ARQUIVO_POR_CODIGO[c] ? `<img src="assets/${ARQUIVO_POR_CODIGO[c]}" alt="${c}">` : `<span>${c}</span>`).join('')}
                ${extras > 0 ? `<em>+${extras}</em>` : ''}
              </div>
              <div class="valor-do-pedido">
                <small>Total</small>
                <strong>${pedido.total}</strong>
              </div>
              <div class="status-do-pedido">
                <span class="ponto-do-status ${pedido.aba}" aria-hidden="true"></span>
                <span>${pedido.estado}</span>
              </div>
              <div class="pagamento-do-pedido"><span>${pedido.metodo}</span></div>
              <button type="button" class="detalhes-do-pedido">Ver detalhes &gt;</button>
            </article>`;
          }).join('')}
        </div>

        <div class="ajuda-dos-pedidos">
          <span class="icone-ajuda" aria-hidden="true"></span>
          <div>
            <strong>Precise de ajuda?</strong>
            <p>Fale com nossa equipe</p>
          </div>
          <button type="button">Falar agora &gt;</button>
        </div>

        <button class="voltar-para-live" type="button">Voltar para o início</button>
      </section>
    `);
  },

  detalhe() {
    const p = PEDIDO_CARTAO;
    return salaReal(`
      ${cabecalhoDaLoja()}
      <section class="tela-de-pedidos tela-detalhe-pedido" aria-label="Detalhes do pedido">
        <header class="cabecalho-pedidos-loja">
          <div class="avatar-da-loja">${INICIAL_DA_LOJA}</div>
          <div>
            <div class="nome-da-loja">${SLUG}</div>
            <div class="selo-de-privacidade">seus dados ficam só com a loja</div>
          </div>
          <button class="ajuda-do-detalhe" type="button">Ajuda</button>
        </header>

        <button class="voltar-dos-pedidos" type="button"><span aria-hidden="true">←</span> Detalhes do pedido</button>
        <p class="apoio-dos-pedidos">Pedido PED-4822</p>

        <section class="resumo-detalhe-pedido" aria-label="Resumo do pedido">
          <div>
            <small>Status do pedido</small>
            <strong class="status-resumo andamento">Pagamento confirmado</strong>
            <span>Sem código de rastreio ainda</span>
          </div>
          <div>
            <small>Data da compra</small>
            <strong>17/08/2026 14:03</strong>
          </div>
          <div>
            <small>Forma de pagamento</small>
            <strong>Cartão</strong>
          </div>
        </section>

        <h3 class="titulo-itens-detalhe">Itens do pedido (${SACOLA.length})</h3>
        <div class="itens-detalhe-pedido">
          ${SACOLA.map((item) => `<article class="item-detalhe-pedido">
            ${ARQUIVO_POR_CODIGO[item.codigo] ? `<img src="assets/${ARQUIVO_POR_CODIGO[item.codigo]}" alt="${item.codigo}">` : `<span>${item.codigo}</span>`}
            <div>
              <strong>${item.nome}</strong>
              <b>${brl(item.centavos)}</b>
              <small>${item.tamanho}: 1</small>
            </div>
            <em>Qtde: 1</em>
            <mark>${item.codigo} ${item.tamanho}</mark>
          </article>`).join('')}
        </div>

        <section class="totais-detalhe-pedido" aria-label="Totais do pedido">
          <div><span>SubTotal</span><strong>${brl(p.subtotal)}</strong></div>
          <div><span>Frete</span><strong>${brl(p.frete)}</strong></div>
          <div><span>Total</span><strong>${brl(p.total)}</strong></div>
        </section>

        <section class="endereco-detalhe-pedido" aria-label="Endereço da entrega">
          <span class="icone-endereco-detalhe" aria-hidden="true"></span>
          <div>
            <strong>Endereço da entrega</strong>
            <p>Endereço confirmado ✓</p>
          </div>
        </section>

        <div class="ajuda-dos-pedidos ajuda-detalhe-pedido">
          <span class="icone-ajuda" aria-hidden="true"></span>
          <div>
            <strong>Precise de ajuda?</strong>
            <p>Fale com nossa equipe</p>
          </div>
          <button type="button">Falar agora &gt;</button>
        </div>

        <button class="voltar-para-live" type="button">Voltar para o início</button>
      </section>
    `);
  },
};
