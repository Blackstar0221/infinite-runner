const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const speedEl = document.getElementById("speed");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let lane = 1; // 0 = left, 1 = middle, 2 = right
let score = 0;
let speed = 4;
let gameRunning = false;
let animationFrame;
let obstacleInterval;
let scoreInterval;
let speedInterval;
let obstacles = [];

function getLaneX(laneIndex) {
  const areaWidth = gameArea.clientWidth;
  const laneWidth = areaWidth / 3;
  const playerWidth = player.offsetWidth;
  return laneWidth * laneIndex + laneWidth / 2 - playerWidth / 2;
}

function updatePlayerPosition() {
  player.style.left = `${getLaneX(lane)}px`;
}

function moveLeft() {
  if (!gameRunning) return;
  if (lane > 0) {
    lane--;
    updatePlayerPosition();
  }
}

function moveRight() {
  if (!gameRunning) return;
  if (lane < 2) {
    lane++;
    updatePlayerPosition();
  }
}

function createObstacle() {
  if (!gameRunning) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  const obstacleLane = Math.floor(Math.random() * 3);
  obstacle.dataset.lane = obstacleLane;
  obstacle.dataset.y = -100;

  obstacle.style.left = `${getLaneX(obstacleLane)}px`;
  obstacle.style.top = "-100px";

  gameArea.appendChild(obstacle);
  obstacles.push(obstacle);
}

function isColliding(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obstacle = obstacles[i];
    let y = parseFloat(obstacle.dataset.y);
    y += speed;
    obstacle.dataset.y = y;
    obstacle.style.top = `${y}px`;

    if (isColliding(player, obstacle)) {
      endGame();
      return;
    }

    if (y > gameArea.clientHeight) {
      obstacle.remove();
      obstacles.splice(i, 1);
    }
  }
}

function gameLoop() {
  if (!gameRunning) return;
  updateObstacles();
  animationFrame = requestAnimationFrame(gameLoop);
}

function startGame() {
  clearGame();

  lane = 1;
  score = 0;
  speed = 4;
  gameRunning = true;

  scoreEl.textContent = score;
  speedEl.textContent = 1;

  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");

  updatePlayerPosition();

  obstacleInterval = setInterval(createObstacle, 900);

  scoreInterval = setInterval(() => {
    if (!gameRunning) return;
    score++;
    scoreEl.textContent = score;
  }, 300);

  speedInterval = setInterval(() => {
    if (!gameRunning) return;
    speed += 0.6;
    speedEl.textContent = Math.floor(speed - 3);
  }, 3000);

  gameLoop();
}

function endGame() {
  gameRunning = false;

  cancelAnimationFrame(animationFrame);
  clearInterval(obstacleInterval);
  clearInterval(scoreInterval);
  clearInterval(speedInterval);

  finalScoreEl.textContent = score;
  gameOverScreen.classList.remove("hidden");
}

function clearGame() {
  cancelAnimationFrame(animationFrame);
  clearInterval(obstacleInterval);
  clearInterval(scoreInterval);
  clearInterval(speedInterval);

  obstacles.forEach(obstacle => obstacle.remove());
  obstacles = [];
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key === "ArrowRight") {
    moveRight();
  }
});

leftBtn.addEventListener("click", moveLeft);
rightBtn.addEventListener("click", moveRight);
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

window.addEventListener("resize", () => {
  updatePlayerPosition();
  obstacles.forEach(obstacle => {
    const obstacleLane = parseInt(obstacle.dataset.lane, 10);
    obstacle.style.left = `${getLaneX(obstacleLane)}px`;
  });
});

updatePlayerPosition();
