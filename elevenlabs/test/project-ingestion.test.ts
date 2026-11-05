import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
const upload = (
  text = "Uploaded article.",
  filename = "article.txt",
  contentType = "text/plain",
) => {
  const data = new TextEncoder().encode(text);
  return { data, size: data.length, filename, contentType };
};
test("Studio ingestion creates canonical blank/document projects and validates candidates atomically", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/studio/projects");
  const blank = c.createProject({ name: "Blank" }).project.project_id;
  assert.equal(c.get(blank).default_model_id, "eleven_multilingual_v2");
  assert.equal(c.get(blank).default_paragraph_voice_id, "sim-narrator");
  assert.deepEqual(c.get(blank).chapters, []);
  const file = upload();
  const id = c.createProject({
    name: "Imported",
    from_document: file,
    auto_convert: true,
  }).project.project_id;
  file.data.fill(0);
  assert.equal(c.get(id).state, "converting");
  await r.run(scenarios.completeStudioConversions);
  const sid = c.listSnapshots(id).snapshots[0].project_snapshot_id;
  assert.equal(
    c.snapshot(id, sid).character_alignments[0].characters.join(""),
    "Uploaded article.",
  );
  const structured = c.createProject({
    name: "Structured",
    from_content_json: JSON.stringify([
      {
        name: "First",
        blocks: [
          {
            sub_type: "h1",
            nodes: [
              { type: "tts_node", text: "Heading", voice_id: "sim-narrator" },
            ],
          },
        ],
      },
    ]),
  }).project.project_id;
  assert.equal(c.get(structured).chapters[0].name, "First");
  const invalidUtf8 = {
    data: new Uint8Array([255]),
    size: 1,
    filename: "bad.txt",
    contentType: "text/plain",
  };
  const baseline = structuredClone(c.projects),
    counter = c.nextProject,
    chapterCounter = c.nextChapterId;
  for (const body of [
    {
      name: "Bad",
      from_document: upload("pdf", "article.pdf", "application/pdf"),
    },
    {
      name: "Bad",
      from_document: upload("x"),
      from_url: "https://example.invalid",
    },
    { name: "Bad", from_document: upload("x".repeat(2001)) },
    { name: "Bad", from_document: upload(), default_model_id: "missing" },
    { name: "Bad", from_document: upload(), default_title_voice_id: "missing" },
    { name: "Bad", auto_convert: true },
    { name: "Bad", from_content_json: "not json" },
    { name: "Bad", from_document: invalidUtf8 },
    { name: "Bad", from_document: { ...upload(), size: 999 } },
    { name: "Bad", from_document: upload("x".repeat(16385)) },
    {
      name: "Bad",
      from_content_json: JSON.stringify([
        {
          name: "Invalid voice",
          blocks: [
            { nodes: [{ type: "tts_node", text: "x", voice_id: "missing" }] },
          ],
        },
      ]),
    },
  ])
    assert.throws(() => c.createProject(body));
  assert.deepEqual(c.projects, baseline);
  assert.equal(c.nextProject, counter);
  assert.equal(c.nextChapterId, chapterCounter);
  assert.equal(c.pending.size, 0);
  r.context.models = new Map();
  assert.throws(() => c.createProject({ name: "Unavailable" }));
  await r.run(scenarios.reset);
  assert.equal(c.projects.size, 1);
  assert.equal(c.nextProject, 1);
});
test("AudioNative ingestion shares Studio content, retains history and publishes only on request", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/audio-native"),
    studio = r.loadContext("/studio/projects");
  const blank = c.createProject({ name: "Blank native" });
  assert.equal(blank.converting, false);
  assert.deepEqual(studio.get(blank.project_id).chapters, []);
  const id = c.createProject({
    name: "Native",
    file: upload(),
    title: "Title",
    author: "Author",
    auto_convert: true,
  }).project_id;
  assert.equal(c.settings(id).enabled, true);
  assert.equal(c.settings(id).settings!.status, "processing");
  await r.run(scenarios.completeStudioConversions);
  assert.equal(c.settings(id).snapshot_id, null);
  const old = studio.listSnapshots(id).snapshots[0].project_snapshot_id,
    history = studio.snapshot(id, old);
  const before = structuredClone(studio.projects),
    next = studio.nextProject,
    players = structuredClone(c.players);
  assert.throws(() =>
    c.createProject({ name: "Invalid", file: upload(), model_id: "missing" }),
  );
  assert.throws(() =>
    c.createProject({ name: "Invalid", file: upload(), voice_id: "missing" }),
  );
  assert.throws(() =>
    c.createProject({ name: "Invalid", file: upload("x".repeat(2000)) }),
  );
  assert.throws(() => c.createProject({ name: "Invalid", sessionization: -1 }));
  assert.deepEqual(c.players, players);
  assert.throws(() => c.replaceContent(id, {}));
  assert.throws(() =>
    c.replaceContent(id, {
      file: upload(
        "<html><body><script>bad</script></body></html>",
        "article.html",
        "text/html",
      ),
    }),
  );
  assert.throws(() =>
    c.replaceContent(id, { file: upload(), auto_publish: true }),
  );
  assert.deepEqual(studio.projects, before);
  assert.equal(studio.nextProject, next);
  assert.equal(c.pending.size, 0);
  const result = c.replaceContent(id, {
    file: upload(
      "<html><body><div><p>New &amp; fresh.</p><h5>Ending</h5></div></body></html>",
      "article.html",
      "text/html",
    ),
    auto_convert: true,
    auto_publish: true,
  });
  assert.equal(result.publishing, true);
  assert.equal(result.converting, true);
  assert.throws(() => c.replaceContent(id, { file: upload() }));
  await r.run(scenarios.completeAudioNative);
  const published = c.settings(id).snapshot_id!;
  assert.ok(published);
  assert.notEqual(published, old);
  assert.deepEqual(studio.snapshot(id, old), history);
  assert.equal(
    studio.snapshot(id, published).character_alignments[0].characters.join(""),
    "Title\nAuthor\nNew & fresh.\nEnding",
  );
  studio.updateProject(id, {
    name: "Renamed",
    default_title_voice_id: "sim-narrator",
    default_paragraph_voice_id: "sim-narrator",
    title: "Live title",
    author: "Live author",
  });
  c.replaceContent(id, { file: upload("Replacement") });
  assert.equal(c.settings(id).settings!.title, "Live title");
  assert.equal(c.settings(id).snapshot_id, published);
  const ch = studio.get(id).chapters[0].chapter_id;
  assert.equal(
    studio.chapter(id, ch).content.blocks[0].nodes[0].type,
    "tts_node",
  );
  assert.equal(
    (studio.chapter(id, ch).content.blocks[0].nodes[0] as { text: string })
      .text,
    "Live title\nLive author\nReplacement",
  );
  const isolated = await createScenarioRunner();
  await isolated.run(scenarios.startup);
  assert.equal(
    isolated.loadContext("/studio/projects").projects.has(id),
    false,
  );
  assert.equal(isolated.loadContext("/audio-native").players.has(id), false);
  studio.deleteProject(id);
  assert.throws(() => c.replaceContent(id, { file: upload() }));
  await r.run(scenarios.reset);
  assert.equal(c.players.size, 1);
  assert.equal(c.pending.size, 0);
});
test("Dispatcher validates all three multipart operations and exposes canonical state", async () => {
  const h = await createDispatcherHarness();
  for (const path of ["/v1/studio/projects", "/v1/audio-native"]) {
    assert.equal((await h.requestMultipart(path, {})).status, 400);
    assert.equal((await h.requestMultipart(path, { name: 42 })).status, 400);
  }
  let res = await h.requestMultipart("/v1/studio/projects", {
    name: "HTTP blank",
  });
  assert.equal(res.status, 200);
  const blank = (await res.json()).project.project_id;
  assert.deepEqual(
    (await (await h.request(`/v1/studio/projects/${blank}`)).json()).chapters,
    [],
  );
  res = await h.requestMultipart("/v1/studio/projects", {
    name: "HTTP document",
    from_document: upload(),
    auto_convert: true,
  });
  assert.equal(res.status, 200);
  const imported = (await res.json()).project.project_id;
  await h.scenario("completeStudioConversions");
  assert.equal(
    (await (await h.request(`/v1/studio/projects/${imported}`)).json())
      .can_be_downloaded,
    true,
  );
  res = await h.requestMultipart("/v1/audio-native", {
    name: "HTTP native",
    file: upload(),
    title: "Header",
    author: "Writer",
  });
  assert.equal(res.status, 200);
  const native = await res.json();
  assert.equal(native.converting, false);
  const id = native.project_id,
    path = `/v1/audio-native/${id}/content`;
  assert.equal((await h.requestMultipart(path, {})).status, 400);
  assert.equal(
    (
      await h.requestMultipart(path, {
        file: upload(),
        auto_convert: "nonsense",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await h.requestMultipart(`/v1/audio-native/${blank}/content`, {
        file: upload(),
      })
    ).status,
    404,
  );
  res = await h.requestMultipart(path, {
    file: upload("Updated HTTP"),
    auto_convert: true,
    auto_publish: true,
  });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).publishing, true);
  await h.scenario("completeAudioNative");
  const settings = await (
    await h.request(`/v1/audio-native/${id}/settings`)
  ).json();
  assert.equal(settings.enabled, true);
  assert.ok(settings.snapshot_id);
  const snapshot = await (
    await h.request(
      `/v1/studio/projects/${id}/snapshots/${settings.snapshot_id}`,
    )
  ).json();
  assert.equal(
    snapshot.character_alignments[0].characters.join(""),
    "Header\nWriter\nUpdated HTTP",
  );
  assert.equal(
    (await h.request(`/v1/studio/projects/${id}/content`, { method: "POST" }))
      .status,
    200,
  );
  assert.deepEqual(
    (await (await h.request(`/v1/studio/projects/${id}`)).json()).chapters,
    [],
  );
  await h.scenario("reset");
  assert.equal((await h.request(`/v1/studio/projects/${id}`)).status, 404);
});
