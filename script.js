const hitbox = document.getElementById("hitbox");
const statusDisplay = document.getElementById("status");
const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");
const bgMusic = document.getElementById("bgMusic");
const ball = document.getElementById("ball");
const toggleInstructions = document.getElementById("toggle-instructions");
const instructions = document.getElementById("instructions");

let isGameOver = false;
let isGameStarted = false;
let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
highscoreElement.textContent = `Récord: ${highscore}`;

let ballTop = 50;
let ballLeft = 50;
let ballDirection = 1;
let ballHorizontalSpeed = 1;
let fallSpeed = 0.3;
let speedMultiplier = 1;

function startGame() {
  if (isGameStarted) return;
  
  isGameStarted = true;
  isGameOver = false;
  score = 0;
  speedMultiplier = 1;
  fallSpeed = 0.3;
  scoreElement.textContent = `Puntuación: ${score}`;
  statusDisplay.textContent = "¡Haz clic en el balón para nominarlo!";
  
  ballTop = 50;
  ballLeft = 50;
  
  bgMusic.volume = 0.3;
  bgMusic.play().catch(e => console.log("Autoplay bloqueado:", e));
  
  moveBall();
}

function moveBall() {
  if (isGameOver) return;

  ballTop += fallSpeed * ballDirection * speedMultiplier;
  ballLeft += ballHorizontalSpeed * speedMultiplier;

  if (ballLeft <= 5 || ballLeft >= 95) {
    ballHorizontalSpeed *= -1;
  }

  hitbox.style.top = `${ballTop}%`;
  hitbox.style.left = `${ballLeft}%`;

  if (ballTop >= 92) {
    gameOver();
  } else if (ballTop <= 10) { 
    ballDirection = 1;
  }

  requestAnimationFrame(moveBall);
}

function nominateBall() {
  if (isGameOver) {
    startGame();
    return;
  }

  if (!isGameStarted) {
    startGame();
    return;
  }

  // Efecto visual
  ball.style.animation = "none";
  void ball.offsetWidth; // Trigger reflow
  ball.style.animation = "ball-pulse 0.8s infinite alternate";
  
  score++;
  scoreElement.textContent = `Puntuación: ${score}`;
  statusDisplay.textContent = "¡Nominada exitosa!";
  
  ballDirection = -1;
  speedMultiplier = 1 + score * 0.05;
  fallSpeed += 0.02;
  ballHorizontalSpeed = (Math.random() * 2 - 1) * speedMultiplier;
}

function gameOver() {
  statusDisplay.textContent = "¡Perdiste! El balón tocó el suelo.";
  isGameOver = true;
  isGameStarted = false;
  
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("highscore", highscore);
    highscoreElement.textContent = `Récord: ${highscore}`;
  }
  
  bgMusic.pause();
  bgMusic.currentTime = 0;
  
  resetBallPosition();
}

function resetBallPosition() {
  setTimeout(() => {
    ballTop = 50;
    ballLeft = 50;
    hitbox.style.top = "50%";
    hitbox.style.left = "50%";
    statusDisplay.textContent = "Haz clic en el balón para comenzar de nuevo.";
  }, 1500);
}

// Instrucciones toggle
toggleInstructions.addEventListener("click", function() {
  instructions.classList.toggle("show");
  this.textContent = instructions.classList.contains("show") ? 
    "Instrucciones ▲" : "Instrucciones ▼";
});

// Permitir música después de interacción
document.addEventListener("click", function() {
  bgMusic.play().catch(e => console.log("Autoplay bloqueado:", e));
}, { once: true });

// Soporte para móviles
hitbox.addEventListener("touchend", function(e) {
  e.preventDefault();
  nominateBall();
});