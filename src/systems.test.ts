import { describe, expect, it } from 'vitest';
import { COINS_PER_SECOND, config } from './config';
import { advance } from './loop';
import { runTick, tickSystems } from './systems';
import { World } from './world';

function makeWorld(x = 100, dx = 4): { world: World; box: number } {
  const world = new World();
  const clock = world.createEntity();
  world.components.clock.set(clock, { tick: 0 });
  const box = world.createEntity();
  world.components.position.set(box, { x, y: 20 });
  world.components.previousPosition.set(box, { x, y: 20 });
  world.components.velocity.set(box, { dx, dy: 0 });
  return { world, box };
}

describe('ordered simulation systems', () => {
  it('runs Clock, save-previous, movement, and wrap in that order', () => {
    expect(tickSystems.map((system) => system.name)).toEqual([
      'advanceClock', 'savePrevious', 'move', 'wrap',
    ]);
    const { world, box } = makeWorld();
    runTick(world);
    expect(world.components.clock.get(1)?.tick).toBe(1);
    expect(world.components.previousPosition.get(box)).toEqual({ x: 100, y: 20 });
    expect(world.components.position.get(box)).toEqual({ x: 104, y: 20 });
  });

  it('keeps overshoot and resets previous position on the right edge', () => {
    const { world, box } = makeWorld(config.worldWidth - 2, 4);
    runTick(world);
    expect(world.components.position.get(box)?.x).toBe(2);
    expect(world.components.previousPosition.get(box)?.x).toBe(2);
  });

  it('leaves an entity without Velocity still, without an error', () => {
    const { world } = makeWorld();
    const still = world.createEntity();
    world.components.position.set(still, { x: 12, y: 34 });
    world.components.previousPosition.set(still, { x: 12, y: 34 });
    expect(() => runTick(world)).not.toThrow();
    expect(world.components.position.get(still)).toEqual({ x: 12, y: 34 });
    expect(world.components.previousPosition.get(still)).toEqual({ x: 12, y: 34 });
  });

  it.each([30, 60, 144])('ends at the same entire world after ten seconds at %i Hz', (framesPerSecond) => {
    const { world } = makeWorld(0, config.startingBoxSpeedPxPerTick);
    let purse = { coins: 0, ticks: 0 };
    for (let frame = 0; frame < 10 * framesPerSecond; frame++) {
      const frameCoins = COINS_PER_SECOND / framesPerSecond;
      const result = advance(purse, frameCoins);
      purse = result.purse;
      for (let tick = 0; tick < result.ticksToRun; tick++) runTick(world);
    }
    expect(world.components.clock.get(1)?.tick).toBe(600);
    expect(world.exportWorld()).toEqual(expectedWorldAfter600Ticks());
  });
});

function expectedWorldAfter600Ticks() {
  const { world } = makeWorld(0, config.startingBoxSpeedPxPerTick);
  for (let tick = 0; tick < 600; tick++) runTick(world);
  return world.exportWorld();
}
