import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
const base = "/v1/convai/agents/sim-agent/simulate-conversation";
const normal = { simulation_specification: { simulated_user_config: {} } };

test("simulation Dispatcher requires an existing agent rather than generating a random result", async () => {
  const app = await createDispatcherHarness();
  const response = await app.request(base.replace("sim-agent", "missing"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(normal),
  });
  assert.equal(response.status, 404);
});

test("simulation context uses live canonical config, bounded text, isolated outputs and scenario reset", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const c = runner.loadContext("/convai/agents");
  const before = structuredClone([...c.agents]);
  const initial = c.simulateConversation("sim-agent", normal).value!;
  assert.equal(initial.simulated_conversation.length, 6);
  assert.equal(
    initial.simulated_conversation[0].message,
    "Hello from the simulator.",
  );
  assert.equal(initial.analysis.call_successful, "unknown");
  initial.simulated_conversation[0].message = "Outside mutation";
  assert.equal(
    c.simulateConversation("sim-agent", normal).value?.simulated_conversation[0]
      .message,
    "Hello from the simulator.",
  );
  c.agents.get(
    "sim-agent",
  )!.configuration.conversation_config.agent!.first_message =
    "Welcome {{name}}";
  const body = {
    simulation_specification: {
      simulated_user_config: { first_message: "Hello {{name}}" },
      dynamic_variables: { name: "Pat" },
      partial_conversation_history: [
        { role: "agent" as const, message: "Earlier", time_in_call_secs: 5 },
      ],
    },
    new_turns_limit: 2,
    extra_evaluation_criteria: [
      { id: "helpful", name: "Helpful", conversation_goal_prompt: "Help" },
    ],
  };
  const result = c.simulateConversation("sim-agent", body).value!;
  assert.deepEqual(
    result.simulated_conversation.map((t) => t.role),
    ["agent", "user", "agent"],
  );
  assert.equal(result.simulated_conversation[1].message, "Hello Pat");
  assert.deepEqual(
    result.simulated_conversation.map((t) => t.time_in_call_secs),
    [5, 6, 7],
  );
  assert.equal(
    result.analysis.evaluation_criteria_results!.helpful.result,
    "unknown",
  );
  body.simulation_specification.partial_conversation_history[0].message =
    "Changed";
  assert.equal(result.simulated_conversation[0].message, "Earlier");
  assert.equal(
    c.simulateConversation("sim-agent", { ...normal, new_turns_limit: 0 }).value
      ?.simulated_conversation.length,
    0,
  );
  assert.equal(
    c.simulateConversation("sim-agent", { ...normal, new_turns_limit: 1 }).value
      ?.simulated_conversation[0].message,
    "Welcome {{name}}",
  );
  c.agents.get(
    "sim-agent",
  )!.configuration.conversation_config.agent!.first_message = "";
  assert.equal(
    c.simulateConversation("sim-agent", { ...normal, new_turns_limit: 1 }).value
      ?.simulated_conversation[0].role,
    "user",
  );
  assert.equal(
    c.simulateConversation("sim-agent", {
      simulation_specification: {
        simulated_user_config: {},
        partial_conversation_history: Array.from({ length: 101 }, () => ({
          role: "user" as const,
          message: "Hi",
          time_in_call_secs: 0,
        })),
      },
    }).error,
    "invalid_simulation",
  );
  const snapshot = structuredClone([...c.agents]);
  for (const invalid of [
    { ...normal, new_turns_limit: -1 },
    { ...normal, new_turns_limit: 1.5 },
    { simulation_specification: { simulated_user_config: 42 } },
    {
      simulation_specification: {
        simulated_user_config: { first_message: 42 },
      },
    },
    {
      simulation_specification: {
        simulated_user_config: {},
        tool_mock_config: { lookup: {} },
      },
    },
    {
      simulation_specification: {
        simulated_user_config: {},
        partial_conversation_history: [
          {
            role: "user",
            message: "Hi",
            time_in_call_secs: 0,
            tool_calls: [{}],
          },
        ],
      },
    },
    { ...normal, extra_evaluation_criteria: [{ id: "dup" }, { id: "dup" }] },
  ])
    assert.equal(
      c.simulateConversation("sim-agent", invalid as never).error,
      "invalid_simulation",
    );
  assert.deepEqual([...c.agents], snapshot);
  c.agents.delete("sim-agent");
  assert.equal(
    c.simulateConversation("sim-agent", normal).error,
    "agent_not_found",
  );
  c.simulationDefaults!.agentReply = "Changed fixture";
  await runner.run(scenarios.reset);
  assert.deepEqual([...c.agents], before);
  assert.equal(
    c.simulateConversation("sim-agent", normal).value?.simulated_conversation[2]
      .message,
    "This is a synthetic agent response.",
  );
});

test("simulation Dispatcher returns deterministic JSON and buffered SSE message lists then analysis", async () => {
  const app = await createDispatcherHarness();
  const send = (path: string, body: unknown) =>
    app.request(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  const before = await (
    await app.request("/v1/convai/agents/sim-agent")
  ).json();
  const body = {
    ...normal,
    new_turns_limit: 3,
    extra_evaluation_criteria: [
      {
        id: "clarity",
        name: "Clarity",
        conversation_goal_prompt: "Respond clearly",
      },
    ],
  };
  const json = await send(base, body);
  assert.equal(json.status, 200);
  assert.match(json.headers.get("content-type")!, /application\/json/);
  const value = await json.json();
  assert.equal(value.simulated_conversation.length, 3);
  assert.deepEqual(
    value.simulated_conversation.map((t: { role: string }) => t.role),
    ["agent", "user", "agent"],
  );
  assert.equal(
    value.simulated_conversation[0].message,
    "Hello from the simulator.",
  );
  assert.equal(value.analysis.call_successful, "unknown");
  assert.equal(
    value.analysis.evaluation_criteria_results.clarity.result,
    "unknown",
  );
  const stream = await send(`${base}/stream`, body);
  assert.equal(stream.status, 200);
  assert.match(stream.headers.get("content-type")!, /text\/event-stream/);
  const events = (await stream.text())
    .trim()
    .split("\n\n")
    .map((block) =>
      JSON.parse(
        block
          .split("\n")
          .find((line) => line.startsWith("data: "))!
          .slice(6),
      ),
    );
  assert.equal(events.length, 4);
  assert.deepEqual(
    events.slice(0, -1).flatMap((event) => event.simulated_conversation),
    value.simulated_conversation,
  );
  assert.deepEqual(events.at(-1), { analysis: value.analysis });
  const empty = await send(`${base}/stream`, { ...normal, new_turns_limit: 0 });
  assert.equal(empty.status, 200);
  assert.equal((await empty.text()).trim().split("\n\n").length, 1);
  for (const path of [base, `${base}/stream`]) {
    assert.equal(
      (
        await send(path, {
          simulation_specification: { simulated_user_config: 42 },
        })
      ).status,
      400,
    );
    assert.equal(
      (await send(path, { ...normal, new_turns_limit: -1 })).status,
      400,
    );
    assert.equal(
      (await send(path.replace("sim-agent", "missing"), normal)).status,
      404,
    );
    assert.equal(
      (
        await send(path, {
          simulation_specification: {
            simulated_user_config: {},
            tool_mock_config: { tool: {} },
          },
        })
      ).status,
      400,
    );
  }
  assert.deepEqual(
    await (await app.request("/v1/convai/agents/sim-agent")).json(),
    before,
  );
  await app.scenario("reset");
  assert.deepEqual(await (await send(base, body)).json(), value);
});
