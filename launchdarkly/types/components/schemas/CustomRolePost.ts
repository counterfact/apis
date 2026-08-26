import type { StatementPostList } from "./StatementPostList.js";
import type { RoleType } from "./RoleType.js";

export type CustomRolePost = {
  /**
   * A human-friendly name for the custom role
   * @example "Ops team"
   */
  name: string;
  /**
   * The custom role key
   * @example "role-key-123abc"
   */
  key: string;
  /**
   * Description of custom role
   * @example "An example role for members of the ops team"
   */
  description?: string;
  /**
   * Resource statements for custom role
   */
  policy: StatementPostList;
  /**
   * Base permissions to use for this role.
   * @example "reader"
   */
  basePermissions?: RoleType;
};
