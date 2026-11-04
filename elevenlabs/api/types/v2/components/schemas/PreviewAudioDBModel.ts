export type PreviewAudioDBModel = {
  voice_id?: string | null;
  text?: string | null;
  audio_url: string;
  hls_manifest_url?: string | null;
  dash_manifest_url?: string | null;
  /**
   * @default false
   */
  is_auto_generated?: boolean | null;
  generated_at_unix?: number | null;
};
