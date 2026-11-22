// fuzzcheck.mjs — draw fresh instances from the real generator (many seeds) and run the entry on each,
// grading with the kit's checker, so the room decomposition and the search are proven on unseen levels.
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const KIT = "D:/makefun/k_sokoban-solver-01-run-20261121/sokoban-solver-01-run-20261121-kit";
const { points } = await import(pathToFileURL(`${KIT}/program/scorer/checker/check.mjs`).href);
const { generate } = await import(pathToFileURL(`${KIT}/program/generator/subject/generate.mjs`).href);
const { streamFor } = await import(pathToFileURL(`${KIT}/program/generator/rng.ts`).href);

const root = "D:/makefun/sokoban-entry/fuzz";
rmSync(root, { recursive: true, force: true });

let sets = 0;
let perfect = 0;
let scoreSum = 0;
for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
  const inputDir = join(root, `s${seed}`, "input");
  mkdirSync(inputDir, { recursive: true });
  const drawn = [];
  for (let i = 0; i < 5; i++) {
    const rng = streamFor(createHash("sha256").update(`fuzz-${seed}`).digest("hex"), "instance", i);
    const inst = generate(rng, i);
    const id = "i" + String(i + 1).padStart(3, "0");
    mkdirSync(join(inputDir, id), { recursive: true });
    writeFileSync(join(inputDir, id, "level.txt"), inst.files["level.txt"]);
    drawn.push({ id, key: inst.key });
  }
  const outDir = join(root, `s${seed}`, "out");
  execFileSync(process.execPath, ["main.ts"], {
    env: { ...process.env, MAKEFUN_INPUT_DIR: inputDir, MAKEFUN_OUTPUT_DIR: outDir, MSYS_NO_PATHCONV: "1" },
    stdio: "inherit",
  });
  let total = 0;
  let answered = 0;
  for (const d of drawn) {
    const files = { "level.txt": readFileSync(join(inputDir, d.id, "level.txt"), "utf8") };
    const outputs = { "solution.txt": readFileSync(join(outDir, d.id, "solution.txt"), "utf8") };
    const r = points(files, d.key, outputs);
    total += r.points;
    if (r.valid) answered++;
    if (r.points !== 1000) console.log(`  seed ${seed} ${d.id}: ${r.detail} (P* ${d.key.pushes})`);
  }
  const score = Math.round((total / drawn.length) * 1000);
  sets++;
  scoreSum += score;
  if (score === 1_000_000 && answered === 5) perfect++;
  console.log(`seed ${seed}: score ${score} answered ${answered}/5`);
}
console.log(`${perfect}/${sets} sets perfect; mean score ${Math.round(scoreSum / sets)}`);
