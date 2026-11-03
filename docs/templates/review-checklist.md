# Review checklist: agent diffs

Use this before merging any agent's work. Claude and Layo go through it together; over time Layo runs it alone.

## Does it do what the spec says?

- [ ] Every acceptance test in the spec has a matching automated test (or a yes/no for Layo to check while playing).
- [ ] Nothing extra was built beyond the spec (scope creep is a warning sign).
- [ ] Edge cases listed in the spec are handled the way the spec decided.

## Does it follow the architecture?

- [ ] All game state is in components (plain data). No state hidden in systems, closures, module variables or Pixi objects.
- [ ] Rendering only reads components; it never changes game state.
- [ ] Input is read through actions, not raw keys or touch events.
- [ ] No `Math.random`, `Date.now()` or `performance.now()` inside the simulation.
- [ ] Feel and tuning values come from the config file, not magic numbers in code.

## Do the tests prove it?

- [ ] CI is green (typecheck + tests).
- [ ] Rewind hash tests and level solution replays still pass.
- [ ] Tests would fail if the feature broke (try reading one test: does it check the real behaviour, or just that the code runs?).
- [ ] A bug fix comes with a regression test.

## Does it play right?

- [ ] Layo played the deployed build (on a phone too, if input or layout changed).
- [ ] Notes from playing are written down as new tasks, not lost.

## Red flags

- Tests were changed or deleted to make them pass.
- Large unrelated changes in the same diff.
- "TODO" or commented-out code where the spec asked for behaviour.
