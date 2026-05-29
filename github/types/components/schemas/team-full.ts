import type { nullable_team_simple } from "./nullable-team-simple.js";
import type { team_organization } from "./team-organization.js";
import type { ldap_dn } from "./ldap-dn.js";

/**
 * Groups of organization members that gives permissions on specified repositories.
 */
export type team_full = {
  /**
   * Unique identifier of the team
   * @example 42
   */
  id: number;
  /**
   * @example "MDQ6VGVhbTE="
   */
  node_id: string;
  /**
   * URL for the team
   * @format uri
   * @example "https://api.github.com/organizations/1/team/1"
   */
  url: string;
  /**
   * @format uri
   * @example "https://github.com/orgs/rails/teams/core"
   */
  html_url: string;
  /**
   * Name of the team
   * @example "Developers"
   */
  name: string;
  /**
   * @example "justice-league"
   */
  slug: string;
  /**
   * @example "A great team."
   */
  description: string;
  /**
   * The level of privacy this team should have
   * @example "closed"
   */
  privacy?: "closed" | "secret";
  /**
   * The notification setting the team has set
   * @example "notifications_enabled"
   */
  notification_setting?: "notifications_enabled" | "notifications_disabled";
  /**
   * Permission that the team will have for its repositories
   * @example "push"
   */
  permission: string;
  /**
   * @example "https://api.github.com/organizations/1/team/1/members{/member}"
   */
  members_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/organizations/1/team/1/repos"
   */
  repositories_url: string;
  parent?: nullable_team_simple;
  /**
   * @example 3
   */
  members_count: number;
  /**
   * @example 10
   */
  repos_count: number;
  /**
   * @format date-time
   * @example "2017-07-14T16:53:42Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2017-08-17T12:37:15Z"
   */
  updated_at: string;
  organization: team_organization;
  ldap_dn?: ldap_dn;
  /**
   * The ownership type of the team
   */
  type: "enterprise" | "organization";
  /**
   * Unique identifier of the organization to which this team belongs
   * @example 37
   */
  organization_id?: number;
  /**
   * Unique identifier of the enterprise to which this team belongs
   * @example 42
   */
  enterprise_id?: number;
};
