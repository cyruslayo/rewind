# Spec: Game loop

**Phase:** Phase 0 · **Status:** approved by Layo (2026-11-03) · **Owner:** agent

## Purpose

The loop makes the game run identically on every device, whether the screen is 30, 60 or 144 Hz, so that a jump that works on one device works on all of them. It also keeps the picture smooth by drawing between simulation steps.

## Data

- **Components read:** none (the loop reads no game data).
- **Components written:** `Clock { tick: number }`. The tick count is a component so rewind can restore it.
- **Not a component:** the purse (time owed). It measures real time, and rewind must never restore it. It stays in the loop driver.
- **Config values** (in the single config file): `ticksPerSecond` (60) and `maxFrameMs` (250).

## Behaviour

Each frame:

1. Work out the real time since the previous frame. Cap it at `maxFrameMs`.
2. Add that time to the purse.
3. While the purse holds at least one tick's worth of time: run one simulation tick, increase `Clock.tick` by 1, and take one tick's worth out of the purse.
4. Draw, placing things between their previous and current tick positions by the fraction left in the purse.

## Edge cases

Decided by Layo:

- **Hidden tab / long stall:** elapsed time per frame is capped at `maxFrameMs`. After a long absence the game continues as if only that much time passed (the tab acts as an automatic pause).
- **Zero or negative frame time:** treated as 0. The purse never goes below zero, and no ticks are bought on that frame.
- **Tick rate:** 60 ticks per second (`ticksPerSecond = 60`). Good for precision controls and phone memory; re-check with measurements in Phase 2.

## Rewind interaction

- `Clock.tick` is a component, so rewind saves and restores it like any other state.
- The purse (real-time bookkeeping) is not restored by rewind: rewinding the game does not rewind the real world.
- The simulation must be deterministic: same starting state and same inputs always give the same result. Therefore no simulation code may read the real clock (`Date.now()`, `performance.now()`) or `Math.random`. Only the loop driver touches real time; the simulation only knows "a tick happened".

## Acceptance tests

- [ ] Test: the same inputs give an identical tick count after 10 seconds at 30, 60 and 144 Hz (600 ticks each).
- [ ] Test: a single 10-second frame runs at most 15 ticks (`maxFrameMs` 250 ÷ 16.67 ms per tick, rounded down).
- [ ] Test: a frame with a negative elapsed time runs 0 ticks and never makes the purse negative.
- [ ] Layo's check while playing: the box moves smoothly, with no visible stuttering or jumping, on both a laptop and a phone (on the deployed link).

## Out of scope

This spec covers only time: fixed ticks, the purse, the stall cap and interpolated drawing. Not covered (each gets its own spec):

- The ECS and the box entity (components, systems, moving things).
- Reading input (the `left`, `right`, `jump`, `rewind` actions). The loop only runs the input system as part of a tick.
- The debug overlay (FPS, tick count, entity count).
- The rewind system (Phase 2).
