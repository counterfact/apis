import type { TimeRange } from "./TimeRange.js";
export type SectionSource = {
  /**
   * The ID of the song to source the section from. You can find the song ID in the response headers when you generate a song.
   */
  song_id: string;
  /**
   * The range to extract from the source song.
   */
  range: TimeRange;
  /**
   * The ranges to exclude from the 'range'.
   */
  negative_ranges?: Array<TimeRange>;
};
