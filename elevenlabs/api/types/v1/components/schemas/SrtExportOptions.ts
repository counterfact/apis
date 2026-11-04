export type SrtExportOptions = {
  /**
   * @default 42
   */
  max_characters_per_line?: number | null;
  /**
   * @default false
   */
  include_speakers?: boolean;
  /**
   * @default true
   */
  include_timestamps?: boolean;
  format: "srt";
  /**
   * @default 0.8
   */
  segment_on_silence_longer_than_s?: number | null;
  /**
   * @default 4
   */
  max_segment_duration_s?: number | null;
  /**
   * @default 84
   */
  max_segment_chars?: number | null;
};
