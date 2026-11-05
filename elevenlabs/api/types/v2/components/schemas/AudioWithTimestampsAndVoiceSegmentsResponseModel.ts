import type { CharacterAlignmentResponseModel } from "./CharacterAlignmentResponseModel.js";
import type { VoiceSegment } from "./VoiceSegment.js";
/**
 * @example {"alignment":{"character_end_times_seconds":[0.1,0.2,0.3,0.4,0.5,0.6,0.7],"character_start_times_seconds":[0,0.1,0.2,0.3,0.4,0.5,0.6],"characters":["H","e","l","l","o","H","i"]},"audio_base64":"base64_encoded_audio_string","normalized_alignment":{"character_end_times_seconds":[0.1,0.2,0.3,0.4,0.5,0.6,0.7],"character_start_times_seconds":[0,0.1,0.2,0.3,0.4,0.5,0.6],"characters":["H","e","l","l","o","H","i"]},"voice_segments":[{"character_end_index":5,"character_start_index":0,"dialogue_input_index":0,"end_time_seconds":0.5,"start_time_seconds":0,"voice_id":"21m00Tcm4TlvDq8ikWAM"},{"character_end_index":7,"character_start_index":5,"dialogue_input_index":1,"end_time_seconds":0.7,"start_time_seconds":0.5,"voice_id":"VEDscrYI8uIMttlO2Ztu"}]}
 */
export type AudioWithTimestampsAndVoiceSegmentsResponseModel = {
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
  /**
   * Voice segments for the audio
   */
  voice_segments: Array<VoiceSegment>;
};
