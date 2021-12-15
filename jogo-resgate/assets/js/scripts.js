function start() {
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    var posicaoY = parseInt(Math.random() * 334);
    var jogo = {
        podeAtirar: true,
        fimDeJogo: false,
        velocidade: 5,
        energiaAtual: 3,
        pontuacao: {
            pontos: 0,
            salvos: 0,
            perdidos: 0
        }
    }

    const TECLA = {
        W: 87,
        S: 83,
        D: 68
    }

    var musica = document.getElementById("musica");
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    //Música em loop
    musica.addEventListener("ended", function(){
        musica.currentTime = 0;
        musica.play();
    }, false);
    musica.play();

    jogo.pressionou = [];

    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
    
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });
    
    jogo.timer = setInterval(() => {
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
    }, 30);

    function movefundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - 1);
    }
    
    function movejogador() {
        if (jogo.pressionou[TECLA.W]) {
            var jogadorY = parseInt($("#jogador").css("top"));
            if (jogadorY > 10) {
                $("#jogador").css("top", jogadorY - 10);
            }
        }
        
        if (jogo.pressionou[TECLA.S]) {
            var jogadorY = parseInt($("#jogador").css("top"));
            if (jogadorY < 434) {
                $("#jogador").css("top", jogadorY + 10);
            }
        }
        
        if (jogo.pressionou[TECLA.D]) {
            if (jogo.podeAtirar == true) {
                jogo.podeAtirar = false;
                somDisparo.play()
    
                jogadorY = parseInt($("#jogador").css("top"))
                jogadorX = parseInt($("#jogador").css("left"))
                var tiroY = jogadorY + 37;
                var tiroX = jogadorX + 190;
    
                $("#fundoGame").append("<div id='disparo'></div>");
                let disparo = $("#disparo")
                disparo.css("top", tiroY);
                disparo.css("left", tiroX);
                
                var tempoDisparo = window.setInterval(() => {
                    tiroX = parseInt(disparo.css("left"));
                    disparo.css("left", tiroX + 15); 
            
                    if (tiroX > 900) {
                        window.clearInterval(tempoDisparo);
                        tempoDisparo = null;
                        disparo.remove();
                        jogo.podeAtirar = true;
                    }
                }, 30);
            }
        }
    }

    function moveinimigo1() {
        let inimigo = $("#inimigo1")
        let posicaoX = parseInt(inimigo.css("left"));
        inimigo.css("left", posicaoX - jogo.velocidade);
        inimigo.css("top", posicaoY);

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            inimigo.css("left", 694);
            inimigo.css("top", posicaoY);
            jogo.pontuacao.pontos = jogo.pontuacao.pontos - 50
        }
    }
    
    function moveinimigo2() {
        let posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX - 3);
        
        if (posicaoX <= 0) {
            $("#inimigo2").css("left", 775);
            jogo.pontuacao.pontos = jogo.pontuacao.pontos - 25
        }
    }

    function moveamigo() {
        let posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + 1);

        if (posicaoX > 906) {
            $("#amigo").css("left", 0);
        }
    }
    
    function colisao() {
        function checkCollision(idDiv1, idDiv2, callback) {
            var colisao = ($(`#${idDiv1}`).collision($(`#${idDiv2}`)));
            if (colisao.length > 0) {
                callback()
            }
        }

        checkCollision("jogador", "inimigo1", loadCollision1);
        checkCollision("jogador", "inimigo2", loadCollision2);
        checkCollision("disparo", "inimigo1", loadCollision3);
        checkCollision("disparo", "inimigo2", loadCollision4);
        checkCollision("jogador", "amigo", loadCollision5);
        checkCollision("inimigo2", "amigo", loadCollision6);

        function loadCollision1() {
            let inimigo = $("#inimigo1")
            let inimigoX = parseInt(inimigo.css("left"));
            let inimigoY = parseInt(inimigo.css("top"));
            criaExplosao(inimigoX, inimigoY, "explosao1");
            
            reposicionaInimigo1()
            jogo.energiaAtual--;
        }

        function loadCollision2() {
            let inimigo = $("#inimigo2")
            let inimigoX = inimigo.css("left");
            let inimigoY = inimigo.css("top");
            criaExplosao(inimigoX, inimigoY, "explosao2");
            
            inimigo.remove();
            
            reposicionaInimigo2();
            jogo.energiaAtual--;
        }
        
        function loadCollision3() {
            let inimigo = $("#inimigo1")
            let inimigoX = parseInt(inimigo.css("left"));
            let inimigoY = parseInt(inimigo.css("top"));
                
            criaExplosao(inimigoX, inimigoY, "explosao1");
            $("#disparo").css("left", 950);
                
            reposicionaInimigo1()
            jogo.pontuacao.pontos = jogo.pontuacao.pontos + 100;
            jogo.velocidade = jogo.velocidade + 0.3;
        }

        function loadCollision4() {
            let inimigo = $("#inimigo2")
            let inimigoX = parseInt(inimigo.css("left"));
            let inimigoY = parseInt(inimigo.css("top"));
            inimigo.remove();
        
            criaExplosao(inimigoX, inimigoY, "explosao2");
            $("#disparo").css("left", 950);
            reposicionaInimigo2();
            jogo.pontuacao.pontos = jogo.pontuacao.pontos + 50
        }

        function loadCollision5() {
            somResgate.play()
            reposicionaAmigo();
            $("#amigo").remove();
            jogo.pontuacao.salvos++
        }

        function loadCollision6() {
            somPerdido.play()
            let amigo = $("#amigo")
            let amigoX = parseInt(amigo.css("left"));
            let amigoY = parseInt(amigo.css("top"));
            explodeAmigo(amigoX, amigoY);
            amigo.remove();

            reposicionaAmigo();
            jogo.pontuacao.perdidos++
        }
    }

    function placar() {
        let placar = $("#placar")
        placar.html("")
        placar.append(`<div><h2>Pontos: ${jogo.pontuacao.pontos}</h2></div>`)
        placar.append(`<div><h2>Salvos: ${jogo.pontuacao.salvos}</h2></div>`)
        placar.append(`<div><h2>Perdidos: ${jogo.pontuacao.perdidos}</h2></div>`)
    }

    function energia() {
        $("#energia").css("background-image", `url(assets/images/energia${jogo.energiaAtual}.png)`);
        if (jogo.energiaAtual == 0) {
            gameOver()
        }
    }

    function criaExplosao(inimigoX, inimigoY, divId) {
        somExplosao.play()
        $("#fundoGame").append(`<div id='${divId}'></div>`);
        
        var divExplosao = $(`#${divId}`);
        divExplosao.css("background-image", "url(assets/images/explosao.png)");
        divExplosao.css("top", inimigoY);
        divExplosao.css("left", inimigoX);
        divExplosao.animate({width:200, opacity:0}, "slow");

        var tempoExplosao = window.setInterval(() => {
            divExplosao.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }, 1000);
    }

    function explodeAmigo(amigoX, amigoY) {
        $("#fundoGame").append("<div id='explosaoAmigo' class='anima4'></div");
        let explosao = $("#explosaoAmigo")
        explosao.css("top", amigoY);
        explosao.css("left", amigoX);

        var tempoExplosao3 = window.setInterval(() => {
            explosao.remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }, 1000);
    }

    function reposicionaInimigo1() {
        let inimigo = $("#inimigo1")
        posicaoY = parseInt(Math.random() * 334);
        inimigo.css("left", 694);
        inimigo.css("top", posicaoY);
    }

    function reposicionaInimigo2() {
        var tempoColisao4 = window.setInterval(() => {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;
            if (jogo.fimDeJogo == false) {
                $("#fundoGame").append("<div id=inimigo2></div>");
            }
        }, 5000);
    }

    function reposicionaAmigo() {
        var tempoAmigo = window.setInterval(() => {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
            
            if (jogo.fimDeJogo == false) {
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }, 6000);
    }


    function gameOver() {
        jogo.fimDeJogo = true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer = null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundoGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + jogo.pontuacao.pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
    }

}

function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
}
