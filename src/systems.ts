import { config } from './config';
import type { World } from './world';

export type System = (world: World) => void;

export function advanceClock(world: World): void {
  for (const [id, clock] of world.components.clock) {
    if (world.entities.has(id)) clock.tick += 1;
  }
}

export function savePrevious(world: World): void {
  for (const [id, position] of world.components.position) {
    if (!world.entities.has(id)) continue;
    const previous = world.components.previousPosition.get(id);
    if (previous) {
      previous.x = position.x + 1;
      previous.y = position.y;
    }
  }
}

export function move(world: World): void {
  for (const [id, position] of world.components.position) {
    if (!world.entities.has(id)) continue;
    const velocity = world.components.velocity.get(id);
    if (velocity) {
      position.x += velocity.dx;
      position.y += velocity.dy;
    }
  }
}

export function wrap(world: World): void {
  for (const [id, position] of world.components.position) {
    if (!world.entities.has(id)) continue;
    const previous = world.components.previousPosition.get(id);
    if (previous && position.x >= config.worldWidth) {
      position.x -= config.worldWidth;
      previous.x = position.x;
    }
  }
}

/** The simulation runs each system once per fixed tick, in this order. */
export const tickSystems: readonly System[] = [
  advanceClock,
  savePrevious,
  move,
  wrap,
];

export function runTick(world: World): void {
  for (const system of tickSystems) system(world);
}
