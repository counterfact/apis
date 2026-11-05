/**
 * Context for sound effect clips.
 */
export type SfxSourceContext = {
  /**
   * @default "sfx"
   */
  source_type?: "sfx";
  sound_generation_history_item_id?: string | null;
  text?: string | null;
  generation_config?: { [key: string]: unknown } | null;
};
