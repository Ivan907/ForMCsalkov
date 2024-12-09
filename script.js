const dino = document.getElementById('dino');

let isJumping = false; // Флаг прыжка
let dinoPosition = 0; // Позиция персонажа по вертикали
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

// Слушатель события для прыжка
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        jump();
    }
});

// Установка начальной позиции персонажа
dino.style.bottom = dinoPosition + 'px';
