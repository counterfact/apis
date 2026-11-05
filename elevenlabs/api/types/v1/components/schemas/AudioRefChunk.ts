import type { TimeRange } from "./TimeRange.js";
export type AudioRefChunk = {
  /**
   * The ID of the song to source the chunk from. You can find the song ID in the response headers when you generate a song.
   */
  song_id: string;
  /**
   * The time range to extract from the song.
   */
  range: TimeRange;
};
