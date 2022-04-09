function start() { // Inicio da função start()

    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1' ></div>");
    $("#fundoGame").append("<div id='inimigo1'class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2' '></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    //Principais variáveis do jogo

    var energiaAtual = 3;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var jogo = {};
    var fimdejogo = false;
    var podeAtirar = true; // Pode atirar
    var velocidade = 5; //Velocidade do inimigo
    var posicaoY = parseInt(Math.random() * 334); //Altera a posição do inimigo 
    var TECLA = {
        W: 87, //W = Tecla que o jogador se movimenta para cima
        S: 83, //S = Tecla que o jogador se movimenta para baixo
        D: 68  //D = Tecla que o jogador Dispara 

    }

    jogo.pressionou = [];

    // Sons do jogo

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    //Música em loop
    musica.addEventListener("ended", function () { musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    //Verifica se o usuário pressionou alguma tecla	

    $(document).keydown(function (e) {
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function (e) {
        jogo.pressionou[e.which] = false;
    });

    //Game Loop

    jogo.timer = setInterval(loop, 30);// 30 mili segundos
    function loop() {       //Função de movimentação
        movefundo();        //Fundo do Game
        movejogador();      //Jogador
        moveinimigo1();     //Helicóptero
        moveinimigo2();     //Caminhão
        moveamigo();        //amigo
        colisao();          //Colisão
        placar();           //Placar do jogo com os pontos
        energia();          //Placar de energia
       
      

    }   // Fim da função loop()

    function movefundo() {//Função que movimenta o fundo do jogo

        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - 1); // Altera a velocidade do fundo do Game

    } // fim da função movefundo()

    function movejogador() {

        if (jogo.pressionou[TECLA.W]) {         //W = Tecla que o jogador se movimenta para cima
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo - 10);

            if (topo <= 0) {                      // Posição limite do helicóptero para cima
                $("#jogador").css("top", topo + 10);
            }

        }

        if (jogo.pressionou[TECLA.S]) {         //S = Tecla que o jogador se movimenta para baixo

            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo + 10);

            if (topo >= 434) {	               // Posição limite do helicóptero para baixo
                $("#jogador").css("top", topo - 10);

            }
        }

        if (jogo.pressionou[TECLA.D]) {         //D = Tecla que o jogador Dispara 

            //Chama função Disparo	
            disparo();
        }

    } // fim da função movejogador()

    function moveinimigo1() { // Movimentação do inimigo

        posicaoX = parseInt($("#inimigo1").css("left")); //Onde o Inimigo irá aparecer 
        $("#inimigo1").css("left", posicaoX - velocidade);
        $("#inimigo1").css("top", posicaoY);

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);//Onde o Inimigo irá aparecer 
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);

        }
    } //Fim da função moveinimigo1()

    function moveinimigo2() {

        posicaoX = parseInt($("#inimigo2").css("left")); // Faz a movimentação do caminhão para frente
        $("#inimigo2").css("left", posicaoX - 3);

        if (posicaoX <= 0) {

            $("#inimigo2").css("left", 775);

        }
    } // Fim da função moveinimigo2()

    function moveamigo() {

        posicaoX = parseInt($("#amigo").css("left"));  // Faz a movimentação do amigo para frente
        $("#amigo").css("left", posicaoX + 1);

        if (posicaoX > 906) {

            $("#amigo").css("left", 0);

        }

    } // fim da função moveamigo()

    function disparo() { //Função de disparo

        if (podeAtirar == true) {

            somDisparo.play(); //som do disparo

            podeAtirar = false;

            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 190;
            topoTiro = topo + 40;
            $("#fundoGame").append("<div id='disparo'></div");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 1); //Velocidade do disparo

        } //Fecha podeAtirar

        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15); //Velocidade do disparo

            if (posicaoX > 900) {

                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        } // Fecha executaDisparo()
    } // Fecha disparo()


    function colisao() { // Colisão com o helicóptero
        var colisao1 = ($("#jogador").collision($("#inimigo1"))); // Helicóptero
        var colisao2 = ($("#jogador").collision($("#inimigo2"))); //Caminhão
        var colisao3 = ($("#disparo").collision($("#inimigo1"))); //Disparo no inimigo 1
        var colisao4 = ($("#disparo").collision($("#inimigo2"))); //Disparo no inimigo 2
        var colisao5 = ($("#jogador").collision($("#amigo")));    //Colisão entre Jogador e o amigo
        var colisao6 = ($("#inimigo2").collision($("#amigo")));   // Colisão do amigo com inimigo 2
        // jogador com o inimigo1

        if (colisao1.length > 0) {

            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left")); // Explosão do inimigo
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        // jogador com o inimigo2 
        if (colisao2.length > 0) {

            energiaAtual--;

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();

            reposicionaInimigo2();

        }

        // Disparo com o inimigo1

        if (colisao3.length > 0) {

            velocidade = velocidade + 0.3; //Aumentando a velocidade do inimigo

            pontos = pontos + 100; //Pontos ao atingir inimigo 1

            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));

            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);

        }

        // Disparo com o inimigo2

        if (colisao4.length > 0) {

            pontos = pontos + 50; //Pontos ao atingir inimigo 2

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();

            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);

            reposicionaInimigo2();

        }

        // jogador com o amigo

        if (colisao5.length > 0) {

            somResgate.play(); //Colisão jogador com o amigo

            salvos++; //Pontos ao salvar o amigo

            reposicionaAmigo();
            $("#amigo").remove();
        }

        //Inimigo2 com o amigo

        if (colisao6.length > 0) {   // Colisão do amigo com inimigo 2

            perdidos++; //Pontos perdidos do amigo

            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();

            reposicionaAmigo();

        }

    }//Fim da função colisão

    //Explosão 1
    function explosao1(inimigo1X, inimigo1Y) { //Explosão 1

        somExplosao.play(); //Som da explosão 1


        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000); // Remove a explosão da tela

        function removeExplosao() {

            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;

        }

    } // Fim da função explosao1

    //Reposiciona Inimigo2

    function reposicionaInimigo2() {

        var tempoColisao4 = window.setInterval(reposiciona4, 500);  //Reposiciona Inimigo2

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimdejogo == false) {

                $("#fundoGame").append("<div id=inimigo2></div");

            }

        }
    }

    //Explosão2

    function explosao2(inimigo2X, inimigo2Y) {

        somExplosao.play(); //Som da explosão 2


        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2() {

            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;

        }

    } // Fim da função explosao2

    //Reposiciona Amigo

    function reposicionaAmigo() {

        var tempoAmigo = window.setInterval(reposiciona6, 6000);

        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (fimdejogo == false) {

                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");

            }

        }
    }// Fim eposiciona Amigo

    //Explosão3

    function explosao3(amigoX, amigoY) {

        somPerdido.play(); // Som quando perde

        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;

        }

    } // Fim da função explosao3

    function placar() { //Função de morcar o placar do jogo

        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");

    } //fim da função placar()

    function energia() {

        if (energiaAtual == 3) {

            $("#energia").css("background-image", "url(imgs/energia3.png)");
        }

        if (energiaAtual == 2) {

            $("#energia").css("background-image", "url(imgs/energia2.png)");
        }

        if (energiaAtual == 1) {

            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }

        if (energiaAtual == 0) {

            $("#energia").css("background-image", "url(imgs/energia0.png)");

            //Game Over

            gameOver();         //Fim de jogo
        }

    } // Fim da função energia

   //Função GAME OVER
	function gameOver() {
        fimdejogo=true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer=null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundoGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
        } // Fim da função gameOver();

} //Fim da função Start

//Reinicia o Jogo
		
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
	
} //Fim da função reiniciaJogo
