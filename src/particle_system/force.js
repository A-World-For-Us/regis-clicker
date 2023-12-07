import { Vec2 } from './utils';

/**
 * A constant gravity force
 */
export class GravityForce {
  constructor(g) {
    this.g = g;
  }

  applyTo(pSystem) {
    const particles = pSystem.particles;

    for (const particle of particles) {
      const mass = particle.mass;
      particle.applyForce(new Vec2(0, this.g * mass));
    }
  }
}
