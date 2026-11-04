import type { MusicPrompt } from "./MusicPrompt.js";
import type { CompositionPlan } from "./CompositionPlan.js";
import type { SongMetadata } from "./SongMetadata.js";
import type { WordTimestamp } from "./WordTimestamp.js";
/**
 * Response model for structured music generation endpoint
 * @example {"composition_plan":{"negative_global_styles":["metal","hip-hop","country"],"positive_global_styles":["pop","rock","jazz"],"sections":[{"duration_ms":10000,"lines":["Verse 1 lyrics"],"negative_local_styles":["metal","hip-hop","country"],"positive_local_styles":["pop","rock","jazz"],"section_name":"Verse 1"}]},"song_metadata":{"description":"My Song Description","genres":["pop","rock","jazz"],"is_explicit":false,"languages":["en","fr"],"title":"My Song"},"words_timestamps":[{"end_ms":1000,"start_ms":0,"word":"Verse"},{"end_ms":2000,"start_ms":1000,"word":"1"},{"end_ms":3000,"start_ms":2000,"word":"lyrics"}]}
 */
export type DetailedMusicResponse = {
  /**
   * The composition plan used to generate the song
   */
  composition_plan: MusicPrompt | CompositionPlan;
  /**
   * The metadata of the generated song
   */
  song_metadata: SongMetadata;
  /**
   * The timestamps of the words in the generated song
   */
  words_timestamps: Array<WordTimestamp> | null;
  /**
   * A low-resolution waveform of the generated song, for showing a preview of it. Holds 4 values per second of audio, from -1000 to 1000. Stereo is mixed down to a single channel. Only present if `with_waveform_visual` was True in the request body.
   */
  waveform_visual?: Array<number> | null;
};
