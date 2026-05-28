import type { secret_scanning_push_protection_bypass_reason } from "./secret-scanning-push-protection-bypass-reason.js";

export type secret_scanning_push_protection_bypass = {
  reason?: secret_scanning_push_protection_bypass_reason;
  /**
   * The time that the bypass will expire in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`.
   * @format date-time
   */
  expire_at?: string;
  /**
   * The token type this bypass is for.
   */
  token_type?: string;
};
