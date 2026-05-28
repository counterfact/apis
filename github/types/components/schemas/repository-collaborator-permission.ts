import type { nullable_collaborator } from "./nullable-collaborator.js";

/**
 * Repository Collaborator Permission
 */
export type repository_collaborator_permission = {
  permission: string;
  /**
   * @example "admin"
   */
  role_name: string;
  user: nullable_collaborator;
};
