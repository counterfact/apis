import assert from "node:assert/strict";
import { test } from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
const bodies = {
  image: { model_id: "gpt-image-1", prompt: "Synthetic landscape" },
  video: { model_id: "veo-3.1-generate-001", prompt: "Synthetic landscape" },
  "text-to-speech": {
    model_id: "eleven_flash_v2_5",
    text: "Local record",
    voice: "sim-narrator",
  },
};
const json = (body: unknown) => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
test("Flows creates isolated pending records and scenarios expose terminal metadata", async () => {
  const h = await createDispatcherHarness();
  for (const kind of Object.keys(bodies) as (keyof typeof bodies)[]) {
    const base = `/v1/flows/${kind}`;
    const initial = await h.request(base);
    assert.equal(initial.status, 200);
    assert.equal((await initial.json()).generations[0].id, `sim-flow-${kind}`);
    const r = await h.request(base, json(bodies[kind]));
    assert.equal(r.status, 200);
    assert.match(r.headers.get("content-type")!, /application\/json/);
    const created = await r.json();
    assert.deepEqual(created, {
      id: `sim-flow-created-${Object.keys(bodies).indexOf(kind) + 1}`,
      status: "pending",
    });
    const detail = await h.request(`${base}/${created.id}`);
    assert.equal(detail.status, 200);
    assert.deepEqual(await detail.json(), created);
    const list = await h.request(
      `${base}?status=pending&model_id=${bodies[kind].model_id}`,
    );
    assert.deepEqual((await list.json()).generations, [created]);
    const other = kind === "image" ? "video" : "image";
    assert.equal(
      (await h.request(`/v1/flows/${other}/${created.id}`)).status,
      404,
    );
  }
  await h.scenario("startFlowGenerations");
  assert.equal(
    (await (await h.request("/v1/flows/image/sim-flow-created-1")).json())
      .status,
    "generating",
  );
  await h.scenario("completeFlowGenerations");
  const done = await h.request("/v1/flows/image/sim-flow-created-1");
  assert.equal(done.status, 200);
  assert.deepEqual(await done.json(), {
    id: "sim-flow-created-1",
    status: "completed",
    content_url: "https://simulator.invalid/flows/sim-flow-created-1",
    content_mime_type: "image/png",
  });
  await h.request("/v1/flows/image", json(bodies.image));
  await h.scenario("failFlowGenerations");
  const failed = await h.request("/v1/flows/image/sim-flow-created-4");
  assert.equal(failed.status, 200);
  assert.equal((await failed.json()).failure_reason, "model_error");
  assert.equal(
    (await (await h.request("/v1/flows/image/sim-flow-created-1")).json())
      .status,
    "completed",
  );
  await h.scenario("reset");
  assert.equal(
    (await h.request("/v1/flows/image/sim-flow-created-1")).status,
    404,
  );
});
test("Flows pagination, errors, empty/reset and instances preserve state", async () => {
  const h = await createDispatcherHarness(),
    base = "/v1/flows/image";
  for (let n = 0; n < 3; n++)
    assert.equal((await h.request(base, json(bodies.image))).status, 200);
  const first = await h.request(base + "?page_size=2");
  assert.equal(first.status, 200);
  const page = await first.json();
  assert.deepEqual(
    page.generations.map((x: { id: string }) => x.id),
    ["sim-flow-created-3", "sim-flow-created-2"],
  );
  assert.equal(page.has_more, true);
  assert.equal(page.next_cursor, "2");
  const second = await (await h.request(base + "?page_size=2&cursor=2")).json();
  assert.equal(second.has_more, false);
  assert.equal(second.next_cursor, null);
  assert.equal(second.generations.length, 2);
  for (const suffix of ["?cursor=-1", "?page_size=0", "?status=unknown"])
    assert.equal((await h.request(base + suffix)).status, 400);
  for (const body of [
    { model_id: "unknown", prompt: "x" },
    { ...bodies.image, prompt: "" },
    { ...bodies.image, webhook: { type: "all" } },
    { ...bodies.image, images: [{ type: "asset", asset_id: "sim-asset" }] },
  ])
    assert.equal((await h.request(base, json(body))).status, 400);
  assert.equal((await (await h.request(base)).json()).generations.length, 4);
  const malformed = await h.request(base, json({}));
  assert.equal(malformed.status, 400);
  await h.scenario("emptyFlowGenerations");
  assert.deepEqual(await (await h.request(base)).json(), {
    generations: [],
    has_more: false,
    next_cursor: null,
  });
  const other = await createDispatcherHarness();
  assert.equal(
    (await (await other.request(base)).json()).generations.length,
    1,
  );
  await h.scenario("reset");
  assert.equal((await (await h.request(base)).json()).generations.length, 1);
});
