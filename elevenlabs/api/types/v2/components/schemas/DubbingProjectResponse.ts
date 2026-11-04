import type { DubbingSourceMediaInfo } from "./DubbingSourceMediaInfo.js";
import type { DubbingError } from "./DubbingError.js";
import type { VoicesNotPermittedWarning } from "./VoicesNotPermittedWarning.js";
export type DubbingProjectResponse = {
  /**
   * Unique identifier of the dubbing project.
   */
  project_id: string;
  /**
   * Lifecycle status of the project: `queued` before the source is picked up, `preparing` while it is transcribed, `ready` once transcription is done and language targets can start, or `failed`. A project is never reported as `processing` — that value belongs to language targets.
   */
  status: "queued" | "preparing" | "processing" | "ready" | "failed";
  /**
   * The free-form string you supplied as `reference` when creating the project, or null if you supplied none.
   */
  reference?: string | null;
  /**
   * BCP-47 language tag of the source media (null if auto-detected).
   */
  source_language?: string | null;
  /**
   * Dubbing model every language target of this project is dubbed with. Fixed at create time and not selectable per language.
   */
  model_id?: string | null;
  /**
   * Source media metadata, populated once the source has been fetched and decoded (shortly after create, before the project is `ready`); null until then.
   */
  media?: DubbingSourceMediaInfo | null;
  /**
   * Identifiers of the language targets under this project. Populated when a single project is fetched, and on create when `target_language` creates one. Always empty in list responses — list the project's language targets instead.
   * @default []
   */
  language_ids?: Array<string>;
  /**
   * IDs of the workspace webhooks notified as this project and its languages reach `ready`, `completed`, or `failed`.
   * @default []
   */
  webhook_ids?: Array<string>;
  /**
   * Monotonic counter incremented whenever the source transcript is edited (segment add/edit/delete).
   */
  revision: number;
  /**
   * Why the project failed; null unless `status` is `failed`. Also null for the few projects that failed before failure reporting was introduced.
   */
  error?: DubbingError | null;
  /**
   * Non-fatal conditions raised while preparing the source, empty when there are none. Reflects the latest preparation. Conditions raised while dubbing a particular language are reported on that language instead.
   */
  warnings?: Array<VoicesNotPermittedWarning>;
  /**
   * When the project was created.
   * @format date-time
   */
  created_at: string;
  /**
   * When the project was last updated.
   * @format date-time
   */
  updated_at: string;
};
