console.log("Let The Game Begin!");

let snake = [{ top: 200, left: 200 }];
let direction = { key: "ArrowRight", dx: 20, dy: 0 };
let food = null;
let score = 0;
let highScore = 0;
let speed = 100;
let gameOverState = false; // Flag to track game over state

// Get the game board element for relative positioning
const gameBoard = document.getElementById("game-board");

window.addEventListener("keydown", (e) => {
  if (!gameOverState) { // Only allow movement if the game is not over
    const newDirection = getDirection(e.key);
    console.log("Key I have Pressed", e.key);
    const allowedChange = Math.abs(direction.dx) !== Math.abs(newDirection.dx);
    if (allowedChange) direction = newDirection;
  }
});

function getDirection(key) {
  switch (key) {
    case "ArrowUp":
    case "w":
      return { key, dx: 0, dy: -20 };
    case "ArrowDown":
    case "s":
      return { key, dx: 0, dy: 20 };
    case "ArrowLeft":
    case "a":
      return { key, dx: -20, dy: 0 };
    case "ArrowRight":
    case "d":
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

  // Wrap snake around the screen
  const boardWidth = gameBoard.offsetWidth; // Get dynamic width of the game board
  const boardHeight = gameBoard.offsetHeight; // Get dynamic height of the game board
  if (snake[0].top < 0) snake[0].top = boardHeight - 20; // Adjust for snake segment size
  if (snake[0].left < 0) snake[0].left = boardWidth - 20; 
  if (snake[0].top >= boardHeight) snake[0].top = 0;
  if (snake[0].left >= boardWidth) snake[0].left = 0;

  if (!eatFood()) snake.pop(); // if the snake doesn't eat food, remove the tail
}

function randomFood() {
  const boardWidth = gameBoard.offsetWidth; // Get dynamic width of the game board
  const boardHeight = gameBoard.offsetHeight; // Get dynamic height of the game board

  // Ensure food doesn't spawn on top of the snake
  do {
    food = {
      top: Math.floor(Math.random() * (boardHeight / 20)) * 20,
      left: Math.floor(Math.random() * (boardWidth / 20)) * 20
    };
  } while (snake.some(segment => segment.top === food.top && segment.left === food.left));
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

function resetGame() {
  gameOverState = false;
  if (score > highScore) {
    highScore = score;
  }
  score = 0;
  speed = 100;
  snake = [{ top: 200, left: 200 }];
  direction = { key: "ArrowRight", dx: 20, dy: 0 };
  food = null;
  randomFood();
  updateScore(); // Update score display after resetting
  gameLoop(); // Restart the game loop
}


function updateScore() {
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("high-score").innerText = "High Score: " + highScore;
}

function gameLoop() {
  if (gameOver()) {
    gameOverState = true; // Set game over state to true
    alert("Game over!");
    resetGame(); // Reset the game
    return; // Stop the current game loop
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
