import type { SeatType } from "./SeatType.js";
export type Body_Invite_user_v1_workspace_invites_add_post = {
  /**
   * The email of the customer
   */
  email: string;
  /**
   * The workspace permission of the user. This is deprecated, use `seat_type` instead.
   * @deprecated
   */
  workspace_permission?: string | null;
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
