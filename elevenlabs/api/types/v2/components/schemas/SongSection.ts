import type { SectionSource } from "./SectionSource.js";
export type SongSection = {
  /**
   * The name of the section. Must be between 1 and 100 characters.
   */
  section_name: string;
  /**
   * The styles and musical directions that should be present in this section. Use English language for best result.
   */
  positive_local_styles: Array<string>;
  /**
   * The styles and musical directions that should not be present in this section. Use English language for best result.
   */
  negative_local_styles: Array<string>;
  /**
   * The duration of the section in milliseconds. Must be between 3000ms and 120000ms.
   */
  duration_ms: number;
  /**
   * The lyrics of the section. Max 30 lines per section and max 200 characters per line.
   */
  lines: Array<string>;
  /**
   * Optional source to extract the section from. Used for inpainting.
   */
  source_from?: SectionSource | null;
};
