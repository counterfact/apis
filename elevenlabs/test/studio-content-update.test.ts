import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
const base = "/v1/studio/projects/sim-project";
const upload = (
  text = "Replacement document.",
  filename = "article.txt",
  contentType = "text/plain",
) => {
  const data = new TextEncoder().encode(text);
  return { data, size: data.length, filename, contentType };
};
const structured = (voice = "sim-narrator") =>
  JSON.stringify([
    {
      name: "First",
      blocks: [
        {
          nodes: [
            { type: "tts_node", text: "Structured content.", voice_id: voice },
          ],
        },
      ],
    },
    {
      name: "Second",
      blocks: [
        {
          nodes: [
            { type: "tts_node", text: "Another chapter.", voice_id: voice },
          ],
        },
      ],
    },
  ]);
test("Studio content updates validate detached candidates and preserve canonical metadata/history", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/studio/projects");
  c.convert("sim-project");
  await r.run(scenarios.completeStudioConversions);
  const old = c.listSnapshots("sim-project").snapshots[0].project_snapshot_id;
  const snapshot = c.snapshot("sim-project", old),
    audio = c.snapshotAudio("sim-project", old, {});
  const metadata = structuredClone(c.projects.get("sim-project")!.metadata);
  const file = upload();
  c.updateContent("sim-project", { from_document: file, auto_convert: true });
  file.data.fill(0);
  assert.equal(c.get("sim-project").name, metadata.name);
  assert.equal(
    c.get("sim-project").default_paragraph_voice_id,
    metadata.default_paragraph_voice_id,
  );
  assert.equal(c.get("sim-project").state, "converting");
  assert.deepEqual(
    {
      ...c.projects.get("sim-project")!.metadata,
      state: metadata.state,
      can_be_downloaded: metadata.can_be_downloaded,
    },
    metadata,
  );
  assert.deepEqual(c.mutedTracks("sim-project").chapter_ids, []);
  const pending = structuredClone(c.pending),
    current = structuredClone(c.projects),
    counter = c.nextChapterId;
  assert.throws(() =>
    c.updateContent("sim-project", { from_document: upload() }),
  );
  assert.deepEqual(c.pending, pending);
  assert.deepEqual(c.projects, current);
  assert.equal(c.nextChapterId, counter);
  await r.run(scenarios.completeStudioConversions);
  const sid = c
    .listSnapshots("sim-project")
    .snapshots.at(-1)!.project_snapshot_id;
  assert.equal(
    c.snapshot("sim-project", sid).character_alignments[0].characters.join(""),
    "Replacement document.",
  );
  const before = structuredClone(c.projects),
    counters = [c.nextChapterId, c.nextProject, c.nextSnapshot];
  for (const body of [
    null,
    { from_url: "https://example.invalid" },
    { from_document: upload(), from_content_json: structured() },
    { from_document: upload("pdf", "file.pdf", "application/pdf") },
    { from_content_json: "bad json" },
    { from_content_json: structured("missing") },
    {
      from_content_json: structured().replace(
        '"Another chapter.","voice_id":"sim-narrator"',
        '"Another chapter.","voice_id":"missing"',
      ),
    },
    { from_document: upload("x".repeat(2001)) },
    { from_document: upload(), auto_convert: "bad" },
    { auto_convert: true },
    { unexpected: true },
  ])
    assert.throws(() => c.updateContent("sim-project", body));
  assert.deepEqual(c.projects, before);
  assert.deepEqual([c.nextChapterId, c.nextProject, c.nextSnapshot], counters);
  assert.equal(c.pending.size, 0);
  r.context.models = new Map();
  assert.throws(() =>
    c.updateContent("sim-project", { from_document: upload() }),
  );
  assert.deepEqual(c.projects, before);
  c.updateContent("sim-project", undefined);
  assert.deepEqual(c.get("sim-project").chapters, []);
  assert.deepEqual(c.snapshot("sim-project", old), snapshot);
  assert.deepEqual(c.snapshotAudio("sim-project", old, {}), audio);
  await r.run(scenarios.reset);
  c.updateContent("sim-project", { from_content_json: structured() });
  assert.equal(c.get("sim-project").chapters.length, 2);
  assert.equal(c.get("sim-project").chapters[0].name, "First");
  c.updateContent("sim-project", {});
  assert.deepEqual(c.get("sim-project").chapters, []);
});
test("Studio content Dispatcher imports uploaded and structured sources and supports optional blank bodies", async () => {
  const h = await createDispatcherHarness();
  let res = await h.requestMultipart(`${base}/content`, {
    from_document: upload(),
    auto_convert: true,
  });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).project.state, "converting");
  assert.equal((await h.requestMultipart(`${base}/content`, {})).status, 409);
  await h.scenario("completeStudioConversions");
  const sid = (await (await h.request(`${base}/snapshots`)).json()).snapshots[0]
    .project_snapshot_id;
  const historical = await (await h.request(`${base}/snapshots/${sid}`)).json();
  for (const body of [
    { from_url: "https://example.invalid" },
    { from_document: upload(), from_content_json: structured() },
    { from_document: upload("bad", "article.pdf", "application/pdf") },
    { from_content_json: "bad json" },
    { from_content_json: structured("missing") },
    { auto_convert: "bad" },
  ]) {
    res = await h.requestMultipart(`${base}/content`, body);
    assert.ok([400, 404].includes(res.status));
  }
  assert.equal((await (await h.request(base)).json()).can_be_downloaded, true);
  res = await h.requestMultipart(`${base}/content`, {
    from_content_json: structured(),
  });
  assert.equal(res.status, 200);
  const project = await (await h.request(base)).json();
  assert.equal(project.chapters.length, 2);
  const chapter = await (
    await h.request(`${base}/chapters/${project.chapters[0].chapter_id}`)
  ).json();
  assert.equal(chapter.content.blocks[0].nodes[0].text, "Structured content.");
  assert.deepEqual(
    await (await h.request(`${base}/snapshots/${sid}`)).json(),
    historical,
  );
  for (const send of [
    () => h.requestMultipart(`${base}/content`, {}),
    () => h.request(`${base}/content`, { method: "POST" }),
    () =>
      h.request(`${base}/content`, {
        method: "POST",
        headers: { "content-type": "multipart/form-data; boundary=x" },
      }),
  ]) {
    assert.equal((await send()).status, 200);
    assert.deepEqual((await (await h.request(base)).json()).chapters, []);
  }
  assert.equal(
    (
      await h.requestMultipart("/v1/studio/projects/missing/content", {
        from_document: upload(),
      })
    ).status,
    404,
  );
});
test("Studio optional chapter edits default only an absent body", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/studio/projects"),
    before = c.chapter("sim-project", "sim-chapter");
  assert.deepEqual(
    c.updateChapter("sim-project", "sim-chapter", undefined).chapter,
    before,
  );
  assert.throws(() => c.updateChapter("sim-project", "sim-chapter", null));
  assert.throws(() =>
    c.updateChapter("sim-project", "sim-chapter", { unexpected: true }),
  );
  assert.deepEqual(c.chapter("sim-project", "sim-chapter"), before);
  const h = await createDispatcherHarness();
  const res = await h.request(`${base}/chapters/sim-chapter`, {
    method: "POST",
  });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).chapter.name, "Introduction");
  assert.equal(
    (
      await h.request(`${base}/chapters/sim-chapter`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "null",
      })
    ).status,
    400,
  );
});
test("Both Studio snapshot streams default only an absent body", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/studio/projects");
  c.convert("sim-project");
  await r.run(scenarios.completeStudioConversions);
  const sid = c.listSnapshots("sim-project").snapshots[0].project_snapshot_id;
  const cid = c.listSnapshots("sim-project", "sim-chapter").snapshots[0]
    .chapter_snapshot_id;
  assert.deepEqual(
    c.snapshotAudio("sim-project", sid, undefined),
    c.snapshotAudio("sim-project", sid, {}),
  );
  assert.deepEqual(
    c.snapshotAudio("sim-project", cid, undefined, "sim-chapter"),
    c.snapshotAudio("sim-project", cid, {}, "sim-chapter"),
  );
  assert.throws(() => c.snapshotAudio("sim-project", sid, null));
  const h = await createDispatcherHarness();
  assert.equal(
    (await h.request(`${base}/convert`, { method: "POST" })).status,
    200,
  );
  await h.scenario("completeStudioConversions");
  const hs = (await (await h.request(`${base}/snapshots`)).json()).snapshots[0]
    .project_snapshot_id;
  const hc = (
    await (await h.request(`${base}/chapters/sim-chapter/snapshots`)).json()
  ).snapshots[0].chapter_snapshot_id;
  for (const path of [
    `${base}/snapshots/${hs}/stream`,
    `${base}/chapters/sim-chapter/snapshots/${hc}/stream`,
  ]) {
    const res = await h.request(path, { method: "POST" });
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") ?? "", /audio\/mpeg/);
    const bytes = Buffer.from(await res.arrayBuffer());
    assert.equal(bytes.length, 8340);
    const explicit = await h.request(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    assert.deepEqual(Buffer.from(await explicit.arrayBuffer()), bytes);
    assert.equal(
      (
        await h.request(path, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "null",
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await h.request(path, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ convert_to_mpeg: "bad" }),
        })
      ).status,
      400,
    );
  }
});
