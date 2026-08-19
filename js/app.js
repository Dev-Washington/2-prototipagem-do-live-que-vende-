const REGISTRO = {};
if (typeof MODELO_1 !== 'undefined') REGISTRO[1] = MODELO_1;
if (typeof MODELO_2 !== 'undefined') REGISTRO[2] = MODELO_2;
if (typeof MODELO_3 !== 'undefined') REGISTRO[3] = MODELO_3;

/* `fixo` é o estado que aquela tela carrega consigo — é o que deixa a mesma faixa
   mostrar Pix e cartão lado a lado sem uma virar a outra ao ser tocada. */
function montarTela(modeloId, telaId, largo = false, fixo = null) {
  if (fixo) Object.assign(ESTADO, fixo);

  const modelo = REGISTRO[modeloId];
  const fabrica = modelo && modelo[telaId];
  if (!fabrica) {
    return `<div class="celular m${modeloId}"><div class="tela-faltando">Tela “${telaId}” ainda não desenhada no modelo ${modeloId}</div></div>`;
  }

  const marca = fixo ? ` data-fixo='${JSON.stringify(fixo)}'` : '';
  return `<div class="${largo ? 'folha' : 'celular'} m${modeloId}" data-tela="${telaId}" data-modelo="${modeloId}"${marca}>${fabrica()}</div>`;
}

function estadoFixo(celular) {
  try { return celular.dataset.fixo ? JSON.parse(celular.dataset.fixo) : null; } catch (erro) { return null; }
}

function molduraEscalada(modeloId, telaId, escala, fixo) {
  return `<div class="moldura" style="--escala:${escala}">
    <div class="moldura-palco">${montarTela(modeloId, telaId, false, fixo)}</div>
  </div>`;
}

/* `doTopo` é para a troca de tela da 16: manter a rolagem faria a tela nova
   nascer no meio, coisa que tocar num botão de aplicativo nunca faz. */
function redesenhar(celular, doTopo = false) {
  const rolagens = [...celular.querySelectorAll('.rolagem')].map((r) => r.scrollTop);
  const pai = celular.parentNode;
  const posicao = [...pai.children].indexOf(celular);

  celular.outerHTML = montarTela(Number(celular.dataset.modelo), celular.dataset.tela, false, estadoFixo(celular));

  pai.children[posicao].querySelectorAll('.rolagem').forEach((r, i) => {
    r.scrollTop = doTopo ? 0 : (rolagens[i] || 0);
  });
}

function ligarInteracoes() {
  document.addEventListener('click', (evento) => {
    const gatilho = evento.target.closest('[data-acao]');
    const link = evento.target.closest('a[href^="#"]');
    if (!gatilho && !link) return;

    const celular = (gatilho || link).closest('.celular, .folha');
    if (!celular) return;

    const acao = gatilho ? gatilho.dataset.acao : '';
    const valor = gatilho ? gatilho.dataset.valor : '';

    if (acao === 'filtro') ESTADO.filtro = valor;
    if (acao === 'filtro-pedidos') ESTADO.pedidos = valor;
    if (acao === 'entrega') ESTADO.entrega = valor;
    if (acao === 'pagamento') ESTADO.pagamento = valor;
    if (acao === 'parcelas') { ESTADO.parcelas = Number(valor); ESTADO.pagamento = 'cartao'; }
    if (acao === 'tamanho') { ESTADO.tamanho = valor; ESTADO.qtd = quantidadeEscolhida(); }
    /* Abrir outra peça zera o que era da anterior: tamanho, cor, foto e quantidade. */
    if (acao === 'peca') {
      ESTADO.peca = valor;
      ESTADO.tamanho = '';
      ESTADO.cor = '';
      ESTADO.foto = 0;
      ESTADO.qtd = 1;
    }
    if (acao === 'foto') ESTADO.foto = Number(valor);
    if (acao === 'cor') { ESTADO.cor = valor; ESTADO.foto = 0; }
    if (acao === 'qtd') ESTADO.qtd = quantidadeEscolhida() + Number(valor);
    if (acao === 'descricao') ESTADO.descricao = !ESTADO.descricao;
    if (acao === 'item-qtd') mudarQtdDoItem(Number(gatilho.dataset.item), Number(valor));
    if (acao === 'item-editar') {
      const alvo = Number(gatilho.dataset.item);
      ESTADO.editando = ESTADO.editando === alvo ? -1 : alvo;
    }
    if (acao === 'item-tamanho') trocarTamanhoDoItem(Number(gatilho.dataset.item), valor);
    if (acao === 'item-cor') trocarCorDoItem(Number(gatilho.dataset.item), valor);
    if (acao === 'item-tirar') tirarDaSacola(Number(gatilho.dataset.item));
    if (acao === 'item-voltar') devolverASacola();
    if (acao === 'passo') ESTADO.passo = Number(valor);
    if (acao === 'bandeira') ESTADO.cartao.bandeira = ESTADO.cartao.bandeira === valor ? '' : valor;
    if (acao === 'reservar') ESTADO.reservaAte = Date.now() + MINUTOS_DE_RESERVA * 60000;
    if (acao === 'por-na-sacola') porNaSacola();

    /* Tela 16: o toque troca a tela viva do aparelho, sem mexer no endereço da
       apresentação. O `fixo` da entrada em TELAS vem junto, senão o atalho do
       cartão chegaria lá desenhado como Pix. */
    if (celular.dataset.tela === 'app') {
      const modelo = REGISTRO[Number(celular.dataset.modelo)];
      const destino = (gatilho && gatilho.dataset.tela)
        || (link ? link.getAttribute('href').slice(1) : '');

      if (destino && modelo[destino]) {
        const entrada = TELAS.find((t) => t.id === destino);
        if (entrada && entrada.fixo) Object.assign(ESTADO, entrada.fixo);
        ESTADO.viva = destino;
        evento.preventDefault();
        redesenhar(celular, true);
        return;
      }
    }

    /* Link comum fora da 16: quem leva é o navegador, como sempre. */
    if (!gatilho) return;

    /* Depois de mexer no estado e antes do preventDefault de propósito: a fatia
       do contato é um link, e a descrição abre sozinha por ser um <details>. */
    if (gatilho.hasAttribute('data-sem-redesenho')) return;

    evento.preventDefault();

    redesenhar(celular);
  });

  /* Sem redesenho de propósito: refazer a tela a cada tecla tiraria o foco do
     campo. O valor vai para o dado, e a próxima tela desenhada já o mostra. */
  document.addEventListener('input', (evento) => {
    const campo = evento.target.closest('[data-campo]');
    if (campo) CLIENTE.campos[campo.dataset.campo] = campo.value;
  });

  document.addEventListener('click', (evento) => {
    if (!evento.target.closest('[data-recomecar]')) return;
    recomecarDemonstracao();
    const aparelho = document.querySelector('[data-tela="app"]');
    if (aparelho) redesenhar(aparelho, true);
  });

  document.addEventListener('change', (evento) => {
    const campo = evento.target.closest('[data-acao="parcelas-select"]');
    if (!campo) return;
    const celular = campo.closest('.celular, .folha');
    if (!celular) return;
    ESTADO.parcelas = Number(campo.value);
    redesenhar(celular);
  });
}

function montarComparativo(destino) {
  const escala = 0.58;

  /* Montar uma tela presa mexe no ESTADO. Sem devolver o valor de antes, as
     faixas desenhadas depois herdariam a escolha da última presa. */
  const comEstado = (fixo, montar) => {
    if (!fixo) return montar();
    const antes = {};
    Object.keys(fixo).forEach((chave) => { antes[chave] = ESTADO[chave]; });
    const html = montar();
    Object.assign(ESTADO, antes);
    return html;
  };

  destino.innerHTML = TELAS.map((tela, i) => `
    <section class="faixa" id="${tela.id}">
      <header class="faixa-cabecalho">
        <span class="faixa-numero">${String(i + 1).padStart(2, '0')}</span>
        <div>
          <h2>${tela.titulo}</h2>
          <p>${tela.apoio}</p>
        </div>
      </header>
      ${comEstado(tela.fixo, () => `<div class="faixa-modelos">
        ${MODELOS.map(m => `<div class="coluna">
          <div class="coluna-etiqueta">
            <span class="coluna-numero">Modelo ${m.id}</span>
            <span class="coluna-nome">${m.nome}</span>
          </div>
          ${molduraEscalada(m.id, tela.id, escala, tela.fixo)}
        </div>`).join('')}
      </div>`)}
    </section>`).join('');

  ligarInteracoes();
}

function montarIndiceDoComparativo(destino) {
  destino.innerHTML = TELAS.map((tela, i) => `
    <a href="#${tela.id}" data-indice="${tela.id}"><span>${String(i + 1).padStart(2, '0')}</span>${tela.titulo}</a>`).join('');

  if (!('IntersectionObserver' in window)) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      const link = destino.querySelector(`[data-indice="${entrada.target.id}"]`);
      if (link) link.classList.toggle('indice-ativo', entrada.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  document.querySelectorAll('.faixa').forEach((faixa) => observador.observe(faixa));
}

function montarFluxo(modeloId, antes = [], depois = []) {
  const telas = [...antes, ...TELAS, ...depois];
  const palco = document.querySelector('[data-palco]');
  const contador = document.querySelector('[data-contador]');
  const titulo = document.querySelector('[data-titulo-tela]');
  const apoio = document.querySelector('[data-apoio-tela]');
  const trilha = document.querySelector('[data-trilha]');
  const anterior = document.querySelector('[data-anterior]');
  const proxima = document.querySelector('[data-proxima]');

  trilha.innerHTML = telas.map((tela, i) => `
    <button class="trilha-item" type="button" data-ir="${i}">
      <span class="trilha-numero">${String(i - antes.length + 1).padStart(2, '0')}</span>${tela.titulo}
    </button>`).join('');

  let atual = 0;

  function indiceDoEndereco() {
    const alvo = location.hash.replace('#', '');
    const achado = telas.findIndex(t => t.id === alvo);
    return achado >= 0 ? achado : 0;
  }

  function mostrar(indice, mexerNoEndereco = true) {
    atual = Math.max(0, Math.min(telas.length - 1, indice));
    const tela = telas[atual];

    palco.innerHTML = tela.largo
      ? montarTela(modeloId, tela.id, true, tela.fixo)
      : molduraEscalada(modeloId, tela.id, 1, tela.fixo);
    palco.classList.toggle('palco-largo', !!tela.largo);
    caber();
    contador.textContent = `${atual + 1} / ${telas.length}`;
    titulo.textContent = tela.titulo;
    if (tela.apoioHtml) apoio.innerHTML = tela.apoioHtml;
    else apoio.textContent = tela.apoio;

    trilha.querySelectorAll('[data-ir]').forEach(botao => {
      botao.classList.toggle('trilha-ativa', Number(botao.dataset.ir) === atual);
    });
    const ativo = trilha.querySelector('.trilha-ativa');
    if (ativo) ativo.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    anterior.disabled = atual === 0;
    proxima.disabled = atual === telas.length - 1;

    if (mexerNoEndereco && location.hash !== '#' + tela.id) {
      try { history.replaceState(null, '', '#' + tela.id); } catch (erro) {  }
    }
  }

  /* O aparelho tem 430 × 900 fixos. Numa janela mais baixa que isso ele sai
     da tela pela base — justo onde ficam a barra e o botão que fecha a compra.
     Então ele encolhe inteiro, na proporção, até caber sem rolar a página. */
  function caber() {
    const moldura = palco.querySelector('.moldura');
    if (!moldura) return;

    const aparelho = moldura.firstElementChild;
    const topo = palco.getBoundingClientRect().top + window.scrollY;
    /* O que fica embaixo do aparelho e precisa continuar à vista: o respiro e
       os botões de passar de tela. A dica do teclado pode ficar para a rolagem. */
    const sobra = 90;

    const porAltura = (window.innerHeight - topo - sobra) / aparelho.offsetHeight;
    const porLargura = palco.clientWidth / aparelho.offsetWidth;
    const escala = Math.max(0.5, Math.min(1, porAltura, porLargura));

    moldura.style.setProperty('--escala', escala.toFixed(3));
  }

  window.addEventListener('resize', caber);

  anterior.addEventListener('click', () => mostrar(atual - 1));
  proxima.addEventListener('click', () => mostrar(atual + 1));
  trilha.addEventListener('click', evento => {
    const botao = evento.target.closest('[data-ir]');
    if (botao) mostrar(Number(botao.dataset.ir));
  });

  document.addEventListener('keydown', evento => {
    if (evento.target.matches('input, textarea')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(evento.key)) { evento.preventDefault(); mostrar(atual + 1); }
    if (['ArrowLeft', 'PageUp'].includes(evento.key)) { evento.preventDefault(); mostrar(atual - 1); }
    if (evento.key === 'Home') mostrar(0);
    if (evento.key === 'End') mostrar(telas.length - 1);
  });

  document.querySelectorAll('[data-modelo-link]').forEach(link => {
    link.addEventListener('click', () => {
      link.setAttribute('href', link.dataset.modeloLink + '#' + telas[atual].id);
    });
  });

  window.addEventListener('hashchange', () => mostrar(indiceDoEndereco(), false));
  ligarInteracoes();
  mostrar(indiceDoEndereco());
}
