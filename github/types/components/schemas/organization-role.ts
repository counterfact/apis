import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Organization roles
 */
export type organization_role = {
  /**
   * The unique identifier of the role.
   * @format int64
   */
  id: number;
  /**
   * The name of the role.
   */
  name: string;
  /**
   * A short description about who this role is for or what permissions it grants.
   */
  description?: string;
  /**
   * The system role from which this role inherits permissions.
   */
  base_role?: "read" | "triage" | "write" | "maintain" | "admin";
  /**
   * Source answers the question, "where did this role come from?"
   */
  source?: "Organization" | "Enterprise" | "Predefined";
  /**
   * A list of permissions included in this role.
   */
  permissions: Array<string>;
  organization: nullable_simple_user;
  /**
   * The date and time the role was created.
   * @format date-time
   */
  created_at: string;
  /**
   * The date and time the role was last updated.
   * @format date-time
   */
  updated_at: string;
};
