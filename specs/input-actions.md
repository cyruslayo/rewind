# Spec: Input actions

**Phase:** Phase 0 · **Status:** draft, written section by section with Layo · **Owner:** agent after approval

## Purpose

Keyboard input controls the box through named actions. The same actions can later come from gamepad and touch controls.

## Data

- **New component:** `InputActions { left: boolean, right: boolean, jump: boolean, rewind: boolean }`. The action values used in a tick live in the world as plain data, so a snapshot can restore them.
- **Components read:** `InputActions`.
- **Components written:** `Velocity` for the box; `InputActions` when sampling the keyboard at the start of a tick.
- **Keyboard bindings:** `ArrowLeft` and `KeyA` map to `left`; `ArrowRight` and `KeyD` map to `right`. The keyboard adapter observes physical keys outside the simulation and maps them to actions. It does not own game state.
- **Config values:** movement speed already lives in config and is the starting box speed. Other action bindings are to decide.

## Behaviour

Layo's first decision: holding `left` or `right` steers the box. Releasing both stops it. Holding both also stops it; neither direction has priority. The simulation reads named actions, never raw keys. This replaces the box's automatic movement.

At the left edge, movement clamps `Position.x` to `0` if it goes negative. This extends the box simulation because the approved ECS spec only needed a right-edge rule. Keep the right-edge overshoot wrap as approved.

To decide: key transitions when multiple keys map to one action, and how unused `jump` and `rewind` actions behave in Phase 0.

## Edge cases

- Left motion stops at `x = 0`; the origin is the chosen left boundary, not a rule about every entity's starting position.
- On focus loss, the keyboard adapter clears all held actions. The next tick samples false values and stops the box. A missed key-release event cannot leave movement stuck.
- To decide: keyboard conflicts.

## Rewind interaction

To decide. Physical keyboard state belongs to the input adapter; any game state used by the simulation must be exportable with the world.

## Acceptance tests

To decide section by section.

## Out of scope

To decide section by section.
