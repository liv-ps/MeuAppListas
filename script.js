let listaAtual = 0;

/* =========================================
   OBTER LISTAS
========================================= */
function obterListas() {
    let dados = localStorage.getItem("listas");
    if (!dados) return [];

    try {
        let listas = JSON.parse(dados);
        if (Array.isArray(listas)) return listas;
    } catch (erro) {
        console.log("Erro ao carregar listas:", erro);
    }
    return [];
}

/* =========================================
   SALVAR LISTAS
========================================= */
function salvarListas(listas) {
    localStorage.setItem("listas", JSON.stringify(listas));
}

/* =========================================
   CRIAR LISTA
========================================= */
function criarLista() {
    let nome = prompt("Digite o nome da lista:");
    if (!nome || nome.trim() === "") return;

    let listas = obterListas();
    listas.push({
        nome: nome.trim(),
        itens: []
    });

    listaAtual = listas.length - 1;
    salvarListas(listas);
    mostrarListas();
}

/* =========================================
   RENOMEAR LISTA
========================================= */
function renomearLista(indice) {
    let listas = obterListas();
    if (!listas[indice]) return;

    let novoNome = prompt("Digite o novo nome da lista:", listas[indice].nome);
    if (novoNome === null || novoNome.trim() === "") return;

    listas[indice].nome = novoNome.trim();
    salvarListas(listas);
    mostrarListas();
}

/* =========================================
   EXCLUIR LISTA
========================================= */
function excluirLista(indice) {
    let listas = obterListas();
    if (!listas[indice]) return;

    let confirmar = confirm('Excluir a lista "' + listas[indice].nome + '"?');
    if (!confirmar) return;

    listas.splice(indice, 1);

    if (listas.length === 0) {
        listaAtual = 0;
    } else if (listaAtual >= listas.length) {
        listaAtual = listas.length - 1;
    }

    salvarListas(listas);
    mostrarListas();
}

/* =========================================
   REORDENAR LISTA (MOVER PARA ESQUERDA/DIREITA)
========================================= */
function moverLista(indice, direcao) {
    let listas = obterListas();
    let novoIndice = indice + direcao;

    if (novoIndice < 0 || novoIndice >= listas.length) return;

    let listaMovida = listas.splice(indice, 1)[0];
    listas.splice(novoIndice, 0, listaMovida);

    if (listaAtual === indice) {
        listaAtual = novoIndice;
    } else if (listaAtual === novoIndice) {
        listaAtual = indice;
    }

    salvarListas(listas);
    mostrarListas();
}

/* =========================================
   MENU DA LISTA (3 PONTOS NO CABEÇALHO)
========================================= */
function abrirMenuLista(indice) {
    let escolha = prompt(
        "Opções da Lista:\n\n" +
        "1 - Renomear lista\n" +
        "2 - Mover para esquerda\n" +
        "3 - Mover para direita\n" +
        "4 - Excluir lista\n\n" +
        "Digite o número desejado:"
    );

    if (escolha === "1") {
        renomearLista(indice);
    } else if (escolha === "2") {
        moverLista(indice, -1);
    } else if (escolha === "3") {
        moverLista(indice, 1);
    } else if (escolha === "4") {
        excluirLista(indice);
    }
}

/* =========================================
   MENU DO ITEM (3 PONTOS NO ITEM)
========================================= */
function abrirMenuItem(indiceItem) {
    let listas = obterListas();
    let itens = listas[listaAtual].itens;

    let escolha = prompt(
        "Opções do Item:\n\n" +
        "1 - Mover para cima\n" +
        "2 - Mover para baixo\n" +
        "3 - Apagar item\n\n" +
        "Digite o número desejado:"
    );

    if (escolha === "1") {
        moverItem(indiceItem, -1);
    } else if (escolha === "2") {
        moverItem(indiceItem, 1);
    } else if (escolha === "3") {
        excluirItem(indiceItem);
    }
}

/* =========================================
   REORDENAR ITEM
========================================= */
function moverItem(indice, direcao) {
    let listas = obterListas();
    let itens = listas[listaAtual].itens;
    let novoIndice = indice + direcao;

    if (novoIndice < 0 || novoIndice >= itens.length) return;

    let itemMovido = itens.splice(indice, 1)[0];
    itens.splice(novoIndice, 0, itemMovido);

    salvarListas(listas);
    mostrarListas();
}

/* =========================================
   EXCLUIR ITEM
========================================= */
function excluirItem(indice) {
    let listas = obterListas();
    listas[listaAtual].itens.splice(indice, 1);
    salvarListas(listas);
    mostrarListas();
}

/* =========================================
   MOSTRAR LISTAS
========================================= */
function mostrarListas() {
    let listas = obterListas();
    let container = document.getElementById("listas");
    let menu = document.getElementById("menuListas");

    if (!container || !menu) return;

    container.innerHTML = "";
    menu.innerHTML = "";

    // BOTÃO NOVA LISTA (+)
    let botaoMais = document.createElement("button");
    botaoMais.className = "botaoNovaLista";
    botaoMais.textContent = "+";
    botaoMais.title = "Nova lista";
    botaoMais.addEventListener("click", criarLista);
    menu.appendChild(botaoMais);

    // BOTÕES DAS LISTAS NO MENU SUPERIOR
    listas.forEach(function (lista, indice) {
        let botao = document.createElement("button");
        botao.className = "botaoLista";
        botao.textContent = lista.nome;

        if (indice === listaAtual) {
            botao.classList.add("ativo");
        }

        botao.addEventListener("click", function () {
            listaAtual = indice;
            mostrarListas();
        });

        menu.appendChild(botao);
    });

    if (listas.length === 0) return;

    if (listaAtual >= listas.length) listaAtual = listas.length - 1;
    if (listaAtual < 0) listaAtual = 0;

    let lista = listas[listaAtual];

    let div = document.createElement("div");
    div.className = "lista";

    div.innerHTML = `
        <div class="cabecalhoLista">
            <h2>${escaparHTML(lista.nome)}</h2>
            <button class="botaoTresPontos" type="button" aria-label="Opções da lista">⋮</button>
        </div>

        <div class="caixaAdicionar">
            <input type="text" id="campoItem" placeholder="Adicionar item..." autocomplete="off">
            <button id="botaoEnviar" type="button">➤</button>
        </div>

        <ul id="itensLista"></ul>

        <div id="concluidas"></div>
    `;

    container.appendChild(div);

    // Evento dos 3 pontos do cabeçalho da lista
    let btnMenuLista = div.querySelector(".cabecalhoLista .botaoTresPontos");
    btnMenuLista.addEventListener("click", function () {
        abrirMenuLista(listaAtual);
    });

    let ul = document.getElementById("itensLista");

    // Exibir itens pendentes
    lista.itens.forEach(function (item, indice) {
        if (item.concluido) return;
        criarItem(item, indice, ul);
    });

    // Exibir tarefas concluídas
    let concluidas = lista.itens.filter(item => item.concluido);
    if (concluidas.length > 0) {
        criarAreaConcluidas(lista);
    }

    // Configurar campo de adicionar
    let campo = document.getElementById("campoItem");
    let botaoEnviar = document.getElementById("botaoEnviar");

    campo.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            adicionarItem();
        }
    });

    botaoEnviar.addEventListener("click", adicionarItem);
}

/* =========================================
   CRIAR ITEM NA INTERFACE
========================================= */
function criarItem(item, indice, ul) {
    let li = document.createElement("li");
    li.className = "itemTarefa";

    li.innerHTML = `
        <input type="checkbox">
        <span class="textoItem" contenteditable="true">${escaparHTML(item.texto)}</span>
        <button class="botaoTresPontos" type="button" aria-label="Opções do item">⋮</button>
    `;

    let checkbox = li.querySelector("input");
    let texto = li.querySelector(".textoItem");
    let botaoOpcoes = li.querySelector(".botaoTresPontos");

    // Concluir item
    checkbox.addEventListener("change", function () {
        let listas = obterListas();
        listas[listaAtual].itens[indice].concluido = checkbox.checked;
        salvarListas(listas);
        mostrarListas();
    });

    // Editar texto
    texto.addEventListener("blur", function () {
        let novoTexto = texto.textContent.trim();
        let listas = obterListas();

        if (novoTexto === "") {
            listas[listaAtual].itens.splice(indice, 1);
        } else {
            listas[listaAtual].itens[indice].texto = novoTexto;
        }

        salvarListas(listas);
        mostrarListas();
    });

    texto.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            texto.blur();
        }
    });

    // Botão de 3 pontos no item
    botaoOpcoes.addEventListener("click", function () {
        abrirMenuItem(indice);
    });

    ul.appendChild(li);
}

/* =========================================
   TAREFAS CONCLUÍDAS
========================================= */
function criarAreaConcluidas(lista) {
    let area = document.getElementById("concluidas");
    let detalhes = document.createElement("details");

    detalhes.open = false;
    detalhes.className = "tarefasConcluidas";

    let quantidade = lista.itens.filter(item => item.concluido).length;

    detalhes.innerHTML = `
        <summary>Tarefas concluídas (${quantidade})</summary>
        <ul></ul>
    `;

    let ul = detalhes.querySelector("ul");

    lista.itens.forEach(function (item, indice) {
        if (!item.concluido) return;

        let li = document.createElement("li");

        li.innerHTML = `
            <input type="checkbox" checked>
            <span>${escaparHTML(item.texto)}</span>
            <button class="botaoTresPontos" type="button" aria-label="Apagar item">⋮</button>
        `;

        let checkbox = li.querySelector("input");
        let btnOpcoes = li.querySelector(".botaoTresPontos");

        checkbox.addEventListener("change", function () {
            let listas = obterListas();
            listas[listaAtual].itens[indice].concluido = false;
            salvarListas(listas);
            mostrarListas();
        });

        btnOpcoes.addEventListener("click", function () {
            excluirItem(indice);
        });

        ul.appendChild(li);
    });

    area.appendChild(detalhes);
}

/* =========================================
   ADICIONAR ITEM
========================================= */
function adicionarItem() {
    let campo = document.getElementById("campoItem");

    if (!campo || campo.value.trim() === "") return;

    let listas = obterListas();
    if (!listas[listaAtual]) return;

    listas[listaAtual].itens.push({
        texto: campo.value.trim(),
        concluido: false
    });

    salvarListas(listas);
    mostrarListas();
}

/* =========================================
   ESCAPAR HTML
========================================= */
function escaparHTML(texto) {
    let div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

/* =========================================
   INICIAR APP
========================================= */
function carregarListas() {
    let listas = obterListas();

    if (listas.length === 0) {
        listaAtual = 0;
    } else if (listaAtual >= listas.length) {
        listaAtual = listas.length - 1;
    }

    mostrarListas();
}

carregarListas();

/* =========================================
   SERVICE WORKER
========================================= */
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("./sw.js")
            .then(function () {
                console.log("Service Worker ativo.");
            })
            .catch(function (erro) {
                console.log("Erro no Service Worker:", erro);
            });
    });
}
