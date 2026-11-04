import type { ForcedAlignmentCharacterResponseModel } from "./ForcedAlignmentCharacterResponseModel.js";
import type { ForcedAlignmentWordResponseModel } from "./ForcedAlignmentWordResponseModel.js";
/**
 * Model representing the response from the aligner service.
 */
export type ForcedAlignmentResponseModel = {
  /**
   * List of characters with their timing information.
   */
  characters: Array<ForcedAlignmentCharacterResponseModel>;
  /**
   * List of words with their timing information.
   */
  words: Array<ForcedAlignmentWordResponseModel>;
  /**
   * The average alignment loss/confidence score for the entire transcript, calculated from all characters.
   */
  loss: number;
};
