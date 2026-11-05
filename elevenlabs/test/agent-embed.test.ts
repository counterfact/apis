import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";

const base = "/v1/convai/agents";
test("agent embed context projects copied canonical settings and presets", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/convai/agents");
  assert.equal(context.getWidget("missing").error, "agent_not_found");
  assert.deepEqual(context.getLink("sim-agent").value, {
    agent_id: "sim-agent",
    token: null,
  });
  assert.equal(
    context.getWidget("sim-agent").value!.widget_config.language,
    "en",
  );
  await runner.run(scenarios.agentWidgetConfiguration);
  const record = context.agents.get("sim-agent")!.configuration;
  const value = context.getWidget("sim-agent").value!;
  assert.equal(value.widget_config.bg_color, "#123456");
  assert.equal(value.widget_config.text_only, true);
  assert.equal(value.widget_config.file_input_config!.max_files_in_memory, 1);
  assert.deepEqual(value.widget_config.supported_language_overrides, ["es"]);
  assert.deepEqual(value.widget_config.language_presets!.es, {
    terms_text: "Local terms",
    first_message: "Hola",
  });
  value.widget_config.markdown_link_allowed_hosts![0].hostname = "changed";
  assert.equal(
    record.platform_settings!.widget!.markdown_link_allowed_hosts![0].hostname,
    "simulator.invalid",
  );
  assert.equal(
    context.getWidget("sim-agent", "ignored").error,
    "unsupported_agent_signature",
  );
  assert.equal(
    context.getWidget("sim-agent", "").error,
    "unsupported_agent_signature",
  );
  context.updateAgent("sim-agent", {
    conversation_config: {
      agent: { language: "fr", first_message: "Bonjour" },
    },
  });
  assert.equal(
    context.getWidget("sim-agent").value!.widget_config.language,
    "fr",
  );
  assert.equal(
    context.getWidget("sim-agent").value!.widget_config.first_message,
    "Bonjour",
  );
  context.agents.get("sim-agent")!.configuration.platform_settings!.auth = {
    enable_auth: true,
    shareable_token: "synthetic-not-issued",
  };
  assert.equal(context.getLink("sim-agent").value!.token, null);
  context.agents.get("sim-agent")!.configuration.conversation_config = {};
  const minimal = context.getWidget("sim-agent").value!.widget_config;
  assert.equal(minimal.language, "en");
  assert.equal(minimal.first_message, "");
  assert.equal(minimal.text_only, false);
});

test("agent widget and link Dispatcher reads follow duplication deletion and reset", async () => {
  const h = await createDispatcherHarness();
  const read = async (id: string, suffix: string, status = 200) => {
    const r = await h.request(`${base}/${id}/${suffix}`);
    assert.equal(r.status, status);
    assert.match(r.headers.get("content-type")!, /application\/json/);
    return r.json();
  };
  assert.deepEqual(await read("sim-agent", "link"), {
    agent_id: "sim-agent",
    token: null,
  });
  const widget = await read("sim-agent", "widget");
  assert.equal(widget.agent_id, "sim-agent");
  assert.equal(widget.widget_config.language, "en");
  assert.equal(widget.widget_config.first_message, "Hello from the simulator.");
  await read("sim-agent", "widget?conversation_signature=local", 400);
  await read("missing", "widget", 404);
  await read("missing", "link", 404);
  await h.scenario("agentWidgetConfiguration");
  const configured = await read("sim-agent", "widget");
  assert.equal(configured.widget_config.bg_color, "#123456");
  assert.equal(configured.widget_config.text_only, true);
  assert.equal(
    configured.widget_config.file_input_config.max_files_in_memory,
    1,
  );
  assert.deepEqual(configured.widget_config.language_presets.es, {
    terms_text: "Local terms",
    first_message: "Hola",
  });
  const duplicate = await h.request(`${base}/sim-agent/duplicate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Copy" }),
  });
  assert.equal(duplicate.status, 200);
  const { agent_id: id } = await duplicate.json();
  assert.deepEqual(
    (await read(id, "widget")).widget_config,
    configured.widget_config,
  );
  assert.deepEqual(await read(id, "link"), { agent_id: id, token: null });
  assert.equal(
    (await h.request(`${base}/sim-agent`, { method: "DELETE" })).status,
    204,
  );
  await read("sim-agent", "widget", 404);
  await read("sim-agent", "link", 404);
  await read(id, "widget");
  await h.scenario("reset");
  await read("sim-agent", "widget");
  await read(id, "link", 404);
  await h.scenario("emptyAgents");
  await read("sim-agent", "widget", 404);
  const other = await createDispatcherHarness();
  assert.equal((await other.request(`${base}/sim-agent/link`)).status, 200);
});
