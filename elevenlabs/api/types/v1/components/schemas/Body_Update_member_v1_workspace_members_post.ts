import type { SeatType } from "./SeatType.js";
export type Body_Update_member_v1_workspace_members_post = {
  /**
   * Email of the target user.
   */
  email: string;
  /**
   * Whether to lock or unlock the user account.
   */
  is_locked?: boolean | null;
  /**
   * The workspace role of the user. This is deprecated, use `workspace_seat_type` instead.
   * @deprecated
   */
  workspace_role?: SeatType | null;
  /**
   * The workspace seat type
   */
  workspace_seat_type?: SeatType | null;
  /**
   * When unlocking a user whose original seat type has no seats available but a basic seat is available, downgrade the user to a basic seat instead of failing.
   * @default false
   */
  allow_downgrade_to_basic_seat?: boolean;
};
