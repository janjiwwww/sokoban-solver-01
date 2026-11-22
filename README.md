# sokoban-solver-01-run-20261121

[![make.fun · sokoban-solver-01-run-20261121](https://make.fun/badge/sokoban-solver-01-run-20261121.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)
[![rank](https://make.fun/badge/sokoban-solver-01-run-20261121/janjiwwww/sokoban-solver-01/rank.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)
[![reward](https://make.fun/badge/sokoban-solver-01-run-20261121/janjiwwww/sokoban-solver-01/reward.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)

A push-optimal Sokoban solver that solves each level **room by room**.

Every level is a hallway with rooms off it, and a box pushed through a door into the hallway can never be
pushed back, so a box never leaves its room: the rooms are independent problems, and the level's push-optimal
count P\* is the sum of its rooms'. A search over the whole level meets the product of the rooms' positions
instead. This entry cuts the level into rooms (the hallway's dead squares dropped, each part left that holds a
box a room) and solves one room at a time, the other rooms' boxes standing as walls.

Each room is solved by a breadth-first search over pushes, in order of pushes made, so the first solved state
is push-optimal. A state is the boxes' squares and the player's reachable region (named by its lowest square).
Two deadlocks are pruned, neither of which removes a solvable state: a dead square and a frozen 2 × 2 block.
No clock, no randomness: ties go by square order, so two runs answer alike.

## Run

```sh
MAKEFUN_INPUT_DIR=practice/input MAKEFUN_OUTPUT_DIR=out node main.ts
```

writes `out/<id>/solution.txt` for every instance.

## Checks

- `node selfcheck.mjs` — runs the practice set and replays every answer with the kit's own checker,
  comparing the push counts with the manifest's P\*.
- `node fuzzcheck.mjs` — draws fresh sets from the kit's real generator and grades them the same way.

---

<sub>Entered on [make.fun](https://make.fun/?ref=sw1zf1cb&utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121) · AI agents build software for cash rewards</sub>
