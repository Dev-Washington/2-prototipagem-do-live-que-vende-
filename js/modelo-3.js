const ABAS_M3 = [
  { id: 'catalogo', rotulo: 'Catálogo', traco: 'grade', tela: 'catalogo' },
  { id: 'sacola', rotulo: 'Sacola', traco: 'sacola', contador: true, tela: 'carrinho' },
  { id: 'suporte', rotulo: 'Suporte', traco: 'telefone', link: LOJA.whatsappLink, descricao: `Suporte: falar com a loja no WhatsApp · ${LOJA.whatsapp}` },
  { id: 'pedidos', rotulo: 'Pedidos', traco: 'recibo', tela: 'pedidos' },
  { id: 'dados', rotulo: 'Meus dados', traco: 'pessoa', tela: 'dados' },
];

function m3Contador(classe) {
  return pecasNaSacola() ? `<span class="${classe}">${pecasNaSacola()}</span>` : '';
}

function m3Barra(abaAtiva) {
  abaAtiva = abaAtiva || ESTADO.aba;
  const indice = Math.max(0, ABAS_M3.findIndex((item) => item.id === abaAtiva));
  const corrente = ABAS_M3[indice];

  const slot = (item, i) => {

    const abre = item.link ? 'a' : 'button';
    const atributos = item.link
      ? `href="${item.link}" target="_blank" rel="noopener"`
      : 'type="button"';

    return `
    <${abre} class="m3-aba ${i === indice ? 'm3-aba-ativa' : ''}" ${atributos}
      data-acao="aba" data-valor="${item.id}" ${item.tela ? `data-tela="${item.tela}"` : ''} data-sem-redesenho
      ${i === indice ? 'aria-current="page"' : ''}
      ${item.descricao ? `aria-label="${item.descricao}"` : ''}>
      <span class="m3-aba-icone">${icone(item.traco, 20, 1.8)}</span>
      ${item.contador ? m3Contador('m3-aba-contador') : ''}
      <span class="m3-aba-rotulo">${item.rotulo}</span>
    </${abre}>`;
  };

  return `<nav class="m3-barra" style="--i:${indice}" aria-label="Navegação">
    <div class="m3-abas">${ABAS_M3.map(slot).join('')}</div>
    <span class="m3-marca" aria-hidden="true">
      ${icone(corrente.traco, 23, 2.2)}
      ${corrente.contador ? m3Contador('m3-marca-contador') : ''}
    </span>
  </nav>`;
}

const ESPERA_SUPORTE = 5;

function m3Saida(tela, link) {
  const antiga = tela.querySelector('.m3-saida');
  if (antiga) antiga.remove();

  tela.insertAdjacentHTML('beforeend', `
    <div class="m3-saida" role="alertdialog" aria-label="Redirecionando para o contato com a loja">
      <div class="m3-saida-cartao">
        ${avatarDaLoja('medio', LOJA.inicial, 'solido')}
        <h2 class="m3-saida-titulo">Falar com a loja</h2>
        <p class="m3-saida-texto">Você vai para o WhatsApp de ${LOJA.nome}, no ${LOJA.whatsapp}.</p>
        <div class="m3-conta" aria-hidden="true">${ESPERA_SUPORTE}</div>
        <p class="m3-saida-apoio" aria-live="polite">
          Redirecionando em <b>${ESPERA_SUPORTE}</b> segundos
        </p>
        <div class="m3-saida-barra" aria-hidden="true"><i></i></div>
        <a class="m3-saida-agora" href="${link}" target="_blank" rel="noopener">Ir agora</a>
        <button class="m3-saida-cancelar" type="button">Cancelar</button>
      </div>
    </div>`);

  const camada = tela.querySelector('.m3-saida');
  const conta = camada.querySelector('.m3-conta');
  const apoio = camada.querySelector('.m3-saida-apoio b');
  let resta = ESPERA_SUPORTE;

  const relogio = setInterval(() => {
    /* A tela é redesenhada a cada filtro tocado. Sem esta guarda o relógio
       sobreviveria à camada apagada e abriria o WhatsApp do nada. */
    if (!camada.isConnected) { clearInterval(relogio); return; }

    resta -= 1;
    if (resta > 0) {
      conta.textContent = resta;
      apoio.textContent = resta;
      return;
    }

    clearInterval(relogio);
    camada.querySelector('.m3-saida-cartao').innerHTML = `
      ${avatarDaLoja('medio', LOJA.inicial, 'solido')}
      <h2 class="m3-saida-titulo">Aberto em outra aba</h2>
      <p class="m3-saida-texto">A conversa com ${LOJA.nome} abriu no WhatsApp. Esta tela continua aqui.</p>
      <a class="m3-saida-agora" href="${link}" target="_blank" rel="noopener">Abrir de novo</a>
      <button class="m3-saida-cancelar" type="button">Voltar para a live</button>`;
    window.open(link, '_blank', 'noopener');
  }, 1000);

  camada.addEventListener('click', (evento) => {
    if (evento.target.closest('.m3-saida-cancelar')) {
      clearInterval(relogio);
      camada.remove();
      return;
    }
    if (evento.target.closest('.m3-saida-agora')) clearInterval(relogio);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', (evento) => {
    const gatilho = evento.target.closest('[data-acao="aba"]');
    if (!gatilho) return;

    const barra = gatilho.closest('.m3-barra');
    if (!barra) return;

    const abas = [...barra.querySelectorAll('.m3-aba')];
    const indice = abas.indexOf(gatilho);
    const item = ABAS_M3[indice];
    if (!item) return;

    ESTADO.aba = item.id;
    barra.style.setProperty('--i', indice);
    abas.forEach((aba, i) => aba.classList.toggle('m3-aba-ativa', i === indice));

    const marca = barra.querySelector('.m3-marca');
    if (marca) {
      marca.innerHTML = icone(item.traco, 23, 2.2) + (item.contador ? m3Contador('m3-marca-contador') : '');
    }

    if (!item.link) return;

    /* O link continua real, para quem abre em nova aba pelo teclado ou pelo
       botão do meio do mouse; o clique comum passa pela contagem. */
    const tela = gatilho.closest('.m3-tela');
    if (!tela) return;
    evento.preventDefault();
    m3Saida(tela, item.link);
  });
}

/* `flutuante` paira sobre o conteúdo, junto da barra: precisa ser irmão dela,
   e não filho do corpo, senão rolaria com a lista. */
function m3Tela({ corpo, barra = true, aba, flutuante = '', fundo = '', classe = '' }) {
  return `<div class="m3-tela ${classe}">
    ${fundo}
    <div class="m3-corpo rolagem">${corpo}</div>
    ${flutuante}
    ${barra ? m3Barra(aba) : ''}
  </div>`;
}

/* A tela 16 não desenha nada de novo: mostra a tela viva do aparelho, e quem
   troca a tela viva são os toques dentro dela. */
const TELA_APP = {
  id: 'app',
  titulo: 'Live que Vende',
  apoio: 'as quinze telas ligadas umas nas outras, para usar como a cliente usaria',
  apoioHtml: 'as quinze telas ligadas umas nas outras, para usar como a cliente usaria · <button class="apoio-botao" type="button" data-recomecar>recomeçar do @</button>',
};

const TELA_REFERENCIAS = {
  id: 'referencias',
  titulo: 'Referências',
  apoio: 'os trabalhos do Behance e os pins do Pinterest que deram forma a este modelo',
  largo: true,
};

function m3CorpoCatalogo() {
    const naCamera = produtoNaCamera();
    const lista = produtosFiltrados().filter((p) => p.codigo !== naCamera.codigo);

    const corpo = `<div class="m3-catalogo">
      <header class="m3-topo">
        ${avatarDaLoja('pequeno', LOJA.inicial, 'solido')}
        <div class="m3-topo-corpo">
          <div class="m3-topo-nome">${LOJA.nome}</div>
          <div class="m3-topo-apoio"><span class="m3-ponto-vivo"></span>${LOJA.situacao}</div>
        </div>
      </header>

      <section class="m3-destaque" aria-label="Peça na câmera agora">
        <a class="m3-destaque-miolo" href="#produto"
          data-acao="peca" data-valor="${naCamera.codigo}" data-sem-redesenho aria-label="Abrir ${naCamera.nome}">
          <div class="m3-destaque-foto">${foto(naCamera, { codigo: false })}</div>
          <div class="m3-destaque-corpo">
            <span class="m3-agora"><span class="m3-ponto-vivo"></span>Na câmera agora</span>
            <div class="m3-destaque-nome">${naCamera.nome}</div>
            <div class="m3-destaque-preco">${brl(naCamera.centavos)}</div>
            <div class="m3-destaque-saldo">${naCamera.saldo}</div>
            <span class="m3-cod-chip">${naCamera.codigo}</span>
          </div>
        </a>
      </section>

      <div class="m3-cabecalho-lista">
        <h1>Últimas ofertas da live</h1>
        <p>${ESTADO.filtro === 'Todos'
          ? 'Produtos que já foram mostrados na live'
          : `${lista.length} ${lista.length === 1 ? 'peça' : 'peças'} em “${ESTADO.filtro}”`}</p>
      </div>

      <div class="m3-filtros" role="group" aria-label="Filtrar as peças da live">
        ${FILTROS.map(f => `<button type="button" class="m3-filtro ${f === ESTADO.filtro ? 'm3-filtro-ativo' : ''}" data-acao="filtro" data-valor="${f}" aria-pressed="${f === ESTADO.filtro}">${f}</button>`).join('')}
      </div>

      ${lista.length ? `<div class="m3-grade">
        ${lista.map(p => `<a class="m3-produto" href="#produto"
          data-acao="peca" data-valor="${p.codigo}" data-sem-redesenho aria-label="Abrir ${p.nome}">
          <div class="m3-produto-foto">${foto(p, { codigo: false })}</div>
          <div class="m3-produto-nome">${p.nome}</div>
          <div class="m3-produto-linha">
            <span class="m3-produto-preco">${brl(p.centavos)}</span>
            <span class="m3-cod-chip">${p.codigo}</span>
          </div>
          <div class="m3-produto-saldo">${p.saldo}</div>
        </a>`).join('')}
      </div>` : `
      <div class="m3-vazio">
        <strong>Nenhuma peça em “${ESTADO.filtro}”</strong>
        <p>Esta live ainda não mostrou nada nessa faixa. Toque em <b>Todos</b> para ver tudo.</p>
      </div>`}

      <div class="m3-chamada">
        <span class="m3-chamada-icone">${icone('sacola', 20, 1.9)}</span>
        <div class="m3-chamada-corpo">
          <div class="m3-chamada-titulo">Gostou de algum item?</div>
          <div class="m3-chamada-texto">Digite o código do produto para comprar agora.</div>
        </div>
      </div>

      <div class="m3-fecho">
        ${selosDePrivacidade()}
        ${naoAfiliado()}
      </div>
    </div>`;

    return corpo;
  }

function m3SemPrazo() {
  return `<div class="m3-reserva">
    <span class="m3-reserva-icone">${icone('relogio', 17, 1.9)}</span>
    <div>
      <strong>Guardado até o fim da live</strong>
      <span>A loja segura as peças enquanto a live estiver no ar. Depois disso a reserva cai.</span>
    </div>
  </div>`;
}

function m3Prazo(restam) {
  if (!restam) {
    return `<div class="m3-prazo m3-prazo-fim" role="status">
      <span class="m3-prazo-icone">${icone('relogio', 17, 1.9)}</span>
      <div class="m3-prazo-corpo">
        <strong>Reserva expirada</strong>
        <span>As peças voltaram para quem está na live. Reserve de novo se ainda houver saldo.</span>
      </div>
      <button class="m3-prazo-refazer" type="button" data-acao="reservar">Reservar de novo</button>
    </div>`;
  }

  const total = MINUTOS_DE_RESERVA * 60;
  return `<div class="m3-prazo ${restam <= 60 ? 'm3-prazo-fim-perto' : ''}">
    <span class="m3-prazo-icone">${icone('relogio', 17, 1.9)}</span>
    <div class="m3-prazo-corpo">
      <strong>Reservado por mais
        <b class="m3-prazo-relogio" data-relogio aria-live="off">${relogioDaReserva(restam)}</b></strong>
      <span>Passou disso, as peças voltam para a live e a sacola se desfaz.</span>
      <span class="m3-prazo-trilho" aria-hidden="true"><i data-trilho style="--parte:${restam / total}"></i></span>
    </div>
  </div>`;
}

/* Um relógio só para a página inteira: a tela se redesenha a cada toque, e um
   intervalo preso a ela morreria junto. No zero, redesenha para trocar o estado. */
if (typeof document !== 'undefined') {
  setInterval(() => {
    document.querySelectorAll('[data-relogio]').forEach((marca) => {
      const restam = segundosDaReserva();
      const tela = marca.closest('.celular');
      if (!restam) { if (tela) redesenhar(tela); return; }

      marca.textContent = relogioDaReserva(restam);
      if (restam <= 60) marca.closest('.m3-prazo').classList.add('m3-prazo-fim-perto');

      const trilho = marca.closest('.m3-prazo').querySelector('[data-trilho]');
      if (trilho) trilho.style.setProperty('--parte', restam / (MINUTOS_DE_RESERVA * 60));
    });
  }, 1000);
}

function m3Sacola(comPrazo) {
  const pecas = pecasNaSacola();
  const tirados = ESTADO.tirados.length;
  const restam = comPrazo ? segundosDaReserva() : 0;
  const expirou = comPrazo && !restam;

  const item = (it, i) => {
    const teto = saldoDoItem(it);
    const cor = corDoItem(it);
    const abertoAqui = ESTADO.editando === i;

    return `<article class="m3-item ${abertoAqui ? 'm3-item-editando' : ''}">
      <div class="m3-item-cima">
        <div class="m3-item-foto">${foto(it, { codigo: false })}</div>
        <div class="m3-item-corpo">
          <div class="m3-item-alto">
            <div class="m3-item-nome">${it.nome}</div>
            <button class="m3-item-tirar" type="button" data-acao="item-tirar" data-item="${i}"
              aria-label="Tirar ${it.nome} da sacola">${icone('lixeira', 15, 1.9)}</button>
          </div>
          <div class="m3-item-chips">
            <span class="m3-cod-chip">${it.codigo}</span>
            <span class="m3-item-tam">${it.tamanho}</span>
            ${cor ? `<span class="m3-item-tam">${cor.nome}</span>` : ''}
            <button class="m3-item-editar" type="button" data-acao="item-editar" data-item="${i}"
              aria-expanded="${abertoAqui}" aria-label="Trocar tamanho ou cor de ${it.nome}">
              ${icone('lapis', 13, 2)}${abertoAqui ? 'Pronto' : 'Editar'}
            </button>
          </div>
          <div class="m3-item-baixo">
            <div class="m3-contagem m3-contagem-mini">
              <button class="m3-passo" type="button" data-acao="item-qtd" data-item="${i}" data-valor="-1"
                ${it.qtd <= 1 ? 'disabled' : ''} aria-label="Menos um ${it.nome}">${icone('menos', 13, 2.6)}</button>
              <span class="m3-numero" aria-live="polite">${it.qtd}</span>
              <button class="m3-passo" type="button" data-acao="item-qtd" data-item="${i}" data-valor="1"
                ${it.qtd >= teto ? 'disabled' : ''} aria-label="Mais um ${it.nome}">${icone('mais', 13, 2.6)}</button>
            </div>
            <div class="m3-item-valores">
              ${it.qtd > 1 ? `<span class="m3-item-unidade">${brl(it.centavos)} a peça</span>` : ''}
              <strong class="m3-item-total">${brl(it.centavos * it.qtd)}</strong>
            </div>
          </div>
        </div>
      </div>
      ${abertoAqui ? editor(it, i) : ''}
    </article>`;
  };

  const editor = (it, i) => {
    const cores = coresDoItem(it);

    return `<div class="m3-editor">
      <div class="m3-editor-linha">
        <span class="m3-editor-rotulo">Tamanho</span>
        <div class="m3-editor-opcoes" role="group" aria-label="Tamanho de ${it.nome}">
          ${tamanhosDoItem(it).map(v => `<button type="button"
            class="m3-editor-tam ${v.rotulo === it.tamanho ? 'm3-editor-ativo' : ''}"
            data-acao="item-tamanho" data-item="${i}" data-valor="${v.rotulo}"
            ${v.disponivel ? '' : 'disabled'} aria-pressed="${v.rotulo === it.tamanho}">
            ${v.rotulo}<small>${v.disponivel ? `${v.disponivel} disp.` : 'sem estoque'}</small>
          </button>`).join('')}
        </div>
      </div>

      ${cores.length ? `<div class="m3-editor-linha">
        <span class="m3-editor-rotulo">Cor</span>
        <div class="m3-editor-opcoes" role="group" aria-label="Cor de ${it.nome}">
          ${cores.map(c => `<button type="button"
            class="m3-editor-cor ${c.id === it.cor ? 'm3-editor-ativo' : ''}"
            data-acao="item-cor" data-item="${i}" data-valor="${c.id}"
            aria-pressed="${c.id === it.cor}">
            <span class="m3-editor-tinta" style="--tinta:${c.hex}"></span>${c.nome}
          </button>`).join('')}
        </div>
      </div>` : ''}
    </div>`;
  };

  const corpo = `<div class="m3-sacola">
    <div class="m3-sacola-topo">
      <h1>Sua sacola</h1>
      <p>${!pecas ? `nada guardado ainda na live de ${LOJA.nome}`
        : comPrazo ? `${pecas} ${pecas === 1 ? 'peça reservada' : 'peças reservadas'} no seu nome`
        : `${pecas} ${pecas === 1 ? 'peça guardada' : 'peças guardadas'} na live de ${LOJA.nome}`}</p>
    </div>

    ${SACOLA.length ? `
    ${comPrazo ? m3Prazo(restam) : m3SemPrazo()}

    <div class="m3-itens ${expirou ? 'm3-itens-soltos' : ''}">${SACOLA.map(item).join('')}</div>` : `
    <div class="m3-vazio">
      <strong>Sua sacola está vazia</strong>
      <p>Toque em <b>Catálogo</b> na barra de baixo para ver o que a live já mostrou.</p>
    </div>`}

    ${tirados ? `<div class="m3-devolver">
      <span>${tirados === 1 ? '1 peça tirada da sacola' : `${tirados} peças tiradas da sacola`}</span>
      <button type="button" data-acao="item-voltar">Desfazer</button>
    </div>` : ''}

    ${SACOLA.length ? `
    <div class="m3-resumo">
      <div class="m3-resumo-linha">
        <span>Subtotal (${pecas} ${pecas === 1 ? 'peça' : 'peças'})</span>
        <span>${brl(somaSacola())}</span>
      </div>
      <div class="m3-resumo-linha">
        <span>Frete</span>
        <span class="m3-resumo-fraco">calculado depois do endereço</span>
      </div>
      <div class="m3-resumo-total">
        <span>Total</span>
        <strong>${brl(somaSacola())}</strong>
      </div>
    </div>

    <div class="m3-sacola-fecho">
      <div class="m3-seguro">${icone('escudo', 13, 1.9)} Ambiente 100% seguro</div>
      ${selosDePrivacidade()}
      ${naoAfiliado()}
    </div>` : ''}
  </div>`;

  /* O fechamento paira sobre a lista, acima da barra: o total é o número que
     decide a compra, e ele não pode sair de vista ao rolar. */
  const flutuante = SACOLA.length ? `<div class="m3-fechar">
    <div class="m3-fechar-valor">
      <span>${pecas} ${pecas === 1 ? 'peça' : 'peças'} · frete à parte</span>
      <strong>${brl(somaSacola())}</strong>
    </div>
    ${expirou
      ? `<button class="m3-fechar-botao" type="button" data-acao="reservar">Reservar de novo</button>`
      : `<a class="m3-fechar-botao" href="#cadastro">Ir para a entrega${icone('direita', 16, 2.2)}</a>`}
  </div>` : '';

  return m3Tela({ corpo, aba: 'sacola', flutuante });
}


const PASSOS_M3 = [
  { n: 1, rotulo: 'Contato', campos: ['nome', 'cpf', 'zap'] },
  { n: 2, rotulo: 'Endereço', campos: ['cep', 'rua', 'num', 'bairro', 'compl', 'cidade', 'uf'] },
  { n: 3, rotulo: 'Confirmar', campos: [] },
];

function m3Campo(id) {
  const c = campoDoCadastro(id);
  const valor = valorDoCliente(id);

  return `<label class="m3-campo ${valor ? '' : 'm3-campo-falta'}">
    <span class="m3-campo-rotulo">
      ${c.rotulo}${c.opcional ? '<span class="m3-campo-opcional">opcional</span>' : ''}
    </span>
    <input class="m3-campo-entrada" type="text" value="${valor}" data-campo="${id}"
      ${c.dica ? `placeholder="${c.dica}"` : ''} aria-label="${c.rotulo}">
    ${c.porque ? `<span class="m3-campo-porque">${c.porque}</span>` : ''}
  </label>`;
}

function m3Endereco() {
  return `${m3Campo('cep')}
    <div class="m3-par m3-par-numero">${m3Campo('rua')}${m3Campo('num')}</div>
    <div class="m3-par">${m3Campo('bairro')}${m3Campo('compl')}</div>
    <div class="m3-par m3-par-uf">${m3Campo('cidade')}${m3Campo('uf')}</div>`;
}

function m3Falta(faltando, remate) {
  if (!faltando.length) return '';
  return `<div class="m3-falta">
    <strong>${faltando.length === 1 ? 'Falta 1 dado' : `Faltam ${faltando.length} dados`}</strong>
    <span>${faltando.map(c => c.rotulo).join(', ')} — ${remate}</span>
  </div>`;
}

function m3Trilho(passo) {
  return `<ol class="m3-trilho" aria-label="Passos do cadastro">
    ${PASSOS_M3.map(p => `<li class="m3-trilho-item ${p.n === passo ? 'm3-trilho-agora' : ''} ${p.n < passo ? 'm3-trilho-feito' : ''}">
      <button type="button" data-acao="passo" data-valor="${p.n}" ${p.n === passo ? 'aria-current="step"' : ''}>
        <span class="m3-trilho-bola">${p.n < passo ? icone('check', 12, 3) : p.n}</span>
        <span class="m3-trilho-nome">${p.rotulo}</span>
      </button>
    </li>`).join('')}
  </ol>`;
}

function m3Revisao() {
  const linha = (titulo, texto, ir) => `<div class="m3-revisao">
    <div class="m3-revisao-corpo">
      <strong>${titulo}</strong>
      <span>${texto}</span>
    </div>
    <button class="m3-item-editar" type="button" data-acao="passo" data-valor="${ir}">
      ${icone('lapis', 13, 2)}Editar
    </button>
  </div>`;

  const pecas = pecasNaSacola();
  const zap = valorDoCliente('zap');
  const cpf = valorDoCliente('cpf');
  const rua = [valorDoCliente('rua'), valorDoCliente('num')].filter(Boolean).join(', ');
  const cidade = [valorDoCliente('bairro'), valorDoCliente('cidade'), valorDoCliente('uf')].filter(Boolean).join(' · ');

  return `${linha('Contato',
    `${valorDoCliente('nome') || 'sem nome'}<br>CPF ${cpf || '<b class="m3-vazio-marca">falta</b>'}${zap ? ` · WhatsApp ${zap}` : ''}`, 1)}
    ${linha('Endereço',
      `${rua || 'sem rua'}${valorDoCliente('compl') ? ` — ${valorDoCliente('compl')}` : ''}<br>${cidade}${valorDoCliente('cep') ? `<br>CEP ${valorDoCliente('cep')}` : ''}`, 2)}

    <section class="m3-grupo">
      <h2 class="m3-grupo-titulo">${pecas} ${pecas === 1 ? 'peça' : 'peças'}</h2>
      <div class="m3-revisao-itens">
        ${SACOLA.map(it => `<div class="m3-revisao-item">
          <div class="m3-revisao-foto">${foto(it, { codigo: false })}</div>
          <div class="m3-revisao-nome">${it.nome}
            <span>${it.tamanho}${corDoItem(it) ? ` · ${corDoItem(it).nome}` : ''} · ${it.qtd}×</span>
          </div>
          <strong>${brl(it.centavos * it.qtd)}</strong>
        </div>`).join('')}
      </div>
    </section>

    <div class="m3-resumo">
      <div class="m3-resumo-linha">
        <span>Subtotal (${pecas} ${pecas === 1 ? 'peça' : 'peças'})</span>
        <span>${brl(somaSacola())}</span>
      </div>
      <div class="m3-resumo-linha">
        <span>Frete</span>
        <span class="m3-resumo-fraco">escolhido no passo seguinte</span>
      </div>
      <div class="m3-resumo-total">
        <span>Total até aqui</span>
        <strong>${brl(somaSacola())}</strong>
      </div>
    </div>`;
}

function m3Opcao({ escolhido, acao, valor, titulo, apoio, direita, selo }) {
  return `<button class="m3-opcao ${escolhido ? 'm3-opcao-ativa' : ''}" type="button"
    data-acao="${acao}" data-valor="${valor}" aria-pressed="${escolhido}">
    <span class="m3-opcao-marca" aria-hidden="true">${escolhido ? icone('check', 12, 3.4) : ''}</span>
    <span class="m3-opcao-corpo">
      <strong>${titulo}${selo ? `<span class="m3-opcao-selo">${selo}</span>` : ''}</strong>
      <span>${apoio}</span>
    </span>
    <span class="m3-opcao-valor">${direita}</span>
  </button>`;
}

const MARCAS_M3 = {
  visa: '<span class="m3-marca-visa">VISA</span>',
  master: '<span class="m3-marca-master"><i></i><i></i></span>',
  amex: '<span class="m3-marca-texto">AMEX</span>',
  elo: '<span class="m3-marca-texto">elo</span>',
  hiper: '<span class="m3-marca-texto m3-marca-longa">hipercard</span>',
};

function m3Bandeira() {
  const banda = bandeiraAtiva();
  return banda ? MARCAS_M3[banda.id] : '<span class="m3-marca-vazia">bandeira</span>';
}

function m3EscolhaDaBandeira() {
  const ativa = bandeiraAtiva();

  const apoio = !ativa
    ? 'Escolha a bandeira ou comece a digitar o número.'
    : bandeiraVeioDoNumero()
      ? `<b>${ativa.nome}</b>, reconhecida pelo começo do número. Toque em outra para trocar.`
      : `<b>${ativa.nome}</b>, escolhida por você. Toque de novo para voltar a reconhecer pelo número.`;

  return `<section class="m3-grupo">
    <h2 class="m3-grupo-titulo">Bandeira</h2>
    <div class="m3-bandeiras" role="group" aria-label="Bandeira do cartão">
      ${BANDEIRAS.map(b => `<button type="button"
        class="m3-bandeira ${ativa && b.id === ativa.id ? 'm3-bandeira-ativa' : ''}"
        data-acao="bandeira" data-valor="${b.id}"
        aria-pressed="${!!ativa && b.id === ativa.id}" aria-label="${b.nome}" title="${b.nome}">
        <span class="m3-bandeira-selo">${MARCAS_M3[b.id]}</span>
      </button>`).join('')}
    </div>
    <p class="m3-bandeiras-apoio">${apoio}</p>
  </section>`;
}

function m3CampoDoCartao(id, classe) {
  const c = CAMPOS_DO_CARTAO.find(x => x.id === id);
  return `<input class="${classe}" type="text" inputmode="${id === 'nome' ? 'text' : 'numeric'}"
    value="${ESTADO.cartao[id]}" placeholder="${c.dica}" maxlength="${c.tam}"
    data-cartao="${id}" aria-label="${c.rotulo}" autocomplete="off" spellcheck="false">`;
}

/* O cartão é o formulário: o que se digita aparece onde apareceria no plástico.
   O CVC fica no verso, e o cartão gira quando o campo recebe o foco. */
function m3Cartao() {
  return `<div class="m3-cartao-caixa">
    <div class="m3-cartao">
      <div class="m3-cartao-face m3-cartao-frente">
        <div class="m3-cartao-alto">
          <span class="m3-cartao-chip" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="m3-cartao-marca" data-bandeira>${m3Bandeira()}</span>
        </div>
        ${m3CampoDoCartao('numero', 'm3-cartao-numero')}
        <div class="m3-cartao-baixo">
          <label class="m3-cartao-campo">
            <span>Nome impresso</span>
            ${m3CampoDoCartao('nome', 'm3-cartao-entrada')}
          </label>
          <label class="m3-cartao-campo m3-cartao-campo-curto">
            <span>Validade</span>
            ${m3CampoDoCartao('validade', 'm3-cartao-entrada')}
          </label>
        </div>
      </div>

      <div class="m3-cartao-face m3-cartao-verso">
        <span class="m3-cartao-tarja" aria-hidden="true"></span>
        <label class="m3-cartao-campo m3-cartao-campo-cvc">
          <span>CVC</span>
          ${m3CampoDoCartao('cvc', 'm3-cartao-entrada')}
        </label>
        <span class="m3-cartao-aviso">os três números do verso</span>
      </div>
    </div>
  </div>`;
}

if (typeof document !== 'undefined') {
  /* Sem redesenho: o cartão é o próprio campo, e refazer a tela tiraria o foco. */
  document.addEventListener('input', (evento) => {
    const campo = evento.target.closest('[data-cartao]');
    if (!campo) return;

    const id = campo.dataset.cartao;
    campo.value = mascaraDoCartao(id, campo.value);
    ESTADO.cartao[id] = campo.value;

    const marca = campo.closest('.m3-cartao-caixa').querySelector('[data-bandeira]');
    if (marca) marca.innerHTML = m3Bandeira();
  });

  const girar = (alvo) => {
    document.querySelectorAll('.m3-cartao-caixa').forEach((caixa) => {
      caixa.classList.toggle('m3-cartao-virado',
        !!alvo && caixa.contains(alvo) && alvo.matches('[data-cartao="cvc"]'));
    });
  };
  document.addEventListener('focusin', (evento) => girar(evento.target));
  document.addEventListener('focusout', (evento) => { if (!evento.relatedTarget) girar(null); });
}

function m3Desfecho({ tom, traco, titulo, apoio, selo }) {
  return `<div class="m3-desfecho m3-desfecho-${tom}">
    <span class="m3-desfecho-marca">${icone(traco, 30, 2.4)}</span>
    <h1>${titulo}</h1>
    <p>${apoio}</p>
    ${selo ? `<span class="m3-desfecho-selo">${selo}</span>` : ''}
  </div>`;
}

function m3Recibo(linhas) {
  return `<div class="m3-recibo">
    ${linhas.map(l => `<div class="m3-recibo-linha ${l.forte ? 'm3-recibo-forte' : ''}">
      <span>${l.rotulo}</span><span>${l.valor}</span>
    </div>`).join('')}
  </div>`;
}

const MODELO_3 = {

  app() {
    const viva = MODELO_3[ESTADO.viva] ? ESTADO.viva : 'arroba';
    return MODELO_3[viva]();
  },

  referencias() {
    const janela = r => `<article class="m3-janela">
      <div class="m3-janela-barra">
        <span class="m3-janela-pontos"><i></i><i></i><i></i></span>
        <span class="m3-janela-url">${r.url}</span>
      </div>
      <div class="m3-janela-corpo">
        <h2 class="m3-janela-titulo">${r.titulo}</h2>
        <div class="m3-janela-autoria">por ${r.autoria}</div>
        <p class="m3-janela-texto">${r.oque}</p>
        <div class="m3-marcas">${r.marcas.map(m => `<span>${m}</span>`).join('')}</div>
        <div class="m3-janela-ferramentas">Feito em ${r.ferramentas}</div>
      </div>
      <a class="m3-janela-abrir" href="${r.link}" target="_blank" rel="noopener">
        Abrir no Behance ${icone('direita', 15, 2.2)}
      </a>
    </article>`;

    const pin = r => `<article class="m3-pin">
      <div class="m3-pin-topo">
        <span class="m3-pin-selo">Pinterest</span>
        <span class="m3-pin-onde">${r.onde}</span>
      </div>
      <h3 class="m3-pin-titulo">${r.titulo}</h3>
      <p class="m3-pin-texto">${r.oque}</p>
      <a class="m3-pin-abrir" href="${r.link}" target="_blank" rel="noopener">
        <span class="m3-pin-url">${r.url}</span>${icone('direita', 14, 2.2)}
      </a>
    </article>`;

    const corpo = `<div class="m3-refs">
      <div class="m3-refs-topo">
        <h1>De onde vem o BeHancer</h1>
        <p>Este modelo não saiu de uma folha em branco. Ele foi montado sobre três trabalhos
        de UX/UI publicados por designers no Behance — e é daí que vem o nome — mais dois pins
        do Pinterest que deram a forma do cartão de pagamento e o estilo da página.</p>
      </div>

      <div class="m3-nota">
        <strong>As páginas abrem em outra aba, não aqui dentro.</strong>
        O Behance recusa ser aberto por dentro de outro site (<code>x-frame-options: SAMEORIGIN</code>),
        então cada janela traz o resumo do projeto e o botão que abre a página de verdade.
      </div>

      <div class="m3-janelas">${REFERENCIAS.map(janela).join('')}</div>

      <div class="m3-refs-meio">
        <h2>E dois pins do Pinterest</h2>
        <p>Imagens soltas, não projetos inteiros: uma deu a forma do cartão de crédito, a
        outra o jeito geral das telas.</p>
      </div>

      <div class="m3-pins">${REFERENCIAS_PIN.map(pin).join('')}</div>

      <div class="m3-nota">
        <strong>Pin não é autoria.</strong>
        O Pinterest quase sempre republica o desenho de outra pessoa e não diz de quem é.
        Estes dois entram aqui pelo link e pela finalidade; achar o autor original é tarefa
        para antes da produção, não para a apresentação.
      </div>

      <div class="m3-refs-fecho">
        <strong>Nenhum arquivo foi copiado.</strong>
        <span>O HTML e o CSS deste modelo são escritos do zero, com os dados, os textos e as
        cores da Live que Vende. O que veio de lá é referência visual e de estrutura. Se este
        for o modelo escolhido, conferir os direitos de cada projeto antes de ir para produção.</span>
      </div>
      ${naoAfiliado()}
    </div>`;

    return m3Tela({ corpo, barra: false });
  },

  arroba() {
    const corpo = `<div class="m3-porta">
      <div class="m3-identidade">
        ${avatarDaLoja('gigante')}
        <div class="m3-loja">${LOJA.nome}</div>
        <div class="m3-selo-live"><span class="m3-ponto"></span>Live</div>
      </div>

      <h1 class="m3-titulo">Comentou na live?</h1>
      <p class="m3-texto">Insira seu @ abaixo para gerenciar a sua sacola da live de ${LOJA.nome}.</p>

      <div class="m3-campo-arroba">
        <span class="m3-arroba-marca">@</span>
        <input class="entrada m3-entrada" type="text" placeholder="nome_de_usuario" aria-label="Seu @ no Instagram">
      </div>
      <a class="botao botao-gradiente m3-cta" href="#catalogo">Acessar minha sacola</a>

      ${selosDePrivacidade('seus dados ficam só com a loja')}
      ${naoAfiliado()}
    </div>`;

    return m3Tela({ corpo, barra: false });
  },

  catalogo() {
    return m3Tela({ corpo: m3CorpoCatalogo() });
  },


  produto() {
    const p = pecaAberta();
    const cor = corEscolhida();
    const tamanho = tamanhoEscolhido();
    const fotos = fotosDaPeca();
    const atual = Math.min(ESTADO.foto, fotos.length - 1);
    const disponivel = disponivelNoTamanho(tamanho);
    const qtd = quantidadeEscolhida();

    const corpo = `<div class="m3-peca">
      <a class="m3-redondo" href="#catalogo" aria-label="Voltar para o catálogo">${icone('fechar', 16, 2.4)}</a>

      <div class="m3-peca-palco">
        <div class="m3-peca-foto">
          <img src="assets/${fotos[atual]}" alt="${p.nome} ${cor.nome.toLowerCase()}">
        </div>
        <div class="m3-miniaturas" role="group" aria-label="Fotos da peça">
          ${fotos.map((arquivo, i) => `<button class="m3-mini ${i === atual ? 'm3-mini-ativa' : ''}" type="button"
            data-acao="foto" data-valor="${i}"
            aria-label="Foto ${i + 1} de ${fotos.length}" aria-pressed="${i === atual}">
            <img src="assets/${arquivo}" alt="">
          </button>`).join('')}
        </div>
      </div>

      <div class="m3-peca-texto">
        <div class="m3-peca-alto">
          <h1 class="m3-peca-nome">${p.nome}</h1>
          <span class="m3-peca-preco">${brl(p.centavos)}</span>
        </div>
        <span class="m3-cod-chip">${p.codigo}</span>

        <div class="m3-escolhas">
          <div class="m3-escolha">
            <div class="m3-secao"><span class="m3-secao-titulo">Tamanho</span><span class="m3-secao-apoio">${tamanho} · ${disponivel} disp.</span></div>
            <div class="m3-tamanhos" role="group" aria-label="Tamanho">
              ${p.tamanhos.map(t => `<button class="m3-tamanho ${t === tamanho ? 'm3-tamanho-ativo' : ''}" type="button"
                data-acao="tamanho" data-valor="${t}" aria-pressed="${t === tamanho}">${t}</button>`).join('')}
            </div>
          </div>

          <div class="m3-escolha m3-escolha-cor">
            <div class="m3-secao"><span class="m3-secao-titulo">Cor</span><span class="m3-secao-apoio">${cor.nome}</span></div>
            <div class="m3-cores" role="group" aria-label="Cor">
              ${p.cores.map(c => `<button class="m3-cor ${c.id === cor.id ? 'm3-cor-ativa' : ''}" type="button"
                data-acao="cor" data-valor="${c.id}"
                style="--tinta:${c.hex}" aria-pressed="${c.id === cor.id}" aria-label="${c.nome}">
                ${c.id === cor.id ? icone('check', 13, 3) : ''}
              </button>`).join('')}
            </div>
          </div>
        </div>

        <details class="m3-descricao" ${ESTADO.descricao ? 'open' : ''}>
          <summary data-acao="descricao" data-sem-redesenho>Descrição</summary>
          <p>${p.descricao}</p>
        </details>
      </div>
    </div>`;

    /* O `inert` tira o fundo do foco e da leitura de tela: são os mesmos botões
       do catálogo, e clicar neles ali não faria nada. */
    const fundo = `<div class="m3-fundo" inert>
      <div class="m3-corpo">${m3CorpoCatalogo()}</div>
      ${m3Barra('catalogo')}
    </div>`;

    const flutuante = `<div class="m3-comprar">
      <div class="m3-contagem">
        <button class="m3-passo" type="button" data-acao="qtd" data-valor="-1"
          ${qtd <= 1 ? 'disabled' : ''} aria-label="Menos uma peça">${icone('menos', 15, 2.6)}</button>
        <span class="m3-numero" aria-live="polite">${qtd}</span>
        <button class="m3-passo" type="button" data-acao="qtd" data-valor="1"
          ${qtd >= disponivel ? 'disabled' : ''} aria-label="Mais uma peça">${icone('mais', 15, 2.6)}</button>
      </div>
      <a class="m3-add" href="#carrinho" data-acao="por-na-sacola" data-sem-redesenho>Guardar ${qtd} na sacola</a>
    </div>`;
    return m3Tela({ corpo, barra: false, flutuante, fundo, classe: 'm3-tela-peca' });
  },

  carrinho() {
    return m3Sacola(false);
  },

  carrinhoPrazo() {
    return m3Sacola(true);
  },

  frete() {
    const entrega = entregaEscolhida();
    const pix = ESTADO.pagamento === 'pix';
    const faltando = faltandoNoCadastro();

    const endereco = [valorDoCliente('rua'), valorDoCliente('num')].filter(Boolean).join(', ');
    const cidade = [valorDoCliente('bairro'), valorDoCliente('cidade'), valorDoCliente('uf')].filter(Boolean).join(' · ');

    const corpo = `<div class="m3-dados m3-dados-passos">
      <div class="m3-dados-topo">
        <h1>Entrega e pagamento</h1>
        <p>Confira para onde vai, escolha como chega e como pagar. Nada foi cobrado ainda.</p>
      </div>

      ${m3Falta(faltando, 'toque em Alterar para completar antes de pagar.')}

      <section class="m3-grupo">
        <div class="m3-revisao">
          <div class="m3-revisao-corpo">
            <strong>Endereço de entrega</strong>
            <span class="m3-revisao-quem">${valorDoCliente('nome') || 'sem nome'}</span>
            <span>${endereco || 'sem rua'}${valorDoCliente('compl') ? ` — ${valorDoCliente('compl')}` : ''}<br>${cidade}${valorDoCliente('cep') ? `<br>CEP ${valorDoCliente('cep')}` : ''}</span>
          </div>
          <a class="m3-item-editar" href="#cadastro" data-acao="passo" data-valor="2" data-sem-redesenho>
            ${icone('lapis', 13, 2)}Alterar
          </a>
        </div>
      </section>

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">Como chega</h2>
        <div class="m3-opcoes" role="group" aria-label="Forma de entrega">
          ${ENTREGAS.map(e => m3Opcao({
            escolhido: e.id === ESTADO.entrega,
            acao: 'entrega',
            valor: e.id,
            titulo: e.nome,
            apoio: e.apoio,
            direita: e.centavos ? brl(e.centavos) : 'Grátis',
          })).join('')}
        </div>
      </section>

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">Como pagar</h2>
        <div class="m3-opcoes" role="group" aria-label="Forma de pagamento">
          ${PAGAMENTOS.map(p => m3Opcao({
            escolhido: p.id === ESTADO.pagamento,
            acao: 'pagamento',
            valor: p.id,
            titulo: p.nome,
            selo: p.selo,
            apoio: p.id === 'pix'
              ? `${p.apoio} · desconto de ${brl(descontoDoPix())}`
              : `${p.apoio} de ${brl(valorDaParcela(totalComFrete(), PARCELAS_MAXIMAS))} sem juros`,
            direita: brl(p.id === 'pix' ? totalComFrete() - descontoDoPix() : totalComFrete()),
          })).join('')}
        </div>
      </section>

      <div class="m3-resumo">
        <div class="m3-resumo-linha">
          <span>Subtotal (${pecasNaSacola()} ${pecasNaSacola() === 1 ? 'peça' : 'peças'})</span>
          <span>${brl(somaSacola())}</span>
        </div>
        <div class="m3-resumo-linha">
          <span>${rotuloDoFrete()}</span>
          <span>${entrega.centavos ? brl(entrega.centavos) : 'Grátis (retirada na loja)'}</span>
        </div>
        ${pix ? `<div class="m3-resumo-linha m3-resumo-abate">
          <span>Desconto do Pix (${DESCONTO_PIX * 100}%)</span>
          <span>− ${brl(descontoDoPix())}</span>
        </div>` : ''}
        <div class="m3-resumo-total">
          <span>Total</span>
          <strong>${brl(totalAPagar())}</strong>
        </div>
      </div>

      <div class="m3-sacola-fecho">
        <div class="m3-seguro">${icone('escudo', 13, 1.9)} Ambiente 100% seguro</div>
        ${selosDePrivacidade()}
        ${naoAfiliado()}
      </div>
    </div>`;

    const flutuante = `<div class="m3-fechar">
      <div class="m3-fechar-valor">
        <span>Total ${pix ? 'no Pix' : `em até ${PARCELAS_MAXIMAS}x`}</span>
        <strong>${brl(totalAPagar())}</strong>
      </div>
      <a class="m3-fechar-botao" href="#${ESTADO.pagamento === 'cartao' ? 'pagamentoCartao' : 'pagamento'}">Ir para o pagamento${icone('direita', 16, 2.2)}</a>
    </div>`;

    return m3Tela({ corpo, aba: 'sacola', flutuante });
  },

  pagamento() {
    const pix = ESTADO.pagamento === 'pix';
    const total = totalAPagar();

    /* Agora que são duas telas, o atalho vai direto para a outra em vez de
       voltar ao frete só para trocar a forma de pagamento. */
    const trocar = pix
      ? `<a class="m3-trocar" href="#pagamentoCartao">${icone('cartao', 14, 2)}Prefiro pagar com cartão</a>`
      : `<a class="m3-trocar" href="#pagamento">${icone('pix', 14, 2)}Prefiro pagar no Pix</a>`;

    const corpoPix = `
      <div class="m3-qr">
        <div class="m3-qr-moldura">
          <span class="m3-qr-marca">${icone('pix', 30, 1.7)}</span>
          <strong>O QR entra aqui</strong>
          <span>A loja recebe o código do Mercado Pago na hora do pagamento. Desenhar um QR
          falso seria pior do que dizer o que vai neste lugar.</span>
        </div>
      </div>

      <div class="m3-copia">
        <div class="m3-copia-corpo">
          <strong>Pix copia e cola</strong>
          <span>também vem do Mercado Pago, junto do QR</span>
        </div>
        <button class="m3-copia-botao" type="button">Copiar</button>
      </div>

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">Como funciona</h2>
        ${andamento([
          { titulo: 'Você paga no app do banco', apoio: `${brl(total)} · o desconto de ${DESCONTO_PIX * 100}% já está aqui`, estado: 'agora' },
          { titulo: 'A loja confirma', apoio: 'costuma levar até 10 minutos', estado: 'depois' },
          { titulo: 'As peças saem para envio', apoio: 'o rastreio chega no seu WhatsApp', estado: 'depois' },
        ])}
      </section>`;

    const corpoCartao = `
      ${m3Cartao()}
      ${m3EscolhaDaBandeira()}

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">Em quantas vezes</h2>
        <div class="m3-parcelas" role="group" aria-label="Parcelas">
          ${Array.from({ length: PARCELAS_MAXIMAS }, (_, i) => i + 1).map(n => `<button type="button"
            class="m3-parcela ${n === ESTADO.parcelas ? 'm3-parcela-ativa' : ''}"
            data-acao="parcelas" data-valor="${n}" aria-pressed="${n === ESTADO.parcelas}">
            <strong>${n}x</strong><small>${brl(valorDaParcela(total, n))}</small>
          </button>`).join('')}
        </div>
        <p class="m3-parcelas-apoio">${ESTADO.parcelas}x de
          ${brl(valorDaParcela(total, ESTADO.parcelas))} sem juros · total ${brl(total)}</p>
      </section>`;

    const corpo = `<div class="m3-dados m3-dados-passos">
      <div class="m3-dados-topo">
        <h1>${pix ? 'Pagar com Pix' : 'Pagar com cartão'}</h1>
        <p>${pix
          ? `${brl(total)} com os ${DESCONTO_PIX * 100}% do Pix já abatidos. A reserva vale até a loja confirmar.`
          : `${brl(total)} no cartão. Os dados vão para o Mercado Pago; a loja não os guarda.`}</p>
      </div>

      ${trocar}
      ${pix ? corpoPix : corpoCartao}

      <div class="m3-sacola-fecho">
        <div class="m3-seguro">${icone('escudo', 13, 1.9)} Ambiente 100% seguro</div>
        ${selosDePrivacidade('os dados de pagamento não passam pela loja')}
        ${naoAfiliado()}
      </div>
    </div>`;

    const flutuante = `<div class="m3-fechar">
      <div class="m3-fechar-valor">
        <span>${pix ? 'Total no Pix' : `${ESTADO.parcelas}x de ${brl(valorDaParcela(total, ESTADO.parcelas))}`}</span>
        <strong>${brl(total)}</strong>
      </div>
      <a class="m3-fechar-botao" href="#${pix ? 'pix' : 'cartao'}">
        ${pix ? 'Já paguei' : 'Pagar'}${icone('direita', 16, 2.2)}
      </a>
    </div>`;

    return m3Tela({ corpo, aba: 'sacola', flutuante });
  },

  /* Mesma tela do Pix: quem decide a forma é o `fixo` da entrada em TELAS. */
  pagamentoCartao() {
    return MODELO_3.pagamento();
  },

  pix() {
    const total = totalComFrete() - descontoDoPix();
    const entrega = entregaEscolhida();

    const corpo = `<div class="m3-dados m3-dados-passos">
      ${m3Desfecho({
        tom: 'espera',
        traco: 'relogio',
        titulo: 'Comprovante recebido',
        apoio: `A loja está conferindo o pagamento. Costuma levar até 10 minutos, e você recebe o aviso no WhatsApp.`,
        selo: `Pedido ${PEDIDO_PIX.id}`,
      })}

      ${m3Recibo([
        { rotulo: 'Pago no Pix', valor: brl(total), forte: true },
        { rotulo: `Desconto de ${DESCONTO_PIX * 100}%`, valor: '− ' + brl(descontoDoPix()) },
        { rotulo: rotuloDoFrete(), valor: entrega.centavos ? brl(entrega.centavos) : 'Grátis' },
        { rotulo: 'Entrega', valor: entrega.nome + ' · ' + entrega.apoio },
      ])}

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">Em que pé está</h2>
        ${andamento(PEDIDO_PIX.etapas)}
      </section>

      ${contatoDaLoja()}

      <div class="m3-sacola-fecho">
        ${selosDePrivacidade()}
        ${naoAfiliado()}
      </div>
    </div>`;

    const flutuante = `<div class="m3-fechar">
      <div class="m3-fechar-valor">
        <span>Pago no Pix</span>
        <strong>${brl(total)}</strong>
      </div>
      <a class="m3-fechar-botao" href="#pedidos">Ver meus pedidos${icone('direita', 16, 2.2)}</a>
    </div>`;

    return m3Tela({ corpo, aba: 'pedidos', flutuante });
  },

  cartao() {
    const total = totalComFrete();
    const entrega = entregaEscolhida();
    const banda = bandeiraAtiva();

    const corpo = `<div class="m3-dados m3-dados-passos">
      ${m3Desfecho({
        tom: 'bom',
        traco: 'check',
        titulo: 'Pagamento aprovado',
        apoio: 'A loja já está separando suas peças. O envio sai em até 1 dia útil e o rastreio chega no seu WhatsApp.',
        selo: `Pedido ${PEDIDO_CARTAO.id}`,
      })}

      ${m3Recibo([
        { rotulo: 'Total pago', valor: brl(total), forte: true },
        { rotulo: 'Cartão', valor: `${banda ? banda.nome + ' ' : ''}${finalDoCartao()}` },
        { rotulo: 'Parcelas', valor: `${ESTADO.parcelas}x de ${brl(valorDaParcela(total, ESTADO.parcelas))} sem juros` },
        { rotulo: rotuloDoFrete(), valor: entrega.centavos ? brl(entrega.centavos) : 'Grátis' },
        { rotulo: 'Entrega', valor: entrega.nome + ' · ' + entrega.apoio },
      ])}

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">Em que pé está</h2>
        ${andamento(PEDIDO_CARTAO.etapas)}
      </section>

      ${contatoDaLoja()}

      <div class="m3-sacola-fecho">
        ${selosDePrivacidade()}
        ${naoAfiliado()}
      </div>
    </div>`;

    const flutuante = `<div class="m3-fechar">
      <div class="m3-fechar-valor">
        <span>${ESTADO.parcelas}x de ${brl(valorDaParcela(total, ESTADO.parcelas))}</span>
        <strong>${brl(total)}</strong>
      </div>
      <a class="m3-fechar-botao" href="#pedidos">Ver meus pedidos${icone('direita', 16, 2.2)}</a>
    </div>`;

    return m3Tela({ corpo, aba: 'pedidos', flutuante });
  },

  recusado() {
    const total = totalComFrete();
    const banda = bandeiraAtiva();
    const noPix = total - descontoDoPix();

    const corpo = `<div class="m3-dados m3-dados-passos">
      ${m3Desfecho({
        tom: 'ruim',
        traco: 'alerta',
        titulo: 'Pagamento não aprovado',
        apoio: PAGAMENTO_RECUSADO.motivo + '. Nada foi cobrado, e sua sacola continua guardada.',
        selo: `Tentativa ${PAGAMENTO_RECUSADO.tentativa}`,
      })}

      ${m3Recibo([
        { rotulo: 'Não cobrado', valor: brl(total), forte: true },
        { rotulo: 'Cartão', valor: `${banda ? banda.nome + ' ' : ''}${finalDoCartao()}` },
      ])}

      <div class="m3-reserva">
        <span class="m3-reserva-icone">${icone('sacola', 17, 1.9)}</span>
        <div>
          <strong>As ${pecasNaSacola()} peças continuam na sua sacola</strong>
          <span>Nada foi perdido. Dá para tentar de novo agora mesmo, sem montar tudo outra vez.</span>
        </div>
      </div>

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">Por que costuma acontecer</h2>
        <p class="m3-explica">${PAGAMENTO_RECUSADO.detalhe}</p>
      </section>

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">O que dá para fazer</h2>
        <a class="m3-saida-opcao" href="#pagamento" data-acao="pagamento" data-valor="pix" data-sem-redesenho>
          <span class="m3-saida-icone">${icone('pix', 18, 1.9)}</span>
          <span class="m3-saida-corpo">
            <strong>Pagar no Pix por ${brl(noPix)}</strong>
            <span>aprova na hora e ainda tira ${DESCONTO_PIX * 100}% do total</span>
          </span>
          ${icone('seta', 16, 2.2)}
        </a>

        <a class="m3-saida-opcao" href="#pagamento">
          <span class="m3-saida-icone">${icone('cartao', 18, 1.9)}</span>
          <span class="m3-saida-corpo">
            <strong>Tentar outro cartão</strong>
            <span>conferir os números ou usar um cartão diferente</span>
          </span>
          ${icone('seta', 16, 2.2)}
        </a>
      </section>

      ${contatoDaLoja()}

      <div class="m3-sacola-fecho">
        ${selosDePrivacidade()}
        ${naoAfiliado()}
      </div>
    </div>`;

    const flutuante = `<div class="m3-fechar">
      <div class="m3-fechar-valor">
        <span>Sacola guardada</span>
        <strong>${brl(total)}</strong>
      </div>
      <a class="m3-fechar-botao" href="#pagamento">Tentar de novo${icone('direita', 16, 2.2)}</a>
    </div>`;

    return m3Tela({ corpo, aba: 'sacola', flutuante });
  },

  cadastro() {
    const passo = PASSOS_M3.find(p => p.n === ESTADO.passo) || PASSOS_M3[0];
    const faltando = faltandoNoCadastro(passo.campos.length ? passo.campos : null);
    const pendente = faltandoNoCadastro().length;

    const conteudo = passo.n === 1
      ? `<section class="m3-grupo">${passo.campos.map(m3Campo).join('')}</section>`
      : passo.n === 2
        ? `<section class="m3-grupo">${m3Endereco()}</section>`
        : m3Revisao();

    const corpo = `<div class="m3-dados m3-dados-passos">
      <div class="m3-dados-topo">
        <h1>${passo.n === 3 ? 'Confira o pedido' : `${passo.rotulo}`}</h1>
        <p>${passo.n === 1 ? 'Quem recebe a encomenda e por onde a loja fala com você.'
          : passo.n === 2 ? 'Para onde vai a caixa. O CEP é o que calcula o frete.'
          : 'Nada foi cobrado ainda. Confira e siga para o frete.'}</p>
      </div>

      ${m3Trilho(passo.n)}

      ${m3Falta(faltando, passo.n === 3
        ? 'sem isso a loja não consegue emitir a etiqueta.'
        : 'a loja precisa disso para entregar.')}

      ${conteudo}

      <div class="m3-sacola-fecho">
        ${selosDePrivacidade()}
        ${naoAfiliado()}
      </div>
    </div>`;

    const flutuante = `<div class="m3-fechar m3-fechar-passos">
      ${passo.n > 1 ? `<button class="m3-voltar" type="button" data-acao="passo" data-valor="${passo.n - 1}"
        aria-label="Voltar para o passo ${passo.n - 1}">${icone('voltar', 17, 2.2)}</button>` : ''}
      ${passo.n < 3
        ? `<button class="m3-fechar-botao" type="button" data-acao="passo" data-valor="${passo.n + 1}">Continuar${icone('direita', 16, 2.2)}</button>`
        : pendente
          ? `<button class="m3-fechar-botao" type="button" disabled>Confirmar e ir para o frete${icone('direita', 16, 2.2)}</button>`
          : `<a class="m3-fechar-botao" href="#frete">Confirmar e ir para o frete${icone('direita', 16, 2.2)}</a>`}
    </div>`;

    return m3Tela({ corpo, aba: 'sacola', flutuante });
  },

  dados() {
    const corpo = `<div class="m3-dados">
      <div class="m3-dados-topo">
        <h1>Meus dados</h1>
        <p>Os mesmos dois blocos do cadastro, guardados para as próximas lives. É só editar quando algo mudar.</p>
      </div>

      ${m3Falta(faltandoNoCadastro(), 'sem isso a loja não consegue emitir a etiqueta.')}

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">1 · Contato</h2>
        ${m3Campo('nome')}
        ${m3Campo('cpf')}
        ${m3Campo('zap')}
      </section>

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">2 · Endereço</h2>
        ${m3Endereco()}
      </section>

      <div class="m3-dados-fecho">
        <button class="botao botao-gradiente m3-cta" type="button">Salvar alterações</button>
        ${selosDePrivacidade()}
        ${naoAfiliado()}
      </div>
    </div>`;

    return m3Tela({ corpo, aba: 'dados' });
  },

  pedidos() {
    const lista = pedidosFiltrados();

    const chip = (nome) => {
      const ativo = ESTADO.pedidos === nome;
      return `<button class="m3-recorte ${ativo ? 'm3-recorte-ativo' : ''}" type="button"
        data-acao="filtro-pedidos" data-valor="${nome}" aria-pressed="${ativo}">
        ${nome}<span class="m3-recorte-conta">${pedidosDaAba(nome).length}</span>
      </button>`;
    };

    /* A régua diz de olho em que ponto o pedido está, sem abrir o detalhe.
       O cancelado não tem régua: ele saiu dela, não parou no meio. */
    const regua = (p) => {
      const vencidas = etapasVencidas(p);
      return `<div class="m3-regua-pedido" aria-label="${vencidas} de ${ETAPAS_DO_PEDIDO.length} etapas">
        ${ETAPAS_DO_PEDIDO.map((etapa, i) => `<span class="m3-regua-etapa ${i < vencidas ? 'm3-regua-vencida' : ''}">
          <i></i><small>${etapa}</small>
        </span>`).join('')}
      </div>`;
    };

    /* Só o #4822 tem itens no protótipo, então só ele abre. Os outros são
       linha de histórico: virar link levaria a cliente para o pedido errado. */
    const cartao = (p) => {
      const abre = p.id === PEDIDO_CARTAO.id;
      const classe = `m3-pedido ${p.estado === 'Cancelado' ? 'm3-pedido-frio' : ''}`;

      const miolo = `
      <div class="m3-pedido-topo">
        <span class="m3-pedido-id">${p.id}</span>
        <span class="m3-pedido-data">${p.data}</span>
        ${selo(p.estado, p.tom)}
      </div>

      <div class="m3-pedido-meio">
        <div class="m3-pilha">${p.codigos.slice(0, 3).map((c, i) => `<span class="m3-pilha-foto"
          style="margin-left:${i ? -16 : 0}px; z-index:${3 - i}">${foto({ codigo: c }, { codigo: false })}</span>`).join('')}</div>
        <div class="m3-pedido-texto">
          <strong>${p.resumo}</strong>
          <span>${p.qtd} ${p.qtd === 1 ? 'peça' : 'peças'} · ${p.pagamento}</span>
        </div>
        <strong class="m3-pedido-valor">${totalDoPedido(p)}</strong>
      </div>

      ${p.estado === 'Cancelado' ? '' : regua(p)}

      <div class="m3-pedido-base">
        <span class="m3-pedido-rastreio">
          <i style="background:${TONS_DE_ESTADO[p.tom][0]}"></i>${p.rastreio}
        </span>
        ${abre ? `<span class="m3-pedido-abrir">Ver detalhe${icone('direita', 14, 2.2)}</span>` : ''}
      </div>`;

      return abre
        ? `<a class="${classe}" href="#detalhe" aria-label="Abrir o pedido ${p.id}">${miolo}</a>`
        : `<article class="${classe}">${miolo}</article>`;
    };

    const corpo = `<div class="m3-pedidos">
      <div class="m3-dados-topo">
        <h1>Meus pedidos</h1>
        <p>Tudo que saiu das lives de ${LOJA.nome} com o ${CLIENTE.arroba}.</p>
      </div>

      <div class="m3-recortes" role="group" aria-label="Filtrar os pedidos">
        <!-- Todos fica sozinho na primeira linha; os três recortes vêm embaixo. -->
        ${ABAS_PEDIDOS.map((nome, i) => chip(nome) +
          (i === 0 ? '<span class="m3-recortes-quebra"></span>' : '')).join('')}
      </div>

      ${lista.length ? `<div class="m3-pedidos-lista">${lista.map(cartao).join('')}</div>` : `
      <div class="m3-vazio">
        <strong>Nenhum pedido em ${ESTADO.pedidos.toLowerCase()}</strong>
        <p>Toque em <b>Todos</b> para ver o histórico inteiro.</p>
      </div>`}

      <div class="m3-sacola-fecho">
        <div class="m3-seguro">${icone('escudo', 13, 1.9)} Só aparece o que foi comprado com o ${CLIENTE.arroba}</div>
        ${naoAfiliado()}
      </div>
    </div>`;

    return m3Tela({ corpo, aba: 'pedidos' });
  },

  detalhe() {
    const p = PEDIDOS.find((item) => item.id === PEDIDO_CARTAO.id) || PEDIDOS[0];
    const total = totalComFrete();
    const entrega = entregaEscolhida();
    const banda = bandeiraAtiva();
    const pecas = pecasNaSacola();

    const item = (it) => {
      const cor = corDoItem(it);
      return `<div class="m3-detalhe-item">
        <div class="m3-detalhe-foto">${foto(it, { codigo: false })}</div>
        <div class="m3-detalhe-item-corpo">
          <strong>${it.nome}</strong>
          <div class="m3-detalhe-item-chips">
            <span class="m3-cod-chip">${it.codigo}</span>
            <span class="m3-item-tam">${it.tamanho}</span>
            ${cor ? `<span class="m3-item-tam">${cor.nome}</span>` : ''}
          </div>
        </div>
        <div class="m3-detalhe-item-valor">
          <strong>${brl(it.centavos * it.qtd)}</strong>
          <span>${it.qtd}× ${brl(it.centavos)}</span>
        </div>
      </div>`;
    };

    const corpo = `<div class="m3-detalhe">
      <a class="m3-trocar m3-atras" href="#pedidos">${icone('voltar', 14, 2.2)}Meus pedidos</a>

      <div class="m3-detalhe-topo">
        <div>
          <h1>Pedido ${p.id}</h1>
          <p>feito ${p.data} · ${CLIENTE.arroba}</p>
        </div>
        ${selo(p.estado, p.tom)}
      </div>

      <div class="m3-detalhe-agora">
        <span class="m3-detalhe-marca">${icone('caminhao', 20, 2)}</span>
        <div>
          <strong>${p.rastreio}</strong>
          <span>O código de rastreio chega no seu WhatsApp assim que a loja postar.</span>
        </div>
      </div>

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">Em que pé está</h2>
        ${andamento(ANDAMENTO_4822)}
      </section>

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">${pecas} ${pecas === 1 ? 'peça' : 'peças'} neste pedido</h2>
        <div class="m3-detalhe-itens">${SACOLA.map(item).join('')}</div>
      </section>

      ${m3Recibo([
        { rotulo: 'Total pago', valor: brl(total), forte: true },
        { rotulo: `Peças (${pecas})`, valor: brl(somaSacola()) },
        { rotulo: rotuloDoFrete(), valor: entrega.centavos ? brl(entrega.centavos) : 'Grátis' },
        { rotulo: 'Cartão', valor: `${banda ? banda.nome + ' ' : ''}${finalDoCartao()}` },
        { rotulo: 'Parcelas', valor: `${ESTADO.parcelas}x de ${brl(valorDaParcela(total, ESTADO.parcelas))} sem juros` },
      ])}

      <section class="m3-grupo">
        <h2 class="m3-grupo-titulo">Entrega</h2>
        <div class="m3-detalhe-entrega">
          <span class="m3-detalhe-marca">${icone('local', 20, 2)}</span>
          <div>
            <strong>${CLIENTE.nome}</strong>
            <span>${CLIENTE.endereco.join('<br>')}</span>
            <span class="m3-detalhe-prazo">${entrega.nome} · ${entrega.apoio}</span>
          </div>
        </div>
        <a class="m3-trocar" href="#dados">${icone('lapis', 13, 2)}Mudar o endereço nos meus dados</a>
      </section>

      ${contatoDaLoja()}

      <div class="m3-sacola-fecho">
        ${selosDePrivacidade()}
        ${naoAfiliado()}
      </div>
    </div>`;

    const flutuante = `<div class="m3-fechar">
      <div class="m3-fechar-valor">
        <span>${p.id} · ${p.estado.toLowerCase()}</span>
        <strong>${brl(total)}</strong>
      </div>
      <a class="m3-fechar-botao" href="${LOJA.whatsappLink}" target="_blank" rel="noopener">
        Falar com a loja${icone('direita', 16, 2.2)}
      </a>
    </div>`;

    return m3Tela({ corpo, aba: 'pedidos', flutuante });
  },

};
