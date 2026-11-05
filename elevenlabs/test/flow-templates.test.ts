import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
import { Context } from "../api/routes/flows/templates/_.context.js";

test("flow template context catalog and historical runs are copied, scoped and paginated", async () => {
  assert.equal(new Context().templates.size, 0);
  assert.equal(new Context().records.size, 0);
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/flows/templates");
  assert.equal(context.list({}).templates.length, 2);
  assert.equal(
    context.list({ search: "LOCAL TEXT" }).templates[0].id,
    "sim-template-text",
  );
  const page = context.list({ page_size: 1, versions_per_template: 1 });
  assert.equal(page.templates[0].id, "sim-template-text");
  assert.equal(page.templates[0].has_more_versions, true);
  assert.equal(page.next_cursor, "1");
  page.templates[0].name = "changed";
  assert.equal(context.list({}).templates[0].name, "Local text");
  assert.equal(
    context.list({ cursor: page.next_cursor }).templates[0].id,
    "sim-template-unavailable",
  );
  assert.deepEqual(context.list({ cursor: "99" }).templates, []);
  assert.equal(
    context.get("sim-template-shared", {}).id,
    "sim-template-shared",
  );
  const copy = context.get("sim-template-text", {});
  copy.versions[0].inputs[0].content_schema.type = "boolean";
  assert.equal(
    context.get("sim-template-text", {}).versions[0].inputs[0].content_schema
      .type,
    "string",
  );
  assert.deepEqual(context.get("sim-template-unavailable", {}).versions, []);
  assert.equal(
    context.runs("sim-template-text", {
      version_id: "sim-template-text-v1",
      page_size: 1,
    }).runs[0].id,
    "sim-template-run-old",
  );
  assert.deepEqual(
    context.runs("sim-template-text", { version_id: "unknown" }).runs,
    [],
  );
  assert.deepEqual(
    context.runs("sim-template-text", { cursor: "99" }).runs,
    [],
  );
  assert.equal(
    context.runs("sim-template-text", { page_size: 1 }).next_cursor,
    "1",
  );
  assert.equal(
    context.run("sim-template-text", "sim-template-run").status,
    "completed",
  );
  const run = context.run("sim-template-text", "sim-template-run");
  assert(run.outputs.result.type === "string");
  run.outputs.result.content = "changed";
  const saved = context.run("sim-template-text", "sim-template-run").outputs
    .result;
  assert(saved.type === "string");
  assert.equal(saved.content, "Synthetic saved text");
  const listOutput = context.runs("sim-template-text").runs[0].outputs.result;
  assert(listOutput.type === "string");
  listOutput.content = "changed list";
  const afterList = context.run("sim-template-text", "sim-template-run").outputs
    .result;
  assert(afterList.type === "string");
  assert.equal(afterList.content, "Synthetic saved text");
  assert.throws(() => context.run("sim-template-shared", "sim-template-run"), {
    code: "template_run_not_found",
  });
  for (const query of [
    { page_size: 26 },
    { cursor: "bad" },
    { versions_per_template: 0 },
    { search: "x".repeat(101) },
  ])
    assert.throws(() => context.list(query));
  for (const query of [{ page_size: 101 }, { cursor: "-1" }, { version_id: 1 }])
    assert.throws(() => context.runs("sim-template-text", query));
  await runner.run(scenarios.reset);
  assert.equal(context.list({}).templates.length, 2);
});

test("validated Dispatcher reads flow template metadata and saved runs without execution", async () => {
  const h = await createDispatcherHarness();
  const request = async (path = "", status = 200) => {
    const response = await h.request(`/v1/flows/templates${path}`);
    assert.equal(response.status, status);
    return response;
  };
  const page = await (
    await request("?page_size=1&versions_per_template=1")
  ).json();
  assert.equal(page.templates[0].id, "sim-template-text");
  assert.equal(page.templates[0].has_more_versions, true);
  assert.equal((await (await request("?cursor=1")).json()).templates.length, 1);
  assert.equal(
    (await (await request("?search=LOCAL%20TEXT")).json()).templates.length,
    1,
  );
  assert.equal(
    (await (await request("/sim-template-text?versions_per_template=1")).json())
      .versions.length,
    1,
  );
  assert.equal(
    (await (await request("/sim-template-shared")).json()).id,
    "sim-template-shared",
  );
  const runs = await (
    await request("/sim-template-text/runs?page_size=1")
  ).json();
  assert.equal(runs.runs[0].id, "sim-template-run");
  assert.equal(runs.next_cursor, "1");
  assert.equal(
    (
      await (
        await request(
          "/sim-template-text/runs?version_id=sim-template-text-v1&page_size=1",
        )
      ).json()
    ).runs[0].status,
    "failed",
  );
  assert.deepEqual(
    (await (await request("/sim-template-text/runs?version_id=unknown")).json())
      .runs,
    [],
  );
  assert.equal(
    (await (await request("/sim-template-text/runs/sim-template-run")).json())
      .outputs.result.content,
    "Synthetic saved text",
  );
  await request("/missing", 404);
  await request("/missing/runs", 404);
  await request("/sim-template-shared/runs/sim-template-run", 404);
  for (const path of [
    "?cursor=x",
    "?page_size=26",
    "?versions_per_template=11",
    "/sim-template-text/runs?page_size=101",
    "/sim-template-text?versions_per_template=0",
  ])
    await request(path, 400);
  await h.scenario("emptyFlowTemplates");
  assert.deepEqual((await (await request()).json()).templates, []);
  await request("/sim-template-text", 404);
  assert.equal((await h.request("/v1/flows/image/sim-flow-image")).status, 200);
  await h.scenario("reset");
  await request("/sim-template-text");
  const other = await createDispatcherHarness();
  assert.equal(
    (await other.request("/v1/flows/templates/sim-template-text")).status,
    200,
  );
});
