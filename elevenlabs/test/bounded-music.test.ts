import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
import { Context } from "../api/routes/music/_.context.js";
const hash = (v: Uint8Array) => createHash("sha256").update(v).digest("hex");
test("Music context retains copied plans and bounded music; rejects unsupported requests atomically", async () => {
  assert.equal(new Context().songs.size, 0);
  assert.equal(new Context().plans.size, 0);
  assert.equal(new Context().audio.length, 0);
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/music");
  assert.equal(c.songs.size, 0);
  assert.equal(c.plans.size, 0);
  const plan = c.plan({ prompt: "Synthetic calm" });
  assert.equal(plan.sections[0].duration_ms, 3840);
  assert.deepEqual(plan.sections[0].lines, []);
  const song = c.compose({ composition_plan: plan });
  assert.equal(song.audio.length, 61299);
  assert.equal(song.durationMs, 3840);
  const original = hash(song.audio);
  song.audio[0] = 0;
  assert.equal(hash(c.songs.get(song.songId)!.audio), original);
  plan.sections[0].section_name = "Changed";
  assert.equal(
    c.songs.get(song.songId)!.compositionPlan!.sections[0].section_name,
    "Synthetic silence",
  );
  const next = c.nextSong;
  for (const input of [
    { composition_plan: plan },
    { prompt: "x", music_length_ms: 3000 },
    { prompt: "x", seed: 1 },
    { prompt: "x", force_instrumental: true },
    { prompt: "x", finetune_id: "missing" },
    { prompt: "x", with_timestamps: true },
    { prompt: "x", respect_sections_durations: false },
  ])
    assert.throws(() => c.compose(input));
  assert.equal(c.nextSong, next);
  assert.equal(c.songs.size, 1);
  c.compose({ prompt: "No retention" }, { enable_logging: false });
  assert.equal(c.songs.size, 1);
  c.plan({ prompt: "No retention" }, { enable_logging: false });
  assert.equal(c.plans.size, 1);
  r.context.models.delete("music_v1");
  assert.throws(() => c.compose({ prompt: "Missing model" }));
  await r.run(scenarios.reset);
  assert.equal(c.songs.size, 0);
  assert.equal(c.plans.size, 0);
  assert.equal(c.nextSong, 0);
});
test("Music Dispatcher validates JSON, returns MP3, multipart detail and complete SSE events", async () => {
  const a = await createDispatcherHarness();
  const send = (path: string, body: unknown) =>
    a.request(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  assert.equal((await send("/v1/music/plan", { prompt: 42 })).status, 400);
  const p = await send("/v1/music/plan", { prompt: "Synthetic calm" });
  assert.equal(p.status, 200);
  const plan = await p.json();
  assert.equal(plan.sections[0].duration_ms, 3840);
  const reordered = Object.fromEntries(Object.entries(plan).reverse());
  assert.equal(
    (
      await send("/v1/music?enable_logging=false", {
        composition_plan: reordered,
      })
    ).status,
    200,
  );
  await a.scenario("reset", "api");
  const audio = await send("/v1/music", { composition_plan: plan });
  assert.equal(audio.status, 200);
  assert.match(audio.headers.get("content-type")!, /audio\/mpeg/);
  assert.equal(audio.headers.get("song-id"), "sim-music-song-1");
  const bytes = new Uint8Array(await audio.arrayBuffer());
  assert.equal(bytes.length, 61299);
  assert.deepEqual(bytes.slice(0, 4), new Uint8Array([255, 251, 144, 100]));
  const stream = await send("/v1/music/stream?output_format=mp3_44100_128", {
    prompt: "Different prompt",
  });
  assert.equal(stream.status, 200);
  assert.equal(hash(new Uint8Array(await stream.arrayBuffer())), hash(bytes));
  const detail = await send("/v1/music/detailed", { prompt: "Synthetic calm" });
  assert.equal(detail.status, 200);
  const ct = detail.headers.get("content-type")!;
  assert.match(ct, /multipart\/mixed; boundary=/);
  const boundary = ct.split("boundary=")[1];
  const raw = Buffer.from(await detail.arrayBuffer());
  const parts = raw.toString("latin1").split(`--${boundary}`);
  assert.equal(parts.length, 4);
  const meta = JSON.parse(parts[1].split("\r\n\r\n")[1].slice(0, -2));
  assert.deepEqual(meta.composition_plan, plan);
  assert.equal(meta.song_metadata.title, "Synthetic silence");
  const encoded = Buffer.from(
    parts[2].split("\r\n\r\n")[1].slice(0, -2),
    "latin1",
  );
  assert.equal(hash(encoded), hash(bytes));
  const sse = await send("/v1/music/detailed/stream", {
    prompt: "Synthetic calm",
  });
  assert.equal(sse.status, 200);
  assert.match(sse.headers.get("content-type")!, /text\/event-stream/);
  const events = (await sse.text())
    .trim()
    .split("\n\n")
    .map((block) => {
      const [event, data] = block.split("\n");
      return { event: event.slice(7), data: JSON.parse(data.slice(6)) };
    });
  assert.deepEqual(
    events.map((e) => e.event),
    ["composition_plan", "song_metadata", "audio_chunk", "done"],
  );
  assert.deepEqual(events[0].data, plan);
  assert.deepEqual(events[2].data.words_timestamps, []);
  assert.deepEqual(events[2].data.waveform_visual, []);
  assert.equal(
    hash(Buffer.from(events[2].data.audio_base64, "base64")),
    hash(bytes),
  );
  for (const [url, input] of [
    ["/v1/music", { prompt: "x", music_length_ms: 3000 }],
    ["/v1/music?output_format=pcm_44100", { prompt: "x" }],
    ["/v1/music/detailed", { prompt: "x", with_waveform_visual: true }],
    ["/v1/music/plan", { prompt: "x", source_composition_plan: plan }],
    ["/v1/music", { prompt: "x", composition_plan: plan }],
  ] as const)
    assert.equal((await send(url, input)).status, 400);
  await a.scenario("emptyModels", "api");
  assert.equal((await send("/v1/music", { prompt: "x" })).status, 404);
  await a.scenario("reset", "api");
  const reset = await send("/v1/music", { prompt: "x" });
  assert.equal(reset.headers.get("song-id"), "sim-music-song-1");
  const other = await createDispatcherHarness();
  const first = await other.request("/v1/music", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt: "x" }),
  });
  assert.equal(first.headers.get("song-id"), "sim-music-song-1");
});
