import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

test("V2 discovery combines label and ID filters before sorting and pagination", async () => {
  const { scenario, request } = await createDispatcherHarness();
  const discover = async (query: string) => {
    const response = await request(`/v2/voices?${query}`);
    assert.equal(response.status, 200, query);
    return response.json();
  };
  const ids = (page: { voices: Array<{ voice_id: string }> }) =>
    page.voices.map((voice) => voice.voice_id);
  assert.deepEqual(ids(await discover("gender=female")), ["sim-narrator"]);
  assert.deepEqual(ids(await discover("age=young&accent=british")), [
    "sim-assistant",
  ]);
  assert.deepEqual(ids(await discover("gender=Female")), []);
  assert.deepEqual(ids(await discover("gender=")), []);
  await scenario("voiceDiscovery", "api");
  const languages = await discover("language=en&language=es");
  assert.equal(languages.total_count, 3);
  assert.ok(ids(languages).includes("sim-spanish-narrator"));
  assert.equal(ids(languages).includes("sim-unlabeled"), false);
  // Verified-language metadata does not substitute for the language label.
  assert.deepEqual(ids(await discover("language=en")), [
    "sim-narrator",
    "sim-assistant",
  ]);
  const missingLabel = await discover("accent=absent");
  assert.equal(missingLabel.total_count, 0);
  assert.equal(missingLabel.has_more, false);
  assert.equal(missingLabel.next_page_token, null);
  assert.deepEqual(ids(await discover("language=fr&language=es")), [
    "sim-spanish-narrator",
  ]);
  assert.deepEqual(
    ids(await discover("use_cases=narration&use_cases=conversational")),
    ids(languages),
  );
  assert.deepEqual(
    ids(await discover("gender=female&language=en&accent=spanish")),
    [],
  );
  const first = await discover(
    "gender=female&use_cases=narration&sort=created_at_unix&page_size=1",
  );
  assert.equal(first.total_count, 2);
  assert.equal(first.has_more, true);
  assert.deepEqual(ids(first), ["sim-narrator"]);
  const second = await discover(
    `gender=female&use_cases=narration&sort=created_at_unix&page_size=1&next_page_token=${first.next_page_token}`,
  );
  assert.deepEqual(ids(second), ["sim-spanish-narrator"]);
  assert.equal(second.has_more, false);
  assert.equal(second.next_page_token, null);
  assert.deepEqual(
    ids(
      await discover(
        "voice_ids=sim-assistant&voice_ids=missing&voice_ids=sim-assistant",
      ),
    ),
    ["sim-assistant"],
  );
  assert.deepEqual(
    ids(await discover("voice_ids=sim-assistant&gender=female")),
    [],
  );
  assert.deepEqual(
    ids(
      await discover(
        "voice_ids=sim-assistant&voice_ids=sim-narrator&search=narration&category=generated",
      ),
    ),
    ["sim-narrator"],
  );
  const hundredIds = new URLSearchParams();
  for (let i = 0; i < 100; i++)
    hundredIds.append("voice_ids", "sim-narrator");
  assert.deepEqual(ids(await discover(hundredIds.toString())), [
    "sim-narrator",
  ]);
  hundredIds.append("voice_ids", "sim-narrator");
  const tooMany = await request(`/v2/voices?${hundredIds}`);
  assert.equal(tooMany.status, 400);
  assert.equal((await tooMany.json()).detail.status, "invalid_request");
  const deleted = await request("/v1/voices/sim-narrator", {
    method: "DELETE",
  });
  assert.equal(deleted.status, 200);
  assert.deepEqual(ids(await discover("voice_ids=sim-narrator")), []);
  assert.equal((await discover("gender=female")).total_count, 1);
  assert.equal((await discover("")).total_count, 3);
  await scenario("reset", "api");
  assert.equal((await discover("")).total_count, 2);
  assert.deepEqual(ids(await discover("language=es")), []);
  assert.deepEqual(ids(await discover("gender=female")), ["sim-narrator"]);
});
