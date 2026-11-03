import { describe, expect, it } from 'vitest';
import { World } from './world';

describe('World', () => {
  it('restores every component, entity and the next ID without sharing values', () => {
    const world = new World();
    const box = world.createEntity();
    const clock = world.createEntity();
    world.components.position.set(box, { x: 100, y: 20 });
    world.components.previousPosition.set(box, { x: 96, y: 20 });
    world.components.velocity.set(box, { dx: 4, dy: 0 });
    world.components.clock.set(clock, { tick: 7 });

    const snapshot = world.exportWorld();
    world.components.position.get(box)!.x = 999;
    expect(snapshot.components.position[0]?.[1].x).toBe(100);

    const later = world.createEntity();
    world.components.position.set(later, { x: 10, y: 10 });
    world.destroyEntity(box);
    world.components.clock.get(clock)!.tick = 8;

    world.restoreWorld(snapshot);
    expect(world.exportWorld()).toEqual(snapshot);
    expect(world.entities.has(box)).toBe(true);
    expect(world.entities.has(later)).toBe(false);
    expect(world.createEntity()).toBe(later);

    world.components.position.get(box)!.x = 123;
    expect(snapshot.components.position[0]?.[1].x).toBe(100);
  });

  it('deletes all components when an entity is destroyed', () => {
    const world = new World();
    const entity = world.createEntity();
    world.components.position.set(entity, { x: 0, y: 0 });
    world.components.previousPosition.set(entity, { x: 0, y: 0 });
    world.components.velocity.set(entity, { dx: 1, dy: 0 });
    world.components.clock.set(entity, { tick: 0 });
    world.destroyEntity(entity);

    expect(world.entities.has(entity)).toBe(false);
    for (const store of Object.values(world.components)) {
      expect(store.has(entity)).toBe(false);
    }
  });
});
