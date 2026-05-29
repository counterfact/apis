import type { simple_user } from "./simple-user.js";
import type { team } from "./team.js";
import type { campaign_state } from "./campaign-state.js";

/**
 * The campaign metadata and alert stats.
 */
export type campaign_summary = {
  /**
   * The number of the newly created campaign
   */
  number: number;
  /**
   * The date and time the campaign was created, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
   * @format date-time
   */
  created_at: string;
  /**
   * The date and time the campaign was last updated, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
   * @format date-time
   */
  updated_at: string;
  /**
   * The campaign name
   */
  name?: string;
  /**
   * The campaign description
   */
  description: string;
  /**
   * The campaign managers
   */
  managers: Array<simple_user>;
  /**
   * The campaign team managers
   */
  team_managers?: Array<team>;
  /**
   * The date and time the campaign was published, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
   * @format date-time
   */
  published_at?: string;
  /**
   * The date and time the campaign has ended, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
   * @format date-time
   */
  ends_at: string;
  /**
   * The date and time the campaign was closed, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ. Will be null if the campaign is still open.
   * @format date-time
   */
  closed_at?: string;
  state: campaign_state;
  /**
   * The contact link of the campaign.
   * @format uri
   */
  contact_link: string;
  alert_stats?: {
    /**
     * The number of open alerts
     */
    open_count: number;
    /**
     * The number of closed alerts
     */
    closed_count: number;
    /**
     * The number of in-progress alerts
     */
    in_progress_count: number;
  };
};
