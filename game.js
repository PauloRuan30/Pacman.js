// Obtendo o elemento canvas e seu contexto de desenho 2D
const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

// Obtendo elementos HTML que contêm os frames de animação do Pacman e dos fantasmas
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

// Função para criar um retângulo no canvas
let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

// Definição de constantes para direções do Pacman
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let ghostImageLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];

// Variáveis do jogo
let lives = 3; // Vidas iniciais do jogador
let ghostCount = 4; // Número de fantasmas no jogo
let score = 0; // Pontuação do jogador
let fps = 30; // Taxa de quadros por segundo
let oneBlockSize = 20; // Tamanho de cada bloco no labirinto
let wallSpaceWidth = oneBlockSize / 1.6; // Largura do espaço entre as paredes
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2; // Deslocamento para desenhar as paredes
let wallInnerColor = "black"; // Cor interna das paredes

// Mapa do jogo representado por uma matriz
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 0, 1, 0, 0, 0, 1, 0, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 0, 1, 0, 0, 0, 1, 0, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Array com posições aleatórias para os fantasmas se movimentarem
let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize,
    },
];

// Função para criar um novo Pacman no jogo
let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
};

// Função para reiniciar o estado do jogo após a colisão do pacman com algum dos fantasmas
let restartPacmanAndGhosts = () => {
    createNewPacman();
    createGhosts();
};

// Função para reiniciar o estado do jogo após a colisão com algum fantasma
let onGhostCollision = () => {
    lives--;
    restartPacmanAndGhosts();
    if (lives == 0) {
    }
};

// Função para atualizar o estado do jogo
let update = () => {
    pacman.moveProcess(); // Atualiza o movimento do Pacman
    pacman.eat(); // Verifica se o Pacman comeu algum alimento
    updateGhosts(); // Atualiza o movimento dos fantasmas
    if (pacman.checkGhostCollision(ghosts)) { // Verifica se houve colisão entre o Pacman e um fantasma
        onGhostCollision(); // Lida com a colisão entre o Pacman e um fantasma
    }
};

// Função para desenhar os alimentos no mapa
let drawFoods = () => {
    // Loop pelos elementos do mapa
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            // Se o elemento do mapa for 2, desenha um alimento
            if (map[i][j] == 2) {
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    "#FEB897"
                );
            }
        }
    }
};

// Função para desenhar as vidas restantes do jogador
let drawRemainingLives = () => {
    // Desenha o texto "Lives:" na tela
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));

    // Desenha as vidas restantes do jogador como frames de animação do Pacman
    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * map.length + 2,
            oneBlockSize,
            oneBlockSize
        );
    }
};

// Função para desenhar a pontuação do jogador
let drawScore = () => {
    // Desenha o texto "Score:" seguido da pontuação atual do jogador
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length + 1)
    );
};

// Função para desenhar todos os elementos do jogo no canvas
let draw = () => {
    // Limpa o canvas
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    // Desenha o fundo do jogo
    createRect(0, 0, canvas.width, canvas.height, "black");
    // Desenha as paredes do labirinto
    drawWalls();
    // Desenha os alimentos
    drawFoods();
    // Desenha os fantasmas
    drawGhosts();
    // Desenha o Pacman
    pacman.draw();
    // Desenha a pontuação do jogador
    drawScore();
    // Desenha as vidas restantes do jogador
    drawRemainingLives();
};

// Função para desenhar as paredes do labirinto
let drawWalls = () => {
    // Loop pelos elementos do mapa
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            // Se o elemento do mapa for 1, desenha uma parede
            if (map[i][j] == 1) {
                // Desenha a parede principal
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    "#342DCA"
                );
                // Desenha os detalhes das paredes
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};

// Função para criar os fantasmas do jogo
let createGhosts = () => {
    ghosts = [];
    // Loop para criar cada fantasma
    for (let i = 0; i < ghostCount; i++) {
        // Cria um novo fantasma com posição, velocidade e outras características definidas
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostImageLocations[i % 4].x,
            ghostImageLocations[i % 4].y,
            124,
            116,
            6 + i
        );
        // Adiciona o novo fantasma ao array de fantasmas
        ghosts.push(newGhost);
    }
};

// Função principal do loop de jogo
let gameLoop = () => {
    update(); // Atualiza o estado do jogo
    draw(); // Desenha o estado atual do jogo no canvas
};

// Inicializa um novo Pacman e cria os fantasmas
createNewPacman();
createGhosts();
gameLoop();

// Inicia o loop de jogo com uma taxa de atualização de acordo com o FPS definido
let gameInterval = setInterval(gameLoop, 1000 / fps);

// Ouvinte de eventos de teclado para controlar o movimento do Pacman
window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if (k == 37 || k == 65) { // Tecla esquerda ou A
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87) { // Tecla cima ou W
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) { // Tecla direita ou D
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) { // Tecla baixo ou S
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});
