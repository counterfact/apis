import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../api/routes/flows/templates/_.context.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

const template = "sim-template-text";
const body = (value: unknown): RequestInit => ({
  method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify(value),
});
const setup = async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  return { runner, c: runner.loadContext("/flows/templates") };
};

test("template runs snapshot selected versions and inputs, complete once, and reset", async () => {
  assert.equal(new Context().records.size, 0);
  const { runner, c } = await setup();
  const request = { inputs: { prompt: "Original" } };
  const run = c.createRun(template, request);
  assert.deepEqual(run, {
    id: "sim-template-created-1", template_id: template,
    version_id: `${template}-v2`, status: "pending",
    outputs: { result: { id: "sim-template-created-1-result", type: "string", status: "pending" } },
  });
  request.inputs.prompt = "Changed";
  run.outputs.result.id = "Changed";
  const record = c.records.get(run.id)!;
  assert.equal(record.execution!.request.inputs.prompt, "Original");
  assert.equal(record.execution!.version.version_id, `${template}-v2`);
  c.templates.get(template)!.versions[0].completionContent!.result = "Changed fixture";
  c.templates.get(template)!.versions[0].value.outputs[0].id = "changed-port";
  c.templates.get(template)!.versions[0].value.version_id = "changed-version";
  await runner.run(scenarios.completeFlowTemplateRuns);
  const done = c.run(template, run.id);
  assert.equal(done.status, "completed");
  assert.deepEqual(done.outputs.result, {
    id: `${run.id}-result`, type: "string", status: "completed", content: "Synthetic template result",
  });
  await runner.run(scenarios.completeFlowTemplateRuns);
  assert.deepEqual(c.run(template, run.id), done);
  assert.equal(c.records.get("sim-template-run-old")!.value.status, "failed");
  done.outputs.result.id = "changed-result";
  assert.equal(c.run(template, run.id).outputs.result.id, `${run.id}-result`);
  await runner.run(scenarios.reset);
  assert.throws(() => c.run(template, run.id), { code: "template_run_not_found" });
  assert.equal(c.createRun(template, request).id, "sim-template-created-1");
});

test("template runs enforce the selected input schema and reject atomically", async () => {
  const { c } = await setup();
  const version = c.templates.get(template)!.versions[0].value;
  version.inputs.push(
    { id: "choice", content_schema: { type: "string", enum: ["yes"] } },
    { id: "count", content_schema: { type: "integer" } },
    { id: "ratio", content_schema: { type: "number", enum: [0.5] } },
    { id: "flags", content_schema: { type: "array", items: { type: "boolean" } } },
  );
  const inputs = { prompt: "", choice: "yes", count: 2, ratio: 0.5, flags: [true, false] };
  const baseline = c.records.size;
  for (const input of [null, {}, { inputs: 42 }, { inputs: {} },
    { inputs: { ...inputs, extra: "x" } }, { inputs: { ...inputs, prompt: 1 } },
    { inputs: { ...inputs, choice: "no" } }, { inputs: { ...inputs, count: 1.1 } },
    { inputs: { ...inputs, ratio: 1 } }, { inputs: { ...inputs, flags: ["true"] } },
    { inputs, version_id: "missing" }, { inputs, webhook: { type: "all" } },
  ]) assert.throws(() => c.createRun(template, input));
  assert.throws(() => c.createRun("missing", { inputs: {} }), { code: "template_not_found" });
  assert.throws(() => c.createRun("sim-template-unavailable", { inputs: { prompt: "x" } }));
  assert.throws(() => c.createRun(template, { inputs: { ...inputs, prompt: { type: "generation", generation_id: "sim-template-output" } } }));
  assert.equal(c.records.size, baseline);
  assert.equal(c.nextRunId, 1);
  const first = c.createRun(template, { inputs });
  inputs.flags[0] = false;
  assert.deepEqual(c.records.get(first.id)!.execution!.request.inputs.flags, [true, false]);
  const pinned = c.createRun(template, { inputs: { prompt: "old" }, version_id: `${template}-v1` });
  assert.equal(pinned.version_id, `${template}-v1`);
  assert.equal(c.runs(template, { page_size: 1 }).runs[0].id, pinned.id);
  assert(c.records.get(pinned.id)!.createdAt > c.records.get(first.id)!.createdAt);
  assert.throws(() => c.completeRun(first.id, {}));
  assert.equal(c.run(template, first.id).status, "pending");
  // Empty bindings are valid for an actual version with no input ports.
  version.inputs = [];
  assert.equal(c.createRun(template, { inputs: {} }).status, "pending");
});

test("validated Dispatcher creates latest, pinned and shared runs and exposes completion", async () => {
  const h = await createDispatcherHarness();
  const base = `/v1/flows/templates/${template}/runs`;
  const response = await h.request(base, body({ inputs: { prompt: "Local text" } }));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /application\/json/);
  const run = await response.json();
  assert.equal(run.id, "sim-template-created-1");
  assert.equal(run.version_id, `${template}-v2`);
  assert.equal(run.status, "pending");
  assert.deepEqual(run.outputs, { result: { id: `${run.id}-result`, type: "string", status: "pending" } });
  assert.deepEqual(await (await h.request(`${base}/${run.id}`)).json(), run);
  assert.equal((await (await h.request(`${base}?page_size=1`)).json()).runs[0].id, run.id);
  const pinned = await h.request(base, body({ inputs: { prompt: "Pinned" }, version_id: `${template}-v1` }));
  assert.equal(pinned.status, 200);
  const pinnedRun = await pinned.json();
  assert.equal(pinnedRun.version_id, `${template}-v1`);
  const shared = await h.request("/v1/flows/templates/sim-template-shared/runs", body({ inputs: { prompt: "Shared" }, version_id: "latest" }));
  assert.equal(shared.status, 200);
  await h.scenario("completeFlowTemplateRuns");
  const finished = await h.request(`${base}/${run.id}`);
  assert.equal(finished.status, 200);
  const completed = await finished.json();
  assert.equal(completed.status, "completed");
  assert.equal(completed.outputs.result.content, "Synthetic template result");
  assert.equal((await (await h.request(`${base}?version_id=${template}-v1`)).json()).runs[0].id, pinnedRun.id);
  await h.scenario("reset");
  assert.equal((await h.request(`${base}/${run.id}`)).status, 404);
  assert.equal((await h.request(base, body({ inputs: { prompt: "Reset" } }))).status, 200);
  const other = await createDispatcherHarness();
  assert.equal((await other.request(`${base}/${run.id}`)).status, 404);
});

test("validated Dispatcher rejects malformed and invalid bindings without creating runs", async () => {
  const h = await createDispatcherHarness();
  const base = `/v1/flows/templates/${template}/runs`;
  const initial = await (await h.request(base)).json();
  for (const value of [{ inputs: 42 }, { inputs: {} }, { inputs: { prompt: false } },
    { inputs: { prompt: "x", unknown: "x" } },
    { inputs: { prompt: "x" }, version_id: "missing" },
    { inputs: { prompt: "x" }, webhook: { type: "all" } },
  ]) {
    const response = await h.request(base, body(value));
    assert.equal(response.status, value && "version_id" in value ? 404 : 400);
  }
  assert.equal((await h.request("/v1/flows/templates/missing/runs", body({ inputs: {} }))).status, 404);
  assert.equal((await h.request("/v1/flows/templates/sim-template-unavailable/runs", body({ inputs: { prompt: "x" } }))).status, 400);
  assert.deepEqual(await (await h.request(base)).json(), initial);
  const created = await (await h.request(base, body({ inputs: { prompt: "valid" } }))).json();
  assert.equal(created.id, "sim-template-created-1");
});
