import { useEffect } from 'react';

/**
 * Particle Simulations in Canvas - Part 1
 * by Carmen Cincotti, carmencincotti.com
 * March 21th, 2022
 */

import { ParticleSystem } from './particles';
import { GravityForce } from './force';
import { Vec2, clearCanvas, randomFormationEmoji } from './utils';

/**
 * Entry function that when called initializes the particle system
 * Also runs the main animation loop, thus this function never terminates
 * unless an error is thrown.
 */
export const startParticleSystem = () => {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  const particleSystem = new ParticleSystem();
  particleSystem.addForce(new GravityForce(0.000981));

  console.log('start particle system');
  const listener = event => {
    const count = event.detail.count || 1;
    for (let i = 0; i < count; i++) {
      const velocity = new Vec2(
        (Math.random() * 2 - 1) * 0.2,
        (Math.random() * 2 - 1) * 0.2 - 0.5,
      );
      particleSystem.addParticle(
        event.detail.emoji || randomFormationEmoji(),
        new Vec2(event.detail.x, event.detail.y),
        velocity,
      );
    }
  };
  window.addEventListener('new-particle', listener);

  let deltaTs = 0;
  let lastElapsedTs = 0;
  let requestId;

  // Calculate new positions, then draw frame
  const run = currentElapsedTs => {
    clearCanvas(ctx);

    // Store deltaTs, as that acts as our step time
    deltaTs = currentElapsedTs - lastElapsedTs;
    lastElapsedTs = currentElapsedTs;

    // Solve the system, then draw it.
    ctx.save();
    particleSystem.solve(deltaTs);
    particleSystem.draw(ctx);
    ctx.restore();

    // Loop back
    requestId = requestAnimationFrame(run);
  };

  const cleanupInterval = setInterval(() => {
    particleSystem.cleanup();
  }, 1000);

  requestId = requestAnimationFrame(run);

  return () => {
    console.log('cleaning up');
    particleSystem.destroy();
    clearInterval(cleanupInterval);
    window.removeEventListener('new-particle', listener);
    cancelAnimationFrame(requestId);
    clearCanvas(ctx);
  };
};

export const ParticleCanvas = () => {
  useEffect(() => {
    return startParticleSystem();
  }, []);

  return <canvas id="particles-canvas" />;
};
