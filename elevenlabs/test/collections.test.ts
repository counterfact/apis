import assert from "node:assert/strict";
import test from "node:test";
import * as scenarios from "../api/scenarios/index.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

const base = "/v1/voices/collections";
test("collection context CRUD isolates copies, maintains membership, and resets", async () => {
  const runner = await createScenarioRunner();
  const c = runner.loadContext("/voices/collections");
  assert.deepEqual(c.listCollections(), { collections: [] });
  await runner.run(scenarios.startup);
  assert.equal(c.listCollections().collections.length, 1);
  const input = { title: "Alpha", icon: "folder" };
  const created = c.createCollection(input);
  assert.equal(created.collection_id, "sim-collection-created-1");
  input.title = "input mutation";
  created.title = "output mutation";
  assert.equal(c.getCollection(created.collection_id)!.title, "Alpha");
  c.getCollection(created.collection_id)!.title = "detail mutation";
  c.listCollections().collections[0].title = "list mutation";
  assert.equal(c.getCollection(created.collection_id)!.title, "Alpha");
  assert.equal(c.updateCollection(created.collection_id, { title: null, icon: "star" })!.title, "Alpha");
  assert.equal(c.updateCollection(created.collection_id, {})!.icon, "star");
  c.addVoice(created.collection_id, "sim-assistant");
  c.addVoice(created.collection_id, "sim-assistant");
  assert.deepEqual(runner.context.getVoice("sim-assistant")!.collection_ids, [created.collection_id]);
  assert.equal(c.addVoice("missing", "sim-assistant").error, "collection_not_found");
  assert.equal(c.addVoice(created.collection_id, "missing").error, "voice_not_found");
  c.removeVoice(created.collection_id, "sim-assistant");
  c.removeVoice(created.collection_id, "sim-assistant");
  assert.deepEqual(runner.context.getVoice("sim-assistant")!.collection_ids, []);
  c.addVoice(created.collection_id, "sim-assistant");
  assert.deepEqual(c.deleteCollection(created.collection_id), { collection_id: created.collection_id });
  assert.deepEqual(runner.context.getVoice("sim-assistant")!.collection_ids, []);
  assert.equal(c.deleteCollection(created.collection_id), undefined);
  assert.equal(c.updateCollection("missing", {}), undefined);
  await runner.run(scenarios.emptyCollections);
  assert.deepEqual(c.listCollections(), { collections: [] });
  assert.deepEqual(runner.context.getVoice("sim-narrator")!.collection_ids, []);
  await runner.run(scenarios.reset);
  assert.equal(c.listCollections().collections.length, 1);
  assert.equal(c.createCollection({ title: "Reset", icon: "" }).collection_id, "sim-collection-created-1");
});

test("collection Dispatcher routes validate CRUD, membership reads, errors and isolation", async () => {
  const app = await createDispatcherHarness();
  const other = await createDispatcherHarness();
  const req = (path: string, method = "GET", body?: unknown) => app.request(path, {
    method, ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  });
  const read = async (path: string) => { const r = await req(path); assert.equal(r.status, 200); return r.json(); };
  const originalVoices = (await read("/v1/voices")).voices;
  const unrelated = await Promise.all(["/v1/models", "/v1/history", "/v1/user"].map(read));
  const response = await req(base, "POST", { title: "Alpha", icon: "folder" });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /application\/json/);
  const created = await response.json();
  assert.deepEqual(created, { collection_id: "sim-collection-created-1", title: "Alpha", icon: "folder", permission_on_resource: "admin" });
  const path = `${base}/${created.collection_id}`;
  assert.deepEqual(await read(path), created);
  assert.equal((await read(base)).collections[0].title, "Alpha");
  const patched = await req(path, "PATCH", { title: "Zulu", icon: null });
  assert.equal(patched.status, 200);
  assert.equal((await patched.json()).icon, "folder");
  assert.equal((await read(base)).collections.at(-1).title, "Zulu");
  assert.equal((await req(path, "PATCH", {})).status, 200);
  for (const body of [{ icon: "missing" }, { title: 1, icon: "bad" }, { title: "missing" }]) assert.equal((await req(base, "POST", body)).status, 400);
  assert.equal((await req(path, "PATCH", { title: 42 })).status, 400);
  assert.equal((await read(path)).title, "Zulu");
  const member = `${path}/voice/sim-assistant`;
  for (let i = 0; i < 2; i++) {
    const r = await req(member, "POST"); assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { collection_id: created.collection_id, voice_id: "sim-assistant" });
  }
  assert.deepEqual((await read("/v1/voices/sim-assistant")).collection_ids, [created.collection_id]);
  assert.deepEqual((await read("/v1/voices")).voices.find((v: { voice_id: string }) => v.voice_id === "sim-assistant").collection_ids, [created.collection_id]);
  assert.deepEqual((await read(`/v2/voices?collection_id=${created.collection_id}&language=es`)).voices, []);
  assert.deepEqual((await read(`/v2/voices?collection_id=${created.collection_id}`)).voices.map((v: { voice_id: string }) => v.voice_id), ["sim-assistant"]);
  assert.deepEqual((await read("/v2/voices?collection_id=missing")).voices, []);
  for (let i = 0; i < 2; i++) {
    const r = await req(member, "DELETE"); assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { collection_id: created.collection_id, voice_id: "sim-assistant" });
  }
  assert.deepEqual((await read(`/v2/voices?collection_id=${created.collection_id}`)).voices, []);
  assert.equal((await read("/v1/voices")).voices.length, originalVoices.length);
  for (const [url, method] of [[`${base}/missing`, "GET"], [`${base}/missing`, "PATCH"], [`${base}/missing`, "DELETE"], [`${base}/missing/voice/sim-assistant`, "POST"], [`${base}/missing/voice/sim-assistant`, "DELETE"], [`${path}/voice/missing`, "POST"], [`${path}/voice/missing`, "DELETE"]]) {
    const r = await req(url, method, method === "PATCH" ? {} : undefined); assert.equal(r.status, 404);
    assert.equal((await r.json()).detail.status, url.endsWith("voice/missing") ? "voice_not_found" : "collection_not_found");
  }
  await req(member, "POST");
  const deleted = await req(path, "DELETE"); assert.equal(deleted.status, 200);
  assert.deepEqual(await deleted.json(), { collection_id: created.collection_id });
  assert.equal((await req(path)).status, 404);
  assert.deepEqual((await read("/v1/voices/sim-assistant")).collection_ids, []);
  assert.deepEqual(await Promise.all(["/v1/models", "/v1/history", "/v1/user"].map(read)), unrelated);
  assert.equal((await (await other.request(base)).json()).collections.length, 1);
  await req(`${base}/sim-collection/voice/sim-assistant`, "POST");
  await req("/v1/voices/sim-assistant", "DELETE");
  assert.equal((await read(`${base}/sim-collection`)).collection_id, "sim-collection");
  assert.deepEqual((await read("/v2/voices?collection_id=sim-collection")).voices.map((v: { voice_id: string }) => v.voice_id), ["sim-narrator"]);
  assert.equal((await req(`${base}/sim-collection/voice/sim-assistant`, "POST")).status, 404);
  assert.equal((await req(`${base}/sim-collection/voice/sim-assistant`, "DELETE")).status, 404);
  await app.scenario("emptyCollections", "api");
  assert.deepEqual(await read(base), { collections: [] });
  assert.deepEqual((await read("/v1/voices/sim-narrator")).collection_ids, []);
  await app.scenario("reset", "api");
  assert.deepEqual((await read("/v1/voices")).voices, originalVoices);
  assert.equal((await (await req(base, "POST", { title: "Reset", icon: "" })).json()).collection_id, "sim-collection-created-1");
});
