import assert from "node:assert/strict";
import { test } from "node:test";
import { Context } from "../api/routes/productions/orders/_.context.js";
test("Production context starts empty, creates deterministic isolated orders, copies data and validates transitions", () => {
  const c = new Context();
  assert.equal(c.orders.size, 0);
  const a = c.create({ sandbox: true }),
    b = c.create({});
  assert.notEqual(a.order_id, b.order_id);
  assert.equal(c.get(a.order_id).sandbox, true);
  assert.equal(c.get(b.order_id).sandbox, false);
  const copy = c.get(a.order_id);
  copy.name = "Changed";
  assert.notEqual(c.get(a.order_id).name, "Changed");
  assert.throws(() => c.submit(a.order_id), /at least one/);
  assert.throws(() => c.update(a.order_id, { request: { name: "" } }));
  assert.throws(() => c.get("absent"));
  assert.equal(c.list({}).orders.length, 2);
  assert.equal(new Context().orders.size, 0);
});

test("Production context owns item transitions, media scoping, copies and filter rules", () => {
  const c = new Context();
  c.timestamp = "2025-01-01T00:00:00Z";
  const id = c.create({}).order_id,
    media = "prodmedia_00000000000000000000000000";
  c.orders
    .get(id)!
    .media.set(media, {
      media_id: media,
      name: "local",
      content_type: "text/plain",
      signed_url: "https://simulator.invalid/media",
    });
  const item = {
    kind: "transcription",
    source_language: "en",
    media_ids: [media],
  };
  const a = c.upsert(id, { request: { item } });
  item.media_ids.length = 0;
  assert.equal(
    (c.get(id).items[0].item as { media_ids: string[] }).media_ids.length,
    1,
  );
  c.upsert(id, {
    request: {
      item: {
        kind: "transcription",
        source_language: "es",
        media_ids: [media],
      },
      item_id: a.item_id,
    },
  });
  assert.equal(c.get(id).items.length, 1);
  assert.equal(c.get(id).items[0].item.source_language, "es");
  c.remove(id, a.item_id);
  assert.equal(c.get(id).items.length, 0);
  assert.throws(() => c.remove(id, a.item_id));
  const fresh = c.create({}).order_id;
  assert.throws(() =>
    c.upsert(fresh, {
      request: {
        item: {
          kind: "transcription",
          source_language: "en",
          media_ids: [media],
        },
      },
    }),
  );
  assert.equal(c.get(fresh).items.length, 0);
  c.upsert(id, {
    request: {
      item: {
        kind: "transcription",
        source_language: "en",
        media_ids: [media],
      },
    },
  });
  assert.equal(c.submit(id).state, "submitted");
  assert.throws(() => c.update(id, { request: { name: "No" } }));
  assert.throws(() => c.remove(id, c.get(id).items[0].item_id));
  assert.throws(() => c.submit(id));
  assert.throws(() => c.upsert(id, { request: { item } }));
  assert.equal(c.list({ status: ["submitted"] }).orders.length, 1);
  assert.equal(c.list({ status: ["open", "submitted"] }).orders.length, 2);
  assert.equal(c.list({ offset: 2 }).orders.length, 0);
  assert.throws(() => c.list({ status: ["invalid"] }));
  assert.throws(() => c.list({ status: "submitted" }));
  assert.throws(() =>
    c.list({ start_date: "2026-01-01", end_date: "2024-01-01" }),
  );
  const m = c.media(id, media);
  m.name = "Changed";
  assert.equal(c.media(id, media).name, "local");
  assert.deepEqual(c.deliverables(id), { deliverables: [] });
});

test("Production context supports dub and subtitle items without partial missing-media writes", () => {
  const c = new Context();
  c.timestamp = "2025-01-01T00:00:00Z";
  const id = c.create({}).order_id,
    m = "prodmedia_00000000000000000000000000";
  c.orders
    .get(id)!
    .media.set(m, {
      media_id: m,
      name: "local",
      content_type: "video/mp4",
      signed_url: "https://simulator.invalid/media",
    });
  const dub = {
    kind: "dub",
    source_language: "en",
    media_id: m,
    destination_languages: ["es"],
    include_captions: true,
    include_source_captions: false,
  };
  const sub = {
    kind: "subtitles",
    source_language: "en",
    media_ids: [m],
    destination_languages: ["es"],
  };
  c.upsert(id, { request: { item: dub } });
  const second = c.upsert(id, { request: { item: sub } });
  const before = c.get(id),
    counter = c.nextItemId;
  assert.throws(() =>
    c.upsert(id, { request: { item: { ...sub, media_ids: [m, "absent"] } } }),
  );
  assert.deepEqual(c.get(id), before);
  assert.equal(c.nextItemId, counter);
  assert.throws(() =>
    c.upsert(id, {
      request: {
        item: { ...dub, media_id: "absent" },
        item_id: second.item_id,
      },
    }),
  );
  assert.deepEqual(c.get(id), before);
  assert.equal(c.nextItemId, counter);
  assert.throws(() => c.update(id, { request: { name: "" } }));
  assert.deepEqual(c.get(id), before);
});
