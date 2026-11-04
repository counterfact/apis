import type { DubbingTranscriptCharacter } from "./DubbingTranscriptCharacter.js";
export type DubbingTranscriptWord = {
  /**
   * @default ""
   */
  text?: string;
  /**
   * @default "unknown"
   */
  word_type?: string;
  /**
   * @default 0
   */
  start_s?: number;
  /**
   * @default 0
   */
  end_s?: number;
  characters?: Array<DubbingTranscriptCharacter>;
};
