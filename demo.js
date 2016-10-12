/**
 *  Particle swarm method, animated in DOM w/GPU acceleration.
 *  https://github.com/ytiurin/particleswarm
 */

var container = document.getElementById('particle-container');
var containerRect = container.getBoundingClientRect();

// CREATE SWARM
var swarm = new Swarm;

swarm.targetPosition = new Vector(
  containerRect.width / 2,
  containerRect.height / 2
);

swarm.particleBraking = 0.997;
swarm.maxSpeed = 50;

swarm.boundingRect = [
  new Vector,
  new Vector(
    containerRect.width,
    containerRect.height
  )
];

// CREATE PARTICLES
var elements=[];

var i = 100;

var l = 1;

var an = 0;

function addParticle()
{
  var style=document.createAttribute('style');

  style.value = `
position:absolute;
left:0px;
top:0px;
width:80px;
height:80px;
background-image:url(./images/`+(l++)+`.png);
background-position: 50% 50%;
background-repeat: no-repeat;
`;

  l = l>12 ? 1 : l;

  var el = document.createElement("div");
  el.attributes.setNamedItem(style);

  container.appendChild(el);

  elements.push(el);

  swarm.addParticle(
    new Particle(
      new Vector(
        Math.random()*containerRect.width,
        Math.random()*containerRect.height
      )
    )
  );
}

while(i--)
  addParticle();

// DRAW ANIMATION
var pauseAnimation=false;

function drawNextFrame()
{
  requestAnimationFrame(function(){
    var particle, i=0, rotateAngle;
    while(particle = swarm.particles[i++])
      elements[i-1].style.transform = "translate3d("+parseInt(particle.position.x-40)+"px,"+parseInt(particle.position.y-40)+"px,0) rotate3d(0,0,1,"+particle.angle+"rad)";

    fps++;

    !pauseAnimation&&
      drawNextFrame();
  });
}

drawNextFrame();

// LOOP ANIMATION
var intervalId;

function startAnimation()
{
  intervalId = setInterval(function(){
    if(mouseX&&mouseY)
      swarm.targetPosition = new Vector(mouseX, mouseY)

    swarm.next();
  }, 16);
}

startAnimation();


// PAUSE/SHUFFLE BUTTONS
var pauseButton = document.getElementById('stop');

pauseButton.addEventListener('click',function(){
  if(pauseAnimation = !pauseAnimation){
    clearInterval(intervalId);
    pauseButton.innerHTML = 'Resume';
  }
  else{
    startAnimation();
    drawNextFrame();
    pauseButton.innerHTML = 'Pause';
  }
});

document.getElementById('shuffle').addEventListener('click',function(){
  var particle, i=0;

  while(particle = swarm.particles[i++]){
    particle.position.x = Math.random()*containerRect.width;
    particle.position.y = Math.random()*containerRect.height;
  }

  mouseX = containerRect.width / 2;
  mouseY = containerRect.height / 2;

  pauseAnimation&&
    drawNextFrame();
});


// MANAGE TOUCH AND MOUSE EVENTS
var mouseX=0,mouseY=0;

function touchStart(e)
{
  e.preventDefault();
  mouseX = e.clientX || (e.touches&&e.touches[0].clientX) || 0;
  mouseY = e.clientY || (e.touches&&e.touches[0].clientY) || 0;
  swarm.particleBraking = 0.99;
}

container.addEventListener('mousedown',touchStart);
container.addEventListener('touchstart',touchStart);

function touchMove(e)
{
  e.preventDefault();
  mouseX = e.clientX || (e.touches&&e.touches[0].clientX) || 0;
  mouseY = e.clientY || (e.touches&&e.touches[0].clientY) || 0;
}

container.addEventListener('mousemove',touchMove);
container.addEventListener('touchmove',touchMove);

function touchEnd(e)
{
  e.preventDefault();
  swarm.particleBraking = 0.997;
  swarm.explode(20, 400);
}

container.addEventListener('mouseup',touchEnd);
container.addEventListener('touchend',touchEnd);

// COUNT FPS
var fps = 0;
var fpsEl = document.getElementById('fps');

setInterval(function(){
  fpsEl.innerHTML = fps+"FPS";

  fps = 0;
}, 1000);


// PARTICLES NUMBER
document.getElementById('count').addEventListener('change', function(e){
  var countDiff = swarm.particles.length - e.target.valueAsNumber;
  var absCountDiff = Math.abs(countDiff);

  if(countDiff === absCountDiff){
    while(absCountDiff--){
      swarm.particles.pop();
      var el = elements.pop(el);
      container.removeChild(el);
    }
  }
  else{
    while(absCountDiff--)
      addParticle();
  }
});
