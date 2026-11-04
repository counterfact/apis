import type { MediaId } from "./MediaId.js";
import type { CueOptionsRequest } from "./CueOptionsRequest.js";
/**
 * @example {"cue_options":{"max_chars_per_line":42,"max_duration_ms":7000,"max_lines_per_cue":2,"min_duration_ms":1000},"destination_languages":["hi","fr-FR","de"],"instructions":"Keep reading speed moderate; preserve humor in idioms.","kind":"subtitles","media_ids":["prodmedia_01jgatk6h0fwxrtbjade61yqhx","prodmedia_01jgb2zd68f8f9tfvbb968wb8z"],"sdh":false,"source_language":"en"}
 */
export type SubtitleOrderItemRequest = {
  /**
   * The type of order item.
   * @default "subtitles"
   */
  kind?: "subtitles";
  /**
   * The IDs of the uploaded media files to generate subtitles for.
   */
  media_ids: Array<MediaId>;
  /**
   * The language code of the source media (e.g. 'en', 'es').
   */
  source_language: string;
  /**
   * List of target language codes. Subtitles will be generated for each media file in each destination language.
   */
  destination_languages: Array<string>;
  /**
   * Formatting options for subtitle cues such as duration, line count, and character limits.
   */
  cue_options?: CueOptionsRequest;
  /**
   * Whether subtitles should use SDH format, which includes descriptions for deaf and hard-of-hearing viewers.
   * @default false
   */
  sdh?: boolean;
  /**
   * Optional free-text instructions for the subtitling team.
   */
  instructions?: string | null;
};
