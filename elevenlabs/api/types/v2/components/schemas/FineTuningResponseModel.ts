import type { VerificationAttemptResponseModel } from "./VerificationAttemptResponseModel.js";
import type { ManualVerificationResponseModel } from "./ManualVerificationResponseModel.js";
/**
 * @example {"is_allowed_to_fine_tune":true,"manual_verification_requested":false,"state":{"eleven_multilingual_v2":"fine_tuned"},"verification_attempts_count":2,"verification_failures":[]}
 */
export type FineTuningResponseModel = {
  /**
   * Whether the user is allowed to fine-tune the voice.
   */
  is_allowed_to_fine_tune: boolean;
  /**
   * The state of the fine-tuning process for each model.
   */
  state: {
    [key: string]:
      | "not_started"
      | "queued"
      | "fine_tuning"
      | "fine_tuned"
      | "failed"
      | "delayed";
  };
  /**
   * List of verification failures in the fine-tuning process.
   */
  verification_failures: Array<string>;
  /**
   * The number of verification attempts in the fine-tuning process.
   */
  verification_attempts_count: number;
  /**
   * Whether a manual verification was requested for the fine-tuning process.
   */
  manual_verification_requested: boolean;
  /**
   * The language of the fine-tuning process.
   */
  language?: string | null;
  /**
   * The progress of the fine-tuning process.
   */
  progress?: { [key: string]: number } | null;
  /**
   * The message of the fine-tuning process.
   */
  message?: { [key: string]: string } | null;
  /**
   * The duration of the dataset in seconds.
   */
  dataset_duration_seconds?: number | null;
  /**
   * The number of verification attempts.
   */
  verification_attempts?: Array<VerificationAttemptResponseModel> | null;
  /**
   * List of slice IDs.
   */
  slice_ids?: Array<string> | null;
  /**
   * The manual verification of the fine-tuning process.
   */
  manual_verification?: ManualVerificationResponseModel | null;
  /**
   * The maximum number of verification attempts.
   */
  max_verification_attempts?: number | null;
  /**
   * The next maximum verification attempts reset time in Unix milliseconds.
   */
  next_max_verification_attempts_reset_unix_ms?: number | null;
};
