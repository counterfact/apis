/**
 * The breakdown of Copilot Business seats for the organization.
 */
export type copilot_organization_seat_breakdown = {
  /**
   * The total number of seats being billed for the organization as of the current billing cycle.
   */
  total?: number;
  /**
   * Seats added during the current billing cycle.
   */
  added_this_cycle?: number;
  /**
   * The number of seats that are pending cancellation at the end of the current billing cycle.
   */
  pending_cancellation?: number;
  /**
   * The number of users who have been invited to receive a Copilot seat through this organization.
   */
  pending_invitation?: number;
  /**
   * The number of seats that have used Copilot during the current billing cycle.
   */
  active_this_cycle?: number;
  /**
   * The number of seats that have not used Copilot during the current billing cycle.
   */
  inactive_this_cycle?: number;
};
