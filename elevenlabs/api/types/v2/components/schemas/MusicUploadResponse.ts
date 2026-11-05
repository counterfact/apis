import type { MusicPrompt } from "./MusicPrompt.js";
import type { CompositionPlan } from "./CompositionPlan.js";
import type { WordTimestamp } from "./WordTimestamp.js";
/**
 * Response model for music upload endpoint.
 * @example {"song_id":"jR4Xz8kL2mNpQ9wVtY1b"}
 */
export type MusicUploadResponse = {
  /**
   * Unique identifier for the uploaded song
   */
  song_id: string;
  /**
   * The composition plan extracted from the uploaded song. Only present if `extract_composition_plan` was provided in the request body.
   */
  composition_plan?: MusicPrompt | CompositionPlan | null;
  /**
   * Word-level timestamps transcribed from the uploaded song. Only present if `with_timestamps` was True in the request body
   */
  words_timestamps?: Array<WordTimestamp> | null;
  /**
   * A low-resolution waveform of the uploaded song, for showing a preview of it. Holds 4 values per second of audio, from -1000 to 1000. Stereo is mixed down to a single channel. Only present if `with_waveform_visual` was True in the request body.
   */
  waveform_visual?: Array<number> | null;
};
