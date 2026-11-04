import assert from "node:assert/strict";
import test from "node:test";
import { Context, defaultSettings } from "../api/routes/_.context.js";
import { reset, startup } from "../api/scenarios/index.js";
import type { Scenario } from "../api/types/index.js";

async function runScenario(context: Context, scenario: Scenario) {
  await scenario({
    context,
    loadContext: () => {
      throw new Error("Unused by voice scenarios");
    },
    routes: {},
    route: () => {
      throw new Error("Unused by voice scenarios");
    },
  });
}

test("voice state is isolated from returned objects and reset restores defaults", async () => {
  const context = new Context();
  assert.deepEqual(context.listVoices(), []);
  await runScenario(context, startup);
  const voice = context.getVoice("sim-narrator")!;
  voice.name = "Changed outside context";
  voice.settings!.stability = 0;
  assert.equal(context.getVoice("sim-narrator")!.name, "Simulator Narrator");
  assert.deepEqual(
    context.getVoice("sim-narrator")!.settings,
    defaultSettings(),
  );
  assert.equal(
    context.editSettings("sim-narrator", { stability: 0.2, speed: null }),
    true,
  );
  assert.equal(context.getVoice("sim-narrator")!.settings!.speed, 1);
  assert.equal(context.getVoice("sim-assistant")!.settings!.stability, 0.5);
  assert.equal(context.editSettings("missing", {}), false);
  assert.equal(context.deleteVoice("sim-narrator"), true);
  assert.equal(context.deleteVoice("sim-narrator"), false);
  assert.equal(context.listVoicesV2({}).page!.total_count, 1);
  await runScenario(context, reset);
  assert.equal(context.listVoicesV2({}).page!.total_count, 2);
  assert.deepEqual(
    context.getVoice("sim-narrator")!.settings,
    defaultSettings(),
  );
});

test("V2 listing filters before pagination and rejects invalid options", async () => {
  const context = new Context();
  await runScenario(context, startup);
  const page = context.listVoicesV2({
    search: "NARRATION",
    page_size: 1,
  }).page!;
  assert.equal(page.total_count, 1);
  assert.equal(page.voices[0].voice_id, "sim-narrator");
  assert.equal(page.has_more, false);
  assert.equal(page.next_page_token, null);
  assert.equal(
    context.listVoicesV2({ next_page_token: "100" }).page!.voices.length,
    0,
  );
  assert.equal(
    context.listVoicesV2({ sort: "created_at_unix", sort_direction: "desc" })
      .page!.voices[0].voice_id,
    "sim-assistant",
  );
  for (const query of [
    { page_size: 0 },
    { page_size: 1.5 },
    { next_page_token: "1e2" },
    { next_page_token: "9007199254740992" },
    { gender: "female" },
  ]) {
    assert.equal(typeof context.listVoicesV2(query).error, "string");
  }
});
