let listaAtual = 0;

let listaPressionada = null;
let itemPressionado = null;

let timerLista = null;
let timerItem = null;

let reorganizandoLista = false;
let reorganizandoItem = false;


/* =========================================
   OBTER LISTAS
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

        console.log(
            "Erro ao carregar listas:",
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

    listaAtual =
        listas.length - 1;

    salvarListas(listas);

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
        'Excluir a lista "' +
        listas[indice].nome +
        '"?'
    );

    if (!confirmar) {
        return;
    }

    listas.splice(
        indice,
        1
    );


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


    salvarListas(listas);

    mostrarListas();
}


/* =========================================
   MENU DA LISTA
========================================= */

function abrirMenuLista(indice) {

    let escolha = prompt(
        "Digite:\n\n" +
        "1 - Renomear lista\n" +
        "2 - Excluir lista\n" +
        "3 - Cancelar"
    );


    if (
        escolha === "1"
    ) {

        renomearLista(indice);

    } else if (
        escolha === "2"
    ) {

        excluirLista(indice);
    }
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


    if (
        !container ||
        !menu
    ) {
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

    botaoMais.addEventListener(
        "click",
        function() {

            criarLista();
        }
    );

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
               IMPORTANTE:
               Não usamos mais dragstart/drop.
               Agora a reorganização funciona
               com toque.
            */

            botao.dataset.indice =
                indice;


            /* =================================
               TOQUE NORMAL
            ================================= */

            botao.addEventListener(
                "click",
                function() {

                    /*
                       Se estiver reorganizando,
                       não abre a lista.
                    */

                    if (
                        reorganizandoLista
                    ) {
                        return;
                    }

                    listaAtual =
                        indice;

                    mostrarListas();
                }
            );


            /* =================================
               PRESSIONAR E SEGURAR
            ================================= */

            botao.addEventListener(
                "pointerdown",
                function(event) {

                    /*
                       Apenas toque com dedo
                       ou caneta.
                    */

                    if (
                        event.pointerType ===
                        "mouse"
                    ) {
                        return;
                    }


                    listaPressionada =
                        indice;


                    timerLista =
                        setTimeout(
                            function() {

                                iniciarReorganizacaoLista(
                                    botao,
                                    indice
                                );

                            },
                            500
                        );
                }
            );


            /* =================================
               SOLTAR
            ================================= */

            botao.addEventListener(
                "pointerup",
                function(event) {

                    clearTimeout(
                        timerLista
                    );


                    if (
                        reorganizandoLista
                    ) {

                        finalizarReorganizacaoLista(
                            botao
                        );
                    }
                }
            );


            /* =================================
               CANCELAR TOQUE
            ================================= */

            botao.addEventListener(
                "pointercancel",
                function() {

                    clearTimeout(
                        timerLista
                    );

                    finalizarReorganizacaoLista(
                        botao
                    );
                }
            );


            menu.appendChild(
                botao
            );
        }
    );


    /* =====================================
       SE NÃO EXISTE LISTA
    ===================================== */

    if (
        listas.length === 0
    ) {

        return;
    }


    /* =====================================
       CORRIGIR ÍNDICE
    ===================================== */

    if (
        listaAtual >= listas.length
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

        <h2>
            ${escaparHTML(lista.nome)}
        </h2>


        <div class="caixaAdicionar">

            <input
                type="text"
                id="campoItem"
                placeholder="Adicionar item..."
                autocomplete="off"
            >

            <button
                id="botaoEnviar"
                type="button"
            >
                ➤
            </button>

        </div>


        <ul id="itensLista"></ul>


        <div id="concluidas"></div>

    `;


    container.appendChild(
        div
    );


    let ul =
        document.getElementById(
            "itensLista"
        );


    /* =====================================
       MOSTRAR ITENS
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
       TAREFAS CONCLUÍDAS
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
       CAMPO DE ADICIONAR
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
   REORGANIZAR LISTA NO CELULAR
========================================= */

function iniciarReorganizacaoLista(
    botao,
    indice
) {

    reorganizandoLista = true;

    listaPressionada =
        indice;


    botao.classList.add(
        "lista-arrastando"
    );


    /*
       Vibração curta no celular,
       quando suportada.
    */

    if (
        navigator.vibrate
    ) {

        navigator.vibrate(50);
    }


    /*
       Permite acompanhar o dedo.
    */

    document.addEventListener(
        "pointermove",
        moverLista
    );
}


/* =========================================
   MOVER LISTA
========================================= */

function moverLista(event) {

    if (
        !reorganizandoLista
    ) {
        return;
    }


    /*
       Descobre qual botão está
       debaixo do dedo.
    */

    let elemento =
        document.elementFromPoint(
            event.clientX,
            event.clientY
        );


    if (!elemento) {
        return;
    }


    let botao =
        elemento.closest(
            ".botaoLista"
        );


    if (
        !botao
    ) {
        return;
    }


    let destino =
        Number(
            botao.dataset.indice
        );


    if (
        destino ===
        listaPressionada
    ) {
        return;
    }


    let listas =
        obterListas();


    let movida =
        listas.splice(
            listaPressionada,
            1
        )[0];


    listas.splice(
        destino,
        0,
        movida
    );


    /*
       Mantém a lista que estava aberta.
    */

    if (
        listaAtual ===
        listaPressionada
    ) {

        listaAtual =
            destino;

    } else if (
        listaPressionada <
            listaAtual &&
        destino >=
            listaAtual
    ) {

        listaAtual--;

    } else if (
        listaPressionada >
            listaAtual &&
        destino <=
            listaAtual
    ) {

        listaAtual++;
    }


    salvarListas(
        listas
    );


    listaPressionada =
        destino;


    mostrarListas();
}


/* =========================================
   FINALIZAR REORGANIZAÇÃO DA LISTA
========================================= */

function finalizarReorganizacaoLista(
    botao
) {

    clearTimeout(
        timerLista
    );


    if (
        !reorganizandoLista
    ) {
        return;
    }


    reorganizandoLista =
        false;


    document.removeEventListener(
        "pointermove",
        moverLista
    );


    if (
        botao
    ) {

        botao.classList.remove(
            "lista-arrastando"
        );
    }


    listaPressionada =
        null;


    mostrarListas();
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
        document.createElement(
            "li"
        );


    li.className =
        "itemTarefa";


    li.dataset.indice =
        indice;


    li.innerHTML = `

        <input
            type="checkbox"
        >

        <span
            class="textoItem"
            contenteditable="true"
        >
            ${escaparHTML(item.texto)}
        </span>

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
       CONCLUIR ITEM
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
       EDITAR ITEM
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


    /* =====================================
       ENTER AO EDITAR
    ===================================== */

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
       PRESSIONAR ITEM
    ===================================== */

    li.addEventListener(
        "pointerdown",
        function(event) {

            /*
               Não inicia reorganização
               quando tocar diretamente
               no texto para editar.
            */

            if (
                event.target === texto ||
                event.target === checkbox
            ) {

                return;
            }


            if (
                event.pointerType ===
                "mouse"
            ) {
                return;
            }


            itemPressionado =
                indice;


            timerItem =
                setTimeout(
                    function() {

                        iniciarReorganizacaoItem(
                            li,
                            indice
                        );

                    },
                    500
                );
        }
    );


    /* =====================================
       SOLTAR ITEM
    ===================================== */

    li.addEventListener(
        "pointerup",
        function() {

            clearTimeout(
                timerItem
            );


            if (
                reorganizandoItem
            ) {

                finalizarReorganizacaoItem(
                    li
                );
            }
        }
    );


    /* =====================================
       CANCELAR
    ===================================== */

    li.addEventListener(
        "pointercancel",
        function() {

            clearTimeout(
                timerItem
            );


            finalizarReorganizacaoItem(
                li
            );
        }
    );


    ul.appendChild(
        li
    );
}


/* =========================================
   INICIAR REORGANIZAÇÃO DO ITEM
========================================= */

function iniciarReorganizacaoItem(
    li,
    indice
) {

    reorganizandoItem =
        true;


    itemPressionado =
        indice;


    li.classList.add(
        "item-arrastando"
    );


    if (
        navigator.vibrate
    ) {

        navigator.vibrate(50);
    }


    document.addEventListener(
        "pointermove",
        moverItem
    );
}


/* =========================================
   MOVER ITEM
========================================= */

function moverItem(event) {

    if (
        !reorganizandoItem
    ) {
        return;
    }


    let elemento =
        document.elementFromPoint(
            event.clientX,
            event.clientY
        );


    if (!elemento) {
        return;
    }


    let li =
        elemento.closest(
            ".itemTarefa"
        );


    if (
        !li
    ) {
        return;
    }


    let destino =
        Number(
            li.dataset.indice
        );


    if (
        destino ===
        itemPressionado
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
            itemPressionado,
            1
        )[0];


    itens.splice(
        destino,
        0,
        movido
    );


    salvarListas(
        listas
    );


    itemPressionado =
        destino;


    mostrarListas();
}


/* =========================================
   FINALIZAR REORGANIZAÇÃO DO ITEM
========================================= */

function finalizarReorganizacaoItem(
    li
) {

    clearTimeout(
        timerItem
    );


    if (
        !reorganizandoItem
    ) {
        return;
    }


    reorganizandoItem =
        false;


    document.removeEventListener(
        "pointermove",
        moverItem
    );


    if (
        li
    ) {

        li.classList.remove(
            "item-arrastando"
        );
    }


    itemPressionado =
        null;


    mostrarListas();
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


            ul.appendChild(
                li
            );
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
   INICIAR APP
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
                .register("./sw.js")
                .then(
                    function() {

                        console.log(
                            "Service Worker ativo."
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
