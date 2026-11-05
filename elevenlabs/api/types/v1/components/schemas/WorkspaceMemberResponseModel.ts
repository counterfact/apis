import type { SeatType } from "./SeatType.js";
/**
 * Public workspace member fields exposed via GET /v1/workspace/members.
 */
export type WorkspaceMemberResponseModel = {
  /**
   * The user ID of the workspace member.
   */
  user_id: string;
  /**
   * The email address of the workspace member.
   */
  email: string;
  /**
   * The first name of the workspace member, if available.
   */
  first_name: string | null;
  /**
   * The seat type (role) of the workspace member.
   */
  seat_type: SeatType | null;
  /**
   * Whether the member is the workspace owner.
   */
  is_owner: boolean;
  /**
   * Whether the member's account is locked in this workspace.
   */
  is_locked: boolean;
};
