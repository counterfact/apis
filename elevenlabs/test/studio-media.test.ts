import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
const base = "/v1/studio/projects/sim-project";
test("Studio conversion captures immutable content and scenario completion", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/studio/projects");
  const { Context } =
    await import("../api/routes/studio/projects/_.context.js");
  const empty = new Context();
  assert.equal(empty.projects.size, 0);
  assert.equal(empty.snapshots.size, 0);
  assert.equal(empty.pending.size, 0);
  assert.equal(empty.audio.length, 0);
  assert.equal(c.snapshots.size, 0);
  assert.equal(c.pending.size, 0);
  const project = c.projects.get("sim-project")!;
  project.metadata.volume_normalization = true;
  assert.throws(() => c.convert("sim-project"));
  assert.equal(c.pending.size, 0);
  project.metadata.volume_normalization = false;
  c.convert("sim-project");
  assert.equal(c.get("sim-project").state, "converting");
  assert.throws(() => c.convert("sim-project"));
  assert.throws(() =>
    c.updateChapter("sim-project", "sim-chapter", { name: "Busy" }),
  );
  await r.run(scenarios.completeStudioConversions);
  const s = c.listSnapshots("sim-project").snapshots[0];
  const snap = c.snapshot("sim-project", s.project_snapshot_id);
  assert.equal(snap.audio_duration_secs, 23040 / 44100);
  assert.equal(
    snap.character_alignments[0].characters.join(""),
    "Local Studio fixture.",
  );
  assert.equal(
    c.chapter("sim-project", "sim-chapter").statistics?.characters_converted,
    21,
  );
  const archive = c.archive("sim-project", s.project_snapshot_id);
  const bytes = c.snapshotAudio("sim-project", s.project_snapshot_id, {});
  bytes[0] = 0;
  assert.equal(
    c.snapshotAudio("sim-project", s.project_snapshot_id, {})[0],
    255,
  );
  c.updateChapter("sim-project", "sim-chapter", { content: { blocks: [] } });
  assert.deepEqual(c.snapshot("sim-project", s.project_snapshot_id), snap);
  assert.deepEqual(c.archive("sim-project", s.project_snapshot_id), archive);
  await r.run(scenarios.completeStudioConversions);
  assert.equal(c.snapshots.size, 1);
  c.updateChapter("sim-project", "sim-chapter", {
    content: {
      blocks: [
        { nodes: [{ type: "tts_node", text: "Missing", voice_id: "missing" }] },
      ],
    },
  });
  assert.throws(() => c.convert("sim-project"));
  assert.equal(c.pending.size, 0);
  c.blankContent("sim-project", undefined);
  assert.equal(c.get("sim-project").chapters.length, 0);
  assert.deepEqual(c.snapshot("sim-project", s.project_snapshot_id), snap);
  assert.throws(() =>
    c.podcast({
      model_id: "eleven_multilingual_v2",
      mode: { type: "bulletin", bulletin: { host_voice_id: "missing" } },
      source: { type: "text", text: "x" },
    }),
  );
  assert.equal(c.nextProject, 1);
  await r.run(scenarios.reset);
  assert.equal(c.snapshots.size, 0);
  assert.equal(c.pending.size, 0);
});
test("Studio Dispatcher renders project/chapter snapshots as bounded MP3 and ZIP", async () => {
  const a = await createDispatcherHarness();
  const send = (p: string, b?: unknown) =>
    a.request(p, {
      method: "POST",
      ...(b === undefined
        ? {}
        : {
            headers: { "content-type": "application/json" },
            body: JSON.stringify(b),
          }),
    });
  assert.deepEqual(await (await a.request(`${base}/snapshots`)).json(), {
    snapshots: [],
  });
  assert.equal((await send(`${base}/convert`)).status, 200);
  assert.equal((await send(`${base}/convert`)).status, 409);
  assert.equal((await a.request(`${base}/snapshots/missing`)).status, 404);
  await a.scenario("completeStudioConversions", "api");
  const list = await a.request(`${base}/snapshots`);
  assert.equal(list.status, 200);
  const id = (await list.json()).snapshots[0].project_snapshot_id;
  const detail = await a.request(`${base}/snapshots/${id}`);
  assert.equal(detail.status, 200);
  assert.equal((await detail.json()).name, "Simulator Studio Project");
  const media = await send(`${base}/snapshots/${id}/stream`, {});
  assert.equal(media.status, 200);
  assert.match(media.headers.get("content-type") ?? "", /audio\/mpeg/);
  assert.equal((await media.arrayBuffer()).byteLength, 8340);
  const zip = await send(`${base}/snapshots/${id}/archive`);
  assert.equal(zip.status, 200);
  assert.match(zip.headers.get("content-type") ?? "", /application\/x-zip/);
  assert.equal(
    Buffer.from(await zip.arrayBuffer()).readUInt32LE(0),
    0x04034b50,
  );
  const cb = `${base}/chapters/sim-chapter`;
  assert.equal((await send(`${cb}/convert`)).status, 200);
  await a.scenario("completeStudioConversions", "api");
  const cs = await a.request(`${cb}/snapshots`);
  assert.equal(cs.status, 200);
  const cid = (await cs.json()).snapshots.at(-1).chapter_snapshot_id;
  const cd = await a.request(`${cb}/snapshots/${cid}`);
  assert.equal(cd.status, 200);
  assert.equal((await cd.json()).chapter_id, "sim-chapter");
  const ca = await send(`${cb}/snapshots/${cid}/stream`, {
    convert_to_mpeg: true,
  });
  assert.equal(ca.status, 200);
  assert.equal((await ca.arrayBuffer()).byteLength, 8340);
  assert.equal(
    (await send(`${cb}/snapshots/${cid}/stream`, { convert_to_mpeg: "bad" }))
      .status,
    400,
  );
  assert.equal(
    (await a.request(`${base}/chapters/missing/snapshots`)).status,
    404,
  );
  assert.equal(
    (await (await a.request(`${base}/snapshots`)).json()).snapshots.length,
    1,
  );
  await a.request(`${cb}`, { method: "DELETE" });
  assert.equal((await a.request(`${cb}/snapshots/${cid}`)).status, 200);
  assert.equal((await send(`${cb}/snapshots/${cid}/stream`, {})).status, 200);
  const other = await createDispatcherHarness();
  assert.deepEqual(await (await other.request(`${base}/snapshots`)).json(), {
    snapshots: [],
  });
  await a.scenario("reset", "api");
  assert.equal((await a.request(`${base}/snapshots/${id}`)).status, 404);
});
test("Studio podcast queues synthetic bulletin; blank content clears live chapters and preserves snapshots", async () => {
  const a = await createDispatcherHarness();
  const b = {
    model_id: "eleven_multilingual_v2",
    mode: { type: "bulletin", bulletin: { host_voice_id: "sim-narrator" } },
    source: { type: "text", text: "Local podcast source." },
  };
  const post = (value: unknown) =>
    a.request("/v1/studio/podcasts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
  const bad = await post({ ...b, model_id: 42 });
  assert.equal(bad.status, 400);
  const created = await post(b);
  assert.equal(created.status, 200);
  const p = (await created.json()).project;
  assert.equal(p.project_id, "sim-podcast-1");
  assert.equal(p.state, "converting");
  assert.equal(
    (
      await post({
        ...b,
        source: { type: "url", url: "https://example.invalid" },
      })
    ).status,
    400,
  );
  await a.scenario("completeStudioConversions", "api");
  const path = `/v1/studio/projects/${p.project_id}`;
  const id = (await (await a.request(`${path}/snapshots`)).json()).snapshots[0]
    .project_snapshot_id;
  const cleared = await a.request(`${path}/content`, { method: "POST" });
  assert.equal(cleared.status, 200);
  assert.equal((await (await a.request(path)).json()).chapters.length, 0);
  assert.equal((await a.request(`${path}/snapshots/${id}`)).status, 200);
  assert.equal(
    (
      await a.request(`${path}/content`, {
        method: "POST",
        headers: { "content-type": "multipart/form-data; boundary=x" },
      })
    ).status,
    400,
  );
});
