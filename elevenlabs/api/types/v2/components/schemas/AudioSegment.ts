export type AudioSegment = {
  start_ms: number;
  end_ms: number;
  description: string;
  segment_type?: string | null;
  /**
   * @default false
   */
  has_speech?: boolean;
  /**
   * @default false
   */
  has_music?: boolean;
  pacing?: string | null;
};
