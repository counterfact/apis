import assert from "node:assert/strict";
import test from "node:test";
import { Context, defaultSettings } from "../api/routes/_.context.js";
import { reset, startup } from "../api/scenarios/index.js";
import type { Scenario } from "../api/types/index.js";
import type { HTTP_GET_Query } from "../api/types/v2/paths/voices.types.js";

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
    { voice_type: "personal" },
  ]) {
    assert.equal(typeof context.listVoicesV2(query).error, "string");
  }
});

test("discovery filters use labels and IDs without mutating voice state", async () => {
  const context = new Context();
  await runScenario(context, startup);
  const before = context.listVoices();
  const ids = (query: HTTP_GET_Query) => {
    const result = context.listVoicesV2(query);
    assert.equal(result.error, undefined);
    return result.page!.voices.map((voice) => voice.voice_id);
  };
  assert.deepEqual(ids({ gender: "female", language: ["fr", "en"] }), [
    "sim-narrator",
  ]);
  assert.deepEqual(ids({ age: "young", accent: "british" }), ["sim-assistant"]);
  assert.deepEqual(ids({ use_cases: ["absent", "narration"] }), [
    "sim-narrator",
  ]);
  assert.deepEqual(
    ids({ voice_ids: ["sim-narrator", "sim-narrator", "missing"] }),
    ["sim-narrator"],
  );
  assert.deepEqual(ids({ voice_ids: ["sim-assistant"], gender: "female" }), []);
  assert.deepEqual(
    ids({ gender: null, language: null, use_cases: null, voice_ids: null }),
    ["sim-narrator", "sim-assistant"],
  );
  for (const query of [
    { language: [] },
    { use_cases: [] },
    { voice_ids: [] },
    { gender: "Female" },
  ]) {
    assert.deepEqual(ids(query), []);
  }
  assert.equal(
    context.listVoicesV2({ voice_ids: Array(101).fill("sim-narrator") }).error,
    "voice_ids must contain at most 100 IDs",
  );
  assert.deepEqual(context.listVoices(), before);
});
