const game = document.getElementById('game');
const dino = document.getElementById('dino');
const distanceDisplay = document.getElementById('distance');
const restartButton = document.getElementById('restart-button');

let isJumping = false; // Флаг прыжка
let isGameOver = false; // Флаг окончания игры
let dinoPosition = 0; // Позиция персонажа по вертикали
let distance = 0; // Счётчик очков
let enemies = []; // Массив для хранения препятствий
let distanceInterval; // Интервал обновления очков
let enemyInterval; // Интервал создания препятствий

const gravity = 0.9; // Сила гравитации
const jumpHeight = 150; // Максимальная высота прыжка
const jumpSpeed = 20; // Скорость изменения высоты прыжка

function jump() {
    if (isJumping) return;

    isJumping = true;
    let upInterval = setInterval(() => {
        if (dinoPosition >= jumpHeight) {
            clearInterval(upInterval);
            let downInterval = setInterval(() => {
                if (dinoPosition <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    dinoPosition -= jumpSpeed * gravity;
                    dino.style.bottom = dinoPosition + 'px';
                }
            }, 20);
        } else {
            dinoPosition += jumpSpeed;
            dino.style.bottom = dinoPosition + 'px';
        }
    }, 20);
}

function startGame() {
    distance = 0;
    isGameOver = false;
    distanceDisplay.textContent = distance;
    restartButton.style.display = 'none';
    enemies.forEach(enemy => enemy.remove());
    enemies = [];

    // Обновление счётчика очков
    distanceInterval = setInterval(() => {
        if (!isGameOver) {
            distance++;
            distanceDisplay.textContent = distance;
        }
    }, 100);

    // Создание препятствий
    enemyInterval = setInterval(() => {
        if (!isGameOver) {
            createEnemy();
        }
    }, 2000);
}

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = game.clientWidth + 'px';
    game.appendChild(enemy);
    enemies.push(enemy);

    const moveEnemy = setInterval(() => {
        if (isGameOver) {
            clearInterval(moveEnemy);
        } else {
            const enemyLeft = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'));
            if (enemyLeft < -30) {
                enemy.remove();
                enemies = enemies.filter(e => e !== enemy);
                clearInterval(moveEnemy);
            } else {
                enemy.style.left = enemyLeft - 5 + 'px';
                checkCollision(enemy);
            }
        }
    }, 20);
}

function checkCollision(enemy) {
    const enemyRect = enemy.getBoundingClientRect();
    const dinoRect = dino.getBoundingClientRect();

    if (
        dinoRect.left < enemyRect.left + enemyRect.width &&
        dinoRect.left + dinoRect.width > enemyRect.left &&
        dinoRect.top < enemyRect.top + enemyRect.height &&
        dinoRect.height + dinoRect.top > enemyRect.top
    ) {
        gameOver();
    }
}

function gameOver() {
    clearInterval(distanceInterval);
    clearInterval(enemyInterval);
    isGameOver = true;
    restartButton.style.display = 'block';
}

function restartGame() {
    startGame();
}

document.addEventListener('keydown', event => {
    if (event.code === 'Space' && !isJumping && !isGameOver) {
        jump();
    }
});

restartButton.addEventListener('click', restartGame);

dino.style.bottom = dinoPosition + 'px';
startGame();
