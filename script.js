console.log("Let The Game Begin!");

let snake = [{ top: 200, left: 200 }];
let direction = { key: "ArrowRight", dx: 20, dy: 0 };
let food = null;
let score = 0;
let highScore = 0;
let speed = 100;
window.addEventListener("keydown", (e) => {
  const newDirection = getDirection(e.key);
  console.log("Key I have Pressed", e.key);
  const allowedChange = Math.abs(direction.dx) !== Math.abs(newDirection.dx);
  if (allowedChange) direction = newDirection;
});

function getDirection(key) {
  switch (key) {
    case "ArrowUp" || "w":
      return { key, dx: 0, dy: -20 };
    case "ArrowDown" || "s":
      return { key, dx: 0, dy: 20 };
    case "ArrowLeft" || "a":
      return { key, dx: -20, dy: 0 };
    case "ArrowRight" || "d":
      return { key, dx: 20, dy: 0 };
    default:
      return direction;
  }
}

function moveSnake() {
  const head = Object.assign({}, snake[0]);
  head.top += direction.dy;
  head.left += direction.dx;
  snake.unshift(head);

  if (snake[0].top < 0) snake[0].top = 380;
  if (snake[0].left < 0) snake[0].left = 380;
  if (snake[0].top > 380) snake[0].top = 0;
  if (snake[0].left > 380) snake[0].left = 0;

  if (!eatFood()) snake.pop(); // if the snake doesn't eat food, remove the tail
}

function randomFood() {
  food = {
    top: Math.floor(Math.random() * 20) * 20,
    left: Math.floor(Math.random() * 20) * 20,
  };
}

function eatFood() {
  if (snake[0].top === food.top && snake[0].left === food.left) {
    food = null;
    return true;
  }
  return false;
}

function gameOver() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].top === snake[0].top && snake[i].left === snake[0].left)
      return true;
  }
  return false;
}

function updateScore() {
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("high-score").innerText = "High Score: " + highScore;
}

function gameLoop() {
  if (gameOver()) {
    alert("Game over!");
    // Resetting Everything
    if (score > highScore) {
      highScore = score;
    }
    score = 0;
    speed = 100;
    snake = [{ top: 200, left: 200 }];
    direction = { key: "ArrowRight", dx: 20, dy: 0 };
    food = null;
    randomFood();
  }

  setTimeout(() => {
    document.getElementById("game-board").innerHTML = "";
    moveSnake();
    if (!food) {
      randomFood();
      score += 2;
      speed = speed - 2;
    }
    if (eatFood()) {
      document.getElementById("score").innerHTML = `Score :${score}`;
    }
    updateScore();
    drawSnake();
    drawFood();
    gameLoop();
  }, speed);
}

drawSnake();
randomFood();
gameLoop();

function drawSnake() {
  snake.forEach((item, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.top = `${item.top}px`;
    snakeElement.style.left = `${item.left}px`;
    snakeElement.classList.add("snake");
    if (index === 0) snakeElement.classList.add("head");
    if (index === snake.length - 1) snakeElement.classList.add("head");
    document.getElementById("game-board").appendChild(snakeElement);
  });
}

function drawFood() {
  const foodElement = document.createElement("div");
  foodElement.style.top = `${food.top}px`;
  foodElement.style.left = `${food.left}px`;
  foodElement.classList.add("food");
  document.getElementById("game-board").appendChild(foodElement);
}