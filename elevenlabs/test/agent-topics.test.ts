import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { Context } from "../api/routes/convai/agents/_.context.js";
import * as scenarios from "../api/scenarios/index.js";
const base = "/v1/convai/agents/sim-agent/topics";
test("topic context reads immutable historical runs with bounded query behavior", async () => {
  assert.equal(new Context().topicRuns.size, 0);
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/convai/agents");
  assert.equal(typeof c.getTopics, "function");
  const latest = c.getTopics("sim-agent").value!;
  assert.equal(latest.aggregated_run_count, 1);
  assert.deepEqual(
    latest.topics.map((x) => x.topic_id),
    ["sim-topic-support", "sim-topic-sales", "sim-topic-unscored"],
  );
  assert.equal(latest.topics[0].success_rate, 0.75);
  latest.topics[0].label = "Mutated";
  latest.topics[0].metrics!.evaluation_criteria![0].success_count = 999;
  const before = structuredClone([...c.topicRuns]);
  for (const run of c.topicRuns.values())
    for (const topic of run.result.topics)
      for (const criteria of topic.metrics?.evaluation_criteria ?? []) {
        assert.equal(Number.isInteger(criteria.success_count), true);
        assert.equal(Number.isInteger(criteria.failure_count), true);
      }
  assert.equal(
    c.getTopics("sim-agent", { sort_by: "success_rate", sort_direction: "asc" })
      .value!.topics[0].topic_id,
    "sim-topic-sales",
  );
  assert.deepEqual(
    c.getTopics("sim-agent", { cursor: "99" }).value!.topics,
    [],
  );
  assert.equal(
    c.getTopics("sim-agent", {
      from_unix_secs: 1735862400,
      to_unix_secs: 1735948800,
    }).value!.aggregated_run_count,
    0,
  );
  assert.equal(
    c.getTopics("sim-agent", { page_size: "1" } as never).error,
    "invalid_topic_query",
  );
  assert.equal(
    c.getTopics("sim-agent", { sort_by: "sentiment", sort_direction: "asc" })
      .value!.topics[0].topic_id,
    "sim-topic-sales",
  );
  assert.equal(
    c
      .getTopics("sim-agent", { sort_by: "frustration", sort_direction: "asc" })
      .value!.topics.at(-1)!.topic_id,
    "sim-topic-unscored",
  );
  const projected = c.getTopics("sim-agent", {
    include_evaluation_criteria: false,
  }).value!;
  assert.equal(projected.topics[0].metrics!.evaluation_criteria, undefined);
  assert.equal(projected.topics[0].success_rate, 0.75);
  assert.equal(
    c.getTopics("sim-agent", {
      from_unix_secs: 1735689601,
      to_unix_secs: 1735776000,
    }).value!.topics[0].conversation_count,
    4,
  );
  for (const q of [
    { page_size: "x" },
    { page_size: "1.2" },
    { page_size: 0 },
    { cursor: "no" },
    { from_unix_secs: "x" },
    { from_unix_secs: 1 },
    { from_unix_secs: 1735689600, to_unix_secs: 1735862400 },
    { sort_by: "unknown" },
    { unsupported: true },
  ])
    assert.ok(c.getTopics("sim-agent", q as never).error);
  assert.deepEqual([...c.topicRuns], before);
  c.agents.get("sim-agent")!.configuration.name = "Current edited agent";
  assert.equal(
    c.getTopics("sim-agent").value!.topics[0].label,
    "Local support",
  );
  const unrelated = c.duplicateAgent("sim-agent", {}).value!.agent_id;
  assert.deepEqual(c.getTopics(unrelated).value!.topics, []);
  c.topicRuns.set("mislabel", {
    ...structuredClone(before[0][1]),
    agentId: "another-agent",
  });
  assert.equal(c.getTopics("sim-agent").value!.topics[0].conversation_count, 8);
  const historical = r
    .loadContext("/convai/agents/{agent_id}/branches")
    .versions.get("sim-agent-version-main")!;
  assert.equal(historical.configuration.name, "Simulator Support");
  c.deleteAgent("sim-agent");
  assert.equal(c.getTopics("sim-agent").error, "agent_not_found");
  await r.run(scenarios.reset);
  assert.equal(c.topicRuns.size, 2);
  assert.equal(
    c.getTopics("sim-agent").value!.topics[0].label,
    "Local support",
  );
});
test("validated Dispatcher returns latest topic fixture and paginates without mutation", async () => {
  const h = await createDispatcherHarness();
  const response = await h.request(base);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /application\/json/);
  const latest = await response.json();
  assert.deepEqual(
    latest.topics.map((x: any) => x.topic_id),
    ["sim-topic-support", "sim-topic-sales", "sim-topic-unscored"],
  );
  const first = await (await h.request(base + "?page_size=1")).json();
  assert.equal(first.has_more, true);
  const second = await (
    await h.request(base + "?page_size=1&cursor=" + first.next_cursor)
  ).json();
  assert.equal(second.topics[0].topic_id, "sim-topic-sales");
  const projected = await (
    await h.request(
      base +
        "?include_evaluation_criteria=false&sort_by=sentiment&sort_direction=asc",
    )
  ).json();
  assert.equal(projected.topics[0].topic_id, "sim-topic-sales");
  assert.equal(projected.topics[0].metrics.evaluation_criteria, undefined);
  assert.equal(
    (
      await h.request(
        base + "?from_unix_secs=1735689601&to_unix_secs=1735776000",
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await h.request(
        base + "?from_unix_secs=1735689600&to_unix_secs=1735862400",
      )
    ).status,
    400,
  );
  assert.equal(
    (await h.request(base.replace("sim-agent", "missing"))).status,
    404,
  );
  assert.deepEqual(await (await h.request(base)).json(), latest);
  assert.equal(
    (await h.request("/v1/convai/agents/sim-agent", { method: "DELETE" }))
      .status,
    204,
  );
  assert.equal((await h.request(base)).status, 404);
  await h.scenario("reset");
  assert.deepEqual(await (await h.request(base)).json(), latest);
  await h.scenario("emptyAgentTopics");
  assert.deepEqual((await (await h.request(base)).json()).topics, []);
  const isolated = await createDispatcherHarness();
  assert.deepEqual(await (await isolated.request(base)).json(), latest);
});
