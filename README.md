![Demo GIF](https://github.com/ytiurin/particleswarm/blob/master/images/demo.gif)

# Particle swarm :honeybee: [Watch in action](https://ytiurin.github.io/particleswarm/)

Particle swarm is an optimization method that iteratively improves a candidate solution with regard to a given measure of quality. Check the Wikipedia [page](https://en.wikipedia.org/wiki/Particle_swarm_optimization) for algorithm description.

## Usage
This code defines a particle swarm object, containing 10 particles with random position. 

```javascript
// Create swarm
var swarm = new Swarm;
// Configure particles movement
swarm.particleBraking = 0.997;
swarm.maxSpeed = 50;
// Set swarm target and bound 
// particles allowed position
swarm.targetPosition = new Vector( 100 / 2, 100 / 2 );
swarm.boundingRect = [ new Vector, new Vector( 100, 100 ) ];
// Set number of particles
var particlesCount = 10;
// Create particles
while ( particlesCount-- )
  swarm.addParticle(
    new Particle(
      new Vector( Math.random() * 100, Math.random() * 100 )));
// move particles 60 times per second
setInterval(function(){
  swarm.next()
}, 16);
```

## GPU acceleration
Animated elements are transformed using CSS `translate3d`/`rotate3d` properties, which is GPU accelerated in majority of modern browsers.
