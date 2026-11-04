import assert from "node:assert/strict";
import test from "node:test";
import { startSimulator } from "../test-support/simulator.js";

test("voice settings persist across HTTP requests, deletion and reset stay consistent", async () => {
  const { app, server, request } = await startSimulator();
  const get = async (path: string) => {
    const response = await request(path);
    assert.equal(response.status, 200);
    return response.json();
  };
  const edit = (body: unknown) =>
    request("/v1/voices/sim-narrator/settings/edit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  try {
    const baseline = await get("/v1/voices/settings/default");
    assert.equal(baseline.stability, 0.5);
    assert.equal((await get("/v1/voices")).voices.length, 2);
    assert.deepEqual(
      await (await edit({ stability: 0.2, speed: 1.1 })).json(),
      { status: "ok" },
    );
    const settings = await get("/v1/voices/sim-narrator/settings");
    assert.equal(settings.stability, 0.2);
    assert.equal(settings.similarity_boost, baseline.similarity_boost);
    assert.deepEqual((await get("/v1/voices/sim-narrator")).settings, settings);
    assert.deepEqual((await get("/v1/voices")).voices[0].settings, settings);
    assert.deepEqual((await get("/v2/voices")).voices[0].settings, settings);
    const firstPage = await get("/v2/voices?page_size=1");
    assert.equal(firstPage.voices.length, 1);
    assert.equal(firstPage.total_count, 2);
    assert.equal(firstPage.has_more, true);
    assert.equal(typeof firstPage.next_page_token, "string");
    const lastPage = await get(
      `/v2/voices?page_size=1&next_page_token=${firstPage.next_page_token}`,
    );
    assert.equal(lastPage.has_more, false);
    assert.equal(lastPage.next_page_token, null);
    assert.equal(lastPage.voices.length, 1);
    assert.notEqual(firstPage.voices[0].voice_id, lastPage.voices[0].voice_id);
    assert.equal(
      (await get("/v2/voices?search=narration")).voices[0].voice_id,
      "sim-narrator",
    );
    assert.equal((await get("/v2/voices?search=absent")).voices.length, 0);
    assert.equal((await get("/v2/voices?category=premade")).voices.length, 0);
    assert.equal(
      (await get("/v2/voices?sort=name&sort_direction=asc")).voices[0].voice_id,
      "sim-assistant",
    );
    for (const query of [
      "page_size=0",
      "page_size=101",
      "next_page_token=bad",
      "next_page_token=-1",
      "sort=bad",
      "sort_direction=bad",
      "gender=female",
    ]) {
      assert.equal((await request(`/v2/voices?${query}`)).status, 400, query);
    }
    assert.equal(
      (await get("/v1/voices/sim-assistant/settings")).stability,
      0.5,
    );
    assert.deepEqual(await get("/v1/voices/settings/default"), baseline);
    assert.equal((await edit({ stability: 2 })).status, 400);
    assert.deepEqual(await get("/v1/voices/sim-narrator/settings"), settings);
    assert.equal((await edit({ stability: "bad" })).status, 400);
    assert.equal((await edit(null)).status, 400);
    assert.equal((await request("/v1/voices/missing")).status, 404);
    const deleted = await request("/v1/voices/sim-narrator", {
      method: "DELETE",
    });
    assert.equal(deleted.status, 200);
    assert.deepEqual(await deleted.json(), { status: "ok" });
    assert.equal((await get("/v1/voices")).voices.length, 1);
    assert.deepEqual(
      (await get("/v2/voices")).voices.map(
        (voice: { voice_id: string }) => voice.voice_id,
      ),
      ["sim-assistant"],
    );
    assert.equal(
      (await request("/v1/voices/sim-narrator/settings")).status,
      404,
    );
    assert.equal((await edit({ stability: 0.4 })).status, 404);
    assert.equal(
      (await request("/v1/voices/sim-narrator", { method: "DELETE" })).status,
      404,
    );
    await app.scenario("reset", "api");
    assert.equal((await get("/v1/voices")).voices.length, 2);
    assert.equal((await get("/v2/voices")).voices.length, 2);
    assert.deepEqual(await get("/v1/voices/sim-narrator/settings"), baseline);
    // An untouched operation still serves its generated random response.
    assert.ok(Array.isArray(await get("/v1/models")));
  } finally {
    await server.stop();
  }
});
