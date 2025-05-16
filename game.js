const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// لوبغاړی
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;
let player = {
    x: 100,
    y: canvas.height - 160,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT
};

// لرګی
let stick = {
    length: 0,
    maxLength: 400,
    isGrowing: false,
    dropped: false
};

// پلیټفارمونه
let platforms = [];
let currentPlatform = 0;

// نمره
let score = 0;

// پلیټفارم جوړول
function createPlatforms() {
    platforms = [
        { x: 100, width: 120 },
        { x: 350, width: 120 },
        { x: 600, width: 120 }
    ];
}

createPlatforms();

// لوبغاړی رسمول
function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// پلیټفارمونه رسمول
function drawPlatforms() {
    ctx.fillStyle = "#333";
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, canvas.height - 100, platform.width, 100);
    });
}

// لرګی رسمول
function drawStick() {
    if (stick.length > 0) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(player.x + player.width, player.y);
        ctx.lineTo(player.x + player.width, player.y - stick.length);
        ctx.stroke();
    }
}

// نمره رسمول
function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

// ګیم رسمول
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawPlayer();
    drawStick();
    drawScore();
    requestAnimationFrame(drawGame);
}

// لرګی اوږدول
function updateStick() {
    if (stick.isGrowing && stick.length < stick.maxLength) {
        stick.length += 5;
    }
}

// د کلیک پېښې
canvas.addEventListener("mousedown", () => {
    stick.isGrowing = true;
});

canvas.addEventListener("mouseup", () => {
    stick.isGrowing = false;
    stick.dropped = true;
    dropStick();
});

function dropStick() {
    const nextPlatform = platforms[currentPlatform + 1];

    const stickEndX = player.x + player.width + stick.length;
    const platformStartX = nextPlatform.x;
    const platformEndX = nextPlatform.x + nextPlatform.width;

    if (stickEndX >= platformStartX && stickEndX <= platformEndX) {
        score++;
        player.x = nextPlatform.x;
        currentPlatform++;
        addNewPlatform();
    } else {
        alert("Game Over! Final Score: " + score);
        resetGame();
    }

    stick.length = 0;
    stick.dropped = false;
}

// نوی پلیټفارم زیاتول
function addNewPlatform() {
    const lastPlatform = platforms[platforms.length - 1];
    const newX = lastPlatform.x + lastPlatform.width + 100 + Math.random() * 100;
    platforms.push({ x: newX, width: 120 });
}

// لوبه له سره پېلول
function resetGame() {
    player.x = 100;
    score = 0;
    currentPlatform = 0;
    createPlatforms();
}

// ګیم لوپ
function gameLoop() {
    updateStick();
    requestAnimationFrame(gameLoop);
}

// لوبه پیلول
drawGame();
gameLoop();