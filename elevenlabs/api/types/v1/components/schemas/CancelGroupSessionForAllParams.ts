/**
 * Cancel an entire group session and notify every registered participant.
 * Destructive -- prefer ``cancel_group_session_registration`` for cancelling
 * a single attendee.
 */
export type CancelGroupSessionForAllParams = {
  /**
   * @default "cancel_group_session_for_all"
   */
  smb_tool_type?: "cancel_group_session_for_all";
};
