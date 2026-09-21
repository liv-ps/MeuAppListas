let listaAtual = 0;


// CRIAR NOVA LISTA
function criarLista() {

    let nome = prompt("Digite o nome da lista:");

    if (nome) {

        let dadosSalvos = localStorage.getItem("listas");

        let listas = [];

        if (dadosSalvos) {
            listas = JSON.parse(dadosSalvos);
        }

        listas.push({
            nome: nome,
            itens: []
        });

        localStorage.setItem(
            "listas",
            JSON.stringify(listas)
        );

        listaAtual = listas.length - 1;

        mostrarListas();
    }
}


// MOSTRAR AS LISTAS
function mostrarListas() {

    let dadosSalvos = localStorage.getItem("listas");

    let listas = [];

    if (dadosSalvos) {
        listas = JSON.parse(dadosSalvos);
    }

    let container = document.getElementById("listas");

    container.innerHTML = "";

    let menu = document.getElementById("menuListas");

    if (!menu) {

        menu = document.createElement("div");

        menu.id = "menuListas";

        document
            .body
            .insertBefore(
                menu,
                document.getElementById("listas")
            );
    }

    menu.innerHTML = "";


    listas.forEach(function(lista, indice) {

        let botao = document.createElement("button");

        botao.className = "botaoLista";

        botao.textContent = lista.nome;

        if (indice === listaAtual) {
            botao.classList.add("ativo");
        }

        botao.onclick = function() {

            listaAtual = indice;

            mostrarListas();
        };

        menu.appendChild(botao);
    });


    if (listas.length === 0) {
        return;
    }


    let lista = listas[listaAtual];

    let div = document.createElement("div");

    div.className = "lista";

    div.innerHTML = `
        <h2>${lista.nome}</h2>

        <input 
            type="text" 
            placeholder="Digite um item"
            id="campoItem"
        >

        <button onclick="adicionarItem()">
            Adicionar
        </button>

        <ul id="itensLista"></ul>
    `;

    container.appendChild(div);


    let ul = document.getElementById("itensLista");

    lista.itens.forEach(function(item, indice) {

        let li = document.createElement("li");

        li.innerHTML = `
            <input 
                type="checkbox"
                ${item.concluido ? "checked" : ""}
                onchange="concluirItem(${indice})"
            >

            <span 
                style="${item.concluido ? "text-decoration: line-through;" : ""}"
            >
                ${item.texto}
            </span>

            <button onclick="excluirItem(${indice})">
                Excluir
            </button>
        `;

        ul.appendChild(li);
    });
}


// ADICIONAR ITEM
function adicionarItem() {

    let campo = document.getElementById("campoItem");

    if (campo.value.trim() === "") {
        return;
    }

    let listas = JSON.parse(
        localStorage.getItem("listas")
    );

    listas[listaAtual].itens.push({
        texto: campo.value,
        concluido: false
    });

    localStorage.setItem(
        "listas",
        JSON.stringify(listas)
    );

    mostrarListas();
}


// EXCLUIR ITEM
function excluirItem(indice) {

    let listas = JSON.parse(
        localStorage.getItem("listas")
    );

    listas[listaAtual].itens.splice(indice, 1);

    localStorage.setItem(
        "listas",
        JSON.stringify(listas)
    );

    mostrarListas();
}


// CONCLUIR ITEM
function concluirItem(indice) {

    let listas = JSON.parse(
        localStorage.getItem("listas")
    );

    listas[listaAtual].itens[indice].concluido =
        !listas[listaAtual].itens[indice].concluido;

    localStorage.setItem(
        "listas",
        JSON.stringify(listas)
    );

    mostrarListas();
}


// CARREGAR APLICATIVO
function carregarListas() {

    let dadosSalvos = localStorage.getItem("listas");

    if (!dadosSalvos) {
        mostrarListas();
        return;
    }

    let listas = JSON.parse(dadosSalvos);

    if (listas.length > 0) {
        listaAtual = 0;
    }

    mostrarListas();
}


carregarListas();


// REGISTRAR O APLICATIVO COMO PWA
if ("serviceWorker" in navigator) {

    window.addEventListener("load", function() {

        navigator.serviceWorker
            .register("./sw.js")
            .then(function() {
                console.log("Aplicativo pronto para funcionar como PWA.");
            })
            .catch(function(erro) {
                console.log(
                    "Erro ao registrar o aplicativo:",
                    erro
                );
            });

    });

}