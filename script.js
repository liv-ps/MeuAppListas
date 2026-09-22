let listaAtual = 0;

let itemArrastado = null;
let listaArrastada = null;


/* =========================================
   CARREGAR DADOS
========================================= */

function obterListas() {

    let dados = localStorage.getItem("listas");

    if (!dados) {
        return [];
    }

    /* -----------------------------------------
       FORMATO NOVO: JSON
    ----------------------------------------- */

    try {

        let listas = JSON.parse(dados);

        if (Array.isArray(listas)) {
            return listas;
        }

    } catch (erro) {

        console.log(
            "Formato antigo detectado. Tentando recuperar..."
        );
    }


    /* -----------------------------------------
       FORMATO ANTIGO: HTML
    ----------------------------------------- */

    try {

        let area = document.createElement("div");

        area.innerHTML = dados;

        let listas = [];


        area.querySelectorAll(":scope > div").forEach(
            function(div) {

                let titulo =
                    div.querySelector("h2");

                if (!titulo) {
                    return;
                }


                let novaLista = {

                    nome:
                        titulo.textContent.trim(),

                    itens: []

                };


                let itens =
                    div.querySelectorAll("ul > li");


                itens.forEach(
                    function(li) {

                        let span =
                            li.querySelector("span");

                        let checkbox =
                            li.querySelector(
                                "input[type='checkbox']"
                            );


                        if (!span) {
                            return;
                        }


                        novaLista.itens.push({

                            texto:
                                span.textContent.trim(),

                            concluido:
                                checkbox
                                    ? checkbox.checked
                                    : false

                        });

                    }
                );


                listas.push(novaLista);
            }
        );


        /* -----------------------------------------
           SALVAR NO NOVO FORMATO
        ----------------------------------------- */

        if (listas.length > 0) {

            localStorage.setItem(
                "listas",
                JSON.stringify(listas)
            );

            console.log(
                "Listas antigas recuperadas com sucesso!"
            );

            return listas;
        }

    } catch (erro) {

        console.error(
            "Não foi possível recuperar as listas:",
            erro
        );
    }


    return [];
}


/* =========================================
   SALVAR LISTAS
========================================= */

function salvarListas(listas) {

    localStorage.setItem(
        "listas",
        JSON.stringify(listas)
    );
}


/* =========================================
   CRIAR NOVA LISTA
========================================= */

function criarLista() {

    let nome =
        prompt("Digite o nome da lista:");


    if (
        !nome ||
        nome.trim() === ""
    ) {

        return;
    }


    let listas = obterListas();


    listas.push({

        nome:
            nome.trim(),

        itens: []

    });


    salvarListas(listas);


    listaAtual =
        listas.length - 1;


    mostrarListas();
}


/* =========================================
   MOSTRAR LISTAS
========================================= */

function mostrarListas() {

    let listas =
        obterListas();


    let container =
        document.getElementById(
            "listas"
        );


    let menu =
        document.getElementById(
            "menuListas"
        );


    if (!container || !menu) {

        console.error(
            "Elementos do aplicativo não encontrados."
        );

        return;
    }


    container.innerHTML = "";

    menu.innerHTML = "";


    /* =====================================
       BOTÃO +
    ===================================== */

    let botaoMais =
        document.createElement(
            "button"
        );


    botaoMais.className =
        "botaoNovaLista";


    botaoMais.textContent =
        "+";


    botaoMais.title =
        "Nova lista";


    botaoMais.onclick =
        criarLista;


    menu.appendChild(
        botaoMais
    );


    /* =====================================
       BOTÕES DAS LISTAS
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


            if (
                indice === listaAtual
            ) {

                botao.classList.add(
                    "ativo"
                );
            }


            /*
               Permite reorganizar
               as listas com o mouse.
            */

            botao.draggable =
                true;


            /* ABRIR */

            botao.onclick =
                function() {

                    listaAtual =
                        indice;

                    mostrarListas();
                };


            /* COMEÇOU A ARRASTAR */

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


            /* TERMINOU */

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


            /* PASSOU POR CIMA */

            botao.addEventListener(
                "dragover",
                function(event) {

                    event.preventDefault();
                }
            );


            /* SOLTOU */

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


                    let listaMovida =
                        listasAtualizadas.splice(
                            listaArrastada,
                            1
                        )[0];


                    listasAtualizadas.splice(
                        indice,
                        0,
                        listaMovida
                    );


                    /* Ajustar lista aberta */

                    if (
                        listaAtual ===
                        listaArrastada
                    ) {

                        listaAtual =
                            indice;

                    }

                    else if (
                        listaArrastada <
                            listaAtual &&
                        indice >=
                            listaAtual
                    ) {

                        listaAtual--;

                    }

                    else if (
                        listaArrastada >
                            listaAtual &&
                        indice <=
                            listaAtual
                    ) {

                        listaAtual++;
                    }


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
       NENHUMA LISTA
    ===================================== */

    if (
        listas.length === 0
    ) {

        return;
    }


    /* =====================================
       GARANTIR ÍNDICE VÁLIDO
    ===================================== */

    if (
        listaAtual >=
        listas.length
    ) {

        listaAtual =
            listas.length - 1;
    }


    if (
        listaAtual < 0
    ) {

        listaAtual = 0;
    }


    /* =====================================
       LISTA ATUAL
    ===================================== */

    let lista =
        listas[listaAtual];


    let div =
        document.createElement(
            "div"
        );


    div.className =
        "lista";


    div.innerHTML = `

        <h2>${escaparHTML(lista.nome)}</h2>

        <ul id="itensLista"></ul>

        <div class="caixaAdicionar">

            <input
                type="text"
                id="campoItem"
                placeholder="Digite um item..."
            >

            <button
                id="botaoEnviar"
                title="Adicionar item"
            >
                ➤
            </button>

        </div>

    `;


    container.appendChild(
        div
    );


    /* =====================================
       ITENS
    ===================================== */

    let ul =
        document.getElementById(
            "itensLista"
        );


    lista.itens.forEach(
        function(item, indice) {

            let li =
                document.createElement(
                    "li"
                );


            li.draggable =
                true;


            li.innerHTML = `

                <input
                    type="checkbox"
                    ${item.concluido
                        ? "checked"
                        : ""}
                >

                <span>
                    ${escaparHTML(item.texto)}
                </span>

                <button>
                    Excluir
                </button>

            `;


            let checkbox =
                li.querySelector(
                    "input[type='checkbox']"
                );


            let texto =
                li.querySelector(
                    "span"
                );


            let botaoExcluir =
                li.querySelector(
                    "button"
                );


            /* CHECKBOX */

            checkbox.addEventListener(
                "change",
                function() {

                    let listasAtualizadas =
                        obterListas();


                    listasAtualizadas[
                        listaAtual
                    ].itens[
                        indice
                    ].concluido =
                        checkbox.checked;


                    salvarListas(
                        listasAtualizadas
                    );


                    if (
                        checkbox.checked
                    ) {

                        texto.style.textDecoration =
                            "line-through";

                    } else {

                        texto.style.textDecoration =
                            "none";
                    }
                }
            );


            if (
                item.concluido
            ) {

                texto.style.textDecoration =
                    "line-through";
            }


            /* EXCLUIR */

            botaoExcluir.onclick =
                function() {

                    excluirItem(
                        indice
                    );
                };


            /* =================================
               ARRASTAR ITEM
            ================================= */

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


                    let listasAtualizadas =
                        obterListas();


                    let itens =
                        listasAtualizadas[
                            listaAtual
                        ].itens;


                    let itemMovido =
                        itens.splice(
                            itemArrastado,
                            1
                        )[0];


                    itens.splice(
                        indice,
                        0,
                        itemMovido
                    );


                    salvarListas(
                        listasAtualizadas
                    );


                    mostrarListas();
                }
            );


            ul.appendChild(
                li
            );
        }
    );


    /* =====================================
       CAMPO DE ADICIONAR ITEM
    ===================================== */

    let campo =
        document.getElementById(
            "campoItem"
        );


    let botaoEnviar =
        document.getElementById(
            "botaoEnviar"
        );


    /* ENTER */

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


    /* BOTÃO */

    botaoEnviar.addEventListener(
        "click",
        function() {

            adicionarItem();
        }
    );


    campo.focus();
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


    if (
        !listas[listaAtual]
    ) {

        return;
    }


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
   EXCLUIR ITEM
========================================= */

function excluirItem(indice) {

    let listas =
        obterListas();


    if (
        !listas[listaAtual]
    ) {

        return;
    }


    listas[
        listaAtual
    ]
        .itens
        .splice(
            indice,
            1
        );


    salvarListas(
        listas
    );


    mostrarListas();
}


/* =========================================
   EVITAR HTML DENTRO DOS TEXTOS
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
   CARREGAR APLICATIVO
========================================= */

function carregarListas() {

    let listas =
        obterListas();


    if (
        listas.length === 0
    ) {

        listaAtual = 0;

    } else if (
        listaAtual >=
        listas.length
    ) {

        listaAtual =
            listas.length - 1;
    }


    mostrarListas();
}


/* =========================================
   INICIAR
========================================= */

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
                .register("./sw.js")
                .then(
                    function() {

                        console.log(
                            "Aplicativo pronto."
                        );
                    }
                )
                .catch(
                    function(erro) {

                        console.log(
                            "Erro no Service Worker:",
                            erro
                        );
                    }
                );
        }
    );
}
