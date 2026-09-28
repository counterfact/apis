import type { permissionGrantInput } from "./permissionGrantInput.js";

export type teamPostInput = {
  /**
   * List of custom role keys the team will access
   * @example ["example-role1","example-role2"]
   */
  customRoleKeys?: Array<string>;
  /**
   * A description of the team
   * @example "An example team"
   */
  description?: string;
  /**
   * The team key
   * @example "team-key-123abc"
   */
  key: string;
  /**
   * A list of member IDs who belong to the team
   * @example ["12ab3c45de678910fgh12345"]
   */
  memberIDs?: Array<string>;
  /**
   * A human-friendly name for the team
   * @example "Example team"
   */
  name: string;
  /**
   * A list of permission grants. Permission grants allow access to a specific action, without having to create or update a custom role.
   */
  permissionGrants?: Array<permissionGrantInput>;
};
