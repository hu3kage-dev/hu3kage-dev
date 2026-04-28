// ========================
// DADOS DE PATCH NOTES
// Adicione novos patches aqui, do mais recente para o mais antigo.
// Tipos: "major" | "minor" | "fix" | "hotfix"
// Seções disponíveis: new, change, fix, remove, balance
// ========================
const PATCHES = [
  {
    version: "v0.4.1",
    title: "Nova Identidade Visual e Validações",
    date: "2025-04-28",
    type: "minor",
    sections: [
      {
        type: "new",
        label: "Novo",
        items: [
          "A identidade visual do site foi reestruturada para um deisgn mais moderno.",
        ]
      },
      {
        type: "fix",
        label: "Correções",
        items: [
          "Uma validação foi adicionada para impedir que o draft seja iniciado se as regras não forem atendidas, com mensagens de erro específicas para cada tipo de inconsistência (ex: número insuficiente de idols, músicas ou produtores selecionados).",
          "Uma validação foi adicionada para impedir que o mesmo nome de jogador seja adicionado mais de uma vez, garantindo que cada jogador tenha um nome único no draft.",
          "Ajustado o visual do botão de Travar Escolha para indicar claramente quando ele está habilitado ou desabilitado, melhorando a experiência do usuário durante a fase de simulação.",
          "Um aviso é emitido se o jogador tentar clicar no botão de Travar Escolha sem que todos os slots estejam preenchidos ou sem que todos os roles estejam atribuídos.",
        ]
      }
    ]
  },
  {
    version: "v0.4.0",
    title: "Fase de Simulação",
    date: "2025-04-27",
    type: "major",
    sections: [
      {
        type: "new",
        label: "Novo",
        items: [
          "Adicionada a <span class='hl'>Fase de Simulação</span> após o encerramento do draft.",
          "Board de formação por jogador com slots de idol, música e produtor.",
          "Pool pessoal: cards do draft ficam disponíveis para organização livre.",
          "Combo de papel por slot (<span class='hl'>Main Vocal, Sub-vocal, Main Dancer</span> etc.) com numeração automática para papéis repetidos.",
          "Roles distintos para músicas e produtores: <span class='hl'>Cute, Girl Crush, Performance</span> etc..",
          "Botão <span class='hl'>Travar Escolha</span> habilitado automaticamente quando todos os slots estão preenchidos e todos os roles atribuídos.",
          "Modal de detalhes acessível ao clicar nos cards do board e da pool.",
          "Drag & drop com restrição de tipo: idol → slot idol, music → slot music, producer → slot producer.",
        ]
      },
      {
        type: "fix",
        label: "Correções",
        items: [
          "Ghost card não persiste mais após soltar o card em qualquer área.",
          "Modal não abre mais após um drag (distinção entre clique e arrasto por threshold de 10px).",
          "Clique em card dentro do board não causa mais piscar da tela.",
        ]
      }
    ]
  },
  {
    version: "v0.3.2",
    title: "Cards com fotos e Colour Coded Fallback",
    date: "2025-04-26",
    type: "minor",
    sections: [
      {
        type: "new",
        label: "Novo",
        items: [
          "Cards de idols, músicas e produtores agora exibem fotos reais (quando disponíveis).",
          "Placeholders coloridos com nome e identificador foram implementados para os cards sem fotos.",
        ]
      },
    ]
  },
  {
    version: "v0.3.1",
    title: "Filtros de Seleção",
    date: "2025-04-25",
    type: "minor",
    sections: [
      {
        type: "new",
        label: "Novo",
        items: [
          "Botões <span class='hl'>Marcar Todos / Desmarcar Todos</span> para músicas e produtores na tela de configuração.",
          "Campo <span class='hl'>Nome dos jogadores</span> com scroll box separada do lado de configuração.",
          "Botão <span class='hl'>Iniciar Draft</span> em roxo com borda amarela.",
        ]
      },
      {
        type: "fix",
        label: "Correções",
        items: [
          "Produtores e músicas desmarcados agora são corretamente excluídos do sorteio — antes o sistema ignorava o filtro e sorteava do pool completo.",
          "Novas funções foram adicionadas para ler checkboxes reais.",
        ]
      }
    ]
  },
  {
    version: "v0.3.0",
    title: "Draft Game",
    date: "2025-04-24",
    type: "major",
    sections: [
      {
        type: "new",
        label: "Novo",
        items: [
          "Tela de jogo do draft com ordem em cobra (snake draft).",
          "Board individual por jogador com slots de idol, música e produtor.",
          "Pool global de cards com drag & drop para os slots.",
          "Modal de detalhes ao clicar em qualquer card.",
          "Cards com color-code: <span class='hl'>amarelo</span> para idols, <span class='hl'>azul marinho</span> para músicas, <span class='hl'>roxo</span> para produtores.",
          "Destaque visual no jogador da vez.",
          "Botão <span class='hl'>Encerrar Turno</span> que avança a ordem de escolha.",
        ]
      }
    ]
  },
  {
    version: "v0.2.0",
    title: "Configuração do Draft",
    date: "2025-04-23",
    type: "major",
    sections: [
      {
        type: "new",
        label: "Novo",
        items: [
          "Tela de configuração do draft com 4 blocos: regras, opções, idols e músicas/produtores.",
          "Filtro por geração (4ª e 5ª) na seleção de idols.",
          "Seleção granular de idols por grupo.",
          "Sorteio aleatório de tamanho de grupo com distribuição ponderada.",
          "Seleção de músicas e produtores com checkboxes individuais.",
        ]
      }
    ]
  },
  {
    version: "v0.1.0",
    title: "Lançamento Inicial",
    date: "2025-04-23",
    type: "major",
    sections: [
      {
        type: "new",
        label: "Novo",
        items: [
          "Página inicial com seleção de modos de jogo.",
          "Modo Draft disponível; Quiz, Gacha e Manager em desenvolvimento.",
          "Sistema de dados com idols, músicas e produtores em <span class='hl'>data.js</span>.",
          "Paleta de cores definida: roxo, amarelo, azul, cinza escuro.",
        ]
      }
    ]
  }
];

// ========================
// RENDER DA PÁGINA DE PATCH NOTES
// ========================
function renderPatchNotes() {
  const tagLabels = {
    major:  "Major",
    minor:  "Minor",
    fix:    "Fix",
    hotfix: "Hotfix",
  };

  const page = document.createElement("div");
  page.className = "patchnotes-page";
  page.innerHTML = `
    <div class="patchnotes-header">
      <h1>Patch Notes</h1>
      <p>Histórico de atualizações do Stray7 K-Pop Games</p>
    </div>
  `;

  if (!PATCHES.length) {
    page.innerHTML += `<div class="patchnotes-empty">Nenhuma patch note registrada ainda.</div>`;
  } else {
    PATCHES.forEach((patch, i) => {
      const card = document.createElement("div");
      card.className = "patch-card" + (i === 0 ? " open" : "");

      const sectionsHTML = patch.sections.map(sec => `
        <div class="patch-section">
          <div class="patch-section-title ${sec.type}">${sec.label}</div>
          <ul class="patch-list">
            ${sec.items.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      `).join("");

      card.innerHTML = `
        <div class="patch-header">
          <div class="patch-header-left">
            <span class="patch-version">${patch.version}</span>
            <span class="patch-title">${patch.title}</span>
          </div>
          <span class="patch-tag tag-${patch.type}">${tagLabels[patch.type] || patch.type}</span>
          <span class="patch-date">${patch.date}</span>
          <span class="patch-chevron">▼</span>
        </div>
        <div class="patch-body">
          ${sectionsHTML}
        </div>
      `;

      card.querySelector(".patch-header").addEventListener("click", () => {
        card.classList.toggle("open");
      });

      page.appendChild(card);
    });
  }

  document.body.appendChild(page);
}

// ========================
// INIT
// ========================
document.addEventListener("DOMContentLoaded", () => {
  injectHeader();
  const isPatchPage = location.pathname.includes("patchnotes");
  if (isPatchPage) renderPatchNotes();
});
