const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: 100, y: canvas.height - 150, width: 20, height: 40 };
let platforms = [];
let stick = { length: 0, maxLength: 400, isGrowing: false };
let score = 0;
let currentPlatformIndex = 0;

// پلیټفارم جوړول
function createPlatforms() {
    platforms = [
        { x: 100, width: 100 },
        { x: 300 + Math.random() * 200, width: 100 },
        { x: 600 + Math.random() * 200, width: 100 }
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
    ctx.fillStyle = "black";
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, canvas.height - 100, platform.width, 100);
    });
}

// لرګی رسمول
function drawStick() {
    if (stick.isGrowing || stick.length > 0) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(player.x + player.width, player.y);
        ctx.lineTo(player.x + player.width, player.y - stick.length);
        ctx.stroke();
    }
}

// نمرې رسمول
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 20, 40);
}

// لوبه رسمول
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawPlayer();
    drawStick();
    drawScore();
    requestAnimationFrame(drawGame);
}

// کلیک پېښې
canvas.addEventListener("mousedown", () => {
    stick.isGrowing = true;
});

canvas.addEventListener("mouseup", () => {
    stick.isGrowing = false;
    dropStick();
});

// لرګی اوږدول
function updateStick() {
    if (stick.isGrowing && stick.length < stick.maxLength) {
        stick.length += 5;
    }
}

// لرګی غورځول او کامیاب یا ناکام معلومول
function dropStick() {
    const targetPlatform = platforms[currentPlatformIndex + 1];

    const stickEndX = player.x + player.width + stick.length;
    const platformStartX = targetPlatform.x;
    const platformEndX = targetPlatform.x + targetPlatform.width;

    if (stickEndX >= platformStartX && stickEndX <= platformEndX) {
        score++;
        player.x = targetPlatform.x;
        currentPlatformIndex++;
        addNewPlatform();
    } else {
        alert("Game Over! Final Score: " + score);
        resetGame();
    }

    stick.length = 0;
}

// نوی پلیټفارم زیاتول
function addNewPlatform() {
    const lastPlatform = platforms[platforms.length - 1];
    const newX = lastPlatform.x + lastPlatform.width + 100 + Math.random() * 150;
    platforms.push({ x: newX, width: 100 });
}

// لوبه له سره پیلول
function resetGame() {
    player.x = 100;
    score = 0;
    currentPlatformIndex = 0;
    createPlatforms();
}

// ګیم لوپ
function gameLoop() {
    updateStick();
    requestAnimationFrame(gameLoop);
}

// لوبه پېل
drawGame();
gameLoop();
