import assert from "node:assert/strict";
import { test } from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
const base = "/v1/dubbing/resource/sim-dubbing-resource";
const json = (method: string, body: unknown) => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
test("Dubbing resource metadata lifecycle shares tracks, segments, languages and version", async () => {
  const h = await createDispatcherHarness();
  const req = async (p: string, init: RequestInit = {}, status = 200) => {
    const r = await h.request(base + p, init);
    assert.equal(r.status, status);
    assert.match(r.headers.get("content-type") ?? "", /json/);
    return r.json();
  };
  assert.equal((await req("")).id, "sim-dubbing-resource");
  assert.equal(
    (await req("/language", json("POST", { language: "fr" }), 201)).version,
    2,
  );
  await req(
    "/segment/sim-dubbing-segment/en",
    json("PATCH", { text: "Changed source" }),
  );
  assert.equal(
    (await req("")).speaker_segments["sim-dubbing-segment"].dubs.es.audio_stale,
    true,
  );
  const speaker = await req(
    "/speaker",
    json("POST", { speaker_name: "New speaker", voice_id: "sim-narrator" }),
  );
  assert.equal(speaker.version, 4);
  const created = await req(
    `/speaker/${speaker.speaker_id}/segment`,
    json("POST", {
      start_time: 3,
      end_time: 4,
      text: "Local source",
      translations: { es: "Hola" },
    }),
    201,
  );
  assert.equal(created.version, 5);
  const segment = created.new_segment;
  await req(
    `/segment/${segment}/es`,
    json("PATCH", { text: "Cambio", start_time: 3.1 }),
  );
  let state = await req("");
  assert.equal(state.speaker_segments[segment].dubs.es.text, "Cambio");
  assert.equal(state.speaker_segments[segment].dubs.es.audio_stale, true);
  assert.equal(state.speaker_segments[segment].dubs.fr.text, null);
  await req(
    `/speaker/${speaker.speaker_id}`,
    json("PATCH", {
      speaker_name: "Renamed",
      voice_id: "sim-assistant",
      languages: ["es"],
    }),
  );
  state = await req("");
  assert.equal(
    state.speaker_tracks[speaker.speaker_id].speaker_name,
    "Renamed",
  );
  assert.equal(
    state.speaker_tracks[speaker.speaker_id].voices.es,
    "sim-assistant",
  );
  assert.equal(
    state.speaker_tracks[speaker.speaker_id].voices.fr,
    "sim-narrator",
  );
  await req(
    "/migrate-segments",
    json("POST", { speaker_id: "sim-dubbing-speaker", segment_ids: [segment] }),
  );
  state = await req("");
  assert.ok(
    state.speaker_tracks["sim-dubbing-speaker"].segments.includes(segment),
  );
  assert.deepEqual(state.speaker_tracks[speaker.speaker_id].segments, []);
  await req(`/segment/${segment}`, { method: "DELETE" });
  assert.equal((await req("")).speaker_segments[segment], undefined);
  await h.scenario("reset");
  assert.equal((await req("")).version, 1);
  assert.equal((await req("")).target_languages.includes("fr"), false);
});
test("Dubbing resource rejects atomic errors and isolates reset", async () => {
  const h = await createDispatcherHarness();
  const req = async (p: string, init: RequestInit = {}, status = 200) => {
    const r = await h.request(base + p, init);
    assert.equal(r.status, status);
    return r.json();
  };
  const before = await req("");
  await req(
    "/migrate-segments",
    json("POST", {
      speaker_id: "sim-dubbing-speaker",
      segment_ids: ["sim-dubbing-segment", "missing"],
    }),
    404,
  );
  await req(
    "/speaker/sim-dubbing-speaker/segment",
    json("POST", { start_time: 5, end_time: 3 }),
    400,
  );
  await req(
    "/segment/sim-dubbing-segment/es",
    json("PATCH", { start_time: 9, end_time: 2 }),
    400,
  );
  await req(
    "/speaker/sim-dubbing-speaker",
    json("PATCH", { languages: ["unknown"], voice_id: "sim-narrator" }),
    404,
  );
  assert.deepEqual(await req(""), before);
  await req("/language", json("POST", { language: "es" }), 201);
  assert.equal((await req("")).version, 1);
  const other = await createDispatcherHarness();
  await h.scenario("emptyDubbingResources");
  await req("", {}, 404);
  assert.equal(
    (await (await other.request(base)).json()).id,
    "sim-dubbing-resource",
  );
  await h.scenario("reset");
  assert.deepEqual(await req(""), before);
});
