import { describe, expect, it } from 'vitest';
import { config } from './config';
import { interpolatePosition } from './renderSystem';
import { runTick } from './systems';
import { World } from './world';

describe('render interpolation', () => {
  it('reads previous and current component values without changing world state', () => {
    const world = new World();
    const entity = world.createEntity();
    world.components.previousPosition.set(entity, { x: 100, y: 8 });
    world.components.position.set(entity, { x: 104, y: 12 });
    const before = world.exportWorld();

    expect(interpolatePosition(world, entity, 0.5)).toEqual({ x: 102, y: 10 });
    expect(world.exportWorld()).toEqual(before);
  });

  it('draws at the wrapped position without a streak across the edge', () => {
    const world = new World();
    const entity = world.createEntity();
    world.components.position.set(entity, { x: config.worldWidth - 1, y: 0 });
    world.components.previousPosition.set(entity, { x: config.worldWidth - 1, y: 0 });
    world.components.velocity.set(entity, { dx: 2, dy: 0 });

    runTick(world);

    expect(interpolatePosition(world, entity, 0.5)).toEqual({ x: 1, y: 0 });
    expect(interpolatePosition(world, entity + 1, 0.5)).toBeUndefined();
  });
});
