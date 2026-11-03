# Spec: Input actions

**Phase:** Phase 0 · **Status:** draft, written section by section with Layo · **Owner:** agent after approval

## Purpose

Keyboard input controls the box through named actions. The same actions can later come from gamepad and touch controls.

## Data

- **New component:** `InputActions { left: boolean, right: boolean, jump: boolean, rewind: boolean }`. The action values used in a tick live in the world as plain data, so a snapshot can restore them.
- **Components read:** `InputActions`.
- **Components written:** `Velocity` for the box; `InputActions` when sampling the keyboard at the start of a tick.
- **Config values and bindings:** to decide. The keyboard adapter observes physical keys outside the simulation and maps them to actions. It does not own game state.

## Behaviour

Layo's first decision: holding `left` or `right` steers the box. Releasing both stops it. The simulation reads named actions, never raw keys. This replaces the box's automatic movement.

To decide: simultaneous directions, key transitions, focus loss, and how unused `jump` and `rewind` actions behave in Phase 0.

## Edge cases

To decide.

## Rewind interaction

To decide. Physical keyboard state belongs to the input adapter; any game state used by the simulation must be exportable with the world.

## Acceptance tests

To decide section by section.

## Out of scope

To decide section by section.
