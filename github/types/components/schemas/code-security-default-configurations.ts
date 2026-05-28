import type { code_security_configuration } from "./code-security-configuration.js";

/**
 * A list of default code security configurations
 */
export type code_security_default_configurations = Array<{
  /**
   * The visibility of newly created repositories for which the code security configuration will be applied to by default
   */
  default_for_new_repos?: "public" | "private_and_internal" | "all";
  configuration?: code_security_configuration;
}>;
