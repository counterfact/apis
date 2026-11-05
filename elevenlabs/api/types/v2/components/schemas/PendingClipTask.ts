export type PendingClipTask = {
  type:
    | "preprocessing"
    | "speech_import"
    | "dubbing"
    | "video_to_music"
    | "media_generation";
  /**
   * @default 0
   */
  progress?: number;
  started_at_ms?: number;
  updated_at_ms?: number;
  metadata?: { [key: string]: unknown };
};
