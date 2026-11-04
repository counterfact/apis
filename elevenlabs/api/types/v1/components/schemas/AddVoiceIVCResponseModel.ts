import type { LibraryVoiceMatchResponseModel } from "./LibraryVoiceMatchResponseModel.js";
/**
 * @example {"requires_verification":false,"voice_id":"c38kUX8pkfYO2kHyqfFy"}
 */
export type AddVoiceIVCResponseModel = {
  /**
   * The ID of the newly created voice.
   */
  voice_id: string;
  /**
   * Whether the voice requires verification
   */
  requires_verification: boolean;
  /**
   * Set when the samples match a protected voice that is available in the Voice Library. The new voice requires verification before use; adding the library voice is the alternative.
   */
  library_voice_match?: LibraryVoiceMatchResponseModel | null;
};
