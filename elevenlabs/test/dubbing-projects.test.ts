import assert from "node:assert/strict";
import { test } from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
const base = "/v1/dubbing/project",
  pid = "sim-dubbing-project",
  lid = "sim-dubbing-es",
  sid = "sim-dubbing-segment";
const json = (method: string, body: unknown) => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
test("Dubbing project records preserve revisions, translations and language lifecycle", async () => {
  const h = await createDispatcherHarness();
  const req = async (path: string, init: RequestInit = {}, status = 200) => {
    const r = await h.request(base + path, init);
    assert.equal(r.status, status, await r.clone().text());
    if (status === 204) {
      assert.equal(await r.text(), "");
      return;
    }
    assert.match(r.headers.get("content-type") ?? "", /json/);
    return r.json();
  };
  assert.equal((await req("")).projects[0].project_id, pid);
  assert.deepEqual((await req("")).projects[0].language_ids, []);
  assert.deepEqual((await req(`/${pid}`)).language_ids, [lid]);
  assert.equal((await req(`/${pid}/language`)).languages[0].language_id, lid);
  const source = await req(`/${pid}/transcript`);
  assert.equal(source.revision, 0);
  assert.equal(source.segments[0].id, sid);
  const target = await req(`/${pid}/language/${lid}/transcript`);
  assert.equal(target.segments[0].translation, "Hola local");
  const edited = await req(
    `/${pid}/transcript/segment/${sid}`,
    json("PATCH", { text: "Revised source" }),
  );
  assert.equal(edited.revision, 1);
  assert.equal((await req(`/${pid}/language/${lid}`)).status, "stale");
  assert.equal(
    (await req(`/${pid}/language/${lid}/transcript`)).segments[0].translation,
    null,
  );
  assert.equal(
    (
      await req(
        `/${pid}/language/${lid}/transcript/segment/${sid}`,
        json("PATCH", { translation: "Revisado" }),
      )
    ).revision,
    2,
  );
  assert.equal((await req(`/${pid}/transcript`)).revision, 1);
  assert.equal(
    (
      await req(
        `/${pid}/language/${lid}/transcript/segments`,
        json("PATCH", { segments: { [sid]: { translation: null } } }),
      )
    ).revision,
    3,
  );
  const added = await req(
    `/${pid}/transcript/segment`,
    json("POST", {
      text: "Second",
      speaker_id: "speaker-1",
      start_s: 4,
      end_s: 5,
    }),
    201,
  );
  assert.equal(added.revision, 2);
  const bulk = await req(
    `/${pid}/transcript/segments`,
    json("PATCH", {
      segments: { [sid]: { text: "One" }, [added.segment.id]: { text: "Two" } },
    }),
  );
  assert.equal(bulk.revision, 3);
  assert.equal(bulk.segments.length, 2);
  assert.equal(
    (
      await req(`/${pid}/transcript/segment/${added.segment.id}`, {
        method: "DELETE",
      })
    ).revision,
    4,
  );
  const created = await req(
    `/${pid}/language`,
    json("POST", { target_language: "fr", translations: { [sid]: "Bonjour" } }),
    201,
  );
  assert.equal(created.status, "queued");
  assert.equal(created.model_id, "dubbing_v2");
  await req(`/${pid}/language/${created.language_id}/transcript`, {}, 409);
  await h.scenario("completeDubbingLanguages");
  assert.equal(
    (await req(`/${pid}/language/${created.language_id}`)).status,
    "completed",
  );
  assert.equal(
    (await req(`/${pid}/language/${created.language_id}/transcript`))
      .segments[0].translation,
    "Bonjour",
  );
  await req(
    `/${pid}/language/${created.language_id}`,
    { method: "DELETE" },
    204,
  );
  await req(`/${pid}/language/${created.language_id}`, {}, 404);
  assert.equal((await req(`/${pid}`)).language_ids.length, 1);
  await req(`/${pid}`, { method: "DELETE" }, 204);
  await req(`/${pid}/transcript`, {}, 404);
  assert.deepEqual((await req("")).projects, []);
  await h.scenario("reset");
  assert.equal((await req(`/${pid}/transcript`)).revision, 0);
});
test("Dubbing project errors are atomic and filtering and instance state are isolated", async () => {
  const h = await createDispatcherHarness();
  const req = async (path: string, init: RequestInit = {}, status = 200) => {
    const r = await h.request(base + path, init);
    assert.equal(r.status, status, await r.clone().text());
    return r.json();
  };
  const transcript = await req(`/${pid}/transcript`);
  await req(
    `/${pid}/transcript/segments`,
    json("PATCH", {
      segments: { [sid]: { text: "No" }, missing: { text: "No" } },
    }),
    404,
  );
  assert.deepEqual(await req(`/${pid}/transcript`), transcript);
  await req(
    `/${pid}/transcript/segment`,
    json("POST", {
      text: "Overlap",
      speaker_id: "speaker-1",
      start_s: 1,
      end_s: 3,
    }),
    400,
  );
  await req(
    `/${pid}/transcript/segment/${sid}`,
    json("PATCH", { end_s: 100 }),
    400,
  );
  await req(
    `/${pid}/language`,
    json("POST", { target_language: "fr", translations: { missing: "No" } }),
    400,
  );
  assert.deepEqual(await req(`/${pid}/transcript`), transcript);
  await req(
    `/${pid}/language/${lid}/transcript/segments`,
    json("PATCH", {
      segments: {
        [sid]: { translation: "No" },
        missing: { translation: "No" },
      },
    }),
    404,
  );
  assert.equal(
    (await req(`/${pid}/language/${lid}/transcript`)).segments[0].translation,
    "Hola local",
  );
  assert.equal((await req("?page_size=0")).projects.length, 1);
  assert.equal((await req("?page_size=1000")).projects.length, 1);
  assert.deepEqual((await req("?cursor=99")).projects, []);
  assert.deepEqual((await req("?status=failed")).projects, []);
  await req("?cursor=bad", {}, 400);
  await req("?status=processing", {}, 400);
  await h.scenario("emptyDubbingProjects");
  assert.deepEqual((await req("")).projects, []);
  const other = await createDispatcherHarness();
  assert.equal((await (await other.request(base)).json()).projects.length, 1);
  await h.scenario("reset");
  assert.equal((await req(`/${pid}/transcript`)).revision, 0);
});
test("Dubbing lists paginate after filtering, queued transcripts conflict and edits preserve unrelated targets", async () => {
  const h = await createDispatcherHarness();
  const req = async (path: string, init: RequestInit = {}, status = 200) => {
    const r = await h.request(base + path, init);
    assert.equal(r.status, status, await r.clone().text());
    return r.json();
  };
  await h.scenario("pendingDubbingProject");
  const first = await req("?page_size=1");
  assert.equal(first.projects[0].project_id, pid);
  assert.equal(first.next_cursor, "1");
  const last = await req("?page_size=1&cursor=" + first.next_cursor);
  assert.equal(last.projects[0].project_id, "sim-dubbing-pending");
  assert.equal(last.next_cursor, null);
  assert.equal(
    (await req("?sort_direction=ASCENDING")).projects[0].project_id,
    "sim-dubbing-pending",
  );
  assert.equal((await req("?status=queued")).projects.length, 1);
  await req("/sim-dubbing-pending/transcript", {}, 409);
  const fr = await req(
    `/${pid}/language`,
    json("POST", { target_language: "fr", translations: { [sid]: "Bonjour" } }),
    201,
  );
  await h.scenario("completeDubbingLanguages");
  const french = await req(`/${pid}/language/${fr.language_id}/transcript`);
  await req(
    `/${pid}/language/${lid}/transcript/segment/${sid}`,
    json("PATCH", { translation: null }),
  );
  assert.deepEqual(
    await req(`/${pid}/language/${fr.language_id}/transcript`),
    french,
  );
  assert.equal(
    (await req(`/${pid}/language?page_size=1&status=stale`)).languages[0]
      .language_id,
    lid,
  );
  const source = await req(`/${pid}/transcript`);
  await req(
    `/${pid}/transcript/segment/${sid}`,
    json("PATCH", { text: null, speaker_id: null, start_s: null, end_s: null }),
  );
  assert.deepEqual((await req(`/${pid}/transcript`)).segments, source.segments);
});
