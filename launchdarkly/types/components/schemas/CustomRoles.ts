import type { CustomRole } from "./CustomRole.js";

export type CustomRoles = {
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * An array of custom roles
   */
  items?: Array<CustomRole>;
};
