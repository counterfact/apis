import type { CharacterAlignmentResponseModel } from "./CharacterAlignmentResponseModel.js";
import type { VoiceSegment } from "./VoiceSegment.js";
/**
 * @example {"alignment":{"character_end_times_seconds":[0.1,0.2],"character_start_times_seconds":[0,0.1],"characters":["H","e"]},"audio_base64":"base64_encoded_audio_chunk","normalized_alignment":{"character_end_times_seconds":[0.1,0.2],"character_start_times_seconds":[0,0.1],"characters":["H","e"]},"voice_segments":[{"character_end_index":2,"character_start_index":0,"dialogue_input_index":0,"end_time_seconds":0.2,"start_time_seconds":0,"voice_id":"VEDscrYI8uIMttlO2Ztu"}]}
 */
export type StreamingAudioChunkWithTimestampsAndVoiceSegmentsResponseModel = {
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
