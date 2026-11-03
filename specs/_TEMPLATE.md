# Spec: <system or feature name>

> One page. Written or approved by Layo before an agent builds it. Delete the hints in italics.

**Phase:** _e.g. Phase 1_ · **Status:** draft / approved / built · **Owner:** _agent or person_

## Purpose

_One or two sentences: what this does for the player or the game._

## Data

- **Components read:** _e.g. `Position`, `Velocity`, `Input`_
- **Components written:** _e.g. `Position`, `Grounded`_
- **New components:** _name and fields, all plain data_
- **Config values:** _anything tunable, stored in the config file, not hardcoded_

## Behaviour

_What happens each tick, step by step. Plain language is fine._

1.
2.

## Edge cases

_What could go wrong or is ambiguous? Decide each one here, not in code._

-

## Rewind interaction

_What happens to this system's state when time is rewound? Is anything `TimeImmune`? Does it hold any state outside components? (It must not.)_

## Acceptance tests

_Each is a test an agent writes, or a yes/no Layo checks while playing._

- [ ]
- [ ]

## Out of scope

_What this spec deliberately does not cover._

-
