# Particle swarm :honeybee:

![Demo GIF](https://github.com/ytiurin/particleswarm/blob/master/images/demo.gif)

Particle swarm optimization method, animated in DOM w/GPU acceleration.

[Demo page](https://ytiurin.github.io/particleswarm/) is mobile friendly.

## Usage
This code defines a configured particle swarm object, adding 10 particles with random position. 

```javascript
var swarm = new Swarm;

swarm.particleBraking = 0.997;
swarm.maxSpeed = 50;

swarm.targetPosition = new Vector(100/2, 100/2);
swarm.boundingRect = [new Vector, new Vector(100, 100)];

var particlesCount = 10;

while(particlesCount--)
  swarm.addParticle(
    new Particle(
      new Vector(
        Math.random()*100,
        Math.random()*100
      )
    )
  );
```

## Definition
Particle swarm is an optimization method that iteratively improves a candidate solution with regard to a given measure of quality. Check the Wikipedia [page](https://en.wikipedia.org/wiki/Particle_swarm_optimization) for algorithm description.

## GPU acceleration
Animated elements are transformed using CSS `translate3d`/`rotate3d` properties, which is GPU accelerated in majority of modern browsers.

## LICENSE
MIT
