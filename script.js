let ball = document.getElementById("ball");
let hitbox = document.getElementById("hitbox");
let status = document.getElementById("status");
let scoreElement = document.getElementById("score");
let highscoreElement = document.getElementById("highscore");

let isGameOver = false;
let isGameStarted = false;
let score = 0;
let highscore = 0;

let ballTop = 50;
let ballLeft = 50;
let ballDirection = 1;
let ballHorizontalSpeed = 1;
let fallSpeed = 0.3;
let speedMultiplier = 1;

// Iniciar el juego
function startGame() {
  if (isGameStarted || isGameOver) return;
  
  isGameStarted = true;
  isGameOver = false;
  score = 0;
  speedMultiplier = 1; // Reiniciar la velocidad
  scoreElement.innerText = `Puntuación: ${score}`;
  status.innerText = "Haz clic en el balón para nominarlo.";
  
  ballTop = 50;
  ballLeft = 50;
  fallSpeed = 0.3;
  moveBall();
}

// Mover la pelota
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

  if (!isGameOver) {
    setTimeout(moveBall, 15);
  }
}

// Cuando el jugador hace clic en la pelota
function nominateBall() {
  if (isGameOver) {
    startGame();
    return;
  }

  if (!isGameStarted) {
    startGame();
  }

  score++;
  scoreElement.innerText = `Puntuación: ${score}`;
  status.innerText = "¡Ball Nomination Exitosa!";

  ballDirection = -1;

  // Incremento de la velocidad según la puntuación
  speedMultiplier = 1 + score * 0.05; // Aumenta 5% con cada punto
  fallSpeed += 0.02;
  ballHorizontalSpeed = (Math.random() * 2 - 1) * speedMultiplier;
}

// Fin del juego
function gameOver() {
  status.innerText = "¡Perdiste! El balón tocó el suelo.";
  isGameOver = true;
  isGameStarted = false;

  if (score > highscore) {
    highscore = score;
    highscoreElement.innerText = `Última puntuación: ${highscore}`;
  }

  resetBallPosition();
}

// Reiniciar la pelota al centro y permitir reiniciar el juego
function resetBallPosition() {
  setTimeout(() => {
    ballTop = 50;
    ballLeft = 50;
    hitbox.style.top = "50%";
    hitbox.style.left = "50%";
    status.innerText = "Haz clic en el balón para comenzar de nuevo.";

    // Permitir reiniciar el juego
    isGameOver = false;
    isGameStarted = false;
  }, 1000);
}
