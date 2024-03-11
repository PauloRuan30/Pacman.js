class Pacman {
    constructor(x, y, width, height, speed) {
        // Construtor da classe Pacman
        // Define as propriedades iniciais do Pacman
        this.x = x; // Posição inicial X
        this.y = y; // Posição inicial Y
        this.width = width; // Largura
        this.height = height; // Altura
        this.speed = speed; // Velocidade
        this.direction = 4; // Direção inicial (4 representa direita)
        this.nextDirection = 4; // Próxima direção (inicializada como direita)
        this.frameCount = 7; // Número total de frames de animação
        this.currentFrame = 1; // Frame atual de animação (inicializado como 1)
        // Configura um temporizador para mudar a animação do Pacman a cada 100 milissegundos
        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }

    moveProcess() {
        // Método responsável pelo processo de movimento do Pacman
        this.changeDirectionIfPossible(); // Tenta mudar a direção do Pacman, se possível
        this.moveForwards(); // Move o Pacman para frente
        if (this.checkCollisions()) { // Verifica colisões após o movimento
            this.moveBackwards(); // Se houver colisão, move o Pacman para trás
            return; // Sai do método
        }
    }

    eat() {
        // Método para verificar e comer a "comida" no mapa
        for (let i = 0; i < map.length; i++) { // Loop pelas linhas do mapa
            for (let j = 0; j < map[0].length; j++) { // Loop pelas colunas do mapa
                if (map[i][j] == 2 && this.getMapX() == j && this.getMapY() == i) {
                    // Se o Pacman estiver em uma posição com "comida"
                    map[i][j] = 3; // Remove a comida do mapa
                    score++; // Aumenta a pontuação
                }
            }
        }
    }

    moveBackwards() {
        // Move o Pacman para trás com base em sua direção atual
        switch (this.direction) {
            case DIRECTION_RIGHT: // Direita
                this.x -= this.speed;
                break;
            case DIRECTION_UP: // Cima
                this.y += this.speed;
                break;
            case DIRECTION_LEFT: // Esquerda
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM: // Baixo
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {
        // Move o Pacman para frente com base em sua direção atual
        switch (this.direction) {
            case DIRECTION_RIGHT: // Direita
                this.x += this.speed;
                break;
            case DIRECTION_UP: // Cima
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT: // Esquerda
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM: // Baixo
                this.y += this.speed;
                break;
        }
    }

    checkCollisions() {
        // Verifica colisões do Pacman com as paredes do mapa
        let isCollided = false; // Inicializa como falso
        // Verifica se a posição do Pacman está sobre uma parede (valor 1) no mapa
        if (
            map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize)] == 1 ||
            map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize + 0.9999)] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize + 0.9999)] == 1
        ) {
            isCollided = true; // Define como verdadeiro se houver colisão
        }
        return isCollided; // Retorna o resultado da verificação de colisão
    }

    checkGhostCollision(ghosts) {
        // Verifica colisões do Pacman com os fantasmas no jogo
        for (let i = 0; i < ghosts.length; i++) { // Loop através dos fantasmas
            let ghost = ghosts[i]; // Referência ao fantasma atual
            if (ghost.getMapX() == this.getMapX() && ghost.getMapY() == this.getMapY()) {
                // Se a posição do Pacman coincidir com a posição do fantasma
                return true; // Retorna verdadeiro indicando colisão
            }
        }
        return false; // Retorna falso se não houver colisão
    }

    changeDirectionIfPossible() {
        // Método para mudar a direção do Pacman, se possível
        if (this.direction == this.nextDirection) return; // Retorna se a direção atual já é a próxima direção
        let tempDirection = this.direction; // Armazena a direção atual temporariamente
        this.direction = this.nextDirection; // Define a direção como próxima direção
        this.moveForwards(); // Move o Pacman para frente na nova direção
        if (this.checkCollisions()) { // Verifica colisões após o movimento
            this.moveBackwards(); // Move o Pacman para trás se houver colisão
            this.direction = tempDirection; // Restaura a direção anterior
        } else {
            this.moveBackwards(); // Move o Pacman para trás se não houver colisão
        }
    }

    // Métodos auxiliares para calcular a posição do Pacman no mapa
    getMapX() {
        return parseInt(this.x / oneBlockSize); // Calcula a posição X no mapa
    }

    getMapY() {
        return parseInt(this.y / oneBlockSize); // Calcula a posição Y no mapa
    }

    getMapXRightSide() {
        return parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize); // Calcula a posição X no mapa considerando o lado direito do Pacman
    }

    getMapYRightSide() {
        return parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize); // Calcula a posição Y no mapa considerando o lado direito do Pacman
    }

    changeAnimation() {
        // Método para alterar a animação do Pacman
        this.currentFrame = (this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1); // Avança para o próximo frame de animação
    }

    draw() {
        // Método para desenhar o Pacman na tela
        canvasContext.save(); // Salva o estado do contexto do canvas
        // Aplica transformações para posicionar e girar o Pacman corretamente na tela
        canvasContext.translate(this.x + oneBlockSize / 2, this.y + oneBlockSize / 2); // Define a posição de rotação do Pacman
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180); // Rotaciona o Pacman com base em sua direção
        canvasContext.translate(-this.x - oneBlockSize / 2, -this.y - oneBlockSize / 2); // Reposiciona o Pacman após a rotação
        // Desenha o Pacman na tela usando a sprite e os parâmetros atuais
        canvasContext.drawImage(
            pacmanFrames, // Imagem contendo a sprite do Pacman
            (this.currentFrame - 1) * oneBlockSize, // Posição X da sprite do Pacman
            0, // Posição Y da sprite do Pacman (sempre 0 pois é uma única linha)
            oneBlockSize, // Largura do sprite do Pacman
            oneBlockSize, // Altura do sprite do Pacman
            this.x, // Posição X na tela
            this.y, // Posição Y na tela
            this.width, // Largura na tela
            this.height // Altura na tela
        );
        canvasContext.restore(); // Restaura o estado anterior do contexto do canvas
    }
}
