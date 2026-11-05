import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const base = "/v1/studio/projects";
const projectInput = () => ({
  name: "Edited project",
  default_title_voice_id: "sim-assistant",
  default_paragraph_voice_id: "sim-narrator",
  author: "Local author",
  volume_normalization: true,
});
const content = () => ({
  blocks: [
    {
      sub_type: "p",
      nodes: [
        {
          type: "tts_node",
          text: "Hello local world",
          voice_id: "sim-narrator",
        },
      ],
    },
  ],
});
test("Studio context starts empty and preserves atomic project/chapter metadata", async () => {
  const { Context } =
    await import("../api/routes/studio/projects/_.context.js");
  assert.equal(new Context().projects.size, 0);
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/studio/projects");
  const initial = c.get("sim-project");
  initial.name = "Mutated";
  assert.equal(c.get("sim-project").name, "Simulator Studio Project");
  const chapter = c.createChapter("sim-project", {
      name: "New chapter",
    }).chapter,
    id = chapter.chapter_id;
  const before = c.get("sim-project"),
    counter = c.nextChapterId;
  assert.throws(() =>
    c.createChapter("sim-project", {
      name: "Remote",
      from_url: "https://example.invalid",
    }),
  );
  assert.equal(c.nextChapterId, counter);
  assert.throws(() =>
    c.updateProject("sim-project", { ...projectInput(), name: "" }),
  );
  assert.deepEqual(c.get("sim-project"), before);
  const source = content();
  c.updateChapter("sim-project", id, { content: source });
  source.blocks[0].nodes[0].text = "Mutated";
  assert.equal(
    c.chapter("sim-project", id).content.blocks[0].nodes[0].type,
    "tts_node",
  );
  assert.equal(
    c.chapter("sim-project", id).statistics?.characters_unconverted,
    17,
  );
  const edited = c.chapter("sim-project", id);
  assert.throws(() =>
    c.updateChapter("sim-project", id, {
      content: {
        blocks: [
          { nodes: [{ type: "tts_node", text: 3, voice_id: "sim-narrator" }] },
        ],
      },
    }),
  );
  assert.deepEqual(c.chapter("sim-project", id), edited);
  c.attachDictionaries("sim-project", {
    pronunciation_dictionary_locators: [
      { pronunciation_dictionary_id: "sim-dictionary", version_id: null },
    ],
  });
  const attached = c.get("sim-project");
  assert.equal(attached.pronunciation_dictionary_versions.length, 1);
  assert.throws(() =>
    c.attachDictionaries("sim-project", {
      pronunciation_dictionary_locators: [
        { pronunciation_dictionary_id: "sim-dictionary", version_id: null },
        { pronunciation_dictionary_id: "missing", version_id: null },
      ],
    }),
  );
  assert.deepEqual(c.get("sim-project"), attached);
  const version = attached.pronunciation_dictionary_versions[0].version_id;
  r.loadContext("/pronunciation-dictionaries").addRules("sim-dictionary", []);
  assert.equal(
    c.get("sim-project").pronunciation_dictionary_versions[0].version_id,
    version,
  );
  c.attachDictionaries("sim-project", {
    pronunciation_dictionary_locators: [
      { pronunciation_dictionary_id: "sim-dictionary", version_id: null },
    ],
    invalidate_affected_text: false,
  });
  assert.notEqual(
    c.get("sim-project").pronunciation_dictionary_versions[0].version_id,
    version,
  );
  const state = c.get("sim-project");
  assert.throws(() =>
    c.updateChapter("sim-project", id, {
      content: {
        blocks: [
          { block_id: "duplicate", nodes: [] },
          { block_id: "duplicate", nodes: [] },
        ],
      },
    }),
  );
  assert.deepEqual(c.get("sim-project"), state);
  c.updateChapter("sim-project", id, { name: null, content: null });
  assert.deepEqual(c.chapter("sim-project", id), edited);
  c.deleteChapter("sim-project", id);
  assert.throws(() => c.chapter("sim-project", id));
  assert.equal(c.get("sim-project").chapters.length, 1);
  c.deleteProject("sim-project");
  assert.equal(c.projects.size, 0);
  assert.throws(() => c.get("sim-project"));
  await r.run(scenarios.reset);
  assert.equal(c.projects.size, 1);
  assert.equal(c.nextChapterId, 1);
});
test("Studio Dispatcher persists metadata, chapter content and dictionary attachments", async () => {
  const a = await createDispatcherHarness(),
    other = await createDispatcherHarness();
  const send = (p: string, m: string, b?: unknown) =>
    a.request(p, {
      method: m,
      ...(b === undefined
        ? {}
        : {
            headers: { "content-type": "application/json" },
            body: JSON.stringify(b),
          }),
    });
  const list = await a.request(base);
  assert.equal(list.status, 200);
  assert.equal((await list.json()).projects.length, 1);
  const get = await a.request(`${base}/sim-project`);
  assert.equal(get.status, 200);
  assert.equal((await get.json()).chapters[0].chapter_id, "sim-chapter");
  const changed = await send(`${base}/sim-project`, "POST", projectInput());
  assert.equal(changed.status, 200);
  assert.equal((await changed.json()).project.name, "Edited project");
  const created = await send(`${base}/sim-project/chapters`, "POST", {
    name: "Created chapter",
  });
  assert.equal(created.status, 200);
  const id = (await created.json()).chapter.chapter_id;
  assert.equal(id, "sim-chapter-created-1");
  const edit = await send(`${base}/sim-project/chapters/${id}`, "POST", {
    name: "Edited chapter",
    content: content(),
  });
  assert.equal(edit.status, 200);
  const result = (await edit.json()).chapter;
  assert.equal(result.name, "Edited chapter");
  assert.equal(result.content.blocks[0].block_id, `${id}-block-1`);
  assert.equal(
    result.content.blocks[0].nodes[0].project_voice_ref_id,
    "sim-narrator",
  );
  assert.equal(result.statistics.characters_unconverted, 17);
  assert.equal(
    (await (await a.request(`${base}/sim-project/chapters`)).json()).chapters
      .length,
    2,
  );
  assert.equal(
    (await (await a.request(`${base}/sim-project/chapters/${id}`)).json()).name,
    "Edited chapter",
  );
  const dictionaries = await send(
    `${base}/sim-project/pronunciation-dictionaries`,
    "POST",
    {
      pronunciation_dictionary_locators: [
        { pronunciation_dictionary_id: "sim-dictionary", version_id: null },
      ],
    },
  );
  assert.equal(dictionaries.status, 200);
  assert.equal((await dictionaries.json()).status, "ok");
  const attached = await (await a.request(`${base}/sim-project`)).json();
  assert.equal(
    attached.pronunciation_dictionary_versions[0].pronunciation_dictionary_id,
    "sim-dictionary",
  );
  assert.equal(
    attached.pronunciation_dictionary_locators[0].version_id,
    attached.pronunciation_dictionary_versions[0].version_id,
  );
  const prior = await (await a.request(`${base}/sim-project`)).json();
  assert.equal(
    (
      await send(`${base}/sim-project/pronunciation-dictionaries`, "POST", {
        pronunciation_dictionary_locators: [
          { pronunciation_dictionary_id: "sim-dictionary", version_id: null },
          { pronunciation_dictionary_id: "missing", version_id: null },
        ],
      })
    ).status,
    404,
  );
  assert.deepEqual(
    await (await a.request(`${base}/sim-project`)).json(),
    prior,
  );
  const muted = await a.request(`${base}/sim-project/muted-tracks`);
  assert.equal(muted.status, 200);
  assert.deepEqual((await muted.json()).chapter_ids, ["sim-chapter"]);
  for (const [p, m, b, status] of [
    [`${base}/missing`, "GET", undefined, 404],
    [`${base}/sim-project/chapters/missing`, "GET", undefined, 404],
    [
      `${base}/sim-project/chapters`,
      "POST",
      { name: "Remote", from_url: "https://example.invalid" },
      400,
    ],
    [
      `${base}/sim-project/chapters/${id}`,
      "POST",
      {
        content: {
          blocks: [
            {
              nodes: [{ type: "tts_node", text: 9, voice_id: "sim-narrator" }],
            },
          ],
        },
      },
      400,
    ],
    [`${base}/sim-project`, "POST", { ...projectInput(), name: "" }, 400],
    [
      `${base}/sim-project/pronunciation-dictionaries`,
      "POST",
      {
        pronunciation_dictionary_locators: [
          { pronunciation_dictionary_id: "missing", version_id: null },
        ],
      },
      404,
    ],
  ] as const)
    assert.equal((await send(p, m, b)).status, status);
  assert.equal(
    (await (await a.request(`${base}/sim-project`)).json()).name,
    "Edited project",
  );
  assert.equal(
    (await (await a.request(`${base}/sim-project/chapters/${id}`)).json())
      .statistics.characters_unconverted,
    17,
  );
  const removed = await send(
    `${base}/sim-project/chapters/sim-chapter`,
    "DELETE",
  );
  assert.equal(removed.status, 200);
  assert.equal((await removed.json()).status, "ok");
  assert.deepEqual(
    (await (await a.request(`${base}/sim-project/muted-tracks`)).json())
      .chapter_ids,
    [],
  );
  const deleted = await send(`${base}/sim-project`, "DELETE");
  assert.equal(deleted.status, 200);
  assert.equal((await deleted.json()).status, "ok");
  assert.equal(
    (await a.request(`${base}/sim-project/chapters/${id}`)).status,
    404,
  );
  assert.equal((await (await a.request("/v1/voices")).json()).voices.length, 2);
  assert.equal((await (await other.request(base)).json()).projects.length, 1);
  await a.scenario("emptyStudioProjects", "api");
  assert.equal((await (await a.request(base)).json()).projects.length, 0);
  await a.scenario("reset", "api");
  assert.equal((await (await a.request(base)).json()).projects.length, 1);
  assert.equal(
    (
      await (
        await send(`${base}/sim-project/chapters`, "POST", { name: "Again" })
      ).json()
    ).chapter.chapter_id,
    id,
  );
});
