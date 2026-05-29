import type { nullable_simple_repository } from "./nullable-simple-repository.js";

/**
 * Information about repositories that Dependabot is able to access in an organization
 */
export type dependabot_repository_access_details = {
  /**
   * The default repository access level for Dependabot updates.
   * @example "internal"
   */
  default_level?: "public" | "internal";
  accessible_repositories?: Array<nullable_simple_repository>;
};
