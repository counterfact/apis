/**
 * Groups of organization members that gives permissions on specified repositories.
 */
export type nullable_team_simple = {
  /**
   * Unique identifier of the team
   * @example 1
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
   * @example "https://api.github.com/organizations/1/team/1/members{/member}"
   */
  members_url: string;
  /**
   * Name of the team
   * @example "Justice League"
   */
  name: string;
  /**
   * Description of the team
   * @example "A great team."
   */
  description: string;
  /**
   * Permission that the team will have for its repositories
   * @example "admin"
   */
  permission: string;
  /**
   * The level of privacy this team should have
   * @example "closed"
   */
  privacy?: string;
  /**
   * The notification setting the team has set
   * @example "notifications_enabled"
   */
  notification_setting?: string;
  /**
   * @format uri
   * @example "https://github.com/orgs/rails/teams/core"
   */
  html_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/organizations/1/team/1/repos"
   */
  repositories_url: string;
  /**
   * @example "justice-league"
   */
  slug: string;
  /**
   * Distinguished Name (DN) that team maps to within LDAP environment
   * @example "uid=example,ou=users,dc=github,dc=com"
   */
  ldap_dn?: string;
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
