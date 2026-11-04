import type { VoiceSharingModerationCheckResponseModel } from "./VoiceSharingModerationCheckResponseModel.js";
import type { ReaderResourceResponseModel } from "./ReaderResourceResponseModel.js";
/**
 * @example {"category":"professional","cloned_by_count":50,"date_unix":1714204800,"description":"A female voice with a soft and friendly tone.","disable_at_unix":1714204800,"enabled_in_library":true,"featured":true,"financial_rewards_enabled":true,"free_users_allowed":true,"history_item_sample_id":"DCwhRBWXzGAHq8TQ4Fs18","labels":{"accent":"American","gender":"female"},"liked_by_count":100,"live_moderation_enabled":true,"moderation_check":{"captcha_checks":[0.95,0.98],"captcha_ids":["captcha1","captcha2"],"date_checked_unix":1714204800,"description_check":true,"description_value":"A female voice with a soft and friendly tone.","name_check":true,"name_value":"Rachel","sample_checks":[0.95,0.98],"sample_ids":["sample1","sample2"]},"name":"Rachel","notice_period":30,"original_voice_id":"DCwhRBWXzGAHq8TQ4Fs18","public_owner_id":"DCwhRBWXzGAHq8TQ4Fs18","rate":0.05,"reader_app_enabled":true,"reader_restricted_on":[{"resource_id":"FCwhRBWXzGAHq8TQ4Fs18","resource_type":"read"}],"review_status":"allowed","status":"enabled","voice_mixing_allowed":false,"whitelisted_emails":["example@example.com"]}
 */
export type VoiceSharingResponseModel = {
  /**
   * The status of the voice sharing.
   */
  status: "enabled" | "disabled" | "copied" | "copied_disabled";
  /**
   * The sample ID of the history item.
   */
  history_item_sample_id?: string | null;
  /**
   * The date of the voice sharing in Unix time.
   */
  date_unix: number;
  /**
   * A list of whitelisted emails.
   */
  whitelisted_emails: Array<string>;
  /**
   * The ID of the public owner.
   */
  public_owner_id: string;
  /**
   * The ID of the original voice.
   */
  original_voice_id: string;
  /**
   * Whether financial rewards are enabled.
   */
  financial_rewards_enabled: boolean;
  /**
   * Whether free users are allowed.
   */
  free_users_allowed: boolean;
  /**
   * Whether live moderation is enabled.
   */
  live_moderation_enabled: boolean;
  /**
   * The rate of the voice sharing.
   */
  rate?: number | null;
  /**
   * The rate of the voice sharing in USD per 1000 credits.
   */
  fiat_rate?: number | null;
  /**
   * The notice period of the voice sharing.
   */
  notice_period: number;
  /**
   * The date of the voice sharing in Unix time.
   */
  disable_at_unix?: number | null;
  /**
   * Whether voice mixing is allowed.
   */
  voice_mixing_allowed: boolean;
  /**
   * Whether the voice is featured.
   */
  featured: boolean;
  /**
   * The category of the voice.
   */
  category:
    | "generated"
    | "cloned"
    | "premade"
    | "professional"
    | "famous"
    | "high_quality";
  /**
   * Whether the reader app is enabled.
   */
  reader_app_enabled?: boolean | null;
  /**
   * The image URL of the voice.
   */
  image_url?: string | null;
  /**
   * The ban reason of the voice.
   */
  ban_reason?: string | null;
  /**
   * The number of likes on the voice.
   */
  liked_by_count: number;
  /**
   * The number of clones on the voice.
   */
  cloned_by_count: number;
  /**
   * The name of the voice.
   */
  name: string;
  /**
   * The description of the voice.
   */
  description?: string | null;
  /**
   * The labels of the voice.
   */
  labels: { [key: string]: string };
  /**
   * The review status of the voice.
   */
  review_status:
    | "not_requested"
    | "pending"
    | "declined"
    | "declined_resubmittable"
    | "allowed"
    | "allowed_with_changes";
  /**
   * The review message of the voice.
   */
  review_message?: string | null;
  /**
   * Whether the voice is enabled in the library.
   */
  enabled_in_library: boolean;
  /**
   * The Instagram username of the voice.
   */
  instagram_username?: string | null;
  /**
   * The Twitter/X username of the voice.
   */
  twitter_username?: string | null;
  /**
   * The YouTube username of the voice.
   */
  youtube_username?: string | null;
  /**
   * The TikTok username of the voice.
   */
  tiktok_username?: string | null;
  /**
   * The moderation check of the voice.
   */
  moderation_check?: VoiceSharingModerationCheckResponseModel | null;
  /**
   * The reader restricted on of the voice.
   */
  reader_restricted_on?: Array<ReaderResourceResponseModel> | null;
};
