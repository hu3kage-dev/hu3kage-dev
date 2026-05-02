// ========================
// HEADER GLOBAL
// ========================

//f:pegarHref
function pegarHref() {
  const path = location.pathname;
  return path.includes('/screens/') ? '../' : './';
}
const NAV_LINKS = [
  { label: "Início",        href: "index.html" },
  { label: "Draft",         href: "draftconfig.html" },
  { label: "Patch Notes",   href: "patchnotes.html" },
];

//f:pegarNavLink
function pegarNavLink(href) {
  const base = pegarHref();
  const isScreensPage = location.pathname.includes('/screens/');
  const screenPages = ["draftconfig.html", "patchnotes.html"];
  if (isScreensPage) {
    if (screenPages.includes(href)) {
      return href;
    }
    return `${base}${href}`;
  }
  if (screenPages.includes(href)) {
    return `screens/${href}`;
  }
  return href;
}

//f:pegarHrefJogo
function pegarHrefJogo(pageName) {
  const isScreensPage = location.pathname.includes('/screens/');
  if (isScreensPage) {
    return pageName;
  }
  return `screens/${pageName}`;
}

//f:injetarHeader
function injetarHeader() {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
      <a href="${pegarNavLink("index.html")}" class="header-logo">
        <div>
          <div class="header-logo-text">STRAY7</div>
          <div class="header-logo-sub">K-Pop Games</div>
        </div>
      </a>
      <nav class="header-nav">
      ${NAV_LINKS.map(link => {
        const navHref = pegarNavLink(link.href);
        const ativo = link.href === currentPage ? "active" : "";
        return `<a href="${navHref}" class="${ativo}">${link.label}</a>`;
      }).join("")}
    </nav>
    <div class="header-right">
      <span class="header-badge">v0.4.0</span>
    </div>
  `;
  document.body.prepend(header);
}

// ========================
// VARIÁVEIS GLOBAIS
// ========================
let filtroAtivo = {
  gen: "all",
  letra: "all"
};
let draftWarningContainer = null;

// ========================
// DATABASE VOLÁTIL
// ========================
// Armazena idols/musics/producers importados em sessão (perdidos ao recarregar)
let extraIdols     = [];
let extraMusics    = [];
let extraProducers = [];

// Retorna a lista ativa mesclando base fixa + importados
function getIdols()     { return [...idols,     ...extraIdols];     }
function getMusics()    { return [...musics,     ...extraMusics];    }
function getProducers() { return [...producers,  ...extraProducers]; }


// ========================
// INDEX PAGE
// ========================

//f:irParaDraft
function irParaDraft() {
  const draftHref = pegarNavLink("draftconfig.html");
  window.location.href = draftHref;
}

//f:modoEmDesenvolvimento
function modoEmDesenvolvimento() {
  alert("Este modo de jogo ainda está em desenvolvimento.");
}

// ========================
// FUNÇÕES DE BLOCOS
// ========================

//f:criarInputsJogadores
function criarInputsJogadores() {
  const container = document.getElementById("playersContainer");
  container.innerHTML = "";
  let qtd = parseInt(document.getElementById("playerCount").value);
  for (let i = 1; i <= qtd; i++) {
    let input = document.createElement("input");
    input.placeholder = "Nome do jogador " + i;
    input.className = "playerNameInput";
    container.appendChild(input);
    container.appendChild(document.createElement("br"));
  }
}

//f:sortearIntegrantes
function sortearIntegrantes() {
  let chance = Math.random();
  let valor;
  if (chance <= 0.95) {
    valor = Math.floor(Math.random() * 9) + 4;
  } else {
    valor = Math.floor(Math.random() * 12) + 13;
  }
  document.getElementById("idolCount").value = valor;
}

//f:agruparPorGrupo
function agruparPorGrupo(lista) {
  let grupos = {};
  lista.forEach(idol => {
    if (!grupos[idol.group]) {
      grupos[idol.group] = [];
    }
    grupos[idol.group].push(idol);
  });
  return grupos;
}

//f:marcarTodosProdutores
function marcarTodosProdutores() {
  document.querySelectorAll("#producerContainer input[type='checkbox']")
    .forEach(cb => cb.checked = true);
}

//f:desmarcarTodosProdutores
function desmarcarTodosProdutores() {
  document.querySelectorAll("#producerContainer input[type='checkbox']")
    .forEach(cb => cb.checked = false);
}

//f:marcarTodasMusicas
function marcarTodasMusicas() {
  document.querySelectorAll("#musicContainer input[type='checkbox']")
    .forEach(cb => cb.checked = true);
}

//f:desmarcarTodasMusicas
function desmarcarTodasMusicas() {
  document.querySelectorAll("#musicContainer input[type='checkbox']")
    .forEach(cb => cb.checked = false);
}

// ========================
// AVISOS
// ======================== 

//f:iniciarAvisoDraft
function iniciarAvisoDraft() {
  const button = document.querySelector(".btn-iniciar-draft");
  if (!button) return;
  draftWarningContainer = document.createElement("div");
  draftWarningContainer.id = "draftWarning";
  draftWarningContainer.style.margin = "10px 0 0 0";
  draftWarningContainer.style.padding = "12px";
  draftWarningContainer.style.borderRadius = "8px";
  draftWarningContainer.style.backgroundColor = "#3a1a1a";
  draftWarningContainer.style.color = "#ffd9d9";
  draftWarningContainer.style.border = "1px solid #b35b5b";
  draftWarningContainer.style.display = "none";
  draftWarningContainer.style.fontSize = "14px";
  button.insertAdjacentElement("beforebegin", draftWarningContainer);
}

//f:draftAviso
function draftAviso(messages) {
  if (!draftWarningContainer) return;
  if (!messages || messages.length === 0) {
    draftWarningContainer.style.display = "none";
    draftWarningContainer.innerHTML = "";
    return;
  }
  draftWarningContainer.style.display = "block";
  draftWarningContainer.innerHTML = messages
    .map(msg => `<p style="margin:0 0 6px 0;">${msg}</p>`)
    .join("");
}

// ========================
// FUNÇÕES DE RENDERIZAÇÃO
// ========================

//f:renderizarGrupos
function renderizarGrupos() {
  const container = document.getElementById("groupsContainer");
  container.innerHTML = "";
  const grupos = agruparPorGrupo(getIdols());
  for (let nomeGrupo in grupos) {
    const idolsDoGrupo = grupos[nomeGrupo];
    let divGrupo = document.createElement("div");
    divGrupo.dataset.grupo = nomeGrupo;
    let checkboxGrupo = document.createElement("input");
    checkboxGrupo.type = "checkbox";
    checkboxGrupo.checked = true;
    let labelGrupo = document.createElement("label");
    labelGrupo.innerText = " " + nomeGrupo;
    divGrupo.appendChild(checkboxGrupo);
    divGrupo.appendChild(labelGrupo);
    let listaIdolsCheckbox = [];
    idolsDoGrupo.forEach(idol => {
      let divIdol = document.createElement("div");
      divIdol.dataset.gen = idol.gen || "";
      divIdol.dataset.nome = idol.name || "";
      let checkboxIdol = document.createElement("input");
      checkboxIdol.type = "checkbox";
      checkboxIdol.checked = true;
      checkboxIdol.value = idol.id;
      listaIdolsCheckbox.push(checkboxIdol);
      checkboxIdol.addEventListener("change", () => {
        let todosMarcados = true;
        let nenhumMarcado = true;
        // só conta os visíveis para o estado indeterminate
        const visiveis = listaIdolsCheckbox.filter(cb => cb.parentElement.style.display !== "none");
        visiveis.forEach(cb => {
          if (cb.checked) nenhumMarcado = false;
          else todosMarcados = false;
        });
        if (visiveis.length === 0) {
          checkboxGrupo.indeterminate = false;
        } else if (todosMarcados) {
          checkboxGrupo.checked = true;
          checkboxGrupo.indeterminate = false;
        } else if (nenhumMarcado) {
          checkboxGrupo.checked = false;
          checkboxGrupo.indeterminate = false;
        } else {
          checkboxGrupo.indeterminate = true;
        }
      });
      let labelIdol = document.createElement("label");
      labelIdol.innerText = " " + idol.name;
      divIdol.appendChild(checkboxIdol);
      divIdol.appendChild(labelIdol);
      divIdol.style.marginLeft = "15px";
      divGrupo.appendChild(divIdol);
    });
    checkboxGrupo.addEventListener("change", () => {
      // só altera os idols visíveis
      listaIdolsCheckbox.forEach(cb => {
        if (cb.parentElement.style.display !== "none") {
          cb.checked = checkboxGrupo.checked;
        }
      });
      checkboxGrupo.indeterminate = false;
    });
    container.appendChild(divGrupo);
  }
  aplicarFiltroVisual();
}

//f:renderizarProdutores
function renderizarProdutores() {
  const container = document.getElementById("producerContainer");
  container.innerHTML = "";
  getProducers().forEach(p => {
    let div = document.createElement("div");
    let cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = true;
    cb.value = p.name;
    let label = document.createElement("label");
    label.innerText = " " + p.name;
    div.appendChild(cb);
    div.appendChild(label);
    container.appendChild(div);
  });
}

//f:renderizarMusicas
function renderizarMusicas() {
  const container = document.getElementById("musicContainer");
  container.innerHTML = "";
  getMusics().forEach(m => {
    let div = document.createElement("div");
    let cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = true;
    cb.value = m.name;
    let label = document.createElement("label");
    label.innerText = " " + m.name;
    div.appendChild(cb);
    div.appendChild(label);
    container.appendChild(div);
  });
}

//f:setFiltro
function setFiltro(tipo, valor) {
  filtroAtivo[tipo] = valor;
  // atualizar visual das pills
  document.querySelectorAll(`.filter-pill[data-filter="${tipo}"]`).forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === valor);
  });
  aplicarFiltroVisual();
}

//f:aplicarFiltroVisual
function aplicarFiltroVisual() {
  const { gen, letra } = filtroAtivo;
  const grupos = document.querySelectorAll("#groupsContainer > div");
  grupos.forEach(grupoDiv => {
    const nomeGrupo = (grupoDiv.dataset.grupo || "").toUpperCase();
    const primeiraLetraGrupo = nomeGrupo.charAt(0);
    // filtro de letra — apenas pelo nome do grupo
    let grupoPassaLetra = true;
    if (letra !== "all") {
      if (letra === "09") {
        grupoPassaLetra = /[0-9@#]/.test(primeiraLetraGrupo);
      } else {
        grupoPassaLetra = primeiraLetraGrupo === letra;
      }
    }
    if (!grupoPassaLetra) {
      grupoDiv.style.display = "none";
      return;
    }
    const idolDivs = grupoDiv.querySelectorAll("div[data-gen]");
    let algumIdolVisivel = false;
    idolDivs.forEach(divIdol => {
      const idolGen = divIdol.dataset.gen || "";
      const passaGen = gen === "all" || idolGen === gen;
      divIdol.style.display = passaGen ? "" : "none";
      if (passaGen) algumIdolVisivel = true;
    });
    // esconde o bloco inteiro do grupo se nenhum idol passa no filtro de geração
    grupoDiv.style.display = algumIdolVisivel ? "" : "none";
  });
}

//f:marcarTodosGeracoes
function marcarTodosGeracoes() {
  document.querySelectorAll("#groupsContainer input[type='checkbox'][value]").forEach(cb => {
    const divIdol = cb.parentElement;
    const divGrupo = divIdol?.parentElement;
    if (divIdol?.style.display !== "none" && divGrupo?.style.display !== "none") {
      cb.checked = true;
    }
  });
  atualizarCheckboxesGrupo();
}

//f:desmarcarTodosGeracoes
function desmarcarTodosGeracoes() {
  document.querySelectorAll("#groupsContainer input[type='checkbox'][value]").forEach(cb => {
    const divIdol = cb.parentElement;
    const divGrupo = divIdol?.parentElement;
    if (divIdol?.style.display !== "none" && divGrupo?.style.display !== "none") {
      cb.checked = false;
    }
  });
  atualizarCheckboxesGrupo();
}

//f:atualizarCheckboxesGrupo
function atualizarCheckboxesGrupo() {
  const grupos = document.querySelectorAll("#groupsContainer > div");
  grupos.forEach(grupoDiv => {
    const checkboxGrupo = grupoDiv.querySelector("input[type='checkbox']:not([value])");
    const checkboxesIdol = grupoDiv.querySelectorAll("input[type='checkbox'][value]");
    let todosMarcados = true;
    let nenhumMarcado = true;
    checkboxesIdol.forEach(cb => {
      if (cb.checked) nenhumMarcado = false;
      else todosMarcados = false;
    });
    if (todosMarcados) {
      checkboxGrupo.checked = true;
      checkboxGrupo.indeterminate = false;
    } else if (nenhumMarcado) {
      checkboxGrupo.checked = false;
      checkboxGrupo.indeterminate = false;
    } else {
      checkboxGrupo.indeterminate = true;
    }
  });
}

// ==============================
// FUNÇÕES DE SORTEIO E SELEÇÃO
// ==============================

//f:pegarIdolsSelecionados
function pegarIdolsSelecionados() {
  let selecionados = [];
  const checkboxes = document.querySelectorAll("#groupsContainer input[type='checkbox']");
  checkboxes.forEach(cb => {
    if (cb.checked && cb.value) {
      let idol = getIdols().find(i => i.id === cb.value);
      if (idol) selecionados.push(idol);
    }
  });
  return selecionados;
}

//f:pegarMusicasSelecionadas
function pegarMusicasSelecionadas() {
  let selecionados = [];
  document.querySelectorAll("#musicContainer input[type='checkbox']").forEach(cb => {
    if (cb.checked && cb.value) {
      let music = getMusics().find(m => m.name === cb.value);
      if (music) selecionados.push(music);
    }
  });
  return selecionados;
}

//f:pegarProdutoresSelecionados
function pegarProdutoresSelecionados() {
  let selecionados = [];
  document.querySelectorAll("#producerContainer input[type='checkbox']").forEach(cb => {
    if (cb.checked && cb.value) {
      let producer = getProducers().find(p => p.name === cb.value);
      if (producer) selecionados.push(producer);
    }
  });
  return selecionados;
}

//f:sortearIdols
function sortearIdols(lista, quantidade) {
  let copia = [...lista];
  let resultado = [];
  for (let i = 0; i < quantidade; i++) {
    let index = Math.floor(Math.random() * copia.length);
    resultado.push(copia[index]);
    copia.splice(index, 1);
  }
  return resultado;
}

// ========================
// INICIALIZAÇÃO DO DRAFT
// ========================

//f:iniciarDraft
function iniciarDraft() {
  let inputs = document.querySelectorAll(".playerNameInput");
  let jogadores = [];
  let allNames = [];
  inputs.forEach(input => {
    allNames.push(input.value.trim());
  });
  const nomesVazios = allNames.filter(nome => nome === "");
  if (nomesVazios.length > 0) {
    jogadores = allNames.filter(nome => nome !== "");
  } else {
    jogadores = [...allNames];
  }
  let integrantes = parseInt(document.getElementById("idolCount").value, 10) || 0;
  let musicasSelecionadas = pegarMusicasSelecionadas();
  let produtoresSelecionados = pegarProdutoresSelecionados();
  let selecionados = pegarIdolsSelecionados();
  let totalIdols = jogadores.length * integrantes;
  const errors = [];
  if (nomesVazios.length > 0) {
    errors.push("Preencha o nome de todos os jogadores.");
  }
  const nomesUnicos = new Set(jogadores.map(nome => nome.toLowerCase()));
  if (jogadores.length > 0 && nomesUnicos.size !== jogadores.length) {
    errors.push("Cada jogador deve ter um nome único.");
  }
  if (produtoresSelecionados.length > 0 && produtoresSelecionados.length < jogadores.length) {
    errors.push("O número de produtores deve ser maior ou igual ao número de jogadores.");
  }
  if (musicasSelecionadas.length > 0 && musicasSelecionadas.length < jogadores.length) {
    errors.push("O número de músicas deve ser maior ou igual ao número de jogadores.");
  }
  if (selecionados.length < totalIdols) {
    errors.push("O número de idols selecionados é menor do que a quantidade mínima necessária para iniciar o draft. (Deve ser igual ao número de jogadores multiplicado pelo número de integrantes)");
  }
  if (integrantes <= 0) {
    errors.push("O tamanho do grupo deve ser um número positivo.");
  }
  if (jogadores.length <= 0) {
    errors.push("Informe pelo menos um jogador para iniciar o draft.");
  }
  if (errors.length > 0) {
    draftAviso(errors);
    return;
  }
  draftAviso([]);
  let usarMusica = musicasSelecionadas.length > 0;
  let usarProdutor = produtoresSelecionados.length > 0;
  let pool = [];
  //idols — forçar type explicitamente antes de entrar no pool
  const idolsComType = sortearIdols(selecionados, totalIdols).map(i => ({ ...i, type: i.type || "Idol" }));
  pool = pool.concat(idolsComType);
  //music
  if (usarMusica) {
    let musicas = sortearIdols(musicasSelecionadas, jogadores.length);
    musicas.forEach(m => m.type = "music");
    pool = pool.concat(musicas);
  }
  //producer
  if (usarProdutor) {
    let produtores = sortearIdols(produtoresSelecionados, jogadores.length);
    produtores.forEach(p => p.type = "producer");
    pool = pool.concat(produtores);
  }
  //garantir que idols têm type antes de salvar
  pool = pool.map(item => ({
    ...item,
    type: item.type && item.type !== "" ? item.type : "Idol"
  }));
  localStorage.setItem("draftData", JSON.stringify({
    jogadores,
    integrantes,
    pool,
    usarMusica,
    usarProdutor
  }));
  const draftgameHref = pegarHrefJogo("draftgame.html");
  window.location.href = draftgameHref;
}

// ========================
// IMPORTAÇÃO DE DATABASE
// ========================

//f:parseCSVLine (suporta aspas corretamente)
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') { insideQuotes = !insideQuotes; continue; }
    if (char === ',' && !insideQuotes) { result.push(current.trim()); current = ""; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
}

//f:normalizarChave
function normalizarChave(chave) {
  return chave.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}

//f:parseArrayDB (usa "/" como separador interno)
function parseArrayDB(valor) {
  if (!valor) return [];
  return valor.split("/").map(v => v.trim()).filter(Boolean);
}

//f:csvParaObjetos
function csvParaObjetos(texto) {
  const linhas = texto.trim().split("\n");
  const headers = parseCSVLine(linhas[0]).map(h => normalizarChave(h));
  const resultado = [];
  for (let i = 1; i < linhas.length; i++) {
    if (!linhas[i].trim()) continue;
    const valores = parseCSVLine(linhas[i]);
    let obj = {};
    headers.forEach((h, idx) => { obj[h] = valores[idx] || ""; });
    resultado.push(obj);
  }
  return resultado;
}

//f:normalizarObjeto
function normalizarObjeto(obj) {
  const tipo = (obj.tipo || obj.type || "").toLowerCase();
  if (tipo === "idol") {
    return {
      gen: obj.geracao || obj.gen || "",
      type: "idol",
      id: obj.id || "",
      name: obj.nome || obj.name || "",
      group: obj.grupo || obj.group || "",
      vocal: obj.vocal || "",
      dance: obj.dance || "",
      rap: obj.rap || "",
      center: obj.center || "",
      visual: obj.visual || "",
      especialidade: obj.especialidade || "",
      conceito: parseArrayDB(obj.conceitospredominantes || (Array.isArray(obj.conceito) ? obj.conceito.join("/") : obj.conceito) || ""),
      generos: parseArrayDB(obj.generospredominantes || (Array.isArray(obj.generos) ? obj.generos.join("/") : obj.generos) || ""),
      fortes: obj.pontosfortes || obj.fortes || "",
      fracos: obj.pontosfracos || obj.fracos || ""
    };
  }
  if (tipo === "music" || tipo === "musica" || tipo === "música") {
    return {
      type: "music",
      id: obj.id || "",
      name: obj.nome || obj.name || "",
      fonte: obj.fonte || "",
      conceitos: parseArrayDB(obj.conceitosoriginais || (Array.isArray(obj.conceitos) ? obj.conceitos.join("/") : obj.conceitos) || ""),
      generos: parseArrayDB(obj.generosoriginais || (Array.isArray(obj.generos) ? obj.generos.join("/") : obj.generos) || "")
    };
  }
  if (tipo === "producer" || tipo === "produtor") {
    return {
      type: "producer",
      id: obj.id || "",
      name: obj.nome || obj.name || "",
      conceito: parseArrayDB(obj.conceitospredominantes || (Array.isArray(obj.conceito) ? obj.conceito.join("/") : obj.conceito) || ""),
      generos: parseArrayDB(obj.generospredominantes || (Array.isArray(obj.generos) ? obj.generos.join("/") : obj.generos) || ""),
      musicas: obj.musicasconhecidas || obj.musicas || ""
    };
  }
  return null;
}

//f:importarDatabase
function importarDatabase(event) {
  const file = event.target.files[0];
  if (!file) return;
  const ext = file.name.split(".").pop().toLowerCase();
  const reader = new FileReader();
  reader.onload = function(e) {
    let objetos = [];
    try {
      if (ext === "json") {
        const parsed = JSON.parse(e.target.result);
        objetos = Array.isArray(parsed) ? parsed : [];
      } else if (ext === "csv") {
        objetos = csvParaObjetos(e.target.result);
      } else {
        alert("Formato não suportado. Use .json ou .csv");
        return;
      }
    } catch(err) {
      alert("Erro ao ler o arquivo: " + err.message);
      return;
    }
    let countIdols = 0, countMusics = 0, countProducers = 0, countIgnored = 0;
    objetos.forEach(obj => {
      const norm = normalizarObjeto(obj);
      if (!norm) { countIgnored++; return; }
      if (norm.type === "idol")     { extraIdols.push(norm);     countIdols++;     }
      else if (norm.type === "music")    { extraMusics.push(norm);    countMusics++;    }
      else if (norm.type === "producer") { extraProducers.push(norm); countProducers++; }
    });
    // re-renderizar tudo
    renderizarGrupos();
    renderizarMusicas();
    renderizarProdutores();
    // resetar o input para permitir reimportar o mesmo arquivo
    event.target.value = "";
    const resumo = [
      countIdols     > 0 ? `${countIdols} idol(s)`     : null,
      countMusics    > 0 ? `${countMusics} música(s)`  : null,
      countProducers > 0 ? `${countProducers} produtor(es)` : null,
      countIgnored   > 0 ? `${countIgnored} ignorado(s) (tipo desconhecido)` : null,
    ].filter(Boolean).join(", ");
    alert(`Database importada com sucesso!\n${resumo || "Nenhum item reconhecido."}`);
  };
  reader.readAsText(file);
}


// ========================
// IMPORTAR DRAFT (.TXT)
// ========================

//f:importarDraftTxt
function importarDraftTxt(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.name.endsWith(".txt")) { alert("Use um arquivo .txt exportado pelo Stray7."); return; }

  const reader = new FileReader();
  reader.onload = function(e) {
    const texto = e.target.result.replace(/\r/g, "");
    // extrair jogadores e integrantes
    const jogadores = [];
    let integrantes = 0;
    const blocoJogadores = texto.match(/--- JOGADORES[\s\S]*?(?=\n---|$)/);
    if (blocoJogadores) {
      blocoJogadores[0].split("\n").forEach(linha => {
        const matchJog = linha.match(/^\s+\d+\.\s+(.+)$/);
        if (matchJog) jogadores.push(matchJog[1].trim());
        const matchInt = linha.match(/Integrantes por time:\s*(\d+)/);
        if (matchInt) integrantes = parseInt(matchInt[1]);
      });
    }

    // extrair objetos do pool a partir das databases disponíveis 
    const nomesIdols      = extrairNomesBloco(texto, "POOL DE IDOLS",     /^\s+\[.+?\]\s+(.+?)\s{2}/);
    const nomesMusicas    = extrairNomesBloco(texto, "POOL DE MÚSICAS",    /^\s+(.+?)(?:\s{2}|$)/);
    const nomesProdutores = extrairNomesBloco(texto, "POOL DE PRODUTORES", /^\s+(.+?)(?:\s{2}|$)/);

    const poolIdols     = nomesIdols.map(item =>
      getIdols().find(i => item.id ? i.id === item.id : i.name === item.name)
    ).filter(Boolean).map(i => ({ ...i, type: "Idol" }));

    const poolMusicas   = nomesMusicas.map(item =>
      getMusics().find(m => item.id ? m.id === item.id : m.name === item.name)
    ).filter(Boolean).map(m => ({ ...m, type: "music" }));

    const poolProdutores= nomesProdutores.map(item =>
      getProducers().find(p => item.id ? p.id === item.id : p.name === item.name)
    ).filter(Boolean).map(p => ({ ...p, type: "producer" }));

    const pool = [...poolIdols, ...poolMusicas, ...poolProdutores];

    if (jogadores.length === 0 || integrantes === 0) {
      alert("Arquivo inválido ou incompleto. Verifique se foi exportado pelo Stray7.");
      event.target.value = "";
      return;
    }
    // desmarcar tudo e marcar só o que estava na pool
    desmarcarTodosGeracoes();
    desmarcarTodasMusicas();
    desmarcarTodosProdutores();

    document.querySelectorAll("#groupsContainer input[type='checkbox'][value]").forEach(cb => {
      if (poolIdols.some(i => i.id === cb.value)) cb.checked = true;
    });
    atualizarCheckboxesGrupo();
    document.querySelectorAll("#musicContainer input[type='checkbox']").forEach(cb => {
      if (poolMusicas.some(m => m.name === cb.value)) cb.checked = true;
    });
    document.querySelectorAll("#producerContainer input[type='checkbox']").forEach(cb => {
      if (poolProdutores.some(p => p.name === cb.value)) cb.checked = true;
    });

    // salvar no localStorage e redirecionar direto para o jogo
    localStorage.setItem("draftData", JSON.stringify({
      jogadores,
      integrantes,
      pool,
      usarMusica:   poolMusicas.length > 0,
      usarProdutor: poolProdutores.length > 0,
      // ordemBase = [0,1,...,n-1] pois jogadores já estão na ordem sorteada
      ordemBase: jogadores.map((_, i) => i)
    }));

    event.target.value = "";

    const ausentes = nomesIdols.length - poolIdols.length
                   + nomesMusicas.length - poolMusicas.length
                   + nomesProdutores.length - poolProdutores.length;

    if (ausentes > 0) {
      alert(`Atenção: ${ausentes} item(s) da pool original não foram encontrados na database atual e foram ignorados.\n\nO draft será iniciado com os itens disponíveis.`);
    }

    window.location.href = pegarHrefJogo("draftgame.html");
  };
  reader.readAsText(file);
}

//f:extrairNomesBloco — helper para pegar ids/nomes de uma seção do .txt
function extrairNomesBloco(texto, titulo, regex) {
  const itens = [];
  const escapado = titulo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = texto.match(new RegExp(`--- ${escapado} ---([\\s\\S]*?)(?=\\n---|$)`));
  if (!match) return itens;
  match[1].split("\n").forEach(linha => {
    if (linha.trim() === "" || linha.trim() === "(nenhum)") return;
    const idMatch = linha.match(/\{id:([^}]+)\}/);
    const m = linha.match(regex);
    if (m) itens.push({ id: idMatch ? idMatch[1].trim() : null, name: m[1].trim() });
  });
  return itens;
}

// ========================
// EXPORTAR DRAFT
// ========================

//f:injetarBotaoExportar
function injetarBotaoExportar() {
  const headerRight = document.querySelector(".header-right");
  if (!headerRight) return;
  const btn = document.createElement("button");
  btn.id = "btnExportarDraft";
  btn.textContent = "⬇ Exportar Draft";
  btn.onclick = exportarDraft;
  headerRight.insertBefore(btn, headerRight.firstChild);
}

//f:exportarDraft
function exportarDraft() {
  const raw = localStorage.getItem("draftData");
  if (!raw) { alert("Nenhum dado de draft encontrado."); return; }
  const { integrantes, pool } = JSON.parse(raw);

  // ler ordem real do DOM (sorteada pelo draftgame.js)
  // fallback para localStorage se o board não estiver disponível
  const playerRows = document.querySelectorAll("#playersBoard .playerRow");
  let jogadores;
  if (playerRows.length > 0) {
    jogadores = Array.from(playerRows).map(row => row.querySelector(".playerName")?.textContent?.trim()).filter(Boolean);
  } else {
    jogadores = JSON.parse(raw).jogadores;
  }

  const tipoLabel = { idol: "Idol", music: "Música", producer: "Produtor" };

  const idols     = pool.filter(i => i.type?.toLowerCase() === "idol");
  const musicas   = pool.filter(i => i.type?.toLowerCase() === "music");
  const produtores= pool.filter(i => i.type?.toLowerCase() === "producer");

  const linhas = [];

  linhas.push("=== STRAY7 DRAFT ===");
  linhas.push(`Data: ${new Date().toLocaleString("pt-BR")}`);
  linhas.push("");

  linhas.push("--- JOGADORES (ordem do draft) ---");
  jogadores.forEach((nome, i) => linhas.push(`  ${i + 1}. ${nome}`));
  linhas.push(`  Integrantes por time: ${integrantes}`);
  linhas.push("");

  linhas.push("--- POOL DE IDOLS ---");
  if (idols.length === 0) {
    linhas.push("  (nenhum)");
  } else {
    idols.forEach(idol => {
      linhas.push(`  [${idol.group}] ${idol.name}  {id:${idol.id}}  (Gen ${idol.gen || "?"} | Esp: ${idol.especialidade || "-"})`);
    });
  }
  linhas.push("");

  if (musicas.length > 0) {
    linhas.push("--- POOL DE MÚSICAS ---");
    musicas.forEach(m => linhas.push(`  ${m.name}  {id:${m.id}}${m.fonte ? "  (Fonte: " + m.fonte + ")" : ""}`));
    linhas.push("");
  }

  if (produtores.length > 0) {
    linhas.push("--- POOL DE PRODUTORES ---");
    produtores.forEach(p => linhas.push(`  ${p.name}  {id:${p.id}}`));
    linhas.push("");
  }

  const texto = linhas.join("\n");
  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `stray7_draft_${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

//f:render onLoad
window.addEventListener("load", () => {
  injetarHeader();
  if (document.getElementById("groupsContainer"))   renderizarGrupos();
  if (document.getElementById("producerContainer")) renderizarProdutores();
  if (document.getElementById("musicContainer"))    renderizarMusicas();
  if (document.querySelector(".btn-iniciar-draft")) iniciarAvisoDraft();
  const paginaAtual = location.pathname.split("/").pop();
  if (paginaAtual === "draftgame.html") injetarBotaoExportar();
});