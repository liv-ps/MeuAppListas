let listaAtual = 0;

let itemArrastado = null;
let listaArrastada = null;

let timerPressionarLista = null;


/* =========================================
   CARREGAR LISTAS
========================================= */

function obterListas() {

    let dados = localStorage.getItem("listas");

    if (!dados) {
        return [];
    }

    try {

        let listas = JSON.parse(dados);

        if (Array.isArray(listas)) {
            return listas;
        }

    } catch (erro) {

        console.log("Erro ao carregar listas:", erro);
    }

    return [];
}


/* =========================================
   SALVAR
========================================= */

function salvarListas(listas) {

    localStorage.setItem(
        "listas",
        JSON.stringify(listas)
    );
}


/* =========================================
   CRIAR LISTA
========================================= */

function criarLista() {

    let nome = prompt(
        "Digite o nome da lista:"
    );

    if (
        !nome ||
        nome.trim() === ""
    ) {
        return;
    }

    let listas = obterListas();

    listas.push({

        nome: nome.trim(),

        itens: []

    });

    salvarListas(listas);

    listaAtual = listas.length - 1;

    mostrarListas();
}


/* =========================================
   RENOMEAR LISTA
========================================= */

function renomearLista(indice) {

    let listas = obterListas();

    if (!listas[indice]) {
        return;
    }

    let novoNome = prompt(
        "Digite o novo nome da lista:",
        listas[indice].nome
    );

    if (
        novoNome === null ||
        novoNome.trim() === ""
    ) {
        return;
    }

    listas[indice].nome =
        novoNome.trim();

    salvarListas(listas);

    mostrarListas();
}


/* =========================================
   EXCLUIR LISTA
========================================= */

function excluirLista(indice) {

    let listas = obterListas();

    if (!listas[indice]) {
        return;
    }

    let confirmar = confirm(
        `Excluir a lista "${listas[indice].nome}"?`
    );

    if (!confirmar) {
        return;
    }

    listas.splice(indice, 1);

    if (listas.length === 0) {

        listaAtual = 0;

    } else if (
        listaAtual >= listas.length
    ) {

        listaAtual =
            listas.length - 1;
    }

    salvarListas(listas);

    mostrarListas();
}


/* =========================================
   MENU DA LISTA
========================================= */

function abrirMenuLista(indice) {

    let escolha = prompt(
        "Digite:\n\n1 - Renomear lista\n2 - Excluir lista\n3 - Cancelar"
    );

    if (escolha === "1") {

        renomearLista(indice);

    } else if (escolha === "2") {

        excluirLista(indice);
    }
}


/* =========================================
   MOSTRAR LISTAS
========================================= */

function mostrarListas() {

    let listas = obterListas();

    let container =
        document.getElementById("listas");

    let menu =
        document.getElementById("menuListas");

    if (!container || !menu) {
        return;
    }

    container.innerHTML = "";

    menu.innerHTML = "";


    /* =====================================
       BOTÃO +
    ===================================== */

    let botaoMais =
        document.createElement("button");

    botaoMais.className =
        "botaoNovaLista";

    botaoMais.textContent = "+";

    botaoMais.title =
        "Nova lista";

    botaoMais.onclick =
        criarLista;

    menu.appendChild(
        botaoMais
    );


    /* =====================================
       LISTAS
    ===================================== */

    listas.forEach(
        function(lista, indice) {

            let botao =
                document.createElement(
                    "button"
                );

            botao.className =
                "botaoLista";

            botao.textContent =
                lista.nome;

            botao.draggable = true;

            if (
                indice === listaAtual
            ) {

                botao.classList.add(
                    "ativo"
                );
            }


            /* Abrir lista */

            botao.onclick =
                function() {

                    listaAtual = indice;

                    mostrarListas();
                };


            /* =================================
               PRESSIONAR E SEGURAR
            ================================= */

            botao.addEventListener(
                "pointerdown",
                function() {

                    timerPressionarLista =
                        setTimeout(
                            function() {

                                abrirMenuLista(
                                    indice
                                );

                            },
                            600
                        );
                }
            );


            botao.addEventListener(
                "pointerup",
                function() {

                    clearTimeout(
                        timerPressionarLista
                    );
                }
            );


            botao.addEventListener(
                "pointerleave",
                function() {

                    clearTimeout(
                        timerPressionarLista
                    );
                }
            );


            botao.addEventListener(
                "pointercancel",
                function() {

                    clearTimeout(
                        timerPressionarLista
                    );
                }
            );


            /* =================================
               ARRASTAR LISTA
            ================================= */

            botao.addEventListener(
                "dragstart",
                function() {

                    listaArrastada =
                        indice;

                    botao.classList.add(
                        "lista-arrastando"
                    );
                }
            );


            botao.addEventListener(
                "dragend",
                function() {

                    botao.classList.remove(
                        "lista-arrastando"
                    );

                    listaArrastada =
                        null;
                }
            );


            botao.addEventListener(
                "dragover",
                function(event) {

                    event.preventDefault();
                }
            );


            botao.addEventListener(
                "drop",
                function(event) {

                    event.preventDefault();

                    if (
                        listaArrastada === null ||
                        listaArrastada === indice
                    ) {
                        return;
                    }

                    let listasAtualizadas =
                        obterListas();

                    let movida =
                        listasAtualizadas.splice(
                            listaArrastada,
                            1
                        )[0];

                    listasAtualizadas.splice(
                        indice,
                        0,
                        movida
                    );


                    salvarListas(
                        listasAtualizadas
                    );

                    mostrarListas();
                }
            );


            menu.appendChild(
                botao
            );
        }
    );


    /* =====================================
       SEM LISTAS
    ===================================== */

    if (
        listas.length === 0
    ) {
        return;
    }


    if (
        listaAtual >= listas.length
    ) {

        listaAtual =
            listas.length - 1;
    }


    /* =====================================
       LISTA ATUAL
    ===================================== */

    let lista =
        listas[listaAtual];


    let div =
        document.createElement("div");

    div.className =
        "lista";


    div.innerHTML = `

        <h2>${escaparHTML(lista.nome)}</h2>

        <div class="caixaAdicionar">

            <input
                type="text"
                id="campoItem"
                placeholder="Adicionar item..."
                autocomplete="off"
            >

            <button
                id="botaoEnviar"
                title="Adicionar item"
            >
                ➤
            </button>

        </div>

        <ul id="itensLista"></ul>

        <div id="concluidas"></div>

    `;


    container.appendChild(div);


    let ul =
        document.getElementById(
            "itensLista"
        );


    /* =====================================
       TAREFAS PENDENTES
    ===================================== */

    lista.itens.forEach(
        function(item, indice) {

            if (
                item.concluido
            ) {
                return;
            }

            criarItem(
                item,
                indice,
                ul
            );
        }
    );


    /* =====================================
       CONCLUÍDAS
    ===================================== */

    let concluidas =
        lista.itens.filter(
            function(item) {

                return item.concluido;
            }
        );


    if (
        concluidas.length > 0
    ) {

        criarAreaConcluidas(
            lista
        );
    }


    /* =====================================
       ADICIONAR
    ===================================== */

    let campo =
        document.getElementById(
            "campoItem"
        );

    let botaoEnviar =
        document.getElementById(
            "botaoEnviar"
        );


    campo.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                adicionarItem();
            }
        }
    );


    botaoEnviar.addEventListener(
        "click",
        function() {

            adicionarItem();
        }
    );
}


/* =========================================
   CRIAR ITEM
========================================= */

function criarItem(
    item,
    indice,
    ul
) {

    let li =
        document.createElement("li");

    li.draggable = true;

    li.className =
        "itemTarefa";


    li.innerHTML = `

        <input
            type="checkbox"
        >

        <span
            contenteditable="true"
            class="textoItem"
        >${escaparHTML(item.texto)}</span>

    `;


    let checkbox =
        li.querySelector(
            "input"
        );


    let texto =
        li.querySelector(
            ".textoItem"
        );


    /* =====================================
       CONCLUIR
    ===================================== */

    checkbox.addEventListener(
        "change",
        function() {

            let listas =
                obterListas();

            listas[
                listaAtual
            ].itens[
                indice
            ].concluido =
                checkbox.checked;

            salvarListas(
                listas
            );

            mostrarListas();
        }
    );


    /* =====================================
       EDITAR
    ===================================== */

    texto.addEventListener(
        "blur",
        function() {

            let novoTexto =
                texto.textContent.trim();

            let listas =
                obterListas();


            if (
                novoTexto === ""
            ) {

                listas[
                    listaAtual
                ].itens.splice(
                    indice,
                    1
                );

            } else {

                listas[
                    listaAtual
                ].itens[
                    indice
                ].texto =
                    novoTexto;
            }


            salvarListas(
                listas
            );

            mostrarListas();
        }
    );


    texto.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                texto.blur();
            }
        }
    );


    /* =====================================
       ARRASTAR ITEM
    ===================================== */

    li.addEventListener(
        "dragstart",
        function() {

            itemArrastado =
                indice;

            li.classList.add(
                "item-arrastando"
            );
        }
    );


    li.addEventListener(
        "dragend",
        function() {

            li.classList.remove(
                "item-arrastando"
            );

            itemArrastado =
                null;
        }
    );


    li.addEventListener(
        "dragover",
        function(event) {

            event.preventDefault();
        }
    );


    li.addEventListener(
        "drop",
        function(event) {

            event.preventDefault();

            if (
                itemArrastado === null ||
                itemArrastado === indice
            ) {
                return;
            }

            let listas =
                obterListas();

            let itens =
                listas[
                    listaAtual
                ].itens;


            let movido =
                itens.splice(
                    itemArrastado,
                    1
                )[0];


            itens.splice(
                indice,
                0,
                movido
            );


            salvarListas(
                listas
            );

            mostrarListas();
        }
    );


    ul.appendChild(li);
}


/* =========================================
   TAREFAS CONCLUÍDAS
========================================= */

function criarAreaConcluidas(
    lista
) {

    let area =
        document.getElementById(
            "concluidas"
        );


    let detalhes =
        document.createElement(
            "details"
        );

    detalhes.open = false;

    detalhes.className =
        "tarefasConcluidas";


    let quantidade =
        lista.itens.filter(
            function(item) {

                return item.concluido;
            }
        ).length;


    detalhes.innerHTML = `

        <summary>
            Tarefas concluídas (${quantidade})
        </summary>

        <ul></ul>

    `;


    let ul =
        detalhes.querySelector(
            "ul"
        );


    lista.itens.forEach(
        function(item, indice) {

            if (
                !item.concluido
            ) {
                return;
            }


            let li =
                document.createElement(
                    "li"
                );


            li.innerHTML = `

                <input
                    type="checkbox"
                    checked
                >

                <span>
                    ${escaparHTML(item.texto)}
                </span>

            `;


            let checkbox =
                li.querySelector(
                    "input"
                );


            let texto =
                li.querySelector(
                    "span"
                );


            texto.style.textDecoration =
                "line-through";


            checkbox.addEventListener(
                "change",
                function() {

                    let listas =
                        obterListas();

                    listas[
                        listaAtual
                    ].itens[
                        indice
                    ].concluido =
                        false;

                    salvarListas(
                        listas
                    );

                    mostrarListas();
                }
            );


            ul.appendChild(li);
        }
    );


    area.appendChild(
        detalhes
    );
}


/* =========================================
   ADICIONAR ITEM
========================================= */

function adicionarItem() {

    let campo =
        document.getElementById(
            "campoItem"
        );


    if (
        !campo ||
        campo.value.trim() === ""
    ) {
        return;
    }


    let listas =
        obterListas();


    listas[
        listaAtual
    ].itens.push({

        texto:
            campo.value.trim(),

        concluido:
            false
    });


    salvarListas(
        listas
    );


    mostrarListas();
}


/* =========================================
   ESCAPAR HTML
========================================= */

function escaparHTML(texto) {

    let div =
        document.createElement(
            "div"
        );

    div.textContent =
        texto;

    return div.innerHTML;
}


/* =========================================
   INICIAR
========================================= */

function carregarListas() {

    let listas =
        obterListas();

    if (
        listas.length === 0
    ) {

        listaAtual = 0;

    } else if (
        listaAtual >= listas.length
    ) {

        listaAtual =
            listas.length - 1;
    }


    mostrarListas();
}


carregarListas();


/* =========================================
   SERVICE WORKER
========================================= */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        function() {

            navigator.serviceWorker
                .register("./sw.js");
        }
    );
}
