import type { BanReasonType } from "./BanReasonType.js";
export type AgentBan = {
  at_unix: number;
  reason?: string | null;
  reason_type: BanReasonType;
};
