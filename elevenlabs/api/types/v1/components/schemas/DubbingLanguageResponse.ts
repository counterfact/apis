import type { VoiceSettings } from "./VoiceSettings.js";
import type { DubbingLanguageOutputs } from "./DubbingLanguageOutputs.js";
import type { DubbingError } from "./DubbingError.js";
import type { VoicesNotPermittedWarning } from "./VoicesNotPermittedWarning.js";
export type DubbingLanguageResponse = {
  /**
   * Unique identifier of the language target.
   */
  language_id: string;
  /**
   * Identifier of the parent dubbing project.
   */
  project_id: string;
  /**
   * BCP-47 language tag this target is dubbed into.
   */
  target_language: string;
  /**
   * Lifecycle status: `queued` (waiting on the project to be ready, or on a worker), `processing` while it is being dubbed, `completed` once its output is available, `stale` when the transcript changed after the output was produced, or `failed`.
   */
  status: "queued" | "processing" | "completed" | "stale" | "failed";
  /**
   * Dubbing model this target is dubbed with, inherited from the project and not selectable per language.
   */
  model_id?: string | null;
  /**
   * Voice settings applied to every speaker in this language, or null if the defaults apply.
   */
  voice_settings?: VoiceSettings | null;
  /**
   * Signed output URLs; null until the target has produced an output (present once `completed`, and kept while `stale` — compare `output_revision` against `revision` to tell whether the output is up to date).
   */
  outputs?: DubbingLanguageOutputs | null;
  /**
   * Monotonic counter incremented whenever this target's transcript changes (a source edit affecting it, or an edit to its translation).
   */
  revision: number;
  /**
   * The `revision` the current dubbed output was generated from; equal to `revision` when up to date, and lower when `stale`. This is null until a generation has completed.
   */
  output_revision?: number | null;
  /**
   * Why this language failed; null unless `status` is `failed`, and also null for the few languages that failed before failure reporting was introduced. A code of `project_failed` means the parent project failed, so read the project for the underlying cause.
   */
  error?: DubbingError | null;
  /**
   * Non-fatal conditions raised while dubbing this language, empty when there are none. Reflects the latest generation. Conditions raised while preparing the source are reported on the project instead.
   */
  warnings?: Array<VoicesNotPermittedWarning>;
  /**
   * When the language target was created.
   * @format date-time
   */
  created_at: string;
  /**
   * When the language target was last updated.
   * @format date-time
   */
  updated_at: string;
};
