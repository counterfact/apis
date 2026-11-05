export type SongSourceContext = {
  /**
   * @default "song"
   */
  source_type?: "song";
  song_id: string;
  chat_id?: string | null;
  title?: string | null;
  description?: string | null;
  genres?: Array<string>;
  languages?: Array<string>;
  is_explicit?: boolean | null;
  bpm?: number | null;
  generation_settings?: { [key: string]: unknown } | null;
};
