# Initial discussion — summary (2026-11-03)

How the plan was reached, in the Claude chat before moving to Claude Code.

## Layo's original request

- Always wanted to learn game design. Believes making original games starts with copying.
- Admires **Jonathan Blow** (Braid, The Witness) and **Casey Muratori** (Handmade Hero — note: written in C-style C++, not C#).
- Focus: **web-based games**, on the most performant stack that works well with coding agents.
- Skip the "learn to program first" stage; move to game design.
- Heard ECS (entity component system) is the best way to build games — wanted Claude's take.
- Wants a deep, engaging project that teaches game design and development, with Claude as orchestrator (Claude may spin up research/coding subagents).
- Aim: become a **foreman** — plan a game, then direct agents to build it.

## Claude's take on ECS

- A good tool, not a religion. Blow and Muratori push **data-oriented thinking** (know your data and what transforms it) more than ECS itself. Muratori's 2025 talk "The Big OOPs" argues for boundaries around whole systems, not individual objects.
- Why ECS fits *this* game:
  1. Rewind = save/restore state. With all state in plain component arrays, recording it is mechanical.
  2. A rewind-immune object is just a `TimeImmune` tag the Rewind system skips.
  3. Each system is a small, spec-able, testable unit — ideal for handing to agents.
- Raw performance is not the reason; a 2D puzzle-platformer won't stress the CPU.
- Decision: write our own tiny ECS first so Layo understands it; bitECS only if we outgrow it.

## Stack decision

TypeScript + Vite + PixiJS v8 + own ECS + Vitest. Rust/Bevy is faster in theory, but iteration speed matters more here; TypeScript has the most training data so agents write it best, and the type checker catches agent mistakes. Phaser 4 was the alternative (prebuilt physics/scenes, but hides what Layo wants to learn). See `research/stack.md`.

## Reference game decision

- Recommended: **Braid-like rewind puzzle-platformer** with **Celeste's movement feel**.
- Backups: Snakebird (easiest; grid + undo), Baba Is You (hardest design).
- Layo asked how Baba Is You compares to rewind. Answer: opposite kinds of hard. Rewind is a technical challenge (real-time physics, recording state, immune objects). Baba is turn-based on a grid so undo is nearly free, but the rules engine and rule combinations make puzzle design very hard.
- **Layo chose the rewind game, but wants to learn puzzle design too.** So puzzle design is woven through every phase (paper level design early, before the mechanic exists).
- Clarified "engineering": agents write the code; for Layo, engineering means deciding structure, writing clear specs, and being able to tell when an agent's work is wrong (e.g. rewind leaving the game in a slightly different state).

## Rewind implementation note

A good starting design: save only relevant state, only when it changes, plus periodic full snapshots, interpolating between them. Blow's GDC talk on Braid's implementation is the deeper reference.

## Outputs so far

- Project doc in Claude: "Rewind: Game Design & Agent Orchestration Curriculum" — https://claude.ai/artifact/JhwzHD3F3T8PZpsWx1Lu9K (copied here as `CURRICULUM.md`).
- Layo then moved to Claude Code to start Phase 0.

## Sources

- PixiJS v8 launch — https://pixijs.com/blog/pixi-v8-launches
- Phaser 4 release — https://github.com/phaserjs/phaser/releases/tag/v4.0.0
- Bevy 0.19 — https://gamefromscratch.com/bevy-0-19-released/
- Jon Blow, Truth in Game Design — https://www.gamedeveloper.com/design/video-jon-blow-on-the-truth-in-game-design-
- Recreating Braid's time mechanics — https://gamedeveloper.com/programming/recreating-the-time-mechanics-of-braid-part-1-
- Braid implementation talk (GDC Vault) — https://gdcvault.com/play/1012210/contactUs
- Celeste & TowerFall physics — https://maddymakesgames.com/articles/celeste_and_towerfall_physics
- Order of the Sinking Star — https://en.wikipedia.org/wiki/Order_of_the_Sinking_Star
- Handmade Hero — https://hero.handmade.network/
- "The Big OOPs" analysis — https://posrodnas.bearblog.dev/analysis-of-casey-muratori-the-big-oops-anatomy-of-a-thirty-five-year-mistake/
- Game Programming Patterns — https://gameprogrammingpatterns.com/sequencing-patterns.html
- Juice It or Lose It — https://gdcvault.com/play/1016487/Juice-It-or-Lose
