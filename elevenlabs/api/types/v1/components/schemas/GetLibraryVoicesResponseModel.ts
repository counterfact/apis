import type { LibraryVoiceResponseModel } from "./LibraryVoiceResponseModel.js";
/**
 * @example {"has_more":false,"total_count":0,"voices":[{"accent":"american","age":"young","category":"professional","cloned_by_count":11,"date_unix":1714423232,"description":"Perfectly calm, neutral and strong voice. Great for a young female protagonist.","descriptive":"calm","featured":false,"free_users_allowed":true,"gender":"Female","language":"en","live_moderation_enabled":false,"name":"Alita","play_api_usage_character_count_1y":12852,"preview_url":"https://storage.googleapis.com/eleven-public-prod/wqkMCd9huxXHX1dy5mLJn4QEQHj1/voices/sB1b5zUrxQVAFl2PhZFp/55e71aac-5cb7-4b3d-8241-429388160509.mp3","public_owner_id":"63e84100a6bf7874ba37a1bab9a31828a379ec94b891b401653b655c5110880f","rate":1,"usage_character_count_1y":12852,"usage_character_count_7d":12852,"use_case":"characters_animation","verified_languages":[{"accent":"american","language":"en","locale":"en-US","model_id":"eleven_multilingual_v2","preview_url":"https://storage.googleapis.com/eleven-public-prod/wqkMCd9huxXHX1dy5mLJn4QEQHj1/voices/sB1b5zUrxQVAFl2PhZFp/55e71aac-5cb7-4b3d-8241-429388160509.mp3"}],"voice_id":"sB1b5zUrxQVAFl2PhZFp"}]}
 */
export type GetLibraryVoicesResponseModel = {
  /**
   * The list of shared voices
   */
  voices: Array<LibraryVoiceResponseModel>;
  /**
   * Whether there are more shared voices in subsequent pages.
   */
  has_more: boolean;
  /**
   * The total number of shared voices matching the query.
   * @default 0
   */
  total_count?: number;
  last_sort_id?: string | null;
};
