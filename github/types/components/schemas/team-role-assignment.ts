import type { nullable_team_simple } from "./nullable-team-simple.js";

/**
 * The Relationship a Team has with a role.
 */
export type team_role_assignment = {
  /**
   * Determines if the team has a direct, indirect, or mixed relationship to a role
   * @example "direct"
   */
  assignment?: "direct" | "indirect" | "mixed";
  id: number;
  node_id: string;
  name: string;
  slug: string;
  description: string;
  privacy?: string;
  notification_setting?: string;
  permission: string;
  permissions?: {
    pull: boolean;
    triage: boolean;
    push: boolean;
    maintain: boolean;
    admin: boolean;
  };
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   * @example "https://github.com/orgs/rails/teams/core"
   */
  html_url: string;
  members_url: string;
  /**
   * @format uri
   */
  repositories_url: string;
  parent: nullable_team_simple;
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
