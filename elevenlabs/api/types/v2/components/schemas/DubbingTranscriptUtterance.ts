import type { DubbingTranscriptWord } from "./DubbingTranscriptWord.js";
export type DubbingTranscriptUtterance = {
  /**
   * @default ""
   */
  text?: string;
  /**
   * @default "unknown"
   */
  speaker_id?: string;
  /**
   * @default 0
   */
  start_s?: number;
  /**
   * @default 0
   */
  end_s?: number;
  words?: Array<DubbingTranscriptWord>;
};
