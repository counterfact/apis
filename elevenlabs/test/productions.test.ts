import assert from "node:assert/strict";
import { test } from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
const id = "prodorder_00000000000000000000000000",
  media = "prodmedia_00000000000000000000000000",
  base = "/v1/productions/orders";
const item = {
  kind: "transcription",
  media_ids: [media],
  source_language: "en",
  verbatim: false,
};
const json = (method: string, body: unknown) => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
test("Productions workflow persists metadata, items, submission and scenario completion", async () => {
  const h = await createDispatcherHarness();
  const req = async (path: string, init: RequestInit = {}, status = 200) => {
    const r = await h.request(base + path, init);
    assert.equal(r.status, status);
    if (status === 200)
      assert.match(r.headers.get("content-type") ?? "", /application\/json/);
    return status === 200 ? r.json() : r.text();
  };
  assert.equal((await req("")).orders.length, 1);
  assert.equal((await req(`/${id}/media/${media}`)).name, "local-source.mp4");
  assert.equal(
    (await req(`/${id}`, json("PATCH", { request: { name: "Revised" } }))).name,
    "Revised",
  );
  const added = await req(`/${id}/items`, json("POST", { request: { item } }));
  assert.match(added.item_id, /^proditem_[a-z0-9]{26}$/);
  assert.equal(added.quote, null);
  assert.equal((await req(`/${id}`)).items.length, 1);
  for (const variant of [
    {
      kind: "dub",
      media_id: media,
      source_language: "en",
      destination_languages: ["es"],
      include_captions: true,
      include_source_captions: false,
    },
    {
      kind: "subtitles",
      media_ids: [media],
      source_language: "en",
      destination_languages: ["es"],
    },
  ]) {
    const addedVariant = await req(
      `/${id}/items`,
      json("POST", { request: { item: variant } }),
    );
    await req(`/${id}/items/${addedVariant.item_id}`, { method: "DELETE" });
  }

  assert.equal(
    (
      await req(
        `/${id}/items`,
        json("POST", {
          request: {
            item: { ...item, instructions: "Updated" },
            item_id: added.item_id,
          },
        }),
      )
    ).item_id,
    added.item_id,
  );
  assert.deepEqual(
    await req(`/${id}/items/${added.item_id}`, { method: "DELETE" }),
    { success: true },
  );
  await req(`/${id}/submit`, { method: "POST" }, 400);
  await req(`/${id}/items`, json("POST", { request: { item } }));
  assert.equal(
    (await req(`/${id}/submit`, { method: "POST" })).state,
    "submitted",
  );
  await req(`/${id}`, json("PATCH", { request: { name: "No" } }), 409);
  await req(`/${id}/items`, json("POST", { request: { item } }), 409);
  await req(`/${id}/items/${added.item_id}`, { method: "DELETE" }, 409);
  await req(`/${id}/submit`, { method: "POST" }, 409);
  assert.deepEqual(await req(`/${id}/deliverables`), { deliverables: [] });
  await h.scenario("completeProductionOrders");
  assert.equal((await req(`/${id}/deliverables`)).deliverables.length, 1);
  assert.equal((await req("?status=done")).orders.length, 1);
  const fresh = await req("", json("POST", { sandbox: true }));
  assert.equal(fresh.sandbox, true);
  assert.notEqual(fresh.order_id, id);
  assert.equal((await req(`/${fresh.order_id}`)).state, "open");
  await h.scenario("reset");
  assert.equal((await req("")).orders.length, 1);
  await req(`/${fresh.order_id}`, {}, 404);
});
test("Productions validates errors, filtering, language discovery and isolated reset", async () => {
  const h = await createDispatcherHarness();
  const req = async (path: string, init: RequestInit = {}, status = 200) => {
    const r = await h.request(base + path, init);
    assert.equal(r.status, status);
    if (status === 200)
      assert.match(r.headers.get("content-type") ?? "", /application\/json/);
    return status === 200 ? r.json() : r.text();
  };
  for (const kind of ["dub", "subtitles", "transcription"])
    assert.equal(
      (await req(`/languages/${kind}`)).kind,
      kind === "transcription" ? "single" : "pair",
    );
  await req(`/${id}`, json("PATCH", { request: { name: "" } }), 400);
  await req(
    `/${id}/items`,
    json("POST", {
      request: {
        item: { ...item, media_ids: ["prodmedia_11111111111111111111111111"] },
      },
    }),
    404,
  );
  await req(
    `/${id}/items/proditem_11111111111111111111111111`,
    { method: "DELETE" },
    404,
  );
  await req("?page_size=0", {}, 400);
  await req("?start_date=garbage", {}, 400);
  for (const q of [
    "status=done",
    "start_date=2026-01-01T00:00:00Z",
    "end_date=2024-01-01T00:00:00Z",
    "offset=1",
  ])
    assert.deepEqual(await req("?" + q), { orders: [] });
  await h.scenario("emptyProductionOrders");
  assert.deepEqual(await req(""), { orders: [] });
  await req(`/${id}`, {}, 404);
  const other = await createDispatcherHarness();
  assert.equal((await (await other.request(base)).json()).orders.length, 1);
  await h.scenario("reset");
  assert.equal((await req("")).orders.length, 1);
});
