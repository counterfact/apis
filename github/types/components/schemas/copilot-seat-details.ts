import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { nullable_organization_simple } from "./nullable-organization-simple.js";
import type { team } from "./team.js";
import type { enterprise_team } from "./enterprise-team.js";

/**
 * Information about a Copilot Business seat assignment for a user, team, or organization.
 */
export type copilot_seat_details = {
  assignee?: nullable_simple_user;
  organization?: nullable_organization_simple;
  /**
   * The team through which the assignee is granted access to GitHub Copilot, if applicable.
   */
  assigning_team?: team | enterprise_team;
  /**
   * The pending cancellation date for the seat, in `YYYY-MM-DD` format. This will be null unless the assignee's Copilot access has been canceled during the current billing cycle. If the seat has been cancelled, this corresponds to the start of the organization's next billing cycle.
   * @format date
   */
  pending_cancellation_date?: string;
  /**
   * Timestamp of user's last GitHub Copilot activity, in ISO 8601 format.
   * @format date-time
   */
  last_activity_at?: string;
  /**
   * Last editor that was used by the user for a GitHub Copilot completion.
   */
  last_activity_editor?: string;
  /**
   * Timestamp of the last time the user authenticated with GitHub Copilot, in ISO 8601 format.
   * @format date-time
   */
  last_authenticated_at?: string;
  /**
   * Timestamp of when the assignee was last granted access to GitHub Copilot, in ISO 8601 format.
   * @format date-time
   */
  created_at: string;
  /**
   * **Closing down notice:** This field is no longer relevant and is closing down. Use the `created_at` field to determine when the assignee was last granted access to GitHub Copilot. Timestamp of when the assignee's GitHub Copilot access was last updated, in ISO 8601 format.
   * @format date-time
   * @deprecated
   */
  updated_at?: string;
  /**
   * The Copilot plan of the organization, or the parent enterprise, when applicable.
   */
  plan_type?: "business" | "enterprise" | "unknown";
};
