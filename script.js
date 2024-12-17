// Получение элементов из DOM
const game = document.getElementById('game');
const dino = document.getElementById('dino');
const distanceDisplay = document.getElementById('distance');
const jumpButton = document.getElementById('jump-button');
const restartButton = document.getElementById('restart-button');

// Игровые переменные
let isJumping = false; // Указывает, находится ли персонаж в прыжке
let isGameOver = false; // Флаг окончания игры
let distance = 0; // Пройденное расстояние
let dinoPosition = 0; // Позиция динозавра
let enemies = []; // Массив врагов
let particles = []; // Массив частиц
let enemyInterval; // Интервал создания врагов
let distanceInterval; // Интервал обновления расстояния

// Настройки прыжка
const maxJumpHeight = game.clientHeight / 3; // Максимальная высота прыжка (треть экрана)
const jumpSpeed = 8; // Скорость прыжка
const gravity = 0.9; // Гравитация
const peakPauseTime = 150; // Пауза на пике прыжка

// Функция запуска игры
function startGame() {
    distance = 0; // Сброс расстояния
    dinoPosition = 0; // Сброс позиции динозавра
    distanceDisplay.textContent = distance; // Обновление счётчика
    isGameOver = false; // Сброс флага окончания игры

    // Очистка врагов и частиц
    enemies.forEach(enemy => enemy.remove());
    particles.forEach(particle => particle.remove());
    enemies = [];
    particles = [];

    // Запуск интервалов
    distanceInterval = setInterval(() => {
        if (!isGameOver) {
            distance++;
            distanceDisplay.textContent = distance; // Обновление отображаемого расстояния
        }
    }, 100);

    enemyInterval = setInterval(() => {
        if (!isGameOver) {
            createEnemy(); // Создание врагов
        }
    }, 2000);
}

// Создание врагов
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = game.clientWidth + 'px'; // Начальная позиция за пределами экрана

    // Случайное положение врага (на земле или в воздухе)
    if (Math.random() > 0.5) {
        enemy.style.bottom = '80px'; // Враг летит
    }

    game.appendChild(enemy);
    enemies.push(enemy);

    const moveEnemy = setInterval(() => {
        if (isGameOver) {
            clearInterval(moveEnemy); // Остановка движения при окончании игры
        } else {
            const enemyLeft = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'));
            if (enemyLeft < -30) { // Удаление врага, вышедшего за экран
                enemy.remove();
                enemies = enemies.filter(e => e !== enemy);
                clearInterval(moveEnemy);
            } else {
                enemy.style.left = enemyLeft - 5 + 'px'; // Движение врага
                checkCollision(enemy); // Проверка на столкновение
            }
        }
    }, 20);
}

// Проверка столкновения
function checkCollision(enemy) {
    const enemyRect = enemy.getBoundingClientRect();
    const dinoRect = dino.getBoundingClientRect();

    if (
        dinoRect.left < enemyRect.left + enemyRect.width &&
        dinoRect.left + dinoRect.width > enemyRect.left &&
        dinoRect.top < enemyRect.top + enemyRect.height &&
        dinoRect.height + dinoRect.top > enemyRect.top
    ) {
        gameOver(); // Конец игры при столкновении
    }
}

// Прыжок персонажа
function jump() {
    if (!isJumping && !isGameOver) {
        isJumping = true;
        let jumpDirection = 'up'; // Направление прыжка

        const jumpInterval = setInterval(() => {
            if (jumpDirection === 'up') {
                dinoPosition += jumpSpeed; // Движение вверх
                if (dinoPosition >= maxJumpHeight) {
                    setTimeout(() => {
                        jumpDirection = 'down'; // Смена направления
                    }, peakPauseTime);
                }
            } else if (jumpDirection === 'down') {
                dinoPosition -= jumpSpeed; // Движение вниз
                if (dinoPosition <= 0) {
                    dinoPosition = 0;
                    clearInterval(jumpInterval);
                    isJumping = false;
                }
            }
            dino.style.bottom = dinoPosition + 'px'; // Обновление позиции динозавра
        }, 20);
    }
}

// Завершение игры
function gameOver() {
    clearInterval(distanceInterval); // Остановка счётчика расстояния
    clearInterval(enemyInterval); // Остановка создания врагов
    isGameOver = true;
    restartButton.style.display = 'block'; // Показ кнопки перезапуска
}

// Перезапуск игры
function restartGame() {
    isGameOver = false; // Сброс состояния игры
    distance = 0; // Сброс расстояния
    dinoPosition = 0; // Сброс позиции динозавра
    distanceDisplay.textContent = distance; // Обновление счётчика
    restartButton.style.display = 'none'; // Скрытие кнопки перезапуска
    startGame(); // Запуск игры
}

// Обработка нажатия клавиши "Пробел"
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        if (isGameOver) {
            restartGame(); // Перезапуск игры, если она окончена
        } else if (!isJumping) {
            jump(); // Прыжок, если игра идёт и персонаж не в прыжке
        }
    }
});

// Обработка нажатия кнопки прыжка
jumpButton.addEventListener('click', () => {
    if (!isJumping && !isGameOver) {
        jump();
    }
});

// Обработка нажатия кнопки перезапуска
restartButton.addEventListener('click', restartGame);

// Запуск игры при загрузке страницы
startGame();
 