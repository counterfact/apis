import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { Context } from "../api/routes/shared-voices/_.context.js";
import * as scenarios from "../api/scenarios/index.js";

test("voice library context filters shared metadata and accents independently of owned voices", async () => {
  assert.equal(new Context().list({}).total_count, 0);
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/shared-voices");
  assert.equal(c.list({}).total_count, 3);
  assert.equal(
    c.list({ language: "es", accent: "spanish" }).voices[0].voice_id,
    "sim-library-spanish",
  );
  assert.equal(
    c.list({ use_cases: "narration", descriptives: ["calm"] }).total_count,
    1,
  );
  assert.equal(
    c.list({ include_custom_rates: false, include_live_moderated: false })
      .total_count,
    1,
  );
  assert.equal(
    c.list({
      featured: true,
      reader_app_enabled: true,
      min_notice_period_days: 7,
    }).voices[0].voice_id,
    "sim-library-american",
  );
  assert.equal(
    c.list({
      owner_id: "sim-public-owner",
      locale: "en-US",
      gender: "female",
      age: "middle_aged",
      category: "professional",
      search: "local",
    }).total_count,
    1,
  );
  assert.equal(
    c.list({
      featured: false,
      reader_app_enabled: false,
      include_custom_rates: true,
      include_live_moderated: true,
    }).total_count,
    3,
  );
  assert.equal(c.list({ include_custom_rates: false }).total_count, 2);
  assert.equal(c.list({ include_live_moderated: false }).total_count, 2);
  assert.equal(
    c.list({ use_cases: ["narration", "characters"] }).total_count,
    2,
  );
  assert.equal(c.list({ use_cases: [] }).total_count, 0);
  assert.equal(c.list({ descriptives: "calm" }).total_count, 1);
  assert.deepEqual(
    c.list({ sort: "cloned_by_count" }).voices.map((v) => v.voice_id),
    ["sim-library-american", "sim-library-british", "sim-library-spanish"],
  );
  assert.equal(
    c.list({ sort: "usage_character_count_1y" }).voices[0].voice_id,
    "sim-library-spanish",
  );
  assert.equal(
    c.list({ sort: "trending" }).voices[0].voice_id,
    "sim-library-american",
  );
  assert.equal(c.list({ search: "absent" }).last_sort_id, null);
  assert.equal(c.list({ page: 99 }).has_more, false);
  assert.equal(c.list({ page: 99 }).last_sort_id, null);
  const page = c.list({ page_size: 1 });
  assert.equal(page.has_more, true);
  assert.notEqual(
    c.list({ page_size: 1, page: 1 }).voices[0].voice_id,
    page.voices[0].voice_id,
  );
  assert.deepEqual(c.list({ page: 99 }).voices, []);
  const copy = c.list({});
  copy.voices[0].name = "Mutated";
  copy.voices[0].verified_languages![0].language = "xx";
  assert.notEqual(c.list({}).voices[0].name, "Mutated");
  assert.notEqual(c.list({}).voices[0].verified_languages![0].language, "xx");
  const accentCopy = c.accents({});
  accentCopy.accents[0].name = "Changed";
  assert.notEqual(c.accents({}).accents[0].name, "Changed");
  assert.deepEqual(
    c.accents({ language: "en" }).accents.map((a) => a.accent),
    ["american", "british"],
  );
  assert.equal(c.accents({ model_id: "eleven_flash_v2_5" }).accents.length, 1);
  assert.deepEqual(c.accents({ language: "zz" }).accents, []);
  for (const q of [
    { page_size: 101 },
    { page: -1 },
    { sort: "bad" },
    { min_notice_period_days: -1 },
    { include_custom_rates: "false" },
    { use_cases: [1] },
  ])
    assert.throws(() => c.list(q));
  assert.throws(() => c.accents({ model_id: "missing" }));
  await r.run(scenarios.emptyVoiceLibrary);
  assert.equal(c.list({}).total_count, 0);
  await r.run(scenarios.reset);
  assert.equal(c.list({}).total_count, 3);
});
test("validated Dispatcher library queries/reset preserve owned voices", async () => {
  const h = await createDispatcherHarness();
  const read = async (path: string, status = 200) => {
    const x = await h.request(`/v1${path}`);
    assert.equal(x.status, status);
    return x;
  };
  assert.equal((await (await read("/shared-voices")).json()).voices.length, 3);
  assert.equal(
    (
      await (
        await read(
          "/shared-voices?use_cases=narration&descriptives=calm&include_custom_rates=false&include_live_moderated=false&min_notice_period_days=7",
        )
      ).json()
    ).total_count,
    1,
  );
  assert.equal(
    (
      await (
        await read(
          "/shared-voices?use_cases=narration&use_cases=characters&sort=cloned_by_count&page_size=1&page=1",
        )
      ).json()
    ).voices.length,
    1,
  );
  assert.equal(
    (await (await read("/voices/accents?language=en")).json()).accents.length,
    2,
  );
  assert.equal(
    (await (await read("/voices/accents?model_id=eleven_flash_v2_5")).json())
      .accents.length,
    1,
  );
  assert.equal(
    (
      await (
        await read(
          "/shared-voices?featured=false&reader_app_enabled=false&include_custom_rates=true&include_live_moderated=true",
        )
      ).json()
    ).total_count,
    3,
  );
  assert.equal(
    (await (await read("/shared-voices?use_cases=absent")).json()).last_sort_id,
    null,
  );
  await read("/shared-voices?min_notice_period_days=bad", 400);
  await read("/shared-voices?include_custom_rates=bad", 400);
  await read("/shared-voices?sort=bad", 400);
  await read("/voices/accents?model_id=missing", 400);
  await h.request("/v1/voices/sim-narrator", { method: "DELETE" });
  assert.equal((await (await read("/shared-voices")).json()).total_count, 3);
  await h.scenario("emptyVoiceLibrary");
  assert.deepEqual((await (await read("/voices/accents")).json()).accents, []);
  await h.scenario("reset");
  assert.equal((await (await read("/shared-voices")).json()).total_count, 3);
  const other = await createDispatcherHarness();
  assert.equal(
    (await (await other.request("/v1/shared-voices")).json()).total_count,
    3,
  );
});
