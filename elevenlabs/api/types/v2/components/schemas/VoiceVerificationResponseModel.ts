import type { VerificationAttemptResponseModel } from "./VerificationAttemptResponseModel.js";
/**
 * @example {"is_verified":true,"language":"en","requires_verification":false,"verification_attempts":[{"accepted":true,"date_unix":1714204800,"levenshtein_distance":2,"recording":{"mime_type":"audio/mpeg","recording_id":"CwhRBWXzGAHq8TQ4Fs17","size_bytes":1000000,"transcription":"Hello, how are you?","upload_date_unix":1714204800},"similarity":0.95,"text":"Hello, how are you?"}],"verification_attempts_count":0,"verification_failures":[]}
 */
export type VoiceVerificationResponseModel = {
  /**
   * Whether the voice requires verification.
   */
  requires_verification: boolean;
  /**
   * Whether the voice has been verified.
   */
  is_verified: boolean;
  /**
   * List of verification failures.
   */
  verification_failures: Array<string>;
  /**
   * The number of verification attempts.
   */
  verification_attempts_count: number;
  /**
   * The language of the voice.
   */
  language?: string | null;
  /**
   * Number of times a verification was attempted.
   */
  verification_attempts?: Array<VerificationAttemptResponseModel> | null;
};
