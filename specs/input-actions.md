# Spec: Input actions

**Phase:** Phase 0 · **Status:** draft, written section by section with Layo · **Owner:** agent after approval

## Purpose

Keyboard input controls the box through named actions. The same actions can later come from gamepad and touch controls.

## Data

To decide: where action values live during a simulation tick; which components the input system reads and writes; keyboard bindings; configuration.

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
