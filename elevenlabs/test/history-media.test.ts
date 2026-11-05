import assert from "node:assert/strict";
import test from "node:test";
import { crc32 } from "node:zlib";
import { Context } from "../api/routes/history/_.context.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

// Read the central directory independently of the archive writer, then check
// every member against its local header, CRC and declared uncompressed size.
function unzipStored(bytes: Uint8Array) {
  const zip = Buffer.from(bytes), end = zip.length - 22;
  assert.equal(zip.readUInt32LE(end), 0x06054b50);
  assert.equal(zip.readUInt16LE(end + 4), 0);
  const count = zip.readUInt16LE(end + 10), entries = new Map<string, Buffer>();
  let offset = zip.readUInt32LE(end + 16);
  const centralStart = offset;
  for (let i = 0; i < count; i++) {
    assert.equal(zip.readUInt32LE(offset), 0x02014b50);
    assert.equal(zip.readUInt16LE(offset + 10), 0);
    const size = zip.readUInt32LE(offset + 24), nameLength = zip.readUInt16LE(offset + 28);
    const name = zip.toString("utf8", offset + 46, offset + 46 + nameLength);
    assert.ok(!name.includes("/") && !name.includes("\\"));
    const local = zip.readUInt32LE(offset + 42);
    assert.equal(zip.readUInt32LE(local), 0x04034b50);
    assert.equal(zip.readUInt16LE(local + 8), 0);
    assert.equal(zip.readUInt32LE(local + 18), size);
    assert.equal(zip.readUInt32LE(local + 22), size);
    assert.equal(zip.toString("utf8", local + 30, local + 30 + nameLength), name);
    const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
    const body = zip.subarray(start, start + size);
    assert.equal(crc32(body), zip.readUInt32LE(offset + 16));
    assert.equal(crc32(body), zip.readUInt32LE(local + 14));
    entries.set(name, body);
    offset += 46 + nameLength + zip.readUInt16LE(offset + 30) + zip.readUInt16LE(offset + 32);
  }
  assert.equal(offset, end);
  assert.equal(offset - centralStart, zip.readUInt32LE(end + 12));
  assert.equal(entries.size, count);
  return entries;
}

test("history context returns copied retained media and valid single/multiple ZIPs without mutations", async () => {
  const empty = new Context(); assert.equal(empty.audio.size, 0);
  const r = await createScenarioRunner(); await r.run(scenarios.startup);
  const c = r.loadContext("/history"), root = r.loadContext("/");
  const before = structuredClone([...c.history]), quota = root.getSubscription().character_count;
  const audio = c.getAudio("sim-history-1");
  assert.equal(audio.length, 8340); assert.deepEqual([...audio.slice(0, 4)], [255, 251, 144, 100]);
  audio[0] = 0; assert.equal(c.getAudio("sim-history-1")[0], 255);
  const single = unzipStored(c.download({ history_item_ids: ["sim-history-1"], output_format: "default" }));
  assert.deepEqual([...single.keys()], ["sim-history-1.mp3"]);
  assert.deepEqual(single.get("sim-history-1.mp3"), Buffer.from(c.getAudio("sim-history-1")));
  const multi = unzipStored(c.download({ history_item_ids: ["sim-history-2", "sim-history-1", "sim-history-2"] }));
  assert.deepEqual([...multi.keys()], ["sim-history-2.mp3", "sim-history-1.mp3"]);
  assert.deepEqual([...c.history], before); assert.equal(root.getSubscription().character_count, quota);
  const rendered = r.loadContext("/text-to-speech").speech("sim-narrator", { text: "New retained speech" });
  assert.deepEqual(c.getAudio(rendered.historyId!), rendered.audio);
  assert.equal(unzipStored(c.download({ history_item_ids: [rendered.historyId!] })).size, 1);
  c.deleteHistoryItem(rendered.historyId!); assert.equal(c.audio.has(rendered.historyId!), false);
  assert.throws(() => c.getAudio(rendered.historyId!), { status: 404 });
  await r.run(scenarios.reset); assert.equal(c.audio.size, 2);
});

test("history media rejects incomplete/unsupported downloads atomically and safely names archive members", async () => {
  const r = await createScenarioRunner(); await r.run(scenarios.startup); const c = r.loadContext("/history");
  const before = structuredClone({ history: [...c.history], audio: [...c.audio] });
  for (const body of [{ history_item_ids: [] }, { history_item_ids: [42] }, { history_item_ids: ["sim-history-1"], output_format: "wav" }, { history_item_ids: ["sim-history-1"], extra: true }, { history_item_ids: Array(101).fill("sim-history-1") }])
    assert.throws(() => c.download(body), { status: 400 });
  assert.throws(() => c.download({ history_item_ids: ["sim-history-1", "missing"] }), { status: 404 });
  assert.deepEqual({ history: [...c.history], audio: [...c.audio] }, before);
  c.audio.delete("sim-history-2"); assert.throws(() => c.getAudio("sim-history-2"), { code: "history_audio_unavailable" });
  assert.throws(() => c.download({ history_item_ids: ["sim-history-1", "sim-history-2"] }), { status: 404 });
  const sample = structuredClone(c.history.get("sim-history-1")!); sample.history_item_id = "../unsafe\\name";
  c.history.set(sample.history_item_id, sample); c.audio.set(sample.history_item_id, c.getAudio("sim-history-1"));
  assert.deepEqual([...unzipStored(c.download({ history_item_ids: [sample.history_item_id] })).keys()], ["..%2Funsafe%5Cname.mp3"]);
  c.audio.set("sim-history-1", new Uint8Array(16 * 1024 * 1024 + 1));
  assert.throws(() => c.download({ history_item_ids: ["sim-history-1"] }), { code: "history_download_too_large" });
});

test("Dispatcher exposes MPEG audio and intact ZIP content for baseline/new history with deletion/reset/isolation", async () => {
  const h = await createDispatcherHarness();
  const download = async (body: unknown, status = 200) => {
    const response = await h.request("/v1/history/download", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    assert.equal(response.status, status, await response.clone().text()); return response;
  };
  const quota = await (await h.request("/v1/user/subscription")).json();
  const response = await h.request("/v1/history/sim-history-1/audio"); assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "audio/mpeg"); assert.match(response.headers.get("content-disposition")!, /\.mp3/);
  const audio = new Uint8Array(await response.arrayBuffer()); assert.equal(audio.length, 8340); assert.deepEqual([...audio.slice(0, 4)], [255, 251, 144, 100]);
  for (const ids of [["sim-history-1"], ["sim-history-1", "sim-history-2"]]) {
    const archive = await download({ history_item_ids: ids }); assert.equal(archive.headers.get("content-type"), "application/zip");
    assert.match(archive.headers.get("content-disposition")!, /history\.zip/);
    const files = unzipStored(new Uint8Array(await archive.arrayBuffer())); assert.equal(files.size, ids.length);
    assert.deepEqual(files.get("sim-history-1.mp3"), Buffer.from(audio));
  }
  assert.deepEqual(await (await h.request("/v1/user/subscription")).json(), quota);
  const generated = await h.request("/v1/text-to-speech/sim-narrator", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: "New history audio" }) });
  assert.equal(generated.status, 200); const id = generated.headers.get("history-item-id")!;
  assert.deepEqual(new Uint8Array(await (await h.request(`/v1/history/${id}/audio`)).arrayBuffer()), new Uint8Array(await generated.arrayBuffer()));
  assert.equal(unzipStored(new Uint8Array(await (await download({ history_item_ids: [id] })).arrayBuffer())).size, 1);
  assert.equal((await h.request("/v1/voices/sim-narrator", { method: "DELETE" })).status, 200);
  assert.equal((await h.request(`/v1/history/${id}/audio`)).status, 200);
  await download({ history_item_ids: ["sim-history-1"], output_format: "wav" }, 400);
  await download({ history_item_ids: ["sim-history-1", "missing"] }, 404);
  assert.equal((await h.request("/v1/history/missing/audio")).status, 404);
  assert.equal((await h.request("/v1/history/sim-history-1", { method: "DELETE" })).status, 200);
  assert.equal((await h.request("/v1/history/sim-history-1/audio")).status, 404);
  const other = await createDispatcherHarness(); assert.equal((await other.request("/v1/history/sim-history-1/audio")).status, 200);
  await h.scenario("historyWithoutAudio");
  assert.equal((await h.request("/v1/history/sim-history-2")).status, 200);
  assert.equal((await h.request("/v1/history/sim-history-2/audio")).status, 404);
  await download({ history_item_ids: ["sim-history-2"] }, 404);
  await h.scenario("reset"); assert.equal((await h.request("/v1/history/sim-history-1/audio")).status, 200);
});
