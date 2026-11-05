import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
const url = "https://simulator.invalid/dubbing-source.mp3";
const file = (data: Uint8Array) => ({
  data: new Uint8Array(data),
  size: data.length,
  filename: "source.mp3",
  contentType: "audio/mpeg",
});
async function setup() {
  const r = await createScenarioRunner();
  await r.run(scenarios.reset);
  return r;
}
test("creation contexts keep copied canonical inputs, validate atomically, and reset counters", async () => {
  const r = await setup(),
    l = r.loadContext("/dubbing"),
    p = r.loadContext("/dubbing/project"),
    upload = file(r.loadContext("/text-to-speech").audio);
  const legacy = l.create({
    file: upload,
    target_lang: "es",
    dubbing_studio: true,
  });
  assert.equal(legacy.dubbing_id, "sim-dubbing-created-1");
  assert.equal(l.get(legacy.dubbing_id).status, "dubbing");
  upload.data[0] = 0;
  assert.equal(l.records.get(legacy.dubbing_id)!.input!.file.data[0], 255);
  const project = p.create({
    source_url: url,
    target_language: "es",
    reference: "Exact reference",
  });
  assert.equal(project.project_id, "sim-dubbing-project-created-1");
  assert.equal(project.status, "queued");
  assert.equal(project.language_ids!.length, 1);
  const pending = p.create({ source_url: url });
  p.deleteProject(pending.project_id);
  const lc = l.records.size,
    pc = p.projects.size;
  for (const input of [
    {},
    { file: file(new Uint8Array([1, 2])) },
    { source_url: "https://example.org/source.mp3" },
    { file: file(r.loadContext("/text-to-speech").audio), source_url: url },
  ]) {
    assert.throws(() => l.create(input));
    assert.throws(() => p.create(input));
  }
  for (const input of [
    { source_url: url, mode: "manual" },
    { source_url: url, start_time: 0 },
    { source_url: url, num_speakers: 2 },
    { source_url: url, watermark: true },
  ])
    assert.throws(() => l.create(input));
  for (const input of [
    { source_url: url, model_id: "unknown" },
    { source_url: url, transcript: upload },
    { source_url: url, keyterms: ["test"] },
    { source_url: url, webhook_ids: ["missing"] },
    { source_url: url, target_language: "!" },
  ])
    assert.throws(() => p.create(input));
  assert.equal(l.records.size, lc);
  assert.equal(p.projects.size, pc);
  assert.equal(l.nextCreation, 1);
  assert.equal(p.nextProjectId, 2);
  await r.run(scenarios.completeDubbingCreation);
  assert.equal(l.get(legacy.dubbing_id).status, "dubbed");
  assert.equal(p.project(project.project_id).status, "ready");
  assert.equal(p.sourceTranscript(project.project_id).segments.length, 1);
  const snapshot = p.sourceTranscript(project.project_id);
  snapshot.segments[0].text = "mutated";
  assert.notEqual(
    p.sourceTranscript(project.project_id).segments[0].text,
    "mutated",
  );
  const resources = r.loadContext("/dubbing/resource");
  resources.process(legacy.dubbing_id, "dub", {
    segments: [],
    languages: null,
  });
  resources.speakerSettings.set(`${legacy.dubbing_id}/synthetic-speaker`, {});
  const queued = structuredClone(resources.jobs.get(legacy.dubbing_id));
  l.delete(legacy.dubbing_id);
  assert.equal(resources.resources.has(legacy.dubbing_id), false);
  assert.equal(resources.jobs.has(legacy.dubbing_id), false);
  assert.equal(
    resources.speakerSettings.has(`${legacy.dubbing_id}/synthetic-speaker`),
    false,
  );
  assert.equal(queued!.snapshot.id, legacy.dubbing_id);
  p.deleteProject(project.project_id);
  await r.run(scenarios.completeDubbingCreation);
  assert.equal(p.projects.has(project.project_id), false);
  assert.equal(p.projects.has(pending.project_id), false);
  await r.run(scenarios.reset);
  assert.equal(
    l.create({ source_url: url }).dubbing_id,
    "sim-dubbing-created-1",
  );
  assert.equal(
    p.create({ source_url: url }).project_id,
    "sim-dubbing-project-created-1",
  );
});
test("actual creation handlers enforce source semantics and expose pending/completed legacy reads", async () => {
  const h = await createDispatcherHarness();
  for (const path of ["/v1/dubbing", "/v1/dubbing/project"]) {
    assert.equal((await h.requestMultipart(path, {})).status, 400);
    assert.equal((await h.request(path, { method: "POST" })).status, 400);
  }
  const r = await setup(),
    source = file(r.loadContext("/text-to-speech").audio);
  assert.equal(
    (
      await h.requestMultipart("/v1/dubbing", {
        file: source,
        num_speakers: "invalid",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await h.requestMultipart("/v1/dubbing/project", {
        file: source,
        keyterms: 42,
      })
    ).status,
    400,
  );
  const response = await h.requestMultipart("/v1/dubbing", {
    file: source,
    name: "Uploaded",
    target_lang: "es",
    dubbing_studio: true,
  });
  assert.equal(response.status, 200);
  const created = await response.json();
  assert.equal(created.dubbing_id, "sim-dubbing-created-1");
  assert.ok(Math.abs(created.expected_duration_sec - 23040 / 44100) < 1e-9);
  const base = `/v1/dubbing/${created.dubbing_id}`;
  assert.equal((await (await h.request(base)).json()).name, "Uploaded");
  assert.equal((await h.request(base + "/audio/es")).status, 425);
  assert.equal((await h.request(base + "/transcript/es")).status, 425);
  await h.scenario("completeDubbingCreation");
  assert.equal((await (await h.request(base)).json()).status, "dubbed");
  const audio = await h.request(base + "/audio/es");
  assert.equal(audio.headers.get("content-type"), "audio/mpeg");
  assert.equal((await audio.arrayBuffer()).byteLength, 8340);
  assert.match(
    await (await h.request(base + "/transcript/es")).text(),
    /synthetic es/,
  );
  assert.equal(
    (await h.request(`/v1/dubbing/resource/${created.dubbing_id}`)).status,
    200,
  );
  await h.request(base, { method: "DELETE" });
  assert.equal(
    (await h.request(`/v1/dubbing/resource/${created.dubbing_id}`)).status,
    404,
  );
  const ordinary = await h.requestMultipart("/v1/dubbing", { source_url: url });
  assert.equal(ordinary.status, 200);
  await h.scenario("completeDubbingCreation");
  const id = (await ordinary.json()).dubbing_id;
  assert.equal((await h.request(`/v1/dubbing/${id}/audio/source`)).status, 200);
});
test("actual project creation supports ordinary uploads and URL targets through existing completion flows", async () => {
  const h = await createDispatcherHarness(),
    r = await setup(),
    source = file(r.loadContext("/text-to-speech").audio);
  const ordinary = await h.requestMultipart("/v1/dubbing/project", {
    file: source,
  });
  assert.equal(ordinary.status, 201);
  const first = await ordinary.json();
  assert.equal(first.model_id, "dubbing_v2");
  assert.deepEqual(first.language_ids, []);
  assert.equal(first.status, "queued");
  assert.equal(first.media, null);
  const response = await h.requestMultipart("/v1/dubbing/project", {
    source_url: url,
    target_language: "es",
    source_language: "en-US",
    reference: "verbatim",
    model_id: "dubbing_v1",
  });
  assert.equal(response.status, 201);
  const created = await response.json(),
    base = `/v1/dubbing/project/${created.project_id}`,
    language = created.language_ids[0];
  assert.equal(created.reference, "verbatim");
  assert.equal(created.model_id, "dubbing_v1");
  assert.equal((await h.request(base + "/transcript")).status, 409);
  await h.scenario("completeDubbingCreation");
  assert.equal((await (await h.request(base)).json()).source_language, "en");
  assert.equal(
    (await (await h.request(base + "/transcript")).json()).segments.length,
    1,
  );
  assert.equal(
    (await (await h.request(base + `/language/${language}`)).json()).status,
    "queued",
  );
  await h.scenario("completeDubbingLanguages");
  assert.equal(
    (await (await h.request(base + `/language/${language}/transcript`)).json())
      .segments[0].translation,
    "[synthetic es] Synthetic simulator source.",
  );
  const terminal = await (await h.request(base)).json();
  await h.scenario("completeDubbingCreation");
  assert.deepEqual(await (await h.request(base)).json(), terminal);
  assert.deepEqual(
    (await (await h.request("/v1/dubbing/project")).json()).projects.find(
      (p: any) => p.project_id === created.project_id,
    ).language_ids,
    [],
  );
  const other = await createDispatcherHarness();
  assert.equal((await other.request(base)).status, 404);
  await h.scenario("reset");
  assert.equal((await h.request(base)).status, 404);
  const again = await h.requestMultipart("/v1/dubbing/project", {
    source_url: url,
  });
  assert.equal(
    (await again.json()).project_id,
    "sim-dubbing-project-created-1",
  );
});

test("creation rejects unsupported media/options without mutation and accepts bounded PCM WAV", async () => {
  const h = await createDispatcherHarness(),
    r = await setup(),
    l = r.loadContext("/dubbing"),
    p = r.loadContext("/dubbing/project"),
    source = file(r.loadContext("/text-to-speech").audio);
  const wav = Buffer.alloc(16044);
  wav.write("RIFF");
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24);
  wav.writeUInt32LE(16000, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(16000, 40);
  const wave = {
    ...file(wav),
    filename: "one-second.wav",
    contentType: "audio/wav",
  };
  assert.equal(l.create({ file: wave }).expected_duration_sec, 1);
  const created = p.create({ file: wave });
  await r.run(scenarios.completeDubbingCreation);
  assert.equal(p.project(created.project_id).media!.duration_s, 1);
  const beforeL = await (await h.request("/v1/dubbing")).json(),
    beforeP = await (await h.request("/v1/dubbing/project")).json();
  for (const path of ["/v1/dubbing", "/v1/dubbing/project"]) {
    for (const body of [
      { file: { ...source, contentType: "video/mp4" } },
      { file: { ...source, size: 1 } },
      { file: source, source_url: url },
      { source_url: "https://example.org/file.mp3" },
      {
        file: {
          ...source,
          data: new Uint8Array(8 * 1024 * 1024 + 1),
          size: 8 * 1024 * 1024 + 1,
        },
      },
    ])
      assert.equal((await h.requestMultipart(path, body)).status, 400);
  }
  assert.equal(
    (await h.requestMultipart("/v1/dubbing", { file: source, mode: "manual" }))
      .status,
    400,
  );
  assert.equal(
    (
      await h.requestMultipart("/v1/dubbing/project", {
        file: source,
        transcript: source,
      })
    ).status,
    400,
  );
  assert.deepEqual(await (await h.request("/v1/dubbing")).json(), beforeL);
  assert.deepEqual(
    await (await h.request("/v1/dubbing/project")).json(),
    beforeP,
  );
});
