const dino = document.getElementById('dino');
const distanceDisplay = document.getElementById('distance');
const restartButton = document.getElementById('restart-button');

let isJumping = false; // Флаг прыжка
let isGameOver = false; // Флаг окончания игры
let dinoPosition = 0; // Позиция персонажа по вертикали
let distance = 0; // Счётчик очков
let distanceInterval; // Интервал обновления очков

const gravity = 0.9; // Сила гравитации
const jumpHeight = 150; // Максимальная высота прыжка
const jumpSpeed = 20; // Скорость изменения высоты прыжка

function jump() {
    if (isJumping) return; // Если персонаж уже прыгает, ничего не делать

    isJumping = true;
    let upInterval = setInterval(() => {
        if (dinoPosition >= jumpHeight) {
            clearInterval(upInterval); // Достигнут пик прыжка
            let downInterval = setInterval(() => {
                if (dinoPosition <= 0) {
                    clearInterval(downInterval); // Персонаж вернулся на землю
                    isJumping = false;
                } else {
                    dinoPosition -= jumpSpeed * gravity; // Падение вниз
                    dino.style.bottom = dinoPosition + 'px';
                }
            }, 20);
        } else {
            dinoPosition += jumpSpeed; // Подъём вверх
            dino.style.bottom = dinoPosition + 'px';
        }
    }, 20);
}

function startGame() {
    distance = 0;
    isGameOver = false;
    distanceDisplay.textContent = distance;
    restartButton.style.display = 'none'; // Скрыть кнопку рестарта

    // Обновление счётчика очков
    distanceInterval = setInterval(() => {
        if (!isGameOver) {
            distance++;
            distanceDisplay.textContent = distance;
        }
    }, 100);
}

function gameOver() {
    clearInterval(distanceInterval); // Остановить обновление очков
    isGameOver = true;
    restartButton.style.display = 'block'; // Показать кнопку рестарта
}

function restartGame() {
    startGame();
}

// Обработка нажатия клавиши "Пробел" для прыжка
document.addEventListener('keydown', event => {
    if (event.code === 'Space' && !isJumping && !isGameOver) {
        jump();
    }
});

// Обработка нажатия кнопки рестарта
restartButton.addEventListener('click', restartGame);

// Установка начальной позиции персонажа и запуск игры
dino.style.bottom = dinoPosition + 'px';
startGame();
