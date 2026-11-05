export type UpdateTransferRuleParams = {
  /**
   * @default "update_transfer_rule"
   */
  smb_tool_type?: "update_transfer_rule";
  /**
   * Whether to offer the post_dial_digits parameter, set from the receptionists' enable_play_keypad_touch_tone_tool config. Digits saved while that is off are dropped when the receptionist is built, so the parameter is hidden rather than accepted and ignored.
   * @default false
   */
  post_dial_digits_enabled?: boolean;
};
