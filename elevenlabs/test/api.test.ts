import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

test("multi-version config serves both versions with their own response shape", async () => {
  const { request } = await createDispatcherHarness();
  const v1 = await request("/v1/voices");
  assert.equal(v1.status, 200);
  const first = await v1.json();
  assert.ok(Array.isArray(first.voices));
  assert.equal("has_more" in first, false);
  const v2 = await request("/v2/voices");
  assert.equal(v2.status, 200);
  const second = await v2.json();
  assert.ok(Array.isArray(second.voices));
  assert.equal(typeof second.has_more, "boolean");
  assert.equal(typeof second.total_count, "number");
  const models = await request("/v1/models");
  assert.equal(models.status, 200);
  assert.ok(Array.isArray(await models.json()));
});


test("V2 rejects V1-only operations and malformed nullable booleans", async () => {
  const { request } = await createDispatcherHarness();
  assert.equal((await request("/v2/models")).status, 404);
  assert.equal((await request("/v2/voices/sim-narrator", { method: "DELETE" })).status, 404);
  assert.equal((await request("/v1/convai/agents?archived=not-a-boolean")).status, 400);
  const response = await request("/v1/voices/sim-narrator");
  assert.equal(response.status, 200);
});
