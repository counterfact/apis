import type { Access } from "./Access.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { TeamCustomRoles } from "./TeamCustomRoles.js";
import type { TeamMembers } from "./TeamMembers.js";
import type { TeamProjects } from "./TeamProjects.js";
import type { TeamMaintainers } from "./TeamMaintainers.js";

export type Team = {
  /**
   * A description of the team
   * @example "Description for this team."
   */
  description?: string;
  /**
   * The team key
   * @example "team-key-123abc"
   */
  key?: string;
  /**
   * A human-friendly name for the team
   * @example "Example team"
   */
  name?: string;
  /**
   * Details on the allowed and denied actions for this team
   */
  _access?: Access;
  /**
   * Timestamp of when the team was created
   * @example "1648671956143"
   */
  _creationDate?: UnixMillis;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/teams","type":"application/json"},"roles":{"href":"/api/v2/teams/example-team/roles","type":"application/json"},"self":{"href":"/api/v2/teams/example-team","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
  /**
   * Timestamp of when the team was most recently updated
   * @example "1648672446072"
   */
  _lastModified?: UnixMillis;
  /**
   * The team version
   * @example 3
   */
  _version?: number;
  /**
   * Whether the team has been synced with an external identity provider (IdP). Team sync is available to customers on an Enterprise plan.
   * @example true
   */
  _idpSynced?: boolean;
  /**
   * Paginated list of the custom roles assigned to this team. Only included if specified in the <code>expand</code> query parameter.
   */
  roles?: TeamCustomRoles;
  /**
   * Details on the total count of members that belong to the team. Only included if specified in the <code>expand</code> query parameter.
   */
  members?: TeamMembers;
  /**
   * Paginated list of the projects that the team has any write access to. Only included if specified in the <code>expand</code> query parameter.
   */
  projects?: TeamProjects;
  /**
   * Paginated list of the maintainers assigned to this team. Only included if specified in the <code>expand</code> query parameter.
   */
  maintainers?: TeamMaintainers;
};
