import assert from "node:assert/strict";
import { test } from "node:test";
import { Context } from "../api/routes/flows/_.context.js";
test("Flows context starts empty, stores copied metadata and scopes records by kind", () => {
  const c = new Context();
  assert.equal(c.generations.size, 0);
  const input = {
    model_id: "gpt-image-1",
    prompt: "Local image",
    quality: "low",
  };
  const created = c.create("image", input);
  input.prompt = "Changed";
  assert.equal(c.generations.get(created.id)!.request.prompt, "Local image");
  assert.deepEqual(c.get("image", created.id), created);
  assert.throws(() => c.get("video", created.id));
  const list = c.list("image", {});
  list.generations[0].id = "changed";
  assert.equal(c.get("image", created.id).id, created.id);
  assert.equal(c.list("image", { status: "completed" }).generations.length, 0);
  assert.equal(c.list("image", { model_id: "other" }).generations.length, 0);
  assert.equal(new Context().generations.size, 0);
});
test("Flows context validates atomic failures and deterministic filtered pagination", () => {
  const c = new Context();
  const input = { model_id: "gpt-image-1", prompt: "Local image" };
  for (const value of [
    null,
    {},
    { ...input, prompt: " " },
    { ...input, model_id: "eleven_flash_v2_5" },
    { ...input, webhook: { type: "all" } },
    { ...input, images: [{}] },
  ])
    assert.throws(() => c.create("image", value));
  assert.equal(c.nextId, 1);
  assert.equal(c.generations.size, 0);
  for (let i = 0; i < 3; i++) c.create("image", input);
  assert.deepEqual(
    c.list("image", { page_size: 1 }).generations.map((x) => x.id),
    ["sim-flow-created-3"],
  );
  assert.equal(c.list("image", { page_size: 1 }).next_cursor, "1");
  assert.equal(c.list("image", { cursor: "99" }).generations.length, 0);
  for (const q of [
    { page_size: 0 },
    { page_size: 101 },
    { cursor: "abc" },
    { status: "no" },
  ])
    assert.throws(() => c.list("image", q));
  assert.equal(c.generations.size, 3);
});
