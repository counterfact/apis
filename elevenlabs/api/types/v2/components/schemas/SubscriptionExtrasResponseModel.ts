import type { ModerationStatusResponseModel } from "./ModerationStatusResponseModel.js";
import type { SubscriptionUsageResponseModel } from "./SubscriptionUsageResponseModel.js";
/**
 * @example {"can_bypass_voice_captcha":true,"can_request_manual_pro_voice_verification":true,"concurrency":10,"convai_concurrency":10,"enterprise_music_concurrency":5,"force_logging_disabled":false,"moderation":{"enterprise_background_moderation_enabled":false,"enterprise_check_block_nogo_voice":false,"enterprise_check_nogo_voice":false,"is_in_probation":false,"is_ivc_captcha_required":false,"never_live_moderate":false,"nogo_voice_similar_voice_upload_count":0,"on_watchlist":false},"overused_characters_rolled_over_from_previous_period":1000,"unused_characters_rolled_over_from_previous_period":1000,"usage":{"actual_reported_credits":1000,"manually_gifted_credits_quota":1000,"manually_gifted_credits_used":1000,"paid_usage_based_credits_used":1000,"rollover_credits_quota":1000,"rollover_credits_used":1000,"subscription_cycle_credits_quota":1000,"subscription_cycle_credits_used":1000}}
 */
export type SubscriptionExtrasResponseModel = {
  /**
   * The concurrency of the user.
   */
  concurrency: number;
  /**
   * The Convai concurrency of the user.
   */
  convai_concurrency: number;
  /**
   * The Music concurrency of the user on enterprise plan.
   */
  enterprise_music_concurrency?: number | null;
  /**
   * Custom total finetunes limit for the user.
   */
  music_finetunes_total_limit?: number | null;
  /**
   * Custom monthly finetunes limit for the user.
   */
  music_finetunes_monthly_limit?: number | null;
  /**
   * Custom finetunes concurrency limit for the user.
   */
  music_finetunes_concurrency_limit?: number | null;
  /**
   * The Convai characters per minute of the user. This field is deprecated and will always return None.
   */
  convai_chars_per_minute?: number | null;
  /**
   * The Convai ASR characters per minute of the user. This field is deprecated and will always return None.
   */
  convai_asr_chars_per_minute?: number | null;
  /**
   * Whether the user's logging is disabled.
   */
  force_logging_disabled: boolean;
  /**
   * Whether the user can request manual pro voice verification.
   */
  can_request_manual_pro_voice_verification: boolean;
  /**
   * Whether the user can bypass the voice captcha.
   */
  can_bypass_voice_captcha: boolean;
  /**
   * The moderation status of the user.
   */
  moderation: ModerationStatusResponseModel;
  /**
   * The unused characters rolled over from the previous period.
   */
  unused_characters_rolled_over_from_previous_period?: number | null;
  /**
   * The overused characters rolled over from the previous period.
   */
  overused_characters_rolled_over_from_previous_period?: number | null;
  /**
   * Data on how the subscription is being used.
   */
  usage?: SubscriptionUsageResponseModel | null;
};
