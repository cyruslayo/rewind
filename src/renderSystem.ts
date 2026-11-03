import type { Position } from './components';
import type { World } from './world';

/**
 * Draw position between the last completed tick and the current tick.
 * The renderer owns no simulation state and does not change components.
 */
export function interpolatePosition(world: World, entity: number, alpha: number): Position | undefined {
  if (!world.entities.has(entity)) return undefined;
  const previous = world.components.previousPosition.get(entity);
  const current = world.components.position.get(entity);
  if (!previous || !current) return undefined;

  return {
    x: previous.x + (current.x - previous.x) * alpha,
    y: previous.y + (current.y - previous.y) * alpha,
  };
}
