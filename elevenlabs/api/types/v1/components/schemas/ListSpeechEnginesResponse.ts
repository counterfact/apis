import type { SpeechEngineSummaryResponse } from "./SpeechEngineSummaryResponse.js";
/**
 * @example {"has_more":false,"speech_engines":[{"access_info":{"creator_email":"john@example.com","creator_name":"John Doe","is_creator":true,"role":"admin"},"created_at_unix_secs":1714000000,"name":"My Speech Engine","speech_engine_id":"seng_3701k3ttaq12ewp8b7qv5rfyszkz","tags":["production","v1"],"updated_at_unix_secs":1714086400,"voice_id":"UCaNsl8F6Xh4GALkVMLS"}]}
 */
export type ListSpeechEnginesResponse = {
  /**
   * The speech engines matching the query
   */
  speech_engines: Array<SpeechEngineSummaryResponse>;
  /**
   * Cursor for fetching the next page
   */
  next_cursor?: string | null;
  /**
   * Whether there are more results
   */
  has_more: boolean;
};
