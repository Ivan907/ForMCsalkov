const square = document.getElementById('square');
const distanceDisplay = document.getElementById('distance');
const restartButton = document.getElementById('restart-button');

let isJumping = false; // Флаг прыжка
let isGameOver = false; // Флаг окончания игры
let squarePosition = 0; // Позиция персонажа по вертикали
let distance = 0; // Счётчик очков
let distanceInterval; // Интервал обновления очков

const gravity = 0.9; // Сила гравитации
const jumpHeight = 150; // Максимальная высота прыжка
const jumpSpeed = 20; // Скорость изменения высоты прыжка

function jump() {
    if (isJumping || isGameOver) return; // Если персонаж прыгает или игра окончена, ничего не делать

    isJumping = true;
    let upInterval = setInterval(() => {
        if (squarePosition >= jumpHeight) {
            clearInterval(upInterval); // Достигнут пик прыжка
            let downInterval = setInterval(() => {
                if (squarePosition <= 0) {
                    clearInterval(downInterval); // Персонаж вернулся на землю
                    squarePosition = 0; // Убедимся, что позиция равна 0
                    square.style.bottom = squarePosition + 'px';
                    isJumping = false;
                } else {
                    squarePosition -= jumpSpeed * gravity; // Падение вниз
                    square.style.bottom = squarePosition + 'px';
                }
            }, 20);
        } else {
            squarePosition += jumpSpeed; // Подъём вверх
            square.style.bottom = squarePosition + 'px';
        }
    }, 20);
}

function startGame() {
    distance = 0;
    isGameOver = false;
    squarePosition = 0; // Сбросить позицию в начале игры
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
    if (event.code === 'Space') {
        jump();
    }
});

// Обработка нажатия кнопки рестарта
restartButton.addEventListener('click', restartGame);

// Установка начальной позиции персонажа и запуск игры
square.style.bottom = squarePosition + 'px';
startGame();
