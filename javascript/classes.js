const gravity = 0.8;
const bgVelocity = -0.2;
let pipeVelocity = -1;

class Player {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.pressed = false;
    this.position = {
      x: x,
      y: y,
    };
    this.velocity = {
      y: 0,
    };
  }

  draw() {
    canvasContext.save();
    canvasContext.drawImage(birdSprite, this.position.x, this.position.y, this.width, this.height);
    canvasContext.restore();
  }

  jump() {
    if (!localStorage.getItem("gameEnd")) {
      if (player.position.y > 25) {
        player.velocity.y = -8;
        const flapSound = new Audio("../sounds/fly.mp3");
        flapSound.play();
      }
    }
  }

  update() {
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }

    if (this.position.y < 0) this.position.y = 0;
    this.draw();
  }
}

class Background {
  constructor(x, y, width, height, valueSpawn) {
    this.width = width;
    this.height = height;
    this.valueSpawn = valueSpawn;
    this.position = {
      x: x + this.valueSpawn,
      y: y,
    };
    this.velocity = {
      x: 0,
    };
  }

  draw() {
    canvasContext.save();
    canvasContext.drawImage(bgSripte, this.position.x, this.position.y, this.width, this.height);
    canvasContext.restore();
  }

  update() {
    this.position.x += this.velocity.x;
    this.velocity.x = bgVelocity;
    this.draw();
  }
}

class Pipe {
  constructor(valueSpawn) {
    this.width = 52;
    this.height = 242;
    this.valueSpawn = valueSpawn;
    this.position = {
      x: 400 + this.valueSpawn,
      y: 0,
      y1: 0,
      y2: 378,
    };
    this.velocity = {
      x: 0,
    };
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomY() {
    this.position.y = this.getRandomNumber(-50, 75);
    this.position.y1 += this.position.y;
    this.position.y2 += this.position.y;
  }

  draw() {
    canvasContext.save();
    canvasContext.drawImage(pipeBottomSprite, this.position.x, this.position.y1 - 378, this.width, 378);
    canvasContext.drawImage(pipeTopSprite, this.position.x, this.position.y1, this.width, this.height);
    canvasContext.drawImage(pipeBottomSprite, this.position.x, this.position.y2, this.width, 378);
    canvasContext.restore();
  }

  update() {
    if (this.position.x + this.width < 0) {
      pipeVelocity -= 0.05;
      this.position.x = 600;
      this.randomY();
    }

    this.position.x += this.velocity.x;
    this.velocity.x = pipeVelocity;
    this.draw();
  }
}

class Ground {
  constructor(x) {
    this.width = 350;
    this.height = 118;
    this.position = {
      x: x,
      y: 680 - 70,
    };
    this.velocity = {
      x: 0,
    };
  }

  draw() {
    canvasContext.save();
    canvasContext.drawImage(groundSprite, this.position.x, this.position.y, this.width, this.height);
    canvasContext.restore();
  }

  update() {
    this.position.x += this.velocity.x;
    this.velocity.x = pipeVelocity;
    this.draw();
  }
}
