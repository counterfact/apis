import type { simple_repository } from "./simple-repository.js";

/**
 * Repositories associated with a code security configuration and attachment status
 */
export type code_security_configuration_repositories = {
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
  repository?: simple_repository;
};
