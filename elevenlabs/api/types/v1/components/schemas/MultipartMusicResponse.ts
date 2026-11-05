import type { DetailedMusicResponse } from "./DetailedMusicResponse.js";
/**
 * Multipart response structure with JSON metadata and binary audio
 * @example {"audio":"[binary audio data]","metadata":{"composition_plan":{"negative_global_styles":["metal","hip-hop","country"],"positive_global_styles":["pop","rock","jazz"],"sections":[{"duration_ms":10000,"lines":["Verse 1 lyrics"],"negative_local_styles":["metal","hip-hop","country"],"positive_local_styles":["pop","rock","jazz"],"section_name":"Verse 1"}]},"song_metadata":{"description":"My Song Description","genres":["pop","rock","jazz"],"is_explicit":false,"languages":["en","fr"],"title":"My Song"},"words_timestamps":[{"end_ms":1000,"start_ms":0,"word":"Verse"},{"end_ms":2000,"start_ms":1000,"word":"1"},{"end_ms":3000,"start_ms":2000,"word":"lyrics"}]}}
 */
export type MultipartMusicResponse = {
  /**
   * JSON metadata about the generated audio
   */
  metadata: DetailedMusicResponse;
  /**
   * Binary audio data in the requested format
   * @format binary
   */
  audio: Uint8Array | string;
};
