import type { ActionIdentifier } from "./ActionIdentifier.js";
import type { AccessAllowedReason } from "./AccessAllowedReason.js";

export type AccessAllowedRep = {
  action: ActionIdentifier;
  reason: AccessAllowedReason;
};
