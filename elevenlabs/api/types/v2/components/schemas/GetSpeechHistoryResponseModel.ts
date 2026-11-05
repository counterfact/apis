import type { SpeechHistoryItemResponseModel } from "./SpeechHistoryItemResponseModel.js";
/**
 * @example {"has_more":true,"history":[{"character_count_change_from":17189,"character_count_change_to":17231,"content_type":"audio/mpeg","date_unix":1714650306,"history_item_id":"ja9xsmfGhxYcymxGcOGB","model_id":"eleven_multilingual_v2","request_id":"BF0BZg4IwLGBlaVjv9Im","settings":{"similarity_boost":0.5,"stability":0.71,"style":0,"use_speaker_boost":true},"source":"TTS","state":"created","text":"Hello, world!","voice_category":"premade","voice_id":"21m00Tcm4TlvDq8ikWAM","voice_name":"Rachel"}],"last_history_item_id":"ja9xsmfGhxYcymxGcOGB","scanned_until":1714650306}
 */
export type GetSpeechHistoryResponseModel = {
  /**
   * A list of speech history items.
   */
  history: Array<SpeechHistoryItemResponseModel>;
  /**
   * The ID of the last history item.
   */
  last_history_item_id?: string | null;
  /**
   * Whether there are more history items to fetch.
   */
  has_more: boolean;
  /**
   * The timestamp of the last history item.
   */
  scanned_until?: number | null;
};
