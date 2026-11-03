import { Application, Graphics } from 'pixi.js';

// Walking skeleton: proves build + deploy work. Replaced by the real loop/ECS in Phase 0.
const app = new Application();
await app.init({ resizeTo: window, background: '#1a1a2e', antialias: true });
document.body.appendChild(app.canvas);

const box = new Graphics().rect(-20, -20, 40, 40).fill('#f4a261');
app.stage.addChild(box);

app.ticker.add(() => {
  box.x = app.screen.width / 2;
  box.y = app.screen.height / 2;
  box.rotation += 0.02;
});
