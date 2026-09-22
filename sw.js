const CACHE_NAME = "minhas-listas-v2";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon.svg"
];


/* =========================================
   INSTALAÇÃO
========================================= */

self.addEventListener(
    "install",
    function(event) {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )

            .then(
                function(cache) {

                    return cache.addAll(
                        ARQUIVOS
                    );
                }
            )

        );

        /*
           Permite que a nova versão
           seja ativada imediatamente.
        */

        self.skipWaiting();
    }
);


/* =========================================
   ATIVAÇÃO
========================================= */

self.addEventListener(
    "activate",
    function(event) {

        event.waitUntil(

            caches.keys()

            .then(
                function(nomesCaches) {

                    return Promise.all(

                        nomesCaches.map(
                            function(nomeCache) {

                                /*
                                   Apaga versões antigas
                                   do cache.
                                */

                                if (
                                    nomeCache !==
                                    CACHE_NAME
                                ) {

                                    return caches.delete(
                                        nomeCache
                                    );
                                }

                            }
                        )

                    );

                }
            )

        );

        /*
           Faz a nova versão assumir
           as páginas abertas.
        */

        self.clients.claim();
    }
);


/* =========================================
   BUSCAR ARQUIVOS
========================================= */

self.addEventListener(
    "fetch",
    function(event) {

        event.respondWith(

            caches.match(
                event.request
            )

            .then(
                function(resposta) {

                    /*
                       Se estiver no cache,
                       usa o arquivo salvo.
                    */

                    if (resposta) {

                        return resposta;
                    }


                    /*
                       Caso contrário,
                       busca na internet.
                    */

                    return fetch(
                        event.request
                    );

                }
            )

        );
    }
);
                }
            )
        );
    }
);
