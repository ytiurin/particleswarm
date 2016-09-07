/** Particle swarm optimization method.
 *  Copyright (C) 2016 Eugene Tiurin (yevhentiurin@gmail.com)
 *  https://github.com/ytiurin/particleswarm
 *
 *  Released under the MIT license
 *  https://github.com/ytiurin/particleswarm/blob/master/LICENSE
 */

'use strict';

function finalVector(a,b)
{
  var finalVector = new Vector;

  for(var n in a)
    finalVector[n] = a[n] - b[n];

  return finalVector;
}

function newVectorLength(a, length)
{
  var newVector = new Vector;
  var changeRatio = distance(new Vector, a) / length;

  for(var n in a)
    newVector[n] = a[n] / changeRatio;

  return newVector;
}

function angle(a,b)
{
  var v1=0, va=0, vb=0;

  for(var n in a){
    v1 += a[n] * b[n];

    va += Math.pow(a[n], 2);
    vb += Math.pow(b[n], 2);
  }

  return Math.acos(v1 / (Math.sqrt(va) * Math.sqrt(vb)));
}

function absAngle(a)
{
  var acos = angle(new Vector(1,0), a);

  if(a.y<0)
    acos=acos*-1;

  return acos;
}

function distance(a,b)
{
  var distance=0;

  for(var n in a)
    distance += Math.pow(Math.abs(a[n] - b[n]), 2);

  return Math.sqrt(distance);
}

function closest(target, a, b)
{
  if(!a)
    return b;

  if(!b)
    return a;

  var distanceDiff = distance(target, a) - distance(target, b);

  if(distanceDiff > 0)
    return b;

  return a;
}

function Vector(initX,initY)
{
  this.x = initX||0;
  this.y = initY||0;
}

function Particle(initPosition)
{
  this.position = initPosition;

  this.globalBestPosition = new Vector;
  this.localBestPosition = this.position;

  this.braking = 1;

  this.maxSpeed;

  this.boundingRect;

  var localWeight = 0.001;
  var globalWeight = 0.001;

  var velocity = new Vector;

  // NEXT
  this.next = function(){

    var oldPosition = new Vector(
      this.position.x,
      this.position.y
    );

    this.localBestPosition = closest(
      this.globalBestPosition,
      this.localBestPosition,
      this.position);

    for(var n in velocity){

      var

      w = this.braking,
      v = velocity[n],
      up = localWeight,
      rp = Math.random(),
      p = this.localBestPosition[n],
      x = this.position[n],
      ug = globalWeight,
      rg = Math.random(),
      g = this.globalBestPosition[n];

      v = w * v + up * rp * (p - x) + ug * rg * (g - x);

      velocity[n] = v;
      this.position[n] += velocity[n];


      if(this.boundingRect){
        if(this.position[n] < this.boundingRect[0][n] ||
          this.position[n] >= this.boundingRect[1][n])

          velocity[n] = velocity[n]*-1;
      }
    }

    if(this.maxSpeed && distance(new Vector, velocity)>this.maxSpeed)
      velocity = newVectorLength(velocity, this.maxSpeed);

    this.angle = absAngle(velocity);
  }

  this.accelerateFrom = function(from, veloc, radius){
    veloc = veloc * (1-(Math.min(distance(from, this.position),radius)/radius));
    if(veloc > 0)
      velocity = newVectorLength(finalVector(this.position,from), veloc);
  }
}

function Swarm()
{
  this.particles = [];

  this.particleBraking = 1;

  this.maxSpeed;

  this.targetPosition = new Vector;

  this.boundingRect;

  var globalBestPosition;

  this.addParticle=function(particle){
    this.particles.push(particle);
  }

  this.explode=function(distance, radius){
    var particle, i=0;

    while(particle = this.particles[i++])
      particle.accelerateFrom(this.targetPosition, distance, radius);
  }

  this.next=function(){
    var particle,i=0;

    var oldGlobalBestPosition = globalBestPosition;

    while(particle = this.particles[i++])
      globalBestPosition = closest(
        this.targetPosition,
        globalBestPosition,
        particle.position);

    i = 0;

    while(particle = this.particles[i++]){
      particle.globalBestPosition = globalBestPosition;
      particle.braking = this.particleBraking;
      particle.maxSpeed = this.maxSpeed;
      particle.boundingRect = this.boundingRect;

      particle.next();
    }
  }
}
