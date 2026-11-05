import type { SongSection } from "./SongSection.js";
/**
 * Composition plan for the `music_v1` model. Using this field with any other model will result in an error.
 * @example {"negative_global_styles":["metal","hip-hop","country"],"positive_global_styles":["pop","rock","jazz"],"sections":[{"duration_ms":10000,"lines":["Verse 1 lyrics"],"negative_local_styles":["metal","hip-hop","country"],"positive_local_styles":["pop","rock","jazz"],"section_name":"Verse 1"}]}
 */
export type MusicPrompt = {
  /**
   * The styles and musical directions that should be present in the entire song. Use English language for best result.
   */
  positive_global_styles: Array<string>;
  /**
   * The styles and musical directions that should not be present in the entire song. Use English language for best result.
   */
  negative_global_styles: Array<string>;
  /**
   * The sections of the song.
   */
  sections: Array<SongSection>;
};
