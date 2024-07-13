
//board 
let board; 
let boardWidth = 750; 
let boardHeight = 550; 
let context; 
 
//dino 
let dinoWidth = 88; 
let dinoHeight = 94; 
let dinoX = 50; 
let dinoY = boardHeight - dinoHeight; 
let dinoImg; 
 
let dino = { 
    x : dinoX, 
    y : dinoY, 
    width : dinoWidth, 
    height : dinoHeight 
} 
 
//cactus 
let cactusArray = []; 
 
let cactus1Width = 34; 
let cactus2Width = 69; 
let cactus3Width = 102; 
 
let cactusHeight = 70; 
let cactusX = 700; 
let cactusY = boardHeight - cactusHeight; 
 
let cactus1Img = new Image(); 
let cactus2Img = new Image(); 
let cactus3Img = new Image(); 
cactus1Img.src = "/img/cactus1.png"; 
cactus2Img.src = "/img/cactus2.png"; 
cactus3Img.src = "/img/cactus3.png"; 

//physics 
let velocityX = -6; //cactus moving left speed 
let velocityY = 0; 
let gravity = .6; 
 
let gameOver = false; 
let score = 0; 
 
window.onload = function() { 
    board = document.getElementById("board"); 
    board.height = boardHeight; 
    board.width = boardWidth; 
 
    context = board.getContext("2d");
 
    dinoImg = new Image(); 
    dinoImg.src = "/img/rufy.png"; 
    dinoImg.onload = function() { 
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height); 
    } 
    //イベントリスナーの追加
    const characters = document.querySelectorAll(".character");
    characters.forEach(character => {
        character.addEventListener("click", function() {
            selectCharacter(character.getAttribute("data-src"));
        });
    });
    document.addEventListener("keydown", moveDino); 

    showCharacterSelection();
} 


const showCharacterSelection = () => {
    hideGameContainer();
}

function selectCharacter(characterSrc) {
    dinoImg.src = characterSrc;
    hideCharacterSelection();
    dinoImg.onload = function() {
        setInterval(placeCactus, 1000);
        requestAnimationFrame(update);
    }
} 

const hideCharacterSelection = () => {
    document.querySelector("h2").classList.add("hidden");
    document.getElementById("character-selection").classList.add("hidden");
    document.querySelector("h1").classList.remove("hidden");
    document.getElementById("board").classList.remove("hidden");
}

const hideGameContainer = () => {
    document.querySelector("h2").classList.remove("hidden");
    document.getElementById("character-selection").classList.remove("hidden");
    document.querySelector("h1").classList.add("hidden");
    document.getElementById("board").classList.add("hidden");
}

function reset(gameOver){ 
    if(gameOver){ 
        document.addEventListener("keydown", function(e){ 
            if(e.code=="Space"){ 
                gameOver=false; 
                hideGameContainer();
                this.location.reload(); 
            } 
        }); 
    } 
} 
 
function update() { 
    requestAnimationFrame(update); 
    if (gameOver) { 
        return; 
    } 
    context.clearRect(0, 0, board.width, board.height); 
 
    //dino 
    velocityY += gravity; 
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground 
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height); 
 
    //cactus 
    for (let i = 0; i < cactusArray.length; i++) { 
        let cactus = cactusArray[i]; 
        cactus.x += velocityX; 
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height); 
 
        if (detectCollision(dino, cactus)) { 
            gameOver = true; 
            reset(gameOver); 
        }
    } 
    if(gameOver){ 
        document.getElementById("game-over").style.display="block" 
    }
 
    //score 
    context.fillStyle="black"; 
    context.font="20px courier"; 
    score++; 
    context.fillText(score, 5, 20); 
} 
 
function moveDino(e) { 
    if (gameOver) { 
        return; 
    } 
 
    if ((e.code == "Space" || e.code == "ArrowUp")) { 
        if(dino.y>50){     
        //jump 
        velocityY = -10; 
        } 
    } 
    else if (e.code == "ArrowDown" && dino.y == dinoY) { 
        //duck 
    } 
 
} 
 
function placeCactus() { 
    if (gameOver) { 
        return; 
    } 
 
    //place cactus 
    let cactus = { 
        img : null, 
        x : cactusX, 
        y : cactusY - cactusHeight, 
        width : null, 
        height: cactusHeight 
    } 
 
    let placeCactusChance = Math.random(); //0 - 0.9999... 
 
    if (placeCactusChance > .90) { //10% you get cactus3 
        cactus.img = cactus3Img; 
        cactus.width = cactus3Width; 
        cactusArray.push(cactus); 
    } 
    else if (placeCactusChance > .70) { //30% you get cactus2 
        cactus.img = cactus2Img; 
        cactus.width = cactus2Width; 
        cactusArray.push(cactus); 
    } 
    else if (placeCactusChance > .50) { //50% you get cactus1 
        cactus.img = cactus1Img; 
        cactus.width = cactus1Width; 
        cactusArray.push(cactus); 
    } 
 
    if (cactusArray.length > 5) { 
        cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow 
    } 
} 
 
function detectCollision(a, b) { 
    return a.x  + 20 < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner 
           a.x + a.width - 20 > b.x &&   //a's top right corner passes b's top left corner 
           a.y + 20 < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner 
           a.y + a.height - 20 > b.y;    //a's bottom left corner passes b's top left corner 
}