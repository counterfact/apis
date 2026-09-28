import type { Access } from "./Access.js";
import type { Statement } from "./Statement.js";
import type { RoleType } from "./RoleType.js";

export type CustomRole = {
  /**
   * The ID of the custom role
   * @example "1234a56b7c89d012345e678f"
   */
  _id: string;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * Details on the allowed and denied actions for this custom role
   */
  _access?: Access;
  /**
   * The description of the custom role
   * @example "This custom role is just an example"
   */
  description?: string;
  /**
   * The key of the custom role
   * @example "example-custom-role"
   */
  key: string;
  /**
   * The name of the custom role
   * @example "Example custom role"
   */
  name: string;
  /**
   * An array of the policies that comprise this custom role
   */
  policy: Array<Statement>;
  /**
   * Base permissions to use for this role
   * @example "reader"
   */
  basePermissions?: RoleType;
};
