/**
 * Vec2 utility class
 */
export class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  some(cb) {
    return cb(this.x) || cb(this.y);
  }

  divide(rightHand, target) {
    target.x = this.x / rightHand.x;
    target.y = this.y / rightHand.y;
  }

  add(rightHand, target) {
    target.x = this.x + rightHand.x;
    target.y = this.y + rightHand.y;
  }

  sub(rightHand, target) {
    target.x = this.x - rightHand.x;
    target.y = this.y - rightHand.y;
  }

  addScalar(scalar, target) {
    target.x = this.x + scalar;
    target.y = this.y + scalar;
  }

  multiplyScalar(scalar, target) {
    target.x = this.x * scalar;
    target.y = this.y * scalar;
  }

  divideScalar(scalar, target) {
    target.x = this.x / scalar;
    target.y = this.y / scalar;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }
}

const formationEmoji = [
  '🎓',
  '🎓',
  '🎓',
  '🎓',
  '🎓',
  '🎓',
  '🎓',
  '🎓',
  '🎓',
  '🎓',
  '📜',
  '🏅',
  '🥇',
  '🎉',
  '🚀',
];

export const randomFormationEmoji = () => {
  return formationEmoji[Math.floor(Math.random() * formationEmoji.length)];
};

/**
 * Helper function to draw circle on canvas
 * @param {Canvas2DContext} ctx
 * @param {number} x
 * @param {number} y
 */
export function drawEmoji(ctx, emoji, x, y) {
  // The size of the emoji is set with the font
  ctx.font = '2em Noto Color Emoji';
  // use these alignment properties for "better" positioning
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(emoji, x, y);
}

export const clearCanvas = ctx => {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

/**
 * Where all draw calls are done to set up canvas in animation loop
 * @param {Canvas2DContext} ctx
 */
export function unimportantCanvasDrawStuff(ctx) {
  clearCanvas(ctx);
}
