import { EulerStep } from './solver';
import { Vec2, drawEmoji } from './utils';

/**
 * Particle class which lives within a particle system
 */
class Particle {
  #f = new Vec2(0, 0); // force
  constructor(mass, emoji, position, velocity) {
    if (!(position instanceof Vec2)) {
      throw 'x not instance of Vec2';
    }
    this.mass = mass;
    this.position = position;
    this.velocity = velocity;
    this.emoji = emoji;
  }

  get f() {
    return this.#f;
  }

  applyForce(f) {
    this.#f.x += f.x;
    this.#f.y += f.y;
  }

  clearForceAccumulator() {
    this.#f.x = 0;
    this.#f.y = 0;
  }

  draw(ctx) {
    drawEmoji(ctx, this.emoji, this.position.x, this.position.y);
  }
}

let id = 0;

/**
 * ParticleSystem maintains particles and forces within a system.
 */
export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.forces = [];
    this.time = undefined;
    this.id = id++;
  }

  get nparticles() {
    return this.particles.length;
  }

  get nforces() {
    return this.forces.length;
  }

  /**
   * Add particle to system
   * @param {Vec2} position
   */
  addParticle(emoji, position, initialVelocity) {
    // console.log(this.id, "add 1 particle")
    // console.log(this.particles.length)
    this.particles.push(new Particle(1, emoji, position, initialVelocity));
    // console.log(this.particles.length)
  }

  /**
   * Add force to system
   * @param {Vec2} force
   */
  addForce(force) {
    this.forces.push(force);
  }

  /**
   * Draw all the particles in the system
   * @param {CanvasContext2D} ctx
   */
  draw(ctx) {
    // console.log(this.id, "draw")
    this.particles.forEach(p => p.draw(ctx));
  }

  /**
   * Solve the particle system, which updates all the particles's position
   * @param {number} deltaTs
   */
  solve(deltaTs) {
    // Clear force accumulators on all particles
    for (const particle of this.particles) {
      particle.clearForceAccumulator();
    }

    // Apply all the forces on all the particles
    this.forces.forEach(f => {
      f.applyTo(this);
    });

    // Update particles velocity and positions given that now we know the acceleration
    // by way of force / mass: a = F / m
    this.particles.forEach(p => {
      EulerStep(p, deltaTs);

      // verify values for debugging purposes
      if (p.f.some(val => isNaN(val))) {
        throw 'Force is not a number';
      }
      if (p.velocity.some(val => isNaN(val))) {
        throw 'Velocity is not a number';
      }
      if (p.position.some(val => isNaN(val))) {
        throw 'Position is not a number';
      }
    });
  }

  cleanup() {
    // Keep 100px buffer around viewport
    this.particles = this.particles.filter(p => {
      return (
        p.position.x > -100 &&
        p.position.x < window.innerWidth + 100 &&
        p.position.y > -100 &&
        p.position.y < window.innerHeight + 100
      );
    });
  }

  destroy() {
    this.particles = [];
    this.forces = [];
  }
}
