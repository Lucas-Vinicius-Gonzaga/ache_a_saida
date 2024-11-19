(function(){
    let cnv = document.querySelector("canvas");
    let ctx = cnv.getContext("2d");
    let estado = "escolher";
    let tempo = 0;
    let portaAberta = 0;
    let viloes = [];

    let pronto = document.getElementById("pronto");
    let gameover = document.getElementById("gameover");
    let info = document.getElementById("info");
    let ganhou = document.getElementById("ganhou");
    let infoTempo = document.getElementById("tempo");
    let infoChave = document.getElementById("chaves");
    let listaJogos = document.getElementById("lista");
    let icones = document.getElementById("foto1");


    const LARG_JOGO = 800;
    const ALT_JOGO = 600;
    const TAM_PAREDE = 55;
    const TAM_IMAGE = 96;
    const RIGHT = 68;
    const UP = 87;
    const LEFT = 65;
    const DOWN = 83;
    const ENTER = 13;
    const ESC = 27;
    

    let img = new Image();
        img.src = "img/img.png";
        img.addEventListener("load",function(){
            requestAnimationFrame(loop,cnv);
        },false);

    let somChave = new Audio("audio/chave.wav");
    let somPorta = new Audio("audio/portao.wav");
    let somGanhou = new Audio("audio/somGanhou.wav");
    //let somPassos = new Audio("audio/somPassos.wav");

    
    persoL = {
        tipo: "perso",
        posX: TAM_PAREDE + 2,
        posY: TAM_PAREDE + 4,
        larg: 24,
        alt: 32,
        passo: 4,
        srcX: 0,
        srcY: TAM_IMAGE,
        countAnim: 0,
        mvLeft: false,
        mvUp: false,
        mvRight: false,
        mvDown: false
    }
    function vilao(){
        this.tipo = "vilao";
        this.posX = 1940;
        this.posY = 887;
        this.larg = 55;
        this.alt = 55;
        this.passo = 1;
        this.srcX = 192;
        this.srcY = TAM_PAREDE;
        this.countAnim = 0;
        this.mvLeft = true;
        this.mvUp = false;
        this.mvRight = false;
        this.mvDown = false;
    }
    for(let i = 0;i <= 2;i++){
        let v = new vilao();
        viloes.push(v);
    }
    viloes[1].posX = 571;
    viloes[1].posY = 66;
    viloes[2].posX = 994;
    viloes[2].posY = 341;

    let maze = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,3,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,1,0,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,1,1,1,0,0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1,1,1,0,1,0,1,0,1],
        [1,1,0,1,1,1,0,1,1,1,1,0,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,0,0,1],
        [1,0,0,1,0,0,0,1,0,1,0,0,1,0,1,1,1,0,1,1,0,0,1,0,0,1,1,0,1,0,0,0,1,0,1,1,1,1,1],
        [1,0,1,1,0,1,0,1,0,0,0,1,1,0,1,0,0,0,0,0,0,1,1,1,0,0,0,0,1,0,1,0,1,0,4,0,0,2,1],
        [1,0,1,0,0,1,0,1,0,1,1,1,0,0,1,1,0,1,1,1,1,1,0,0,0,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
        [1,0,1,1,1,1,0,1,0,1,0,0,0,1,1,1,0,0,0,0,1,3,0,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,0,0,1,0,1,0,1,0,0,0,1,1,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,0,1],
        [1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,0,0,0,1,0,0,0,1,0,0,1,1,1,0,0,0,1,1,0,0,0,1,0,1],
        [1,0,0,1,0,1,0,0,0,1,0,1,3,1,1,1,0,1,1,1,1,1,1,0,1,1,0,0,0,1,0,0,1,1,0,1,0,0,1],
        [1,0,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,1,0,1,0,0,1],
        [1,0,0,0,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,1,0,1],
        [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    let walls = [];
    let caminhos = [];
    let keys = [];
    let itensColet = 0;
    
    for(let row in maze){
        for(let column in maze[row]){
            let tile = maze[row][column];
            if(tile == 0){
                let caminho = {
                    posX: column * TAM_PAREDE,
                    posY: row * TAM_PAREDE,
                    larg: TAM_PAREDE,
                    alt: TAM_PAREDE
                }
                caminhos.push(caminho);
            }else if(tile == 1){
                let wall = {
                    posX: column * TAM_PAREDE,
                    posY: row * TAM_PAREDE,
                    larg: TAM_PAREDE,
                    alt: TAM_PAREDE
                }
                walls.push(wall);
            }else if(tile == 2){
                var chegada = {
                    posX: column * TAM_PAREDE,
                    posY: row * TAM_PAREDE,
                    larg: TAM_PAREDE,
                    alt: TAM_PAREDE,
                    row: row,
                    column: column,
                    chegou: false
                }
            }else if(tile == 3){
                let key = {
                    posX: column * TAM_PAREDE,
                    posY: row * TAM_PAREDE,
                    larg: TAM_PAREDE,
                    alt: TAM_PAREDE,
                    row: row,
                    column: column,
                    pegou: false
                }
                keys.push(key);
            }else if(tile == 4){
                var portao = {
                    posX: column * TAM_PAREDE,
                    posY: row * TAM_PAREDE,
                    larg: TAM_PAREDE,
                    alt: TAM_PAREDE,
                    row: row,
                    
                    column: column,
                    passar: false
                }
            }

        }
    }
    
    const LARG_T = maze[0].length * TAM_PAREDE;
    const ALT_T = maze.length * TAM_PAREDE;

    let camera = {
        posX: 0,
        posY: 0,
        larg: LARG_JOGO,
        alt: ALT_JOGO,

        limiteLeft: function(){
            return this.posX + (this.larg * 0.25)
        },
        limiteTop: function(){
            return this.posY + (this.alt * 0.25)
        },
        limiteRight: function(){
            return this.posX + (this.larg * 0.75)
        },
        limiteBottom: function(){
            return this.posY + (this.alt * 0.75)
        },
    }

    function detectaColisao(player,wall){
        let distX = (player.posX + player.larg/2) - (wall.posX + wall.larg/2);
        let distY = (player.posY + player.alt/2) - (wall.posY + wall.alt/2);

        let somaLarg = (player.larg + wall.larg)/2;
        let somaAlt = (player.alt + wall.alt)/2;

        if(Math.abs(distX) < somaLarg && Math.abs(distY) < somaAlt){
            var invasaoX = somaLarg - Math.abs(distX);
            var invasaoY = somaAlt - Math.abs(distY);

            if(player.tipo == "vilao"){
                if(invasaoX > invasaoY){
                    player.posY = distY > 0 ? player.posY + invasaoY : player.posY - invasaoY;
                    player.mvDown = player.mvUp = false;
                    let rand = Math.random() >= 0.5;
                    player.mvRight = rand;
                    player.mvLeft = !rand;
                }else{
                    player.posX = distX > 0 ? player.posX + invasaoX : player.posX - invasaoX;
                    player.mvRight = player.mvLeft = false;
                    let rand = Math.random() >= 0.5;
                    player.mvUp = rand;
                    player.mvDown = !rand;
                }


            }else if(player.tipo == "perso"){

                if(invasaoX > invasaoY){
                    player.posY = distY > 0 ? player.posY + invasaoY : player.posY - invasaoY;
                }else{
                    player.posX = distX > 0 ? player.posX + invasaoX : player.posX - invasaoX;
                }
            }
        }

        
    }
    function detectaMorte(vilao,player){
        let distX = (player.posX + player.larg/2) - (vilao.posX + vilao.larg/2);
        let distY = (player.posY + player.alt/2) - (vilao.posY + vilao.alt/2);

        let somaLarg = (player.larg + vilao.larg)/2;
        let somaAlt = (player.alt + vilao.alt)/2;

        if(Math.abs(distX) < somaLarg && Math.abs(distY) < somaAlt){
            estado = "gameover";
        }
    }
    function caminhoAlter(player,caminho){
        if(player.mvRight || player.mvLeft){
            let distC = caminho.posY - player.posY;
            
            if(player.posX == caminho.posX){
                if(distC > 0){
                    if(Math.abs(distC) == TAM_PAREDE){
                        let rand = Math.random() >= 0.5;
                        player.mvDown = rand;
                        if(player.mvRight){
                            player.mvRight = !rand;
                        }else if(player.mvLeft){
                            player.mvLeft = !rand;
                        }
                    }
                }else if(distC < 0){
                    if(Math.abs(distC) == TAM_PAREDE){
                        let rand = Math.random() >= 0.5;
                        player.mvUp = rand;
                        if(player.mvRight){
                            player.mvRight = !rand;
                        }else if(player.mvLeft){
                            player.mvLeft = !rand;
                        }
                    }
                }
            }
        }else if(player.mvUp || player.mvDown){
            let distC = caminho.posX - player.posX;

            if(player.posY == caminho.posY){
                if(distC < 0){
                    if(Math.abs(distC) == TAM_PAREDE){
                        let rand = Math.random() >= 0.5;
                        player.mvLeft = rand;
                        if(player.mvUp){
                            player.mvUp = !rand;
                        }else if(player.mvDown){
                            player.mvDown = !rand;
                        }
                    }

                }else if(distC > 0){
                    if(Math.abs(distC) == TAM_PAREDE){
                        let rand = Math.random() >= 0.5;
                        player.mvRight = rand;
                        if(player.mvUp){
                            player.mvUp = !rand;
                        }else if(player.mvDown){
                            player.mvDown = !rand;
                        }
                    }
                }
            }
        }
    }
    function pegarItem(player,keys){
        for(let i in keys){
            if(keys[i].pegou == false){
                let distX = (player.posX + player.larg/2) - (keys[i].posX + keys[i].larg/2);
                let distY = (player.posY + player.alt/2) - (keys[i].posY + keys[i].alt/2);

                let somaLarg = (player.larg + keys[i].larg)/2;
                let somaAlt = (player.alt + keys[i].alt)/2;

                if(Math.abs(distX) < somaLarg && Math.abs(distY) < somaAlt){
                    itensColet++;
                    maze[keys[i].row][keys[i].column] = 0;
                    infoChave.innerHTML = "Chaves: "+itensColet+"/4"
                    somChave.cloneNode().play();
                    keys[i].pegou = true;
                }
            }
        }
    }
    function portaoFechado(player,portao){
        
        if(!portao.passar){
            let distX = (player.posX + player.larg/2) - (portao.posX + portao.larg/2);
            let distY = (player.posY + player.alt/2) - (portao.posY + portao.alt/2);

            let somaLarg = (player.larg + portao.larg)/2;
            let somaAlt = (player.alt + portao.alt)/2;

            if(Math.abs(distX) < somaLarg && Math.abs(distY) < somaAlt){
                let invasaoX = somaLarg - Math.abs(distX);
                let invasaoY = somaAlt - Math.abs(distY);
    
                if(invasaoX > invasaoY){
                    player.posY = distY > 0 ? player.posY + invasaoY : player.posY - invasaoY;
                }else{
                    player.posX = distX > 0 ? player.posX + invasaoX : player.posX - invasaoX;
                }
            }
        }
    }
    function linhaChegada(player,chegada){
        let distX = (player.posX + player.larg/2) - (chegada.posX + chegada.larg/2);
        let distY = (player.posY + player.alt/2) - (chegada.posY + chegada.alt/2);

        let somaLarg = (player.larg + chegada.larg)/2;
        let somaAlt = (player.alt + chegada.alt)/2;

        if(Math.abs(distX) < somaLarg && Math.abs(distY) < somaAlt){
            
            if(!chegada.chegou){
                estado = "ganhou";
                somGanhou.cloneNode().play();   
            }
            chegada.chegou = true;
        }
    }

    function reiniciar(){
        estado = "pronto";
        persoL.posX = TAM_PAREDE + 2;
        persoL.posY = TAM_PAREDE + 4;
        itensColet = 0;
        infoChave.innerHTML = "Chaves: "+itensColet+"/4"
        chegada.chegou = false;
        tempo = 0;
        portaAberta = 0;
        maze[portao.row][portao.column] = 4;
        viloes[0].posX = 1940;
        viloes[0].posY = 887;
        viloes[1].posX = 571;
        viloes[1].posY = 66;
        viloes[2].posX = 994;
        viloes[2].posY = 341;

        for(let i in keys){
            maze[keys[i].row][keys[i].column] = 3;
            keys[i].pegou = false
        }
    }

    /* Eventos */
    document.addEventListener("keydown",movimentar,false);
    document.addEventListener("keyup",parar,false);
    document.addEventListener("keyup",jogar,false);
    icones.addEventListener("mousedown",abrir,false);

    function jogar(evento){
        let tecla = evento.keyCode;
        if(tecla == ENTER && estado == "pronto"){
            estado = "jogando";
        }else if(tecla == ENTER && (estado == "gameover" || estado == "ganhou")){
            reiniciar();
        }else if(tecla == ENTER && estado == "jogando"){
            console.log("Posição X: "+persoL.posX)
            console.log("Posição Y: "+persoL.posY)
        }else if(tecla == ESC){
            estado = "escolhendo"
        }
    }
    function movimentar(evento){
        let tecla = evento.keyCode;
        
        switch(tecla){
            case RIGHT:
                persoL.mvRight = true;
                break;
            case LEFT:
                persoL.mvLeft = true;
                break;
            case UP:
                persoL.mvUp = true;
                break;
            case DOWN:
                persoL.mvDown = true;
        }
    }
    function parar(evento){
        let tecla = evento.keyCode;
        
        switch(tecla){
            case RIGHT:
                persoL.mvRight = false;
                break;
            case LEFT:
                persoL.mvLeft = false;
                break;
            case UP:
                persoL.mvUp = false;
                break;
            case DOWN:
                persoL.mvDown = false;
        }
    }
    function abrir(){
        estado = "pronto";
        reiniciar();
    }
    
    function atualizar(){
        let tempoRest = 150;
            tempo++;
            tempoRest -= Math.round(tempo/60);
            infoTempo.innerHTML = "Tempo: " + tempoRest;
        if(tempoRest <= 0){
            estado = "gameover";
            tempoRest = 150;
            tempo = 0
        }    

        if(persoL.mvRight && !persoL.mvLeft){
            persoL.posX += persoL.passo;
            persoL.srcY = 96 + (persoL.alt * 3)
        }else
        if(persoL.mvLeft && !persoL.mvRight){
            persoL.posX -= persoL.passo;
            persoL.srcY = 96 + (persoL.alt * 2)
        }
        if(persoL.mvUp && !persoL.mvDown){
            persoL.posY -= persoL.passo;
            persoL.srcY = 96 + (persoL.alt * 1)
        }else
        if(persoL.mvDown && !persoL.mvUp){
            persoL.posY += persoL.passo;
            persoL.srcY = 96 + (persoL.alt * 0)
        }
        
        if(persoL.mvLeft || persoL.mvRight || persoL.mvUp || persoL.mvDown){
            persoL.countAnim++;
            if(persoL.countAnim >= 16){
                persoL.countAnim = 0;
            }

            persoL.srcX = Math.floor(persoL.countAnim/2) * persoL.larg;
        }else{
            persoL.srcX = 0;
        }

        /* Vilão */
        for(let i = 0;i <= 2;i++){
            if(viloes[i].mvRight && !viloes[i].mvLeft){
                viloes[i].posX += viloes[i].passo;
                viloes[i].srcY = 96 + (96 * 3)
            }else
            if(viloes[i].mvLeft && !viloes[i].mvRight){
                viloes[i].posX -= viloes[i].passo;
                viloes[i].srcY = 96 + (96 * 1)
            }
            if(viloes[i].mvUp && !viloes[i].mvDown){
                viloes[i].posY -= viloes[i].passo;
                viloes[i].srcY = 96 + (96 * 0)
            }else
            if(viloes[i].mvDown && !viloes[i].mvUp){
                viloes[i].posY += viloes[i].passo;
                viloes[i].srcY = 96 + (96 * 2)
            }

            if(viloes[i].mvLeft || viloes[i].mvDown || viloes[i].mvRight || viloes[i].mvUp){
                viloes[i].countAnim++;
                if(viloes[i].countAnim >= 54){
                    viloes[i].countAnim = 0;
                }

                viloes[i].srcX = 192 + (Math.floor(viloes[i].countAnim/6) * 96);
            }else{
                viloes[i].srcX = 192;
            }
        }
        /* Colisão e acontecimentos */
        for(let i in walls){
            let wall = walls[i];
                detectaColisao(persoL,wall);
            for (let j = 0;j <= 2; j++) {
                detectaColisao(viloes[j],wall,persoL);
            }
        }
        for(let i in caminhos){
            let caminho = caminhos[i];
            
            for (let j = 0;j <= 2; j++) {
                caminhoAlter(viloes[j],caminho);
            }
        }
        for (let j = 0;j <= 2; j++) {
            detectaMorte(viloes[j],persoL);
        }
        
        pegarItem(persoL,keys);
        if(itensColet < 4){
            portaoFechado(persoL,portao);
        }else{
            if(portaAberta == 0){
            maze[portao.row][portao.column] = 5;
                somPorta.cloneNode().play();
            }
            portaAberta++;
        }
        linhaChegada(persoL,chegada);

        if(persoL.posX < camera.limiteLeft()){
            camera.posX = persoL.posX - (camera.larg*0.25)
        }
        if(persoL.posY < camera.limiteTop()){
            camera.posY = persoL.posY - (camera.alt*0.25)
        }
        if(persoL.posX + persoL.larg > camera.limiteRight()){
            camera.posX = persoL.posX + persoL.larg - (camera.larg*0.75)
        }
        if(persoL.posY + persoL.alt > camera.limiteBottom()){
            camera.posY = persoL.posY + persoL.alt - (camera.alt*0.75)
        }

        camera.posX = Math.max(0,Math.min(LARG_T - camera.larg,camera.posX));
        camera.posY = Math.max(0,Math.min(ALT_T - camera.alt,camera.posY));
    }

    function desenhar(){
        ctx.clearRect(0,0,LARG_JOGO,ALT_JOGO)
        ctx.save();
        ctx.translate(-camera.posX,-camera.posY);
        for(let row in maze){
            for(let column in maze[row]){
                let tile = maze[row][column];
                let x = column * TAM_PAREDE;
                let y = row * TAM_PAREDE;
                
                ctx.drawImage(
                    img,
                    tile * TAM_IMAGE,0,TAM_IMAGE,TAM_IMAGE,
                    x,y,TAM_PAREDE,TAM_PAREDE
                );
            }
        }

        ctx.drawImage(
            img,
            persoL.srcX,persoL.srcY,persoL.larg,persoL.alt,
            persoL.posX,persoL.posY,persoL.larg,persoL.alt
        );
        for(let i = 0;i <= 2;i++){
            ctx.drawImage(
                img,
                viloes[i].srcX,viloes[i].srcY,TAM_IMAGE,TAM_IMAGE,
                viloes[i].posX,viloes[i].posY,viloes[i].larg,viloes[i].alt  
            );
        }
        ctx.restore();
    }

    function loop(){
        if(estado == "jogando"){
            atualizar();
            desenhar();
            pronto.style.display = 'none';
            gameover.style.display = 'none';
            info.style.display = 'block';
            ganhou.style.display = 'none';
        }else if(estado == "pronto"){
            pronto.style.display = 'block';
            gameover.style.display = 'none';
            info.style.display = 'none';
            ganhou.style.display = 'none';
            cnv.style.display = 'block';
            listaJogos.style.display = 'none';
        }else if(estado == "gameover"){
            pronto.style.display = 'none';
            gameover.style.display = 'block';
            info.style.display = 'none';
            ganhou.style.display = 'none';
        }else if(estado == "ganhou"){
            ganhou.style.display = 'block';
            pronto.style.display = 'none';
            gameover.style.display = 'none';
            info.style.display = 'none';
        }else if(estado == "escolhendo"){
            pronto.style.display = 'none';
            gameover.style.display = 'none';
            info.style.display = 'none';
            ganhou.style.display = 'none';
            cnv.style.display = 'none';
            listaJogos.style.display = 'block';
        }
        requestAnimationFrame(loop,cnv);
    }
}())

/*let maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,1,0,0,1,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,1,1,1,0,0,3,0,1,0,0,0,0,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1,1,1,0,1,0,1,3,1],
    [1,1,0,1,1,1,0,1,1,1,1,0,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,0,0,1],
    [1,0,0,1,0,0,0,1,0,1,0,0,1,0,1,1,1,0,1,1,0,0,1,0,0,1,1,0,1,0,0,0,1,0,1,1,1,1,1],
    [1,0,1,1,0,1,0,1,0,0,0,1,1,0,1,0,0,0,0,0,0,1,1,1,0,0,0,0,1,0,1,0,1,0,4,0,0,2,1],
    [1,0,1,0,0,1,0,1,0,1,1,1,0,0,1,1,0,1,1,1,1,1,0,0,0,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,0,1,0,1,0,0,0,1,1,1,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,1,0,1,0,1,0,0,0,1,1,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,0,1],
    [1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,0,0,0,1,0,0,0,1,0,0,1,1,1,0,0,0,1,1,0,0,0,1,0,1],
    [1,0,0,1,0,1,0,0,0,1,0,1,3,1,1,1,0,1,1,1,1,1,1,0,1,1,0,0,0,1,0,0,1,1,0,1,0,0,1],
    [1,0,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,1,3,0,0,1,0,1,0,0,1],
    [1,0,0,0,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,1,0,1],
    [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];*/