import { Application, Graphics } from 'pixi.js';
import type { Clock } from './components';
import { startLoop } from './loopDriver';

// TEMPORARY: replaced by the ECS + box spec.
// Throwaway demo: plain-object state, one box that wraps across the screen.

/** Box speed in pixels per tick. */
const BOX_SPEED_PX_PER_TICK = 4;
const BOX_SIZE = 40;

const state = {
  clock: { tick: 0 } as Clock,
  prevX: 0,
  x: 0,
};

const app = new Application();
await app.init({ resizeTo: window, background: '#1a1a2e', antialias: true });
document.body.appendChild(app.canvas);

const box = new Graphics().rect(-BOX_SIZE / 2, -BOX_SIZE / 2, BOX_SIZE, BOX_SIZE).fill('#f4a261');
app.stage.addChild(box);

// Pixi's own ticker would draw on its own schedule; our loop driver draws instead.
app.ticker.stop();

function onTick(): void {
  state.prevX = state.x;
  state.x += BOX_SPEED_PX_PER_TICK;
  if (state.x > app.screen.width + BOX_SIZE) {
    // Wrap: move both so interpolation does not smear across the screen.
    state.x = -BOX_SIZE;
    state.prevX = -BOX_SIZE;
  }
  state.clock.tick += 1;
}

function onRender(alpha: number): void {
  box.x = state.prevX + (state.x - state.prevX) * alpha;
  box.y = app.screen.height / 2;
  app.render();
}

startLoop({ onTick, onRender });
