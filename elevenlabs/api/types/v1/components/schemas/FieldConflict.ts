import type { ConflictSection } from "./ConflictSection.js";
export type FieldConflict = {
  /**
   * Identifier of the conflicting field relative to its section: a dot-path within conversation_config/platform_settings (e.g. `tts.voice_id`), a procedure id, or a workflow path: `nodes.<id>`, `edges.<id>`, or the name of a top-level workflow setting.
   */
  path: string;
  /**
   * Which config section this path belongs to.
   */
  section: ConflictSection;
  /**
   * Value at the common ancestor (merge base).
   */
  base_value?: unknown;
  /**
   * Value on the source branch tip.
   */
  source_value?: unknown;
  /**
   * Value on the target branch tip.
   */
  target_value?: unknown;
};
