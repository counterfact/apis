import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
const image = () => ({
  data: new Uint8Array([137, 80, 78, 71]),
  size: 4,
  filename: "avatar.png",
  contentType: "image/png",
});
const base = "/v1/convai/agents/sim-agent",
  conv = "/v1/convai/conversations/sim-conversation";
const wav = () => {
  const data = new Uint8Array(46),
    v = new DataView(data.buffer);
  for (const [at, s] of [
    [0, "RIFF"],
    [8, "WAVE"],
    [12, "fmt "],
    [36, "data"],
  ] as const)
    data.set(Buffer.from(s), at);
  v.setUint32(4, 38, true);
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true);
  v.setUint32(28, 16000, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  v.setUint32(40, 2, true);
  return { data, size: 46, filename: "hold.wav", contentType: "audio/wav" };
};
test("context uploads copy bytes, retain history, duplicate ownership, reject atomically and reset", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/convai/agents"),
    q = r.loadContext("/convai/conversations"),
    l = r.loadContext("/convai/agents/{agent_id}/branches");
  const history = structuredClone(l.versions),
    source = image(),
    a = c.uploadAvatar("sim-agent", source);
  source.data.fill(0);
  assert.equal(c.getMedia("sim-agent", a.avatar_url!)!.data[0], 137);
  c.getMedia("sim-agent", a.avatar_url!)!.data.fill(0);
  assert.equal(c.getMedia("sim-agent", a.avatar_url!)!.data[0], 137);
  assert.deepEqual(l.versions, history);
  const hold = c.uploadHoldAudio("sim-agent", wav());
  assert.equal(hold.hold_audio.duration_secs, 1 / 8000);
  const mp3 = r.loadContext("/text-to-speech").audio;
  assert.ok(
    c.uploadHoldAudio("sim-agent", {
      data: mp3,
      size: mp3.length,
      filename: "hold.mp3",
      contentType: "audio/mpeg",
    }).hold_audio.duration_secs > 0,
  );
  c.deleteHoldAudio("sim-agent");
  assert.ok(c.getMedia("sim-agent", hold.hold_audio.audio_path));
  const duplicate = c.duplicateAgent("sim-agent", {}).value!.agent_id;
  c.deleteAgent("sim-agent");
  assert.ok(c.getMedia(duplicate, a.avatar_url!));
  const before = structuredClone(c.agents);
  for (const f of [
    { ...image(), size: 9 },
    { ...image(), contentType: "text/plain" },
    { ...image(), data: new Uint8Array(1048577), size: 1048577 },
  ])
    assert.throws(() => c.uploadAvatar(duplicate, f));
  assert.throws(() => c.uploadHoldAudio(duplicate, image()));
  assert.throws(() =>
    c.uploadHoldAudio(duplicate, { ...wav(), data: new Uint8Array(46) }),
  );
  assert.deepEqual(c.agents, before);
  const next = c.nextMedia;
  c.mediaDefaults!.maxDuration = 0.00001;
  assert.throws(() => c.uploadHoldAudio(duplicate, wav()));
  assert.equal(c.nextMedia, next);
  assert.deepEqual(c.agents, before);
  const sourceFile = image(),
    f = q.uploadFile("sim-conversation", sourceFile);
  sourceFile.data.fill(0);
  assert.equal(q.getFileUpload("sim-conversation", f.file_id)!.data[0], 137);
  q.getFileUpload("sim-conversation", f.file_id)!.data.fill(0);
  assert.equal(q.getFileUpload("sim-conversation", f.file_id)!.data[0], 137);
  const prior = structuredClone(q.files),
    counter = q.nextFile;
  for (const file of [
    { ...image(), size: 99 },
    { ...image(), contentType: "audio/mpeg" },
  ])
    assert.throws(() => q.uploadFile("sim-conversation", file));
  assert.deepEqual(q.files, prior);
  assert.equal(q.nextFile, counter);
  assert.equal(
    q.getFileUpload("sim-conversation", f.file_id)!.contentType,
    "image/png",
  );
  assert.throws(() => q.deleteFile("sim-conversation", "sim-file-used"));
  q.deleteFile("sim-conversation", f.file_id);
  assert.throws(() => q.getFileUpload("sim-conversation", f.file_id));
  q.uploadFile("sim-conversation", image());
  q.deleteConversation("sim-conversation");
  assert.equal(q.files.has("sim-conversation"), false);
  await r.run(scenarios.reset);
  assert.equal(c.uploadAvatar("sim-agent", image()).avatar_url, a.avatar_url);
});
test("validated multipart routes update live metadata, preserve reads/deletes and reset", async () => {
  const h = await createDispatcherHarness(),
    initial = await (await h.request(base)).json();
  const historical = await (
    await h.request(base + "?version_id=sim-agent-version-main")
  ).json();
  const avatar = await h.requestMultipart(base + "/avatar", {
    avatar_file: image(),
  });
  assert.equal(avatar.status, 200);
  assert.match(avatar.headers.get("content-type")!, /json/);
  const a = await avatar.json();
  assert.equal(a.agent_id, "sim-agent");
  assert.match(a.avatar_url, /simulator.invalid/);
  assert.deepEqual(
    (await (await h.request(base + "/widget")).json()).widget_config.avatar,
    { type: "image", url: a.avatar_url },
  );
  assert.equal(
    (await (await h.request(base)).json()).platform_settings.widget
      .custom_avatar_path,
    a.avatar_url,
  );
  assert.deepEqual(
    await (await h.request(base + "?version_id=sim-agent-version-main")).json(),
    historical,
  );
  const main = await (
    await h.request(base + "?branch_id=sim-main-branch")
  ).json();
  assert.equal(main.platform_settings.widget.custom_avatar_path, a.avatar_url);
  assert.equal("media" in main, false);
  assert.equal("upload" in main, false);
  const hold = await h.requestMultipart(base + "/hold-audio", {
    hold_audio_file: wav(),
  });
  assert.equal(hold.status, 200);
  const audio = await hold.json();
  assert.equal(audio.hold_audio.duration_secs, 1 / 8000);
  assert.deepEqual(
    (await (await h.request(base)).json()).platform_settings.queueing_config
      .hold_audio,
    audio.hold_audio,
  );
  assert.equal(
    (await h.request(base + "/hold-audio", { method: "DELETE" })).status,
    200,
  );
  const upload = await h.requestMultipart(conv + "/files", {
    file: { ...image(), filename: "note.txt", contentType: "text/plain" },
  });
  assert.equal(upload.status, 200);
  const f = await upload.json();
  assert.equal(
    JSON.stringify(await (await h.request(conv)).json()).includes(f.file_id),
    false,
  );
  assert.deepEqual(Object.keys(f), ["file_id"]);
  assert.equal(
    (await h.request(conv + "/files/" + f.file_id, { method: "DELETE" }))
      .status,
    200,
  );
  assert.equal(
    (await h.request(conv + "/files/" + f.file_id, { method: "DELETE" }))
      .status,
    404,
  );
  assert.equal(
    (await h.request(conv + "/files/sim-file-used", { method: "DELETE" }))
      .status,
    409,
  );
  for (const [path, body, status] of [
    [base + "/avatar", { avatar_file: { ...image(), size: 1 } }, 400],
    [base + "/hold-audio", { hold_audio_file: image() }, 400],
    [conv + "/files", { file: { ...image(), contentType: "audio/mpeg" } }, 400],
    [
      base.replace("sim-agent", "missing") + "/avatar",
      { avatar_file: image() },
      404,
    ],
    [
      conv.replace("sim-conversation", "missing") + "/files",
      { file: image() },
      404,
    ],
  ] as const)
    assert.equal((await h.requestMultipart(path, body)).status, status);
  for (const path of [base + "/avatar", base + "/hold-audio", conv + "/files"])
    assert.equal((await h.requestMultipart(path, {})).status, 400);
  await h.scenario("reset");
  assert.deepEqual(await (await h.request(base)).json(), initial);
});

test("hold parser accepts bounded PCM and complete Layer III frames and rejects malformed sources", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/convai/agents");
  const source = r.loadContext("/text-to-speech").audio;
  const mp3 = {
    data: source,
    size: source.length,
    filename: "hold.mp3",
    contentType: "audio/mpeg",
  };
  assert.ok(
    Math.abs(
      c.uploadHoldAudio("sim-agent", mp3).hold_audio.duration_secs -
        23040 / 44100,
    ) < 1e-12,
  );
  const before = structuredClone(c.agents),
    counter = c.nextMedia;
  const truncated = source.slice(0, -1),
    badRate = wav();
  new DataView(badRate.data.buffer).setUint32(28, 1, true);
  for (const f of [
    { ...mp3, data: truncated, size: truncated.length },
    badRate,
    {
      ...mp3,
      data: new Uint8Array([73, 68, 51, 4, 0, 0, 127, 127, 127, 127]),
      size: 10,
    },
    { ...mp3, data: new Uint8Array(), size: 0 },
  ])
    assert.throws(() => c.uploadHoldAudio("sim-agent", f));
  assert.deepEqual(c.agents, before);
  assert.equal(c.nextMedia, counter);
});
