import type { VerifiedVoiceLanguageResponseModel } from "./VerifiedVoiceLanguageResponseModel.js";
/**
 * @example {"accent":"american","age":"young","category":"professional","cloned_by_count":11,"date_unix":1714423232,"description":"Perfectly calm, neutral and strong voice. Great for a young female protagonist.","descriptive":"calm","featured":false,"free_users_allowed":true,"gender":"Female","language":"en","live_moderation_enabled":false,"name":"Alita","play_api_usage_character_count_1y":12852,"preview_url":"https://storage.googleapis.com/eleven-public-prod/wqkMCd9huxXHX1dy5mLJn4QEQHj1/voices/sB1b5zUrxQVAFl2PhZFp/55e71aac-5cb7-4b3d-8241-429388160509.mp3","public_owner_id":"63e84100a6bf7874ba37a1bab9a31828a379ec94b891b401653b655c5110880f","rate":1,"usage_character_count_1y":12852,"usage_character_count_7d":12852,"use_case":"characters_animation","verified_languages":[{"accent":"american","language":"en","locale":"en-US","model_id":"eleven_multilingual_v2","preview_url":"https://storage.googleapis.com/eleven-public-prod/wqkMCd9huxXHX1dy5mLJn4QEQHj1/voices/sB1b5zUrxQVAFl2PhZFp/55e71aac-5cb7-4b3d-8241-429388160509.mp3"}],"voice_id":"sB1b5zUrxQVAFl2PhZFp"}
 */
export type LibraryVoiceResponseModel = {
  /**
   * The public owner id of the voice.
   */
  public_owner_id: string;
  /**
   * The id of the voice.
   */
  voice_id: string;
  /**
   * The date the voice was added to the library in Unix time.
   */
  date_unix: number;
  /**
   * The name of the voice.
   */
  name: string;
  /**
   * The accent of the voice.
   */
  accent: string;
  /**
   * The gender of the voice.
   */
  gender: string;
  /**
   * The age of the voice.
   */
  age: string;
  /**
   * The descriptive of the voice.
   */
  descriptive: string;
  /**
   * The use case of the voice.
   */
  use_case: string;
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
   * The language of the voice.
   */
  language?: string | null;
  /**
   * The locale of the voice.
   */
  locale?: string | null;
  /**
   * The description of the voice.
   */
  description?: string | null;
  /**
   * The preview URL of the voice.
   */
  preview_url?: string | null;
  /**
   * The usage character count of the voice in the last year.
   */
  usage_character_count_1y: number;
  /**
   * The usage character count of the voice in the last 7 days.
   */
  usage_character_count_7d: number;
  /**
   * The play API usage character count of the voice in the last year.
   */
  play_api_usage_character_count_1y: number;
  /**
   * The number of times the voice has been cloned.
   */
  cloned_by_count: number;
  /**
   * The rate multiplier of the voice.
   */
  rate?: number | null;
  /**
   * The rate of the voice in USD per 1000 credits. null if default
   */
  fiat_rate?: number | null;
  /**
   * Whether free users are allowed to use the voice.
   */
  free_users_allowed: boolean;
  /**
   * Whether live moderation is enabled for the voice.
   */
  live_moderation_enabled: boolean;
  /**
   * Whether the voice is featured.
   */
  featured: boolean;
  /**
   * The verified languages of the voice.
   */
  verified_languages?: Array<VerifiedVoiceLanguageResponseModel> | null;
  /**
   * The notice period of the voice.
   */
  notice_period?: number | null;
  /**
   * The Instagram username of the voice.
   */
  instagram_username?: string | null;
  /**
   * The Twitter username of the voice.
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
   * The image URL of the voice.
   */
  image_url?: string | null;
  /**
   * Whether the voice was added by the user.
   */
  is_added_by_user?: boolean | null;
  /**
   * Whether the voice is bookmarked by the current user. Only relevant when is_added_by_user is True.
   */
  is_bookmarked?: boolean | null;
};
