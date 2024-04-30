const gameScreen = document.getElementById('game-screen');
const player = document.createElement('div');
const zombiesContainer = document.getElementById('zombies');
const heartsContainer = document.getElementById('hearts');
const startScreen = document.getElementById('start-screen');
const playButton = document.getElementById('play-button');
const endScreen = document.getElementById('end-screen');
const bullets = [];
let lastBulletTime = 0;
const bulletCooldown = 2000; // 2 seconds cooldown

player.classList.add('player');
gameScreen.appendChild(player);

playButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    startGame();
});

let playerX = 50;
let playerY = 50;
let zombies = [];
let zombieInterval;
let playerSpeed = 5;

player.style.left = playerX + 'px';
player.style.top = playerY + 'px';
player.style.backgroundImage = "url('player.png')";

document.addEventListener('click', () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastBulletTime > bulletCooldown) {
        lastBulletTime = currentTime;
        shoot();
    }
});

let keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

function movePlayer() {
    if (keys['a'] && keys['w']) {
        playerX -= playerSpeed / Math.sqrt(2);
        playerY -= playerSpeed / Math.sqrt(2);
    } else if (keys['a'] && keys['s']) {
        playerX -= playerSpeed / Math.sqrt(2);
        playerY += playerSpeed / Math.sqrt(2);
    } else if (keys['d'] && keys['w']) {
        playerX += playerSpeed / Math.sqrt(2);
        playerY -= playerSpeed / Math.sqrt(2);
    } else if (keys['d'] && keys['s']) {
        playerX += playerSpeed / Math.sqrt(2);
        playerY += playerSpeed / Math.sqrt(2);
    } else if (keys['a']) {
        playerX -= playerSpeed;
    } else if (keys['d']) {
        playerX += playerSpeed;
    } else if (keys['w']) {
        playerY -= playerSpeed;
    } else if (keys['s']) {
        playerY += playerSpeed;
    }

    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
}

function shoot() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = playerX + 'px';
    bullet.style.top = playerY + 'px';
    gameScreen.appendChild(bullet);
    bullets.push(bullet);

    const bulletMove = setInterval(() => {
        bullet.style.top = parseInt(bullet.style.top) - 5 + 'px';

        zombies.forEach((zombie, zindex) => {
            if (isCollision(bullet, zombie)) {
                zombiesContainer.removeChild(zombie);
                zombies.splice(zindex, 1);
                gameScreen.removeChild(bullet);
                bullets.splice(bullets.indexOf(bullet), 1);
                clearInterval(bulletMove);
            }
        });

        if (parseInt(bullet.style.top) < 0) {
            gameScreen.removeChild(bullet);
            bullets.splice(bullets.indexOf(bullet), 1);
            clearInterval(bulletMove);
        }
    }, 10);
}

function isCollision(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return !(
        aRect.top > bRect.bottom ||
        aRect.bottom < bRect.top ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function spawnZombie() {
    const zombie = document.createElement('div');
    zombie.classList.add('zombie');
    zombie.style.left =
        Math.floor(Math.random() * (gameScreen.offsetWidth - 50)) + 'px';
    zombie.style.top = '0';
    zombie.style.backgroundImage = "url('zombie.png')";

    zombiesContainer.appendChild(zombie);
    zombies.push(zombie);

    const zombieMove = setInterval(() => {
        const zombieY = parseInt(zombie.style.top);
        zombie.style.top = zombieY + 2 + 'px';

        if (zombieY > gameScreen.offsetHeight) {
            zombiesContainer.removeChild(zombie);
            clearInterval(zombieMove);
        }

        if (isCollision(player, zombie)) {
            hearts--;
            heartsContainer.removeChild(heartsContainer.lastChild);
            zombiesContainer.removeChild(zombie);

            if (hearts === 0) {
                endGame();
            }
        }
    }, 10);
}

function startGame() {
    hearts = 4; // Set initial hearts to 3
    for (let i = 0; i < 2; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.backgroundImage = "url('heart.png')";
        heartsContainer.appendChild(heart);
    }

    playButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        gameStarted = true;
        zombieInterval = setInterval(spawnZombie, 2000);
    });

    document.addEventListener('mousemove', () => {
        if (!gameStarted) {
            startScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            gameStarted = true;
            zombieInterval = setInterval(spawnZombie, 2000);
        }
    });

    setInterval(movePlayer, 10);
    setInterval(moveBullets, 10);
    setInterval(moveZombies, 10);
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function moveBullets() {
    bullets.forEach((bullet) => {
        const bulletX = parseInt(bullet.style.left);
        const bulletY = parseInt(bullet.style.top);

        const angle = Math.atan2(mouseY - bulletY, mouseX - bulletX);
        const speed = 5;
        const velX = Math.cos(angle) * speed;
        const velY = Math.sin(angle) * speed;

        bullet.style.left = bulletX + velX + 'px';
        bullet.style.top = bulletY + velY + 'px';
    });
}

function moveZombies() {
    zombies.forEach((zombie) => {
        const zombieX = parseInt(zombie.style.left);
        const zombieY = parseInt(zombie.style.top);

        const angle = Math.atan2(playerY - zombieY, playerX - zombieX);
        const speed = 1;
        const velX = Math.cos(angle) * speed;
        const velY = Math.sin(angle) * speed;

        zombie.style.left = zombieX + velX + 'px';
        zombie.style.top = zombieY + velY + 'px';
    });
}

function endGame() {
    if (hearts.length === 0) {
        // Calculate final score here if needed
        endScreen.style.display = 'block';
    }
}

startGame();
