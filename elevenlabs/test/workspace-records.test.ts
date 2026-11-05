import assert from "node:assert/strict";
import { test } from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
const json = (body: unknown) => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
test("Workspace resource grants persist, override and protect creator against live directories", async () => {
  const h = await createDispatcherHarness(),
    base = "/v1/workspace/resources/sim-narrator",
    get = async () => {
      const r = await h.request(base + "?resource_type=voice");
      assert.equal(r.status, 200);
      assert.match(r.headers.get("content-type")!, /json/);
      return r.json();
    };
  assert.equal((await get()).resource_name, "Simulator Narrator");
  const share = async (body: unknown, status = 200) => {
    const r = await h.request(base + "/share", json(body));
    assert.equal(r.status, status);
  };
  await share({
    resource_type: "voice",
    role: "viewer",
    user_email: "assistant@example.invalid",
  });
  assert.deepEqual((await get()).role_to_group_ids.viewer, [
    "sim-member-assistant",
  ]);
  await share({
    resource_type: "voice",
    role: "editor",
    user_email: "assistant@example.invalid",
  });
  assert.deepEqual((await get()).role_to_group_ids.editor, [
    "sim-member-assistant",
  ]);
  assert.equal((await get()).role_to_group_ids.viewer, undefined);
  await share({
    resource_type: "voice",
    role: "viewer",
    group_id: "sim-group-team",
  });
  await share({
    resource_type: "voice",
    role: "commenter",
    workspace_api_key_id: "sim-service-key",
  });
  const createKey = await h.request(
    "/v1/service-accounts/sim-service-account/api-keys",
    json({ name: "Second key", permissions: ["voices_read"] }),
  );
  assert.equal(createKey.status, 200);
  const newKey = await createKey.json();
  assert.equal(
    (
      await h.request(
        base + "/unshare",
        json({ resource_type: "voice", workspace_api_key_id: newKey.key_id }),
      )
    ).status,
    200,
  );
  assert.equal(
    (await get()).share_options.filter(
      (o: { id: string }) => o.id === "sim-service-account",
    ).length,
    1,
  );
  await share({
    resource_type: "voice",
    role: "commenter",
    workspace_api_key_id: newKey.key_id,
  });
  assert.equal(
    (await get()).share_options.filter(
      (o: { id: string }) => o.id === "sim-service-account",
    ).length,
    0,
  );
  assert.equal(
    (
      await h.request(
        "/v1/service-accounts/sim-service-account/api-keys/sim-service-key",
        { method: "DELETE" },
      )
    ).status,
    200,
  );
  assert.deepEqual((await get()).role_to_group_ids.commenter, [
    "sim-service-account",
  ]);
  assert.equal(
    (
      await h.request(
        "/v1/service-accounts/sim-service-account/api-keys/" + newKey.key_id,
        { method: "DELETE" },
      )
    ).status,
    200,
  );
  assert.deepEqual((await get()).role_to_group_ids.commenter, [
    "sim-service-account",
  ]);
  await share(
    {
      resource_type: "voice",
      role: "viewer",
      workspace_api_key_id: "sim-service-key",
    },
    404,
  );
  await share(
    { resource_type: "voice", role: "viewer", group_id: "missing" },
    404,
  );
  await share(
    {
      resource_type: "voice",
      role: "viewer",
      group_id: "default",
      user_email: "assistant@example.invalid",
    },
    400,
  );
  assert.equal(
    (
      await h.request(
        base + "/unshare",
        json({
          resource_type: "voice",
          user_email: "narrator@example.invalid",
        }),
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await h.request(
        base + "/unshare",
        json({
          resource_type: "voice",
          user_email: "assistant@example.invalid",
        }),
      )
    ).status,
    200,
  );
  assert.equal((await get()).role_to_group_ids.editor, undefined);
  await h.request("/v1/voices/sim-narrator", { method: "DELETE" });
  assert.equal((await h.request(base + "?resource_type=voice")).status, 404);
  await h.scenario("reset");
  assert.deepEqual((await get()).role_to_group_ids, {
    admin: ["sim-member-narrator"],
  });
  assert.equal(
    (
      await h.request(
        "/v1/workspace/resources/sim-collection?resource_type=voice_collection",
      )
    ).status,
    200,
  );
  assert.equal((await h.request(base + "?resource_type=assets")).status, 400);
  const other = await createDispatcherHarness();
  assert.equal(
    (await other.request(base + "?resource_type=voice")).status,
    200,
  );
});
test("Workspace historical audit and request records filter, paginate and reset independently", async () => {
  const h = await createDispatcherHarness();
  const audit = async (q = "") => {
    const r = await h.request("/v1/workspace/audit-logs" + q);
    assert.equal(r.status, 200);
    return r.json();
  };
  const first = await audit("?limit=1");
  assert.equal(first.entries[0].id, "sim-audit-2");
  assert.equal(first.has_more, true);
  assert.equal(
    (await audit("?limit=1&cursor=" + first.next_cursor)).entries[0].id,
    "sim-audit-1",
  );
  assert.equal(
    (await audit("?actor_uid=sim-member-assistant")).entries.length,
    1,
  );
  assert.equal(
    (await audit("?time_from_unix_ms=1735689601000")).entries.length,
    1,
  );
  const requests = async (body: unknown, status = 200) => {
    const r = await h.request("/v1/workspace/analytics/requests", json(body));
    assert.equal(r.status, status);
    return r.json();
  };
  const result = await requests({ start_time: 1735689600000 });
  assert.deepEqual(result.columns, [
    "timestamp",
    "request_id",
    "method",
    "path",
    "status_code",
    "user_id",
  ]);
  assert.equal(result.rows.length, 2);
  assert.equal(result.rows[0][1], "sim-request-1");
  assert.equal(
    (await requests({ end_time: 1735689602000, search: "voices" })).rows[0][1],
    "sim-request-1",
  );
  assert.equal(
    (
      await requests({
        start_time: 1735689600000,
        filters: [{ column: "status_code", operation: "ge", values: [400] }],
      })
    ).rows.length,
    1,
  );
  for (const query of [
    "?limit=0",
    "?cursor=bad",
    "?time_from_unix_ms=bad",
    "?time_from_unix_ms=5&time_to_unix_ms=2",
  ])
    assert.equal(
      (await h.request("/v1/workspace/audit-logs" + query)).status,
      400,
    );
  await requests({}, 400);
  await requests(
    {
      start_time: 1735689600000,
      filters: [{ column: "unknown", operation: "eq", values: [1] }],
    },
    400,
  );
  await h.scenario("emptyWorkspaceRecords");
  assert.equal((await audit()).entries.length, 0);
  assert.equal((await requests({ start_time: 1735689600000 })).rows.length, 0);
  await h.scenario("reset");
  assert.equal((await audit()).entries.length, 2);
});
