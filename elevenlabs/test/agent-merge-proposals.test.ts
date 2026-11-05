import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
import type { Context } from "../api/routes/convai/agents/{agent_id}/merge-proposals/_.context.js";
const body = {
  source_branch_id: "sim-agent-feature",
  target_branch_id: "sim-main-branch",
  title: "Feature review",
};
test("proposal context manages reviews, copies, closed states and canonical branches", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext(
    "/convai/agents/{agent_id}/merge-proposals" as never,
  ) as unknown as Context;
  const id = c.create("sim-agent", body).created_merge_proposal_id;
  assert.equal(
    c.get("sim-agent", id).source_tip_version_id_at_creation,
    "sim-agent-version-feature",
  );
  const copy = c.get("sim-agent", id);
  copy.comments!.push({
    id: "bad",
    user_id: "bad",
    body: "bad",
    created_at: 0,
  });
  assert.equal(c.get("sim-agent", id).comments!.length, 0);
  c.review("sim-agent", id, { state: "approved", comment: "Looks good" });
  c.review("sim-agent", id, { state: "changes_requested" });
  assert.equal(c.get("sim-agent", id).reviews!.length, 1);
  c.comment("sim-agent", id, { body: "Please update" });
  assert.equal(c.get("sim-agent", id).comments![0].body, "Please update");
  assert.throws(() => c.update("sim-agent", id, { title: "", close: true }));
  assert.equal(c.get("sim-agent", id).outcome!.status, "open");
  c.update("sim-agent", id, {
    title: "Updated",
    description: null,
    close: true,
  });
  assert.equal(c.get("sim-agent", id).outcome!.status, "closed");
  assert.throws(() => c.review("sim-agent", id, { state: "approved" }));
  assert.equal(
    c.list("sim-agent", { status: "closed", search: "UPDATED" }).results.length,
    1,
  );
  assert.throws(() =>
    c.create("sim-agent", { ...body, target_branch_id: "sim-agent-feature" }),
  );
  assert.throws(() =>
    c.create("sim-agent", { ...body, triage_ticket_id: "unknown" }),
  );
  const agents = r.loadContext("/convai/agents");
  agents.deleteAgent("sim-agent");
  assert.throws(() => c.get("sim-agent", id));
  await r.run(scenarios.reset);
  assert.equal(c.list("sim-agent").results.length, 1);
});
test("validated Dispatcher proposal management shares state and reset", async () => {
  const h = await createDispatcherHarness();
  const req = async (
    path = "",
    method = "GET",
    value?: unknown,
    status = 200,
  ) => {
    const res = await h.request(
      `/v1/convai/agents/sim-agent/merge-proposals${path}`,
      {
        method,
        ...(value === undefined
          ? {}
          : {
              body: JSON.stringify(value),
              headers: { "content-type": "application/json" },
            }),
      },
    );
    assert.equal(res.status, status);
    return res;
  };
  const id = (await (await req("", "POST", body)).json())
    .created_merge_proposal_id;
  assert.match(id, /^sim-merge-proposal-created-/);
  await req(`/${id}`, "PATCH", {
    title: "Changed",
    requested_reviewer_user_ids: ["sim-reviewer"],
  });
  await req(`/${id}/reviews`, "POST", {
    state: "approved",
    comment: "Local review",
  });
  await req(`/${id}/comments`, "POST", { body: "Local comment" });
  const detail = await (await req(`/${id}`)).json();
  assert.equal(detail.title, "Changed");
  assert.equal(detail.reviews[0].state, "approved");
  assert.equal(detail.comments[0].body, "Local comment");
  const page = await (await req("?page_size=1&search=changed")).json();
  assert.equal(page.results.length, 1);
  assert.equal(page.has_more, false);
  await req(`/${id}`, "PATCH", { close: true });
  await req(`/${id}/comments`, "POST", { body: "After close" });
  await req(`/${id}/reviews`, "POST", { state: "approved" }, 409);
  await req("", "POST", { ...body, source_branch_id: "missing" }, 404);
  await req("?cursor=bad", "GET", undefined, 400);
  await req(`/${id}`, "PATCH", { title: 42 }, 400);
  await h.scenario("reset");
  await req(`/${id}`, "GET", undefined, 404);
  assert.equal((await (await req()).json()).results.length, 1);
  await h.scenario("emptyAgentMergeProposals");
  assert.deepEqual((await (await req()).json()).results, []);
  const other = await createDispatcherHarness();
  assert.equal(
    (
      await (
        await other.request("/v1/convai/agents/sim-agent/merge-proposals")
      ).json()
    ).results.length,
    1,
  );
});

test("proposal context validates filters and mutations without consuming IDs", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext(
    "/convai/agents/{agent_id}/merge-proposals",
  ) as Context;
  const before = c.nextProposal;
  for (const value of [
    { ...body, triage_ticket_id: "sim-ticket" },
    { ...body, triage_ticket_id: 42 },
    { ...body, title: " " },
    { ...body, requested_reviewer_user_ids: [1] },
    { ...body, description: "x".repeat(4097) },
  ])
    assert.throws(() => c.create("sim-agent", value));
  assert.equal(c.nextProposal, before);
  const id = c.create("sim-agent", {
    ...body,
    requested_reviewer_user_ids: ["sim-reviewer", "sim-reviewer"],
  }).created_merge_proposal_id;
  assert.deepEqual(c.get("sim-agent", id).requested_reviewer_user_ids, [
    "sim-reviewer",
  ]);
  const page = c.list("sim-agent", {
    page_size: 1,
    source_branch_id: "sim-agent-feature",
    target_branch_id: "sim-main-branch",
    status: "open",
  });
  assert.equal(page.results[0].id, id);
  assert.equal(page.has_more, true);
  assert.equal(
    c.list("sim-agent", { page_size: 1, cursor: page.next_cursor }).results[0]
      .id,
    "sim-merge-proposal",
  );
  assert.deepEqual(c.list("sim-agent", { cursor: "99" }).results, []);
  for (const q of [
    { page_size: 0 },
    { page_size: 101 },
    { cursor: "01" },
    { status: ["open"] },
    { search: 42 },
  ])
    assert.throws(() => c.list("sim-agent", q));
  const time = c.get("sim-agent", id).updated_at;
  for (const input of [
    { state: ["approved"] },
    { state: "invalid" },
    { state: "approved", comment: "x".repeat(4097) },
  ])
    assert.throws(() => c.review("sim-agent", id, input));
  for (const input of [{ body: "" }, { body: " " }, { body: 42 }])
    assert.throws(() => c.comment("sim-agent", id, input));
  assert.equal(c.get("sim-agent", id).updated_at, time);
  assert.equal(c.nextComment, 0);
  const edited = c.update("sim-agent", id, {
    requested_reviewer_user_ids: [],
    title: null,
  });
  edited.requested_reviewer_user_ids!.push("mutated");
  assert.deepEqual(c.get("sim-agent", id).requested_reviewer_user_ids, []);
  const agents = r.loadContext("/convai/agents");
  const duplicate = agents.duplicateAgent("sim-agent", {}).value!.agent_id;
  assert.throws(() => c.get(duplicate, id), {
    code: "merge_proposal_not_found",
  });
  assert.deepEqual(c.list(duplicate).results, []);
  c.lifecycle!.update("sim-agent", "sim-agent-feature", { is_archived: true });
  assert.throws(() => c.create("sim-agent", body), { code: "branch_archived" });
  assert.equal(
    c.get("sim-agent", id).source_tip_version_id_at_creation,
    "sim-agent-version-feature",
  );
});
