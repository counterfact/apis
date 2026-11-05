import type { BackgroundSoundSourceType } from "./BackgroundSoundSourceType.js";
import type { BackgroundSoundPresetId } from "./BackgroundSoundPresetId.js";
export type BackgroundSoundConfigWorkflowOverride = {
  /**
   * The type of background sound source.
   */
  source_type?: BackgroundSoundSourceType | null;
  /**
   * Identifier for the sound source.
   */
  source_id?: BackgroundSoundPresetId | null;
  /**
   * Volume level for background sound (0.01 to 1.0).
   */
  volume?: number | null;
  /**
   * Apply a crossfade at the loop boundary to avoid audible pops when the sound loops.
   */
  crossfade_loop?: boolean | null;
};
