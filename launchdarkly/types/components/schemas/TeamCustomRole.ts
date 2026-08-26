import type { TeamProjects } from "./TeamProjects.js";
import type { UnixMillis } from "./UnixMillis.js";

export type TeamCustomRole = {
  /**
   * The key of the custom role
   * @example "role-key-123abc"
   */
  key?: string;
  /**
   * The name of the custom role
   * @example "Example role"
   */
  name?: string;
  /**
   * Details on the projects where team members have write privileges on at least one resource type (e.g. flags)
   */
  projects?: TeamProjects;
  /**
   * Timestamp of when the custom role was assigned to this team
   * @example "1648672018410"
   */
  appliedOn?: UnixMillis;
};
