import type { FinetuneVisibility } from "./FinetuneVisibility.js";
import type { FinetuneCreatedBy } from "./FinetuneCreatedBy.js";
import type { MusicFinetuneStatus } from "./MusicFinetuneStatus.js";
import type { MusicFinetuneFailureReason } from "./MusicFinetuneFailureReason.js";
export type MusicFinetuneResponseModel = {
  /**
   * Unique identifier of the finetune.
   */
  id: string;
  /**
   * Name of the finetune.
   */
  name: string;
  /**
   * Tags associated with the finetune.
   */
  tags: Array<string>;
  /**
   * Primary musical genre of the finetune.
   */
  primary_genre?: string | null;
  /**
   * The base music model the finetune was trained on.
   */
  model_id: string;
  /**
   * When the finetune was created (UTC).
   * @format date-time
   */
  created_at: string;
  /**
   * Who can access this finetune: `private` (only you), `workspace` (members of your workspace), `public` (ElevenLabs-curated, available to everyone).
   */
  visibility: FinetuneVisibility;
  /**
   * Who created the finetune: `self`, `workspace`, or `elevenlabs`.
   */
  created_by: FinetuneCreatedBy;
  /**
   * Training lifecycle status: pending, in_progress, completed, failed, and blocked.
   */
  status: MusicFinetuneStatus;
  /**
   * Training progress from 0.0 to 1.0.
   */
  training_progress: number;
  /**
   * Reason the finetune failed or was blocked, if applicable.
   */
  failure_reason?: MusicFinetuneFailureReason | null;
};
