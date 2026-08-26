import type { ActionIdentifier } from "./ActionIdentifier.js";
import type { AccessDeniedReason } from "./AccessDeniedReason.js";

export type AccessDenied = {
  action: ActionIdentifier;
  reason: AccessDeniedReason;
};
