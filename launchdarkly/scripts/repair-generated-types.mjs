import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const repairs = [
  {
    path: "types/components/schemas/InsightsMetricScore.ts",
    find: 'import type { InsightsMetricScore } from "./InsightsMetricScore.js";\n\n',
    replace: "",
  },
  {
    path: "types/paths/api/v2/code-refs/repositories/{repo}/branches/{branch}.types.ts",
    find: 'import type { putBranch } from "../../../../../../../components/schemas/putBranch.js";',
    replace:
      'import type { putBranch as PutBranchBody } from "../../../../../../../components/schemas/putBranch.js";',
  },
  {
    path: "types/paths/api/v2/code-refs/repositories/{repo}/branches/{branch}.types.ts",
    find: "    body: putBranch;",
    replace: "    body: PutBranchBody;",
  },
];

for (const repair of repairs) {
  const path = resolve(packageDirectory, repair.path);
  const source = await readFile(path, "utf8");
  if (!source.includes(repair.find)) {
    throw new Error(`Expected generated text was not found in ${repair.path}.`);
  }
  await writeFile(path, source.replace(repair.find, repair.replace), "utf8");
}

console.log(
  "Applied the two documented Counterfact type-name compatibility repairs.",
);
