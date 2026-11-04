export type PdfExportOptions = {
  /**
   * @default true
   */
  include_speakers?: boolean;
  /**
   * @default true
   */
  include_timestamps?: boolean;
  format: "pdf";
  segment_on_silence_longer_than_s?: number | null;
  max_segment_duration_s?: number | null;
  max_segment_chars?: number | null;
};
