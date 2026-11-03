# Research: reference games & design resources (Nov 2026)

Gathered by a research subagent on 2026-11-03. Difficulty ratings are estimates.

## Jonathan Blow's design philosophy
- Games are systems that reveal truths about their rules; observe what the system produces rather than forcing outcomes ("Truth in Game Design", GDC Europe 2011). https://www.gamedeveloper.com/design/video-jon-blow-on-the-truth-in-game-design-
- Many of Braid's best ideas came during development: ask "what if the player can reverse time?" and watch what emerges.
- Braid: puzzles mostly skippable, no fixed difficulty curve; story told via text. https://en.wikipedia.org/wiki/Braid_(video_game)
- Rewind implementation starting point: save only relevant state, only when it changes, periodic full snapshots, interpolate. https://gamedeveloper.com/programming/recreating-the-time-mechanics-of-braid-part-1-
- GDC talk on Braid's implementation: https://gdcvault.com/play/1012210/contactUs

## Casey Muratori
- Handmade Hero: build a professional-quality game from scratch on video; started Nov 2014. https://hero.handmade.network/
- "The Big OOPs" (2025): encapsulate at system/module level, not object level; draw boundaries by what data each system needs. Summary: https://posrodnas.bearblog.dev/analysis-of-casey-muratori-the-big-oops-anatomy-of-a-thirty-five-year-mistake/

## Candidate reference games
| Game | Core mechanic | Learning value | Difficulty |
|---|---|---|---|
| Braid | Rewind; some objects time-immune | State history, per-world rules | Med-high |
| Celeste | 8-way dash, climb, jump | Movement feel, coyote time, buffering | Medium |
| Baba Is You | Rules are pushable tiles | Data-driven rules engine | Med-high |
| Snakebird | Snake segments, push, gravity | Grid logic, undo | Low-med |
| Stephen's Sausage Roll | Grid sausage rolling | Grid puzzles | Medium |
| Super Meat Boy | Precise platforming, instant restart | Collision, restart loops | Medium |
| Fez | Rotate world to reveal paths | Perspective logic | Med-high |
| Superhot | Time moves when you move | Simpler time mechanic | Low-med |
| Order of the Sinking Star (Blow, Oct 8 2026) | Sokoban-style, mechanics combine across realms | How Blow layers mechanics | Med-high |

Chosen: Braid core + Celeste feel.

## Design resources
- Game Programming Patterns (Nystrom, free) — https://gameprogrammingpatterns.com/sequencing-patterns.html
- Celeste & TowerFall physics (Thorson) — integer AABB, sub-pixel remainders — https://maddymakesgames.com/articles/celeste_and_towerfall_physics
- Celeste forgiveness: coyote time, corner correction — https://blizzardwatch.com/2020/03/13/celeste-developer-game-feel/
- Juice It or Lose It (GDC) — https://gdcvault.com/play/1016487/Juice-It-or-Lose
- Game Maker's Toolkit, "How Jonathan Blow Designs a Puzzle"
- MDA framework paper (Hunicke, LeBlanc, Zubek 2004) — https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/
- Raph Koster, *A Theory of Fun*; Jesse Schell, *The Art of Game Design*
