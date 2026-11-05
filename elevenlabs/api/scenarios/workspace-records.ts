import type { Scenario } from "../types/index.js";
export const emptyWorkspaceRecords: Scenario = ($) => {
  const c = $.loadContext("/workspace"),
    analytics = $.loadContext("/workspace/analytics");
  c.resourceGrants = new Map();
  c.auditEntries = [];
  analytics.requests = [];
  c.resourceLookup = (type, id) => {
    const item =
      type === "voice"
        ? $.context.voices.get(id)
        : type === "voice_collection"
          ? $.loadContext("/voices/collections").collections.get(id)
          : undefined;
    if (!item) return undefined;
    return {
      name: "name" in item ? item.name : item.title,
      creator: "sim-member-narrator",
    };
  };
  c.serviceDirectory = () =>
    new Map(
      [...$.loadContext("/service-accounts").accounts.values()].map((a) => [
        a.id,
        a.name,
      ]),
    );
  c.keyDirectory = () =>
    new Map(
      [...$.loadContext("/service-accounts").accounts.values()].flatMap((a) =>
        [...a.keys.values()].map(
          (k) => [k.key_id, { userId: a.id, name: a.name }] as const,
        ),
      ),
    );
};
export const resetWorkspaceRecords: Scenario = ($) => {
  emptyWorkspaceRecords($);
  const c = $.loadContext("/workspace");
  c.auditEntries = [0, 1].map((i) => ({
    id: `sim-audit-${i + 1}`,
    time: 1735689600000 + i * 1000,
    time_dt: new Date(1735689600000 + i * 1000).toISOString(),
    activity_id: 1,
    status_id: 1,
    activity_name: "Create",
    class_name: "Account Change",
    class_uid: 3001,
    type_uid: 300101,
    type_name: "Account Change: Create",
    message: "Synthetic historical workspace event",
    actor: {
      user: {
        uid: i ? "sim-member-assistant" : "sim-member-narrator",
        name: i ? "Assistant" : "Narrator",
      },
    },
  }));
  $.loadContext("/workspace/analytics").requests = [
    {
      timestamp: 1735689600000,
      request_id: "sim-request-1",
      method: "GET",
      path: "/v1/voices",
      status_code: 200,
      user_id: "sim-member-narrator",
    },
    {
      timestamp: 1735689601000,
      request_id: "sim-request-2",
      method: "GET",
      path: "/v1/missing",
      status_code: 404,
      user_id: "sim-member-assistant",
    },
  ];
};
