import type { SeatType } from "./SeatType.js";
export type Body_Invite_multiple_users_v1_workspace_invites_add_bulk_post = {
  /**
   * The email of the customer
   */
  emails: Array<string>;
  /**
   * The seat type of the user
   */
  seat_type?: SeatType | null;
  /**
   * The group ids of the user
   */
  group_ids?: Array<string> | null;
  /**
   * Monthly credit usage limit for the invitee. Omit or set to null for no custom cap.
   */
  usage_limit?: number | null;
};
