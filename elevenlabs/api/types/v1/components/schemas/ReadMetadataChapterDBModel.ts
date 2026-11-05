export type ReadMetadataChapterDBModel = {
  chapter_name: string;
  word_count: number;
  char_count: number;
  starting_char_offset: number;
  /**
   * @default false
   */
  has_parsed_html?: boolean;
  /**
   * @default false
   */
  has_summary?: boolean;
  duration_seconds?: number | null;
  file_number?: string | null;
  /**
   * @default false
   */
  is_fallback_name?: boolean;
  chapter_id?: string | null;
};
