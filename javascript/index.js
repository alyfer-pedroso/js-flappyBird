const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

const birdSprite = new Image();
const bgSripte = new Image();
const pipeTopSprite = new Image();
const pipeBottomSprite = new Image();
const groundSprite = new Image();
birdSprite.src = "./assets/bird.png";
bgSripte.src = "../assets/bg.png";
pipeTopSprite.src = "../assets/canocima.png";
pipeBottomSprite.src = "../assets/canobaixo.png";
groundSprite.src = "../assets/chao.png";

const scoreAudio = new Audio("../sounds/score.mp3");

let fps = 60;
let gameTick;
let gameEnd = false;
let score = 0;

let player = new Player(150, 30, 38, 26);
let backgrounds = [new Background(0, 0, canvas.width, canvas.height, 0), new Background(0, 0, canvas.width, canvas.height, 350)];
let pipes = [new Pipe(0), new Pipe(200), new Pipe(400)];
let grounds = [new Ground(0), new Ground(350)];

const createRect = (color, x, y, width, height, alpha) => {
  canvasContext.globalAlpha = alpha ? alpha : 1;
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
};

const setControllers = () => {
  addEventListener("keydown", (e) => {
    switch (e.key.toLowerCase()) {
      case "w":
        if (!player.pressed) player.jump();
        player.pressed = true;
        break;
      case " ":
        if (!player.pressed) player.jump();
        player.pressed = true;
        break;
      case "arrowup":
        if (!player.pressed) player.jump();
        player.pressed = true;
        break;
    }
  });

  addEventListener("keyup", (e) => {
    switch (e.key.toLowerCase()) {
      case "w":
        player.pressed = false;
        break;
      case " ":
        player.pressed = false;
        break;
      case "arrowup":
        player.pressed = false;
        break;
    }
  });

  if (window.screen.width < 900) {
    addEventListener("touchstart", (e) => {
      if (!player.pressed) player.jump();
      player.pressed = true;
    });

    addEventListener("touchend", (e) => {
      player.pressed = false;
    });
  }
};

const gameOver = () => {
  player.canDraw = false;

  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  createRect("black", 0, 0, canvas.width, canvas.height, 1);

  localStorage.setItem("gameEnd", true);
  if (score > JSON.parse(localStorage.getItem("score"))) localStorage.setItem("score", score);
  drawScore();
  drawHighScore(localStorage.getItem("score"));

  canvasContext.font = "30px Emulogic";
  canvasContext.fillStyle = "red";
  canvasContext.fillText("Game Over", 40, canvas.height / 2);

  clearInterval(gameTick);
  setTimeout(() => location.reload(), 2000);
};

const drawScore = () => {
  if (player.canDraw) {
    canvasContext.font = "35px Emulogic";
    canvasContext.fillStyle = "yellow";
    canvasContext.fillText(`${score}`, canvas.width / 2 - 20, 40);
  }
};

const drawHighScore = (score) => {
  canvasContext.font = "20px Emulogic";
  canvasContext.fillStyle = "orange";
  canvasContext.fillText(`HIGHSCORE: ${score}`, 50, canvas.height / 2 - 80);
};

const start = () => {
  score = 0;
  localStorage.removeItem("gameEnd");
  pipes.forEach((pipe) => {
    pipe.randomY();
  });
  setControllers();
};

const update = () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  createRect("lightblue", 0, 0, canvas.width, canvas.height);

  backgrounds.forEach((background) => {
    if (player.canDraw) background.update();
  });
  if (backgrounds[0].position.x + backgrounds[0].width < 0) backgrounds[0].position.x = 349;
  if (backgrounds[1].position.x + backgrounds[1].width < 1) backgrounds[1].position.x = 349;

  pipes.forEach((pipe) => {
    if (player.canDraw) pipe.update();
    if (Math.round(pipe.position.x + pipe.width) === player.position.x) {
      scoreAudio.play();
      score += 1;
    }
    if (
      (player.position.y <= pipe.height + pipe.position.y1 &&
        player.position.x + player.width >= pipe.position.x &&
        player.position.x <= pipe.position.x + pipe.width) ||
      (player.position.y + player.height >= pipe.position.y2 &&
        player.position.x + player.width >= pipe.position.x &&
        player.position.x <= pipe.position.x + pipe.width)
    ) {
      gameOver();
    }
  });

  grounds.forEach((ground) => {
    if (player.canDraw) ground.update();
    if (player.position.y + player.height >= ground.position.y) gameOver();
  });
  if (grounds[0].position.x + grounds[0].width < 0) grounds[0].position.x = 349;
  if (grounds[1].position.x + grounds[1].width < 1) grounds[1].position.x = 349;

  player.update();
  drawScore();
};

start();
gameTick = setInterval(update, 1000 / fps);
