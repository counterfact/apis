import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
test("AudioNative configured settings are deterministic", async () => {
  const h = await createDispatcherHarness();
  const settings = await h.request("/v1/audio-native/sim-project/settings");
  assert.equal(settings.status, 200);
  assert.equal((await settings.json()).settings?.title, "Local article");
});
test("AudioNative rejects an unknown article URL", async () => {
  const h = await createDispatcherHarness();
  const r = await h.request("/v1/audio-native/content", {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({url:"unknown"})});
  assert.equal(r.status,400);
});
