/**
 * Group of enterprise owners and/or members
 */
export type enterprise_team = {
  /**
   * @format int64
   */
  id: number;
  name: string;
  description?: string;
  slug: string;
  /**
   * @format uri
   */
  url: string;
  /**
   * Retired: this field will not be returned with GHEC enterprise teams.
   * @example "disabled | all"
   */
  sync_to_organizations?: string;
  /**
   * @example "disabled | selected | all"
   */
  organization_selection_type?: string;
  /**
   * @example "62ab9291-fae2-468e-974b-7e45096d5021"
   */
  group_id: string;
  /**
   * Retired: this field will not be returned with GHEC enterprise teams.
   * @example "Justice League"
   */
  group_name?: string;
  /**
   * @format uri
   * @example "https://github.com/enterprises/dc/teams/justice-league"
   */
  html_url: string;
  members_url: string;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  /**
   * Whether team members will receive notifications when the team is mentioned.
   * @example "notifications_enabled"
   */
  notification_setting?: "notifications_enabled" | "notifications_disabled";
};
