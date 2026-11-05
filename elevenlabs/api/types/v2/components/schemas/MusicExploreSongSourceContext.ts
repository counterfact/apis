export type MusicExploreSongSourceContext = {
  /**
   * @default "music_explore_song"
   */
  source_type?: "music_explore_song";
  music_explore_song_id: string;
  title?: string | null;
  description?: string | null;
  bpm?: number | null;
  vocals?: string | null;
  lyrics?: string | null;
};
