import type { CharacterAlignmentResponseModel } from "./CharacterAlignmentResponseModel.js";
/**
 * @example {"alignment":{"character_end_times_seconds":[0.1,0.2,0.3,0.4,0.5],"character_start_times_seconds":[0,0.1,0.2,0.3,0.4],"characters":["H","e","l","l","o"]},"audio_base64":"base64_encoded_audio_string","normalized_alignment":{"character_end_times_seconds":[0.1,0.2,0.3,0.4,0.5],"character_start_times_seconds":[0,0.1,0.2,0.3,0.4],"characters":["H","e","l","l","o"]}}
 */
export type AudioWithTimestampsResponseModel = {
  /**
   * Base64 encoded audio data
   */
  audio_base64: string;
  /**
   * Timestamp information for each character in the original text
   */
  alignment?: CharacterAlignmentResponseModel | null;
  /**
   * Timestamp information for each character in the normalized text
   */
  normalized_alignment?: CharacterAlignmentResponseModel | null;
};
