import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
import type { Context } from "../api/routes/convai/agents/{agent_id}/branches/{branch_id}/procedures/_.context.js";
const base = "/v1/convai/agents/sim-agent/branches/sim-main-branch/procedures";
const edit = { name: "Edited", content: "Local draft", type: "free_form" };
test("procedure context keeps draft working sets separate from published snapshots", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext(
    "/convai/agents/{agent_id}/branches/{branch_id}/procedures" as never,
  ) as Context;
  assert.equal(
    c.list("sim-agent", "sim-main-branch").procedures[0].procedure_id,
    "sim-procedure",
  );
  const created = c.create("sim-agent", "sim-main-branch", {
    name: "New",
    content: "Opaque text",
  });
  assert.equal(created.procedure_id, "sim-procedure-created-1");
  assert.equal(
    c.get("sim-agent", "sim-agent-feature", "sim-procedure", {
      version_id: "sim-procedure-version",
    }).name,
    "Published support",
  );
  c.updateDraft("sim-agent", "sim-agent-feature", "sim-procedure", {
    ...edit,
    name: "Feature draft",
  });
  assert.equal(
    c
      .list("sim-agent", "sim-main-branch")
      .procedures.find((x) => x.procedure_id === "sim-procedure")?.name,
    "Published support",
  );

  c.updateDraft("sim-agent", "sim-main-branch", "sim-procedure", edit);
  assert.equal(
    c.draft("sim-agent", "sim-main-branch", "sim-procedure").name,
    "Edited",
  );
  assert.equal(
    c.get("sim-agent", "sim-main-branch", "sim-procedure").name,
    "Published support",
  );
  assert.equal(
    c.list("sim-agent", "sim-main-branch", "sim-agent-version-main")
      .procedures[0].has_draft,
    false,
  );
  const copy = c.list("sim-agent", "sim-main-branch");
  copy.procedures[0].name = "Mutated";
  assert.equal(
    c
      .list("sim-agent", "sim-main-branch")
      .procedures.find((x) => x.procedure_id === "sim-procedure")?.name,
    "Edited",
  );
  c.deleteDraft("sim-agent", "sim-main-branch", "sim-procedure");
  assert.throws(
    () => c.draft("sim-agent", "sim-main-branch", "sim-procedure"),
    { code: "procedure_draft_not_found" },
  );
  c.remove("sim-agent", "sim-main-branch", created.procedure_id);
  c.remove("sim-agent", "sim-main-branch", "sim-procedure");
  assert.equal(
    c
      .list("sim-agent", "sim-main-branch")
      .procedures.some((x) => x.procedure_id === "sim-procedure"),
    false,
  );
  assert.equal(
    c.get("sim-agent", "sim-main-branch", "sim-procedure", {
      agent_version_id: "sim-agent-version-main",
    }).name,
    "Published support",
  );
  await r.run(scenarios.reset);
  assert.equal(c.list("sim-agent", "sim-main-branch").procedures.length, 1);
});
test("validated Dispatcher exposes procedure lifecycle and branch reset without publishing drafts", async () => {
  const h = await createDispatcherHarness();
  const req = async (
    path = "",
    method = "GET",
    body?: unknown,
    status = 200,
  ) => {
    const response = await h.request(base + path, {
      method,
      ...(body === undefined
        ? {}
        : {
            body: JSON.stringify(body),
            headers: { "content-type": "application/json" },
          }),
    });
    assert.equal(response.status, status);
    return response;
  };
  assert.equal((await (await req()).json()).procedures.length, 1);
  const featureBase = base.replace("sim-main-branch", "sim-agent-feature");
  assert.equal(
    (
      await (
        await h.request(
          featureBase + "/sim-procedure?version_id=sim-procedure-version",
        )
      ).json()
    ).name,
    "Published support",
  );
  assert.equal(
    (
      await h.request(featureBase + "/sim-procedure/draft", {
        method: "PATCH",
        body: JSON.stringify({ ...edit, name: "Feature draft" }),
        headers: { "content-type": "application/json" },
      })
    ).status,
    200,
  );
  assert.equal(
    (await (await req()).json()).procedures[0].name,
    "Published support",
  );

  const created = await (
    await req("", "POST", { name: "New", content: "Local" })
  ).json();
  assert.equal(created.procedure_id, "sim-procedure-created-1");
  assert.equal(
    (await (await req(`/${created.procedure_id}/draft`)).json()).content,
    "Local",
  );
  await req("/sim-procedure/draft", "PATCH", {
    ...edit,
    trigger: "When asked",
  });
  await req("/sim-procedure/draft", "PATCH", { ...edit, trigger: null });
  assert.equal(
    (await (await req("/sim-procedure/draft")).json()).trigger,
    "When asked",
  );
  assert.equal(
    (await (await req("/sim-procedure")).json()).name,
    "Published support",
  );
  await req("/sim-procedure/draft", "PATCH", {
    ...edit,
    description: "Alias trigger",
  });
  assert.equal(
    (await (await req("/sim-procedure/draft")).json()).trigger,
    "Alias trigger",
  );
  await req(
    "/sim-procedure/draft",
    "PATCH",
    { ...edit, trigger: "One", description: "Two" },
    400,
  );
  await req("/sim-procedure/draft", "PATCH", { name: "Invalid" }, 400);
  await req("/missing", "GET", undefined, 404);
  await req(
    "?agent_version_id=sim-agent-version-feature",
    "GET",
    undefined,
    404,
  );
  await req("/sim-procedure?version_id=missing", "GET", undefined, 404);
  assert.equal(
    (await (await h.request("/v1/convai/agents/sim-agent")).json()).procedures[
      "sim-procedure"
    ].name,
    "Published support",
  );
  assert.equal(
    (
      await h.request(
        "/v1/convai/agents/sim-agent/drafts?branch_id=sim-main-branch",
        { method: "DELETE" },
      )
    ).status,
    200,
  );
  await req(`/${created.procedure_id}/draft`, "GET", undefined, 404);
  assert.equal((await (await req()).json()).procedures.length, 1);
  await req("/sim-procedure", "DELETE");
  assert.equal((await (await req()).json()).procedures.length, 0);
  assert.equal(
    (
      await (
        await h.request(
          "/v1/convai/agents/sim-agent?version_id=sim-agent-version-main",
        )
      ).json()
    ).procedures["sim-procedure"].name,
    "Published support",
  );
  await h.scenario("reset");
  assert.equal((await (await req()).json()).procedures.length, 1);
  const other = await createDispatcherHarness();
  assert.equal((await (await other.request(base)).json()).procedures.length, 1);
});

test("procedure folders protect known handoffs and conservatively reject unverified outside content", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  await r.run(scenarios.procedureFolderReferences);
  const c = r.loadContext(
    "/convai/agents/{agent_id}/branches/{branch_id}/procedures" as never,
  ) as Context;
  assert.throws(
    () => c.remove("sim-agent", "sim-main-branch", "sim-procedure-folder"),
    { code: "procedure_referenced" },
  );
  assert.equal(c.list("sim-agent", "sim-main-branch").procedures.length, 3);
  assert.equal(
    c.get("sim-agent", "sim-agent-feature", "sim-procedure").version_id,
    "sim-procedure-version",
  );
  c.updateDraft("sim-agent", "sim-main-branch", "sim-procedure", edit);
  assert.throws(
    () => c.remove("sim-agent", "sim-main-branch", "sim-procedure-folder"),
    { code: "procedure_reference_analysis_required" },
  );
  c.deleteDraft("sim-agent", "sim-main-branch", "sim-procedure");

  c.remove("sim-agent", "sim-main-branch", "sim-procedure");
  const unknown = c.create("sim-agent", "sim-main-branch", {
    name: "Opaque",
    content: "Unanalyzed procedure",
  });
  assert.throws(
    () => c.remove("sim-agent", "sim-main-branch", "sim-procedure-folder"),
    { code: "procedure_reference_analysis_required" },
  );
  assert.throws(
    () => c.remove("sim-agent", "sim-main-branch", "sim-procedure-child"),
    { code: "procedure_reference_analysis_required" },
  );
  const draftCopy = c.draft(
    "sim-agent",
    "sim-main-branch",
    unknown.procedure_id,
  );
  draftCopy.content = "Mutated";
  assert.equal(
    c.draft("sim-agent", "sim-main-branch", unknown.procedure_id).content,
    "Unanalyzed procedure",
  );
  c.remove("sim-agent", "sim-main-branch", unknown.procedure_id);
  c.remove("sim-agent", "sim-main-branch", "sim-procedure-folder");
  assert.equal(c.list("sim-agent", "sim-main-branch").procedures.length, 0);
  c.clearBranchDrafts("sim-agent", "sim-main-branch");
  assert.equal(c.list("sim-agent", "sim-main-branch").procedures.length, 3);
  const prior = c.nextProcedure;
  for (const input of [
    { folder_parent_id: "missing" },
    { folder_parent_id: "sim-procedure" },
    { type: "unsupported" },
    { content: 3 },
  ])
    assert.throws(() => c.create("sim-agent", "sim-main-branch", input));
  assert.equal(c.nextProcedure, prior);
  const feature = c.create("sim-agent", "sim-agent-feature", null);
  assert.throws(
    () => c.get("sim-agent", "sim-main-branch", feature.procedure_id),
    { code: "procedure_not_found" },
  );
  const lifecycle = r.loadContext("/convai/agents/{agent_id}/branches");
  lifecycle.update("sim-agent", "sim-agent-feature", { is_archived: true });
  assert.throws(
    () =>
      c.updateDraft(
        "sim-agent",
        "sim-agent-feature",
        feature.procedure_id,
        edit,
      ),
    { code: "branch_archived" },
  );
  const h = await createDispatcherHarness();
  await h.scenario("procedureFolderReferences");
  const opaque = await (
    await h.request(base, {
      method: "POST",
      body: JSON.stringify({ content: "Unverified" }),
      headers: { "content-type": "application/json" },
    })
  ).json();
  assert.equal(
    (
      await (
        await h.request(base + "/sim-procedure-child", { method: "DELETE" })
      ).json()
    ).detail.status,
    "procedure_reference_analysis_required",
  );
  assert.equal(
    (await h.request(base + "/" + opaque.procedure_id, { method: "DELETE" }))
      .status,
    200,
  );
  assert.equal(
    (await h.request(base + "/sim-procedure-folder", { method: "DELETE" }))
      .status,
    409,
  );
  assert.equal(
    (await h.request(base + "/sim-procedure", { method: "DELETE" })).status,
    200,
  );
  assert.equal(
    (await h.request(base + "/sim-procedure-folder", { method: "DELETE" }))
      .status,
    200,
  );
  assert.equal((await (await h.request(base)).json()).procedures.length, 0);
});
