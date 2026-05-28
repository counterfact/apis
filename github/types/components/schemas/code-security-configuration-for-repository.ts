import type { code_security_configuration } from "./code-security-configuration.js";

/**
 * Code security configuration associated with a repository and attachment status
 */
export type code_security_configuration_for_repository = {
  /**
   * The attachment status of the code security configuration on the repository.
   */
  status?:
    | "attached"
    | "attaching"
    | "detached"
    | "removed"
    | "enforced"
    | "failed"
    | "updating"
    | "removed_by_enterprise";
  configuration?: code_security_configuration;
};
