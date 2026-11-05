import assert from "node:assert/strict";
import { test } from "node:test";
import { Context } from "../api/routes/workspace/_.context.js";
import { Context as Analytics } from "../api/routes/workspace/analytics/_.context.js";
test("Workspace records start empty and resource failures preserve grants", () => {
  const c = new Context();
  assert.equal(c.auditEntries.length, 0);
  assert.equal(c.resourceGrants.size, 0);
  c.resourceLookup = (type, id) =>
    type === "voice" && id === "voice"
      ? { name: "Local voice", creator: "owner" }
      : undefined;
  c.memberDirectory = () =>
    new Map([
      ["owner@example.invalid", "owner"],
      ["member@example.invalid", "member"],
    ]);
  c.shareResource("voice", {
    resource_type: "voice",
    role: "viewer",
    user_email: "member@example.invalid",
  });
  const before = c.resourceMetadata("voice", "voice");
  assert.throws(() =>
    c.shareResource("voice", {
      resource_type: "voice",
      role: "admin",
      user_email: "missing@example.invalid",
    }),
  );
  assert.deepEqual(c.resourceMetadata("voice", "voice"), before);
  assert.throws(() =>
    c.shareResource(
      "voice",
      { resource_type: "voice", user_email: "owner@example.invalid" },
      true,
    ),
  );
  before.role_to_group_ids.viewer.push("changed");
  assert.deepEqual(
    c.resourceMetadata("voice", "voice").role_to_group_ids.viewer,
    ["member"],
  );
  c.shareResource("voice", {
    resource_type: "voice",
    role: "editor",
    user_email: "member@example.invalid",
  });
  assert.deepEqual(c.resourceMetadata("voice", "voice").role_to_group_ids, {
    admin: ["owner"],
    editor: ["member"],
  });
});
test("Request records support typed predicates without mutation", () => {
  const c = new Analytics();
  assert.equal(c.requests.length, 0);
  c.requests = [
    {
      timestamp: 1735689600000,
      request_id: "a",
      method: "GET",
      path: "/voices",
      status_code: 200,
      user_id: "user",
    },
    {
      timestamp: 1735689601000,
      request_id: "b",
      method: "POST",
      path: "/other",
      status_code: 400,
      user_id: "other",
    },
  ];
  assert.deepEqual(
    c
      .listRequests({
        start_time: 1735689600000,
        filters: [{ column: "status_code", operation: "ge", values: [400] }],
      })
      .rows.map((r) => r[1]),
    ["b"],
  );
  assert.throws(() => c.listRequests({}));
  assert.throws(() =>
    c.listRequests({
      start_time: 1735689600000,
      filters: [{ column: "status_code", operation: "gt", values: ["bad"] }],
    }),
  );
  assert.equal(c.requests.length, 2);
});
