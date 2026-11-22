// selfcheck.mjs — replay the solver's answers on the practice set with the kit's own checker and
// compare each instance's pushes with the manifest's P*.
import { pathToFileURL } from "node:url";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const KIT = "D:/makefun/k_sokoban-solver-01-run-20261121/sokoban-solver-01-run-20261121-kit";
const { points } = await import(pathToFileURL(`${KIT}/program/scorer/checker/check.mjs`).href);
const manifest = JSON.parse(readFileSync(`${KIT}/practice/reference/manifest.json`, "utf8"));

// Run the entry over the practice set.
const out = "D:/makefun/sokoban-entry/out";
execFileSync(process.execPath, ["main.ts"], {
  env: { ...process.env, MAKEFUN_INPUT_DIR: `${KIT}/practice/input`, MAKEFUN_OUTPUT_DIR: out, MSYS_NO_PATHCONV: "1" },
  stdio: "inherit",
});

const idOf = (k) => "i" + String(k + 1).padStart(3, "0");
let total = 0;
let answered = 0;
manifest.instances.forEach((inst, k) => {
  const id = inst.id;
  const files = { "level.txt": readFileSync(`${KIT}/practice/reference/${id}/level.txt`, "utf8") };
  const outputs = { "solution.txt": readFileSync(join(out, id, "solution.txt"), "utf8") };
  const r = points(files, inst.key, outputs);
  total += r.points;
  if (r.valid) answered++;
  console.log(`${id}: ${Math.round(r.points * 1000)}/1000  ${r.detail}`);
});
console.log(`score ${Math.round((total / manifest.instances.length) * 1000)} / 1000000   answered ${answered}/${manifest.instances.length}`);
