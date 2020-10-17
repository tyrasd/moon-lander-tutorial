function drawSpaceship() {
    context.save();
    context.beginPath();
    context.translate(spaceship.position.x, spaceship.position.y);
    context.rotate(spaceship.angle);
    context.rect(spaceship.width * -0.5, spaceship.height * -0.5, spaceship.width, spaceship.height);
    context.fillStyle = "#FEE";
    context.fill();
    context.closePath();

    if (spaceship.engineOn) {
        context.beginPath();
        context.moveTo(spaceship.width * -0.5, spaceship.height * 0.5);
        context.lineTo(spaceship.width * 0.5, spaceship.height * 0.5);
        context.lineTo(0, spaceship.width * 1.5 + Math.random() * spaceship.width);
        context.lineTo(spaceship.width * -0.5, spaceship.height * 0.5);
        context.closePath();
        context.fillStyle = "orange";
        context.fill();
    }
    context.restore();
}

function updateSpaceship() {
    spaceship.position.x += spaceship.velocity.x;
    spaceship.position.y += spaceship.velocity.y;
    if (spaceship.rotatingRight) spaceship.angle += Math.PI / 180 * 2;
    if (spaceship.rotatingLeft) spaceship.angle -= Math.PI / 180 * 2;

    if (spaceship.engineOn) {
        spaceship.velocity.x += spaceship.thrust * Math.sin(-spaceship.angle);
        spaceship.velocity.y += spaceship.thrust * Math.cos(spaceship.angle);
    }
    spaceship.velocity.y -= gravity;
}

function drawStars() {
  context.save();
  context.fillStyle = "#111"
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < stars.length; i++) {
    var star = stars[i];
    context.beginPath();
    context.arc(star.x * canvas.width, star.y * canvas.height, star.radius, 0, 2*Math.PI);
    context.closePath();
    context.fillStyle = "rgba(255, 255, 255, " + star.alpha + ")";
    if (star.decreasing == true) {
      star.alpha -= star.dRatio;
      if (star.alpha < 0.1) star.decreasing = false;
    } else {
      star.alpha += star.dRatio;
      if (star.alpha > 0.95) star.decreasing = true;
    }
    context.fill();
  }
  context.restore();
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();
  updateSpaceship();
  drawSpaceship();

  requestAnimationFrame(draw);
}

function keyLetGo(event) {
  if (event.keyCode==37) spaceship.rotatingLeft = false;
  if (event.keyCode==39) spaceship.rotatingRight = false;
  if (event.keyCode==38) spaceship.engineOn = false;
}


function keyPressed(event) {
  if (event.keyCode==37) spaceship.rotatingLeft = true;
  if (event.keyCode==39) spaceship.rotatingRight = true;
  if (event.keyCode==38) spaceship.engineOn = true;
}

document.addEventListener('keyup', keyLetGo);
document.addEventListener('keydown', keyPressed);

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var spaceship = {
  color: "white",
  width: 0.05 * canvas.width,
  height: 0.1 * canvas.width,
  thrust: -0.1,
  position: { x: 50, y: 50 },
  velocity: { x: 0.2, y: -1 },
  angle: 0,
  engineOn: false,
  rotatingLeft: false,
  rotatingRight: false,
  crashed: false
}
var gravity = -0.03;
var stars = [];

for (var i = 0; i < 500; i++) {
  stars[i] = {
    x: Math.random(),
    y: Math.random(),
    radius: Math.sqrt(Math.random() * 2),
    alpha: 1.0,
    decreasing: true,
    dRatio: Math.random() * 0.05
  };
}

draw();


window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);

function resizeGame() {
  var gameArea = document.getElementById('gameArea');
  var widthToHeight = 4 / 3;
  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight;
  var newWidthToHeight = newWidth / newHeight;

  if (newWidthToHeight > widthToHeight) {
    newWidth = newHeight * widthToHeight;
    gameArea.style.height = newHeight + 'px';
    gameArea.style.width = newWidth + 'px';
  } else {
    newHeight = newWidth / widthToHeight;
    gameArea.style.width = newWidth + 'px';
    gameArea.style.height = newHeight + 'px';
  }

  gameArea.style.marginTop = (-newHeight / 2) + 'px';
  gameArea.style.marginLeft = (-newWidth / 2) + 'px';

  var gameCanvas = document.getElementById('gameCanvas');
  gameCanvas.width = newWidth;
  gameCanvas.height = newHeight;

  spaceship['width'] = 0.05 * canvas.width;
  spaceship['height'] = spaceship['width'] * 2;
}
