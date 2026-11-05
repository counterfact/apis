import type { WebhookTargetAll } from "./WebhookTargetAll.js";
import type { WebhookTargetIds } from "./WebhookTargetIds.js";
export type WebhookTarget =
  (WebhookTargetAll & { type: "all" }) | (WebhookTargetIds & { type: "ids" });
