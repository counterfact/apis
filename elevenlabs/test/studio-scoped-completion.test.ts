import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
import { completeStudioProjectJobs } from "../api/scenarios/studio-projects.js";

test("scoped Studio completion preserves unrelated queued jobs and supports later completion", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/studio/projects");
  c.convert("sim-project");
  const second = c.podcast({
    model_id: "eleven_multilingual_v2",
    mode: {type: "bulletin", bulletin: {host_voice_id: "sim-narrator"}},
    source: {type: "text", text: "Second local project."},
  }).project.project_id;
  const pendingSecond = structuredClone(c.pending.get(second));
  completeStudioProjectJobs(c, new Set());
  assert.equal(c.pending.size, 2);
  assert.equal(c.snapshots.size, 0);
  completeStudioProjectJobs(c, new Set(["sim-project", "missing"]));
  assert.equal(c.get("sim-project").state, "default");
  assert.equal(c.get(second).state, "converting");
  assert.equal(c.pending.size, 1);
  assert.deepEqual(c.pending.get(second), pendingSecond);
  assert.equal(c.listSnapshots("sim-project").snapshots.length, 1);
  assert.equal(c.listSnapshots(second).snapshots.length, 0);
  assert.equal(c.nextSnapshot, 2);
  completeStudioProjectJobs(c, new Set(["sim-project"]));
  assert.equal(c.nextSnapshot, 2);
  await r.run(scenarios.completeStudioConversions);
  assert.equal(c.pending.size, 0);
  assert.equal(c.get(second).state, "default");
  assert.equal(c.listSnapshots(second).snapshots[0].project_snapshot_id, "sim-project-snapshot-2");
  await r.run(scenarios.completeStudioConversions);
  assert.equal(c.snapshots.size, 2);
});
