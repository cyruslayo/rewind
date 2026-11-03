import type { Clock, Position, PreviousPosition, Velocity } from './components';

export type Entity = number;

export interface WorldSnapshot {
  entities: Entity[];
  nextEntityId: number;
  components: {
    position: [Entity, Position][];
    previousPosition: [Entity, PreviousPosition][];
    velocity: [Entity, Velocity][];
    clock: [Entity, Clock][];
  };
}

/**
 * The world owns all simulation state. Component values contain plain data.
 * Systems use the maps directly; the world does not own their execution order.
 */
export class World {
  readonly entities = new Set<Entity>();
  nextEntityId = 1;
  readonly components = {
    position: new Map<Entity, Position>(),
    previousPosition: new Map<Entity, PreviousPosition>(),
    velocity: new Map<Entity, Velocity>(),
    clock: new Map<Entity, Clock>(),
  };

  createEntity(): Entity {
    const entity = this.nextEntityId++;
    this.entities.add(entity);
    return entity;
  }

  destroyEntity(entity: Entity): void {
    this.entities.delete(entity);
    for (const store of Object.values(this.components)) {
      store.delete(entity);
    }
  }

  exportWorld(): WorldSnapshot {
    return {
      entities: [...this.entities],
      nextEntityId: this.nextEntityId,
      components: {
        position: [...this.components.position].map(([id, value]) => [id, { ...value }]),
        previousPosition: [...this.components.previousPosition].map(([id, value]) => [id, { ...value }]),
        velocity: [...this.components.velocity].map(([id, value]) => [id, { ...value }]),
        clock: [...this.components.clock].map(([id, value]) => [id, { ...value }]),
      },
    };
  }

  restoreWorld(snapshot: WorldSnapshot): void {
    this.entities.clear();
    for (const entity of snapshot.entities) this.entities.add(entity);
    this.nextEntityId = snapshot.nextEntityId;

    for (const store of Object.values(this.components)) store.clear();
    for (const [id, value] of snapshot.components.position) this.components.position.set(id, { ...value });
    for (const [id, value] of snapshot.components.previousPosition) this.components.previousPosition.set(id, { ...value });
    for (const [id, value] of snapshot.components.velocity) this.components.velocity.set(id, { ...value });
    for (const [id, value] of snapshot.components.clock) this.components.clock.set(id, { ...value });
  }
}
