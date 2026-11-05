import type { Scenario } from "../types/index.js";

export const emptyTags: Scenario = ($) => {
  const context = $.loadContext("/convai/tags");
  context.tags = new Map();
  context.nextTagNumber = 0;
  context.creationTimeUnix = 1_735_689_600;
  context.workspaceId = "sim-workspace";
  context.ownerUserId = "sim-user";
};

export const resetTags: Scenario = ($) => {
  emptyTags($);
  $.loadContext("/convai/tags").tags.set("sim-tag", {
    tag_id: "sim-tag", workspace_id: "sim-workspace", owner_user_id: "sim-user",
    title: "Simulator Follow-up", description: "Local conversation tag fixture.", created_at_unix_secs: 1_735_689_600,
  });
};
