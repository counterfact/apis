import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

test("dispatcher harness loads versioned routes, startup state, and isolated instances", async () => {
  const first = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const voices = await first.request("/v1/voices");
  assert.equal(voices.status, 200);
  assert.match(voices.headers.get("content-type")!, /application\/json/);
  assert.equal((await voices.json()).voices.length, 2);
  assert.equal((await first.request("/v1/voices/sim-narrator", { method: "DELETE" })).status, 200);
  assert.equal((await (await first.request("/v2/voices")).json()).total_count, 1);
  assert.equal((await (await second.request("/v2/voices")).json()).total_count, 2);
  await first.scenario("reset", "api");
  assert.equal((await (await first.request("/v2/voices")).json()).total_count, 2);
  assert.equal((await first.request("/v10/voices")).status, 404);
  assert.equal((await first.request("/v1/not-a-route")).status, 404);
  assert.equal((await first.request("/v1/voices", { method: "PATCH" })).status, 405);
  await assert.rejects(first.scenario("missing", "api"), /not a function exported/);
  await assert.rejects(first.scenario("reset", "wrong-group"), /group/i);
});

test("dispatcher harness preserves repeated query parameters and validates JSON bodies", async () => {
  const simulator = await createDispatcherHarness();
  const filtered = await simulator.request("/v2/voices?voice_ids=sim-narrator&voice_ids=sim-assistant");
  assert.equal(filtered.status, 200);
  assert.equal((await filtered.json()).total_count, 2);
  const invalid = await simulator.request("/v1/voices/sim-narrator/settings/edit", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stability: 2 }),
  });
  assert.equal(invalid.status, 400);
  const unchanged = await simulator.request("/v1/voices/sim-narrator/settings");
  assert.equal((await unchanged.json()).stability, 0.5);
  await assert.rejects(simulator.request("/v1/voices/sim-narrator/settings/edit", {
    method: "POST", body: new FormData(),
  }), /JSON/);
});

test("multipart harness keeps request validation and rejects missing required fields", async () => {
  const app = await createDispatcherHarness();
  const response = await app.requestMultipart("/v1/voices/sim-narrator/edit", {});
  assert.equal(response.status, 400);
  assert.equal((await (await app.request("/v1/voices/sim-narrator")).json()).name, "Simulator Narrator");
});
