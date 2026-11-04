import type { RecordingResponseModel } from "./RecordingResponseModel.js";
/**
 * @example {"accepted":true,"date_unix":1714204800,"levenshtein_distance":2,"recording":{"mime_type":"audio/mpeg","recording_id":"CwhRBWXzGAHq8TQ4Fs17","size_bytes":1000000,"transcription":"Hello, how are you?","upload_date_unix":1714204800},"similarity":0.95,"text":"Hello, how are you?"}
 */
export type VerificationAttemptResponseModel = {
  /**
   * The text of the verification attempt.
   */
  text: string;
  /**
   * The date of the verification attempt in Unix time.
   */
  date_unix: number;
  /**
   * Whether the verification attempt was accepted.
   */
  accepted: boolean;
  /**
   * The similarity of the verification attempt.
   */
  similarity: number;
  /**
   * The Levenshtein distance of the verification attempt.
   */
  levenshtein_distance: number;
  /**
   * The recording of the verification attempt.
   */
  recording?: RecordingResponseModel | null;
};
