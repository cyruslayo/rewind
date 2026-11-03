import { Application, Graphics } from 'pixi.js';
import { config } from './config';
import { startLoop } from './loopDriver';
import { interpolatePosition } from './renderSystem';
import { runTick } from './systems';
import { World } from './world';

const world = new World();
const clock = world.createEntity();
world.components.clock.set(clock, { tick: 0 });

const boxEntity = world.createEntity();
const initialPosition = { x: 0, y: 0 };
world.components.position.set(boxEntity, { ...initialPosition });
world.components.previousPosition.set(boxEntity, { ...initialPosition });
world.components.velocity.set(boxEntity, { dx: config.startingBoxSpeedPxPerTick, dy: 0 });

const app = new Application();
await app.init({ resizeTo: window, background: '#1a1a2e', antialias: true });
document.body.appendChild(app.canvas);

const box = new Graphics()
  .rect(-config.boxSize / 2, -config.boxSize / 2, config.boxSize, config.boxSize)
  .fill('#f4a261');
app.stage.addChild(box);

// Pixi's ticker would draw independently; the loop driver draws once per frame.
app.ticker.stop();

startLoop({
  onTick: () => runTick(world),
  onRender: (alpha) => {
    const position = interpolatePosition(world, boxEntity, alpha);
    if (position) {
      // Scale the logical world to the screen width, including on narrow phones.
      const scale = app.screen.width / config.worldWidth;
      box.scale.set(scale);
      box.x = position.x * scale;
      box.y = app.screen.height / 2 + position.y * scale;
    }
    app.render();
  },
});
