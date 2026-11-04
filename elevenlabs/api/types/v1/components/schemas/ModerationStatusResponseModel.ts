/**
 * @example {"enterprise_background_moderation_enabled":false,"enterprise_check_block_nogo_voice":false,"enterprise_check_nogo_voice":false,"is_in_probation":false,"is_ivc_captcha_required":false,"never_live_moderate":false,"nogo_voice_similar_voice_upload_count":0,"on_watchlist":false}
 */
export type ModerationStatusResponseModel = {
  /**
   * Whether the user is in probation.
   */
  is_in_probation: boolean;
  /**
   * Whether the user's enterprise check nogo voice is enabled.
   */
  enterprise_check_nogo_voice: boolean;
  /**
   * Whether the user's enterprise check block nogo voice is enabled.
   */
  enterprise_check_block_nogo_voice: boolean;
  /**
   * Whether the user's never live moderate is enabled.
   */
  never_live_moderate: boolean;
  /**
   * The number of similar voice uploads that have been blocked.
   */
  nogo_voice_similar_voice_upload_count: number;
  /**
   * Whether the user's enterprise background moderation is enabled.
   */
  enterprise_background_moderation_enabled: boolean;
  /**
   * Whether captcha is required when creating IVCs.
   */
  is_ivc_captcha_required: boolean;
  /**
   * The safety status of the user.
   */
  safety_status?:
    ("appeal_approved" | "appeal_denied" | "false_positive") | null;
  /**
   * The warning status of the user.
   */
  warning_status?: ("warning" | "warning_cleared") | null;
  /**
   * Whether the user is on the watchlist.
   */
  on_watchlist: boolean;
};
