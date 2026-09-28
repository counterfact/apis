import type { AccessDenied } from "./AccessDenied.js";
import type { AccessAllowedRep } from "./AccessAllowedRep.js";

export type Access = {
  denied: Array<AccessDenied>;
  allowed: Array<AccessAllowedRep>;
};
