function m2Sheet({ titulo = '', voltar = false, fechar = true, corpo, rodape = '', alto = false }) {
  const cabecalho = (titulo || voltar || fechar) ? `
    <div class="m2-cabecalho">
      ${voltar ? `<button class="m2-redondo" type="button" aria-label="Voltar">${icone('voltar', 15, 2.2)}</button>` : ''}
      ${titulo ? `<h2 class="m2-titulo">${titulo}</h2>` : '<div style="flex:1"></div>'}
      ${fechar ? `<button class="m2-redondo" type="button" aria-label="Fechar">${icone('fechar', 14, 2.2)}</button>` : ''}
    </div>` : '';

  return `<div class="m2-fundo-live">
    <div class="m2-sheet ${alto ? 'm2-sheet-alta' : ''}">
      <div class="m2-alca"><span></span></div>
      ${cabecalho}
      <div class="m2-corpo rolagem">${corpo}</div>
      ${rodape ? `<div class="m2-rodape">${rodape}</div>` : ''}
    </div>
  </div>`;
}

function m2Pagina({ cabecalho = '', corpo, rodape = '' }) {
  return `<div class="m2-pagina">
    ${cabecalho ? `<div class="m2-topo-fixo">${cabecalho}</div>` : ''}
    <div class="m2-pagina-corpo rolagem">${corpo}</div>
    ${rodape ? `<div class="m2-base-fixa">${rodape}</div>` : ''}
  </div>`;
}

const MODELO_2 = {

  arroba() {
    return m2Pagina({
      corpo: `<div class="m2-arroba">
        ${avatarDaLoja('grande')}
        <div class="m2-arroba-loja">${LOJA.nome}</div>
        <div class="m2-selo-live"><span class="m2-ponto"></span>Live</div>
        <h1 class="m2-arroba-titulo">Comentou na live?</h1>
        <p class="m2-arroba-texto">Insira seu @ abaixo para gerenciar a sua sacola da live de ${LOJA.nome}.</p>
        <div class="m2-campo-arroba">
          <span class="m2-arroba-marca">@</span>
          <input class="entrada" type="text" placeholder="nome_de_usuario" aria-label="Seu @ no Instagram">
        </div>
        <button class="botao botao-gradiente m2-cta-arroba" type="button">Acessar minha sacola</button>
        ${selosDePrivacidade('seus dados ficam só com a loja')}
      </div>`,
      rodape: naoAfiliado(),
    });
  },

  catalogo() {

    const cabecalho = `<div class="m2-barra-loja">
      ${avatarDaLoja('medio', LOJA.inicial, 'solido')}
      <div class="m2-barra-corpo">
        <div class="m2-barra-nome">${LOJA.nomeCaixaAlta}</div>
        <div class="m2-barra-apoio">${LOJA.situacao}</div>
      </div>
      <div class="m2-sacola-botao">${icone('sacola', 19, 1.8)}<span class="m2-contador">${pecasNaSacola()}</span></div>
    </div>`;

    const lista = produtosFiltrados();

    const corpo = `
      <div class="m2-cabecalho-lista">
        <h1>Últimas ofertas da live</h1>
        <p>${ESTADO.filtro === 'Todos'
          ? 'Produtos que já foram mostrados na live'
          : `${lista.length} ${lista.length === 1 ? 'peça' : 'peças'} em “${ESTADO.filtro}”`}</p>
      </div>
      <div class="m2-filtros">
        ${FILTROS.map(f => `<button type="button" class="m2-filtro ${f === ESTADO.filtro ? 'm2-filtro-ativo' : ''}" data-acao="filtro" data-valor="${f}">${f}</button>`).join('')}
      </div>
      ${lista.length ? `<div class="m2-grade">
        ${lista.map(p => `<article class="m2-produto">
          <div class="m2-produto-foto">${foto(p)}</div>
          <div class="m2-produto-nome">${p.nome}</div>
          <div class="m2-produto-preco">${brl(p.centavos)}</div>
          <div class="m2-produto-saldo">${p.saldo}</div>
        </article>`).join('')}
      </div>` : `
      <div class="m2-vazio">
        <strong>Nenhuma peça em “${ESTADO.filtro}”</strong>
        <p>Esta live ainda não mostrou nada nessa faixa. Toque em <b>Todos</b> para ver tudo.</p>
      </div>`}
      <div class="m2-chamada">
        <span class="m2-chamada-icone">${icone('sacola', 20, 1.9)}</span>
        <div>
          <div class="m2-chamada-titulo">Gostou de algum item?</div>
          <div class="m2-chamada-texto">Digite o código do produto para comprar agora.</div>
        </div>
      </div>
      <div class="m2-fecho-lista">
        ${selosDePrivacidade()}
        <button class="botao botao-gradiente m2-cta-pedidos" type="button">Ver meus pedidos</button>
      </div>`;

    const rodape = `
      <div class="m2-linha-codigo">
        <input class="entrada" type="text" placeholder="Digite o código - ex.: A1 M" aria-label="Código do produto">
        <button class="botao botao-primario m2-enviar" type="button" aria-label="Enviar código">${icone('direita', 19, 2.1)}</button>
      </div>
      ${naoAfiliado()}`;

    return m2Pagina({ cabecalho, corpo, rodape });
  },

  produto() {
    const p = pecaAberta();
    return m2Sheet({
      fechar: false,
      corpo: `
        <div class="m2-produto-palco">
          ${foto(p, { codigo: false, classe: 'm2-foto-grande' })}
          <span class="cod m2-cod-solto">${p.codigo}</span>
          <button class="m2-redondo m2-fechar-solto" type="button" aria-label="Fechar">${icone('fechar', 14, 2.3)}</button>
        </div>
        <div class="m2-produto-texto">
          <h2 class="m2-produto-titulo">${p.nome}</h2>
          <div class="m2-produto-linha">
            <span class="m2-produto-valor">${brl(p.centavos)}</span>
            <span class="m2-produto-apoio">${p.apoio}</span>
          </div>
          <div class="m2-secao-titulo">
            <span>Tamanho</span>
            <span class="m2-secao-apoio">${p.disponivel}</span>
          </div>
          <div class="m2-tamanhos">
            ${p.tamanhos.map(t => `<span class="m2-tamanho ${t === p.escolhido ? 'm2-tamanho-ativo' : ''}">${t}</span>`).join('')}
          </div>
          <div class="m2-secao-titulo"><span>Quantidade</span></div>
          <div class="m2-contagem">
            <button class="m2-passo" type="button" aria-label="Menos">${icone('menos', 14, 2.4)}</button>
            <span class="m2-numero">1</span>
            <button class="m2-passo" type="button" aria-label="Mais">${icone('mais', 14, 2.4)}</button>
          </div>
        </div>`,
      rodape: `
        <button class="botao botao-gradiente botao-cheio m2-pilula" type="button">Guardar 1</button>
        <button class="botao botao-vazado botao-cheio m2-pilula m2-secundario" type="button">Voltar para a vitrine</button>`,
    });
  },

  carrinho() {
    return m2Sheet({
      titulo: `Seu carrinho (${pecasNaSacola()})`,
      corpo: `<div class="m2-lista-carrinho">
        ${SACOLA.map(item => `<div class="m2-item">
          <div class="m2-item-foto">${foto(item)}</div>
          <div class="m2-item-corpo">
            <div class="m2-item-topo">
              <div class="m2-item-nome">${item.nome}</div>
              <button class="m2-remover" type="button" aria-label="Remover">${icone('lixeira', 15, 1.8)}</button>
            </div>
            <div class="m2-item-preco">${brl(item.centavos)}</div>
            <div class="m2-item-meta">${item.tamanho} · Guardado para você</div>
            <div class="m2-item-acoes">
              <span class="m2-etiqueta">${item.codigo} ${item.tamanho}</span>
              <div class="m2-contagem m2-contagem-mini">
                <button class="m2-passo" type="button" aria-label="Menos">${icone('menos', 12, 2.4)}</button>
                <span class="m2-numero">${item.qtd}</span>
                <button class="m2-passo" type="button" aria-label="Mais">${icone('mais', 12, 2.4)}</button>
              </div>
            </div>
            <div class="m2-item-prazo">${icone('relogio', 12)} guardado até o fim da live</div>
          </div>
        </div>`).join('')}
      </div>`,
      rodape: `
        ${blocoDeTotais(null)}
        <button class="botao botao-gradiente botao-cheio m2-pilula" type="button">${icone('cadeado', 17)} Continuar para a entrega</button>
        <div class="m2-selo-seguro">${icone('escudo', 13, 1.9)} Ambiente 100% seguro</div>`,
    });
  },

  cadastro() {
    const de = id => CAMPOS_CADASTRO.find(c => c.id === id);
    const campo = c => `<label class="campo m2-campo">
      <span class="campo-rotulo">${c.rotulo}${c.porque ? `, <span class="campo-porque">${c.porque}</span>` : ''}</span>
      <input class="entrada" type="text" ${c.dica ? `placeholder="${c.dica}"` : ''} aria-label="${c.rotulo}">
    </label>`;

    const pessoais = CAMPOS_CADASTRO.filter(c => ['nome', 'cpf', 'zap'].includes(c.id));

    return m2Sheet({
      titulo: 'Rápido: só o necessário para reservar e entregar',
      alto: true,
      corpo: `
        <div class="m2-grupo">${pessoais.map(campo).join('')}</div>
        <div class="regua"></div>
        <div class="m2-grupo">
          ${campo(de('cep'))}
          <div class="m2-par m2-par-numero">${campo(de('rua'))}${campo(de('num'))}</div>
          <div class="m2-par">${campo(de('bairro'))}${campo(de('compl'))}</div>
          <div class="m2-par m2-par-uf">${campo(de('cidade'))}${campo(de('uf'))}</div>
        </div>`,
      rodape: `
        <button class="botao botao-desligado botao-cheio m2-pilula" type="button" disabled>Ver frete e total</button>
        <div class="m2-dica-rodape">
          <span>Complete os dados de entrega para ver o frete</span>
          <span class="m2-divisor"></span>
          <span>0 de 9 campos preenchidos</span>
        </div>`,
    });
  },

  frete() {
    const entrega = entregaEscolhida();
    return m2Sheet({
      titulo: 'Frete e total',
      voltar: true,
      alto: true,
      corpo: `
        <div class="m2-bloco">
          <div class="m2-bloco-topo"><span>Itens</span><span class="m2-bloco-apoio">${pecasNaSacola()} peças</span></div>
          ${SACOLA.map(item => linhaDeItem(item)).join('')}
        </div>
        <div class="regua"></div>
        <div class="m2-bloco">
          <div class="m2-bloco-topo"><span>Como você quer receber</span></div>
          ${ENTREGAS.map(e => {
            const on = e.id === ESTADO.entrega;
            return `<label class="m2-opcao ${on ? 'm2-opcao-ativa' : ''}" data-acao="entrega" data-valor="${e.id}">
              <span class="m2-radio"></span>
              <span class="m2-opcao-corpo">
                <span class="m2-opcao-nome">${e.nome}</span>
                <span class="m2-opcao-apoio">${e.apoio}</span>
              </span>
              <span class="m2-opcao-valor ${e.centavos === 0 ? 'm2-gratis' : ''}">${e.centavos === 0 ? 'Grátis' : brl(e.centavos)}</span>
            </label>`;
          }).join('')}
        </div>
        ${blocoDeTotais(entrega.centavos)}`,
      rodape: `
        <button class="botao botao-primario botao-cheio m2-quadrado" type="button">${icone('cadeado', 17)} Ir para o pagamento · ${brl(totalComFrete())}</button>
        <div class="m2-dica-centro">${entrega.centavos === 0
          ? 'Retirada na loja, sem custo de frete'
          : 'Prazo começa a contar após a confirmação do pagamento'}</div>`,
    });
  },

  pagamento() {
    const entrega = entregaEscolhida();
    const total = totalComFrete();
    const noPix = ESTADO.pagamento === 'pix';

    const avisoDoPix = `<div class="m2-aviso-pix">
      <span class="m2-aviso-icone">${icone('pix', 19, 1.9)}</span>
      <p>O código Pix aparece na próxima tela e vale por 30 minutos. As peças ficam reservadas nesse período.</p>
    </div>`;

    const formularioDoCartao = `<div class="m2-cartao-form">
      <label class="campo m2-campo">
        <span class="campo-rotulo">Número do cartão</span>
        <input class="entrada" type="text" placeholder="0000 0000 0000 0000" aria-label="Número do cartão">
      </label>
      <label class="campo m2-campo">
        <span class="campo-rotulo">Nome impresso no cartão</span>
        <input class="entrada" type="text" aria-label="Nome impresso no cartão">
      </label>
      <div class="m2-par m2-par-cvv">
        <label class="campo m2-campo">
          <span class="campo-rotulo">Validade</span>
          <input class="entrada" type="text" placeholder="MM/AA" aria-label="Validade">
        </label>
        <label class="campo m2-campo">
          <span class="campo-rotulo">CVV</span>
          <input class="entrada" type="text" placeholder="000" aria-label="CVV">
        </label>
      </div>
      <div class="m2-parcelas-titulo">Parcelas</div>
      <div class="m2-parcelas">
        ${Array.from({ length: PARCELAS_MAXIMAS }, (_, i) => i + 1).map(n => {
          const on = n === ESTADO.parcelas;
          return `<button type="button" class="m2-parcela ${on ? 'm2-parcela-ativa' : ''}" data-acao="parcelas" data-valor="${n}">
            <span class="m2-parcela-vezes">${n}x</span>
            <span class="m2-parcela-valor">${brl(valorDaParcela(total, n))}</span>
            <span class="m2-parcela-nota">sem juros</span>
          </button>`;
        }).join('')}
      </div>
      <div class="m2-dica-centro">Total ${brl(total)} · ${ESTADO.parcelas}x de ${brl(valorDaParcela(total, ESTADO.parcelas))} sem juros</div>
    </div>`;

    return m2Sheet({
      titulo: 'Pagamento',
      voltar: true,
      alto: true,
      corpo: `
        ${cartaoDeEntrega(entrega)}
        <div class="m2-bloco">
          <div class="m2-bloco-topo"><span>Como você quer pagar</span></div>
          ${PAGAMENTOS.map(p => {
            const on = p.id === ESTADO.pagamento;
            return `<label class="m2-opcao ${on ? 'm2-opcao-ativa' : ''}" data-acao="pagamento" data-valor="${p.id}">
              <span class="m2-radio"></span>
              <span class="m2-opcao-corpo">
                <span class="m2-opcao-nome">${p.nome}</span>
                <span class="m2-opcao-apoio">${p.apoio}</span>
              </span>
              ${p.selo ? `<span class="selo m2-selo-verde">${p.selo}</span>` : ''}
            </label>`;
          }).join('')}
        </div>
        ${noPix ? avisoDoPix : formularioDoCartao}
        ${blocoDeTotais(entrega.centavos, {
          rotuloFrete: rotuloDoFrete(),
          rodape: noPix ? 'No Pix: ' + brl(Math.round(total * 0.95)) : `${ESTADO.parcelas}x de ${brl(valorDaParcela(total, ESTADO.parcelas))}`,
        })}`,
      rodape: `
        <button class="botao botao-gradiente botao-cheio m2-pilula" type="button">${icone('cadeado', 17)} ${noPix
          ? 'Gerar código Pix'
          : `Pagar em ${ESTADO.parcelas}x`}</button>
        <div class="m2-dica-centro">Ambiente 100% seguro</div>`,
    });
  },

  /* Mesma tela do Pix: quem decide a forma é o `fixo` da entrada em TELAS. */
  pagamentoCartao() {
    return MODELO_2.pagamento();
  },

  pix() {
    const p = PEDIDO_PIX;
    return m2Pagina({
      corpo: `<div class="m2-desfecho">
        <div class="m2-check"><span class="m2-check-anel"></span><span class="m2-check-miolo">${icone('check', 40, 2.4)}</span></div>
        <h1 class="m2-desfecho-titulo">Pix enviado!</h1>
        <p class="m2-desfecho-texto">Recebemos seu comprovante. A loja confirma o pagamento e separa suas peças.</p>
        <div class="cartao m2-resumo">
          <div class="m2-resumo-linha"><span>Pedido</span><span class="m2-mono">${p.id}</span></div>
          <div class="m2-resumo-linha"><span>Valor pago no Pix</span><span class="m2-resumo-valor">${brl(p.valor)}</span></div>
          <div class="m2-resumo-linha"><span>Entrega</span><span class="m2-resumo-forte">${p.entrega}</span></div>
          <div class="regua"></div>
          ${andamento(p.etapas)}
        </div>
        ${contatoDaLoja()}
      </div>`,
      rodape: `
        <button class="botao botao-primario botao-cheio m2-quadrado" type="button">Acompanhar meu pedido</button>
        <button class="botao botao-neutro botao-cheio m2-quadrado m2-secundario" type="button">Voltar para a vitrine</button>
        ${naoAfiliado()}`,
    });
  },

  cartao() {
    const p = PEDIDO_CARTAO;
    return m2Pagina({
      corpo: `<div class="m2-desfecho">
        <div class="m2-check"><span class="m2-check-anel"></span><span class="m2-check-miolo">${icone('check', 40, 2.4)}</span></div>
        <h1 class="m2-desfecho-titulo">Pagamento aprovado!</h1>
        <p class="m2-desfecho-texto">Seu cartão foi aprovado e suas peças já estão reservadas para separação.</p>
        <div class="cartao m2-resumo">
          <div class="m2-resumo-linha"><span>Pedido</span><span class="m2-mono">${p.id}</span></div>
          <div class="m2-cartao-linha">
            <span class="m2-tarja"><i></i></span>
            <div class="linha-corpo">
              <div class="linha-titulo">Cartão de crédito</div>
              <div class="linha-apoio m2-mono">${p.cartao}</div>
            </div>
            <span class="selo m2-selo-verde">Aprovado</span>
          </div>
          <div class="regua"></div>
          <div class="m2-resumo-linha"><span>Subtotal (${pecasNaSacola()} peças)</span><span class="m2-resumo-forte">${brl(p.subtotal)}</span></div>
          <div class="m2-resumo-linha"><span>Frete (Sedex)</span><span class="m2-resumo-forte">${brl(p.frete)}</span></div>
          <div class="m2-resumo-linha m2-resumo-total"><span>Total</span><span class="preco-grande">${brl(p.total)}</span></div>
          <div class="totais-rodape">${p.parcelas}</div>
          <div class="regua"></div>
          ${andamento(p.etapas)}
        </div>
        <div class="m2-endereco-curto">
          <span class="quadro-icone">${icone('local', 17, 1.9)}</span>
          <p>${CLIENTE.nome} · ${CLIENTE.enderecoLinha}</p>
        </div>
        ${contatoDaLoja()}
      </div>`,
      rodape: `
        <button class="botao botao-primario botao-cheio m2-quadrado" type="button">Acompanhar meu pedido</button>
        <button class="botao botao-neutro botao-cheio m2-quadrado m2-secundario" type="button">Voltar para a vitrine</button>
        ${naoAfiliado()}`,
    });
  },

  pedidos() {
    const cabecalho = `
      <div class="m2-barra-pedidos">
        <button class="m2-redondo m2-redondo-cheio" type="button" aria-label="Voltar">${icone('voltar', 15, 2.4)}</button>
        <div class="m2-barra-corpo">
          <div class="m2-barra-nome">Meus pedidos</div>
          <div class="m2-barra-apoio">${CLIENTE.arroba} · ${LOJA.nome}</div>
        </div>
        ${avatarDaLoja('pequeno', CLIENTE.inicial, 'solido')}
      </div>
      <div class="m2-abas">
        ${ABAS_PEDIDOS.map((a, i) => `<span class="m2-aba ${i === 0 ? 'm2-aba-ativa' : ''}">${a}</span>`).join('')}
      </div>`;

    const corpo = `<div class="m2-lista-pedidos">
      ${PEDIDOS.map(pedido => `<article class="m2-pedido">
        <div class="m2-pedido-topo">
          <span class="m2-mono m2-pedido-id">${pedido.id}</span>
          <span class="m2-pedido-data">${pedido.data}</span>
          ${selo(pedido.estado, pedido.tom)}
        </div>
        <div class="m2-pedido-corpo">
          <div class="m2-pilha">
            ${pedido.codigos.map((c, i) => `<div class="m2-pilha-foto" style="margin-left:${i ? -14 : 0}px">
              ${foto({ codigo: c, tipo: TIPO_POR_CODIGO[c] })}
            </div>`).join('')}
          </div>
          <div class="m2-pedido-texto">
            <div class="m2-pedido-resumo">${pedido.resumo}</div>
            <div class="m2-pedido-qtd">${pedido.qtd} ${pedido.qtd === 1 ? 'peça' : 'peças'}</div>
          </div>
          <div class="m2-pedido-valores">
            <div class="m2-pedido-total">${pedido.total}</div>
            <div class="m2-pedido-pagamento">${pedido.pagamento}</div>
          </div>
        </div>
        <div class="m2-pedido-base">
          <div class="m2-rastreio">
            <span class="m2-ponto-estado" style="background:${TONS_DE_ESTADO[pedido.tom][0]}"></span>
            <span>${pedido.rastreio}</span>
          </div>
          <button class="botao botao-gradiente m2-detalhes" type="button">Detalhes</button>
        </div>
      </article>`).join('')}
      <p class="m2-nota-lista">Só aparecem pedidos feitos com o @ ${CLIENTE.arroba.replace('@', '')}</p>
    </div>`;

    return m2Pagina({
      cabecalho,
      corpo,
      rodape: `
        <button class="botao botao-gradiente botao-cheio m2-pilula" type="button">Voltar para a vitrine</button>
        ${naoAfiliado()}`,
    });
  },

  detalhe() {
    const p = PEDIDO_CARTAO;
    const cabecalho = `<div class="m2-barra-pedidos">
      <button class="m2-redondo m2-redondo-cheio" type="button" aria-label="Voltar">${icone('voltar', 15, 2.4)}</button>
      <div class="m2-barra-corpo">
        <div class="m2-barra-nome">Pedido ${p.id}</div>
        <div class="m2-barra-apoio">feito hoje, 14:02 · ${CLIENTE.arroba}</div>
      </div>
      <span class="m2-selo-vazado">Separando</span>
    </div>`;

    const corpo = `<div class="m2-detalhe">
      <div class="cartao">
        <div class="m2-bloco-topo"><span>Andamento</span></div>
        ${andamento(ANDAMENTO_4822)}
      </div>

      <div class="cartao m2-cartao-itens">
        <div class="m2-itens-topo"><span>Itens</span><span class="m2-bloco-apoio">${pecasNaSacola()} peças</span></div>
        ${SACOLA.map(item => `<div class="m2-item-detalhe">
          <div class="m2-item-foto-detalhe">${foto(item, { codigo: false })}</div>
          <div class="item-corpo">
            <div class="m2-item-nome-detalhe">${item.nome}</div>
            <div class="item-apoio">Tamanho ${item.tamanho.toLowerCase() === 'único' ? 'único' : item.tamanho}</div>
          </div>
          <div class="m2-item-direita">
            <div class="m2-item-valor">${brl(item.centavos * item.qtd)}</div>
            <div class="m2-item-unidade">${item.qtd}× ${brl(item.centavos)}</div>
          </div>
        </div>`).join('')}
        <div class="m2-itens-totais">
          <div class="totais-linha"><span>Subtotal</span><span>${brl(p.subtotal)}</span></div>
          <div class="totais-linha"><span>Frete (Sedex)</span><span>${brl(p.frete)}</span></div>
          <div class="regua"></div>
          <div class="totais-linha totais-final"><span>Total</span><span class="preco-grande">${brl(p.total)}</span></div>
          <div class="totais-rodape">cartão •••• 4218 · ${p.parcelas.replace(' sem juros', '')}</div>
        </div>
      </div>

      <div class="cartao">
        <div class="linha-icone">
          <span class="quadro-icone">${icone('local', 16, 1.9)}</span>
          <div class="linha-corpo">
            <div class="linha-titulo">Entrega</div>
            <div class="linha-apoio">${CLIENTE.nome}<br>${CLIENTE.endereco.join('<br>')}</div>
          </div>
        </div>
        <div class="regua"></div>
        <div class="linha-icone">
          <span class="quadro-icone">${icone('caminhao', 16, 1.9)}</span>
          <div class="linha-corpo">
            <div class="linha-titulo">Código de rastreio</div>
            <div class="linha-apoio">sai quando o pedido for postado</div>
          </div>
          <span class="m2-traco">—</span>
        </div>
      </div>

      ${contatoDaLoja()}
    </div>`;

    return m2Pagina({
      cabecalho,
      corpo,
      rodape: `
        <button class="botao botao-vazado botao-cheio m2-pilula" type="button">Voltar para meus pedidos</button>
        ${naoAfiliado()}`,
    });
  },
};
