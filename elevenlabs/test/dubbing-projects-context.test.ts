import assert from "node:assert/strict";
import { test } from "node:test";
import { Context } from "../api/routes/dubbing/project/_.context.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { reset, completeDubbingLanguages } from "../api/scenarios/index.js";
test("Dubbing context owns empty state and copied source/target transitions", async () => {
  assert.equal(new Context().projects.size, 0);
  const r = await createScenarioRunner();
  await r.run(reset);
  const c = r.loadContext("/dubbing/project") as Context;
  const p = "sim-dubbing-project",
    l = "sim-dubbing-es",
    s = "sim-dubbing-segment";
  const view = c.sourceTranscript(p);
  view.segments[0].text = "Changed copy";
  assert.equal(c.sourceTranscript(p).segments[0].text, "Hello local");
  const output = c.language(p, l).outputs;
  c.updateSource(p, { [s]: { text: "New" } });
  assert.equal(c.project(p).revision, 1);
  assert.equal(c.language(p, l).revision, 1);
  assert.equal(c.language(p, l).status, "stale");
  assert.deepEqual(c.language(p, l).outputs, output);
  assert.equal(c.targetTranscript(p, l).segments[0].translation, null);
  c.updateTarget(p, l, { [s]: { translation: "Nueva" } });
  assert.equal(c.language(p, l).revision, 2);
  assert.equal(c.project(p).revision, 1);
  c.updateTarget(p, l, { [s]: {} });
  assert.equal(c.language(p, l).revision, 3);
  assert.equal(c.targetTranscript(p, l).segments[0].translation, "Nueva");
  const created = c.createLanguage(p, {
    target_language: "fr",
    translations: { [s]: "Bonjour" },
  });
  assert.equal(created.status, "queued");
  assert.throws(() => c.targetTranscript(p, created.language_id));
  await r.run(completeDubbingLanguages);
  assert.equal(
    c.targetTranscript(p, created.language_id).segments[0].translation,
    "Bonjour",
  );
});
test("Dubbing context validates spans, atomic changes, counters and bulk final timing", async () => {
  const r = await createScenarioRunner();
  await r.run(reset);
  const c = r.loadContext("/dubbing/project") as Context,
    p = "sim-dubbing-project",
    s = "sim-dubbing-segment";
  const before = c.sourceTranscript(p);
  for (const edits of [
    { [s]: { text: "No" }, missing: { text: "No" } },
    { [s]: { start_s: -1 } },
    { [s]: { start_s: 3, end_s: 2 } },
  ])
    assert.throws(() => c.updateSource(p, edits));
  assert.deepEqual(c.sourceTranscript(p), before);
  assert.throws(() =>
    c.addSource(p, {
      text: "No",
      speaker_id: "speaker-1",
      start_s: 1,
      end_s: 2,
    }),
  );
  assert.equal(c.nextSegmentId, 1);
  const added = c.addSource(p, {
    text: "Two",
    speaker_id: "speaker-1",
    start_s: 4,
    end_s: 5,
  });
  const id = added.segment.id;
  c.updateSource(p, {
    [s]: { start_s: 4, end_s: 5 },
    [id]: { start_s: 0, end_s: 2 },
  });
  assert.equal(c.sourceTranscript(p).segments[0].id, id);
  const next = c.nextLanguageId;
  assert.throws(() =>
    c.createLanguage(p, { target_language: "fr", translations: { bad: "No" } }),
  );
  assert.equal(c.nextLanguageId, next);
  c.deleteLanguage(p, "sim-dubbing-es");
  assert.equal(c.project(p).language_ids?.length, 0);
  c.deleteProject(p);
  assert.equal(c.projects.size, 0);
  assert.throws(() => c.language(p, "sim-dubbing-es"));
});
