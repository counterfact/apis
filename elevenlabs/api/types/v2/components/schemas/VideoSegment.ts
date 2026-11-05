export type VideoSegment = {
  start_ms: number;
  end_ms: number;
  description: string;
  subjects?: Array<string>;
  shot_type?: string | null;
  camera_movement?: string | null;
  transition_in?: string | null;
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
