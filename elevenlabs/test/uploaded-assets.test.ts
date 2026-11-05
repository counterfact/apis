import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const order = "prodorder_00000000000000000000000000";
const base = `/v1/productions/orders/${order}`;
const file = () => ({
  data: new Uint8Array([255, 251, 144, 100]),
  filename: "source.mp3",
  contentType: "audio/mpeg",
  size: 4,
});
const json = (body: unknown) => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

test("asset uploads persist copies in canonical records and reset/delete remove payload", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/assets");
  const source = file();
  const a = c.upload("My source", source);
  source.data[0] = 0;
  source.filename = "changed";
  a.name = "changed";
  assert.equal(c.get(a.asset_id).name, "My source");
  assert.equal(c.getUpload(a.asset_id)!.data[0], 255);
  const copy = c.getUpload(a.asset_id)!;
  copy.data[0] = 0;
  assert.equal(c.getUpload(a.asset_id)!.data[0], 255);
  assert.equal(c.list({ search: "My source" }).assets.length, 1);
  assert.equal("upload" in c.get(a.asset_id), false);
  const before = structuredClone(c.records),
    counter = c.nextUpload;
  for (const [name, f] of [
    [" ", file()],
    ["x", { ...file(), size: 9 }],
    ["x", { ...file(), data: new Uint8Array(), size: 0 }],
    ["x", { ...file(), contentType: "invalid" }],
    ["x", { ...file(), filename: " " }],
    ["x", { ...file(), data: new Uint8Array(1048577), size: 1048577 }],
  ] as const)
    assert.throws(() => c.upload(name, f));
  assert.deepEqual(c.records, before);
  assert.equal(c.nextUpload, counter);
  c.delete(a.asset_id);
  assert.throws(() => c.getUpload(a.asset_id));
  await r.run(scenarios.reset);
  assert.deepEqual(c.upload("Again", file()).asset_id, a.asset_id);
});

test("asset multipart Dispatcher uploads normal requests and preserves read/list/delete lifecycle", async () => {
  const h = await createDispatcherHarness();
  const response = await h.requestMultipart("/v1/assets", {
    name: "Uploaded source",
    asset: file(),
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /json/);
  const a = await response.json();
  assert.equal(a.name, "Uploaded source");
  assert.equal(a.mime_type, "audio/mpeg");
  assert.equal(a.created_at_unix, 1735689700);
  assert.match(a.content_url, /simulator.invalid/);
  assert.equal("upload" in a, false);
  assert.deepEqual(
    await (await h.request(`/v1/assets/${a.asset_id}`)).json(),
    a,
  );
  assert.equal(
    (await (await h.request("/v1/assets?search=Uploaded")).json()).assets[0]
      .asset_id,
    a.asset_id,
  );
  assert.equal(
    (await h.requestMultipart("/v1/assets", { name: "No file" })).status,
    400,
  );
  assert.equal(
    (await h.requestMultipart("/v1/assets", { name: " ", asset: file() }))
      .status,
    400,
  );
  assert.equal(
    (await h.request(`/v1/assets/${a.asset_id}`, { method: "DELETE" })).status,
    204,
  );
  assert.equal((await h.request(`/v1/assets/${a.asset_id}`)).status, 404);
  await h.scenario("reset");
  assert.equal((await (await h.request("/v1/assets")).json()).assets.length, 2);
});

test("production registration owns cloned payload, language and order scoped atomic writes", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/productions/orders");
  const source = file();
  const { media_id } = c.registerMedia(order, {
    declared_language: "en",
    media: source,
  });
  source.data[0] = 0;
  assert.equal(c.mediaUpload(order, media_id)!.data[0], 255);
  const copy = c.mediaUpload(order, media_id)!;
  copy.data[0] = 0;
  assert.equal(c.mediaUpload(order, media_id)!.data[0], 255);
  assert.equal(c.media(order, media_id).name, "source.mp3");
  assert.equal("upload" in c.media(order, media_id), false);
  const before = structuredClone(c.orders),
    counter = c.nextMediaId;
  c.languages.set("transcription", {
    kind: "single",
    languages: [{ code: "en", label: "English" }],
  });
  c.languages.set("dub", {
    kind: "pair",
    language_pairs: [
      {
        source_language: { code: "en", label: "English" },
        destination_languages: [{ code: "fr", label: "French" }],
      },
    ],
  });
  assert.throws(() =>
    c.registerMedia(order, { declared_language: "fr", media: file() }),
  );
  c.languages.set("transcription", {
    kind: "single",
    languages: [
      { code: "en", label: "English" },
      { code: "es", label: "Spanish" },
    ],
  });
  for (const body of [
    { declared_language: "en" },
    { declared_language: "xx", media: file() },
    {
      declared_language: "en",
      media: file(),
      media_url: "https://simulator.invalid/production-source.mp3",
    },
    {
      declared_language: "en",
      media: { ...file(), contentType: "text/plain" },
    },
    {
      declared_language: "en",
      media: { ...file(), data: new Uint8Array(1048577), size: 1048577 },
    },
    { declared_language: "en", media: { ...file(), size: 3 } },
    { declared_language: "en", media: file(), media_url_filename: "extra.mp3" },
    {
      declared_language: "en",
      media_url: "https://simulator.invalid/production-source.mp3",
      media_url_filename: "a.mp3",
      media_url_content_type: "video/mp4",
    },
    {
      declared_language: "en",
      media_url: "https://other.invalid/a",
      media_url_filename: "a.mp3",
      media_url_content_type: "audio/mpeg",
    },
    {
      declared_language: "en",
      media_url: "https://simulator.invalid/production-source.mp3",
    },
  ])
    assert.throws(() => c.registerMedia(order, body));
  assert.deepEqual(c.orders, before);
  assert.equal(c.nextMediaId, counter);
  assert.throws(() =>
    c.registerMedia("absent", { declared_language: "en", media: file() }),
  );
  const fresh = c.create({}).order_id;
  assert.throws(() => c.media(fresh, media_id));
  const url = c.registerMedia(order, {
    declared_language: "es",
    media_url: "https://simulator.invalid/production-source.mp3",
    media_url_filename: "remote.mp3",
    media_url_content_type: "audio/mpeg",
  });
  assert.equal(c.mediaUpload(order, url.media_id)!.size, 8340);
  assert.equal(c.media(order, url.media_id).language, "es");
  c.upsert(order, {
    request: {
      item: {
        kind: "transcription",
        source_language: "en",
        media_ids: [media_id],
      },
    },
  });
  c.submit(order);
  assert.throws(
    () => c.registerMedia(order, { declared_language: "en", media: file() }),
    { code: "production_order_not_open" },
  );
  await r.run(scenarios.reset);
  assert.throws(() => c.media(order, media_id));
  assert.equal(c.nextMediaId, 1);
});

test("production multipart registrations work with file/fixture URL and feed the order lifecycle", async () => {
  const h = await createDispatcherHarness();
  const response = await h.requestMultipart(`${base}/media`, {
    declared_language: "en",
    media: file(),
  });
  assert.equal(response.status, 200);
  const { media_id } = await response.json();
  assert.match(media_id, /^prodmedia_[a-z0-9]{26}$/);
  const stored = await (await h.request(`${base}/media/${media_id}`)).json();
  assert.equal(stored.name, "source.mp3");
  assert.equal(stored.content_type, "audio/mpeg");
  assert.equal(stored.language, "en");
  assert.match(stored.signed_url, /simulator.invalid/);
  assert.equal("upload" in stored, false);
  const url = await h.requestMultipart(`${base}/media`, {
    declared_language: "es",
    media_url: "https://simulator.invalid/production-source.mp3",
    media_url_filename: "remote.mp3",
    media_url_content_type: "audio/mpeg",
  });
  assert.equal(url.status, 200);
  for (const body of [
    { media: file() },
    { declared_language: "en" },
    { declared_language: "xx", media: file() },
    {
      declared_language: "en",
      media: file(),
      media_url: "https://other.invalid/x",
    },
  ])
    assert.equal((await h.requestMultipart(`${base}/media`, body)).status, 400);
  assert.equal(
    (
      await h.requestMultipart(
        "/v1/productions/orders/prodorder_11111111111111111111111111/media",
        { declared_language: "en", media: file() },
      )
    ).status,
    404,
  );
  assert.equal(
    (
      await h.request(
        `${base}/items`,
        json({
          request: {
            item: {
              kind: "transcription",
              source_language: "en",
              media_ids: [media_id],
            },
          },
        }),
      )
    ).status,
    200,
  );
  assert.equal(
    (await h.request(`${base}/submit`, { method: "POST" })).status,
    200,
  );
  assert.equal(
    (
      await h.requestMultipart(`${base}/media`, {
        declared_language: "en",
        media: file(),
      })
    ).status,
    409,
  );
  await h.scenario("completeProductionOrders");
  assert.equal(
    (await (await h.request(`${base}/deliverables`)).json()).deliverables
      .length,
    1,
  );
  await h.scenario("reset");
  assert.equal((await h.request(`${base}/media/${media_id}`)).status, 404);
  const isolated = await createDispatcherHarness();
  assert.equal(
    (await isolated.request(`${base}/media/${media_id}`)).status,
    404,
  );
});
