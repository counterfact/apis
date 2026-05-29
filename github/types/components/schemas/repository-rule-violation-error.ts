import type { secret_scanning_push_protection_bypass_placeholder_id } from "./secret-scanning-push-protection-bypass-placeholder-id.js";

/**
 * Repository rule violation was detected
 */
export type repository_rule_violation_error = {
  message?: string;
  documentation_url?: string;
  status?: string;
  metadata?: {
    secret_scanning?: {
      bypass_placeholders?: Array<{
        placeholder_id?: secret_scanning_push_protection_bypass_placeholder_id;
        token_type?: string;
      }>;
    };
  };
};
