import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
/**
 * @example {"access_info":{"creator_email":"john@example.com","creator_name":"John Doe","is_creator":true,"role":"admin"},"created_at_unix_secs":1714000000,"name":"My Speech Engine","speech_engine_id":"seng_3701k3ttaq12ewp8b7qv5rfyszkz","tags":["production","v1"],"updated_at_unix_secs":1714086400,"voice_id":"UCaNsl8F6Xh4GALkVMLS"}
 */
export type SpeechEngineSummaryResponse = {
  /**
   * The speech engine resource ID
   */
  speech_engine_id: string;
  /**
   * Human-readable name for the speech engine
   */
  name: string;
  /**
   * Voice ID assigned to this speech engine
   */
  voice_id: string;
  /**
   * Creation time in Unix seconds
   */
  created_at_unix_secs: number;
  /**
   * Last update time in Unix seconds
   */
  updated_at_unix_secs: number;
  /**
   * Arbitrary tags for categorization and filtering
   */
  tags: Array<string>;
  /**
   * The access information of the speech engine for the user
   */
  access_info: ResourceAccessInfo;
};
