import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { Context } from "../api/routes/convai/conversations/_.context.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const base = "/v1/convai/conversations/";
const id = "sim-conversation";
const hash = "5a8c648164ba405f8ddd927c3fa307e83410cedcf2ada38d4b1b14b18d0c7856";
const digest = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");

test("conversation file Dispatcher rejects deletion of historical attachments", async () => {
  const app = await createDispatcherHarness();
  const response = await app.request(base + id + "/files/sim-file-used", {method:"DELETE"});
  assert.equal(response.status, 409);
  assert.equal((await response.json()).detail.status, "conversation_file_in_use");
});

test("conversation media Dispatcher serves bounded audio and enforces file ownership and usage atomically", async () => {
  const app = await createDispatcherHarness();
  const initialAudio = await app.request(base + id + "/audio");
  assert.equal(initialAudio.status, 200);
  assert.equal(digest(new Uint8Array(await initialAudio.arrayBuffer())), hash);
  const before = await (await app.request(base + id)).json();
  assert.equal(before.has_audio, true);
  assert.equal(before.has_response_audio, true);
  assert.equal(before.has_user_audio, false);
  for (let n = 0; n < 2; n++) {
    const audio = await app.request(base + id + "/audio");
    assert.equal(audio.status, 200);
    assert.equal(audio.headers.get("content-type"), "audio/mpeg");
    const bytes = new Uint8Array(await audio.arrayBuffer());
    assert.equal(bytes.length, 8340);
    assert.equal(digest(bytes), hash);
  }
  for (const [path, status] of [["missing/audio", 404], ["sim-conversation-old/audio", 409], [id + "/audio?output_format=pcm_16000", 400], [id + "/audio?download=true", 400]] as const) {
    assert.equal((await app.request(base + path)).status, status);
  }
  for (const [conversation, file, status] of [["missing", "sim-file-unused", 404], ["sim-conversation-old", "sim-file-unused", 404], [id, "missing", 404], [id, "sim-file-used", 409]] as const) {
    assert.equal((await app.request(base + conversation + "/files/" + file, {method:"DELETE"})).status, status);
  }
  assert.deepEqual(await (await app.request(base + id)).json(), before);
  const deleted = await app.request(base + id + "/files/sim-file-unused", {method:"DELETE"});
  assert.equal(deleted.status, 200);
  assert.deepEqual(await deleted.json(), {file_id:"sim-file-unused"});
  assert.equal((await app.request(base + id + "/files/sim-file-unused", {method:"DELETE"})).status, 404);
  assert.deepEqual(await (await app.request(base + id)).json(), before);
  assert.equal(digest(new Uint8Array(await (await app.request(base + id + "/audio")).arrayBuffer())), hash);
  await app.request("/v1/convai/agents/sim-agent", {method:"DELETE"});
  assert.equal((await app.request(base + id + "/audio")).status, 200);
  assert.equal((await app.request(base + id, {method:"DELETE"})).status, 200);
  assert.equal((await app.request(base + id + "/audio")).status, 404);
  assert.equal((await app.request(base + id + "/files/sim-file-used", {method:"DELETE"})).status, 404);
  await app.scenario("reset");
  assert.deepEqual(await (await app.request(base + id)).json(), before);
  assert.equal((await app.request(base + id + "/files/sim-file-unused", {method:"DELETE"})).status, 200);
  await app.scenario("emptyConversations");
  assert.equal((await app.request(base + id + "/audio")).status, 404);
});

test("conversation media Context copies bytes, uses canonical transcript references, cleans up and isolates reset", async () => {
  const empty = new Context();
  assert.equal(empty.audio.size, 0);
  assert.equal(empty.files.size, 0);
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const c = runner.loadContext("/convai/conversations");
  const other = await createScenarioRunner();
  await other.run(scenarios.startup);
  const baseline = c.getConversation(id);
  const bytes = c.getAudio(id);
  assert.equal(digest(bytes), hash);
  bytes.fill(0);
  assert.equal(digest(c.getAudio(id)), hash);
  const state = structuredClone({audio:c.audio, files:c.files, conversations:c.conversations});
  for (const operation of [() => c.getAudio("missing"), () => c.getAudio("sim-conversation-old"), () => c.getAudio(id, {output_format:"wav"}), () => c.deleteFile(id,"sim-file-used"), () => c.deleteFile("sim-conversation-old", "sim-file-unused"), () => c.deleteFile(id,"missing")]) assert.throws(operation);
  assert.deepEqual({audio:c.audio, files:c.files, conversations:c.conversations}, state);
  // Both the legacy and current transcript attachment fields prevent deletion.
  const turn = c.conversations.get(id)!.transcript[0];
  const used = turn.file_inputs![0];
  turn.file_input = structuredClone(used);
  turn.file_inputs = [];
  assert.throws(() => c.deleteFile(id, "sim-file-used"));
  assert.deepEqual(c.deleteFile(id,"sim-file-unused"), {file_id:"sim-file-unused"});
  assert.equal(c.files.get(id)!.has("sim-file-unused"), false);
  assert.throws(() => c.deleteFile(id,"sim-file-unused"));
  assert.equal(other.loadContext("/convai/conversations").files.get(id)!.has("sim-file-unused"), true);
  c.deleteConversation(id);
  assert.equal(c.audio.has(id), false);
  assert.equal(c.files.has(id), false);
  assert.equal(c.sipMessages.has(id), false);
  assert.equal([...c.references.values()].includes(id), false);
  await runner.run(scenarios.reset);
  assert.deepEqual(c.getConversation(id), baseline);
  assert.equal(digest(c.getAudio(id)), hash);
  assert.equal(c.files.get(id)!.size, 2);
  assert.equal(other.loadContext("/convai/conversations").getAudio(id).length, 8340);
  c.audio.delete(id);
  assert.equal(c.getConversation(id).has_audio, false);
  assert.equal(c.getConversation(id).has_response_audio, false);
  assert.throws(() => c.getAudio(id));
  await runner.run(scenarios.emptyConversations);
  assert.equal(c.audio.size, 0);
  assert.equal(c.files.size, 0);
});
