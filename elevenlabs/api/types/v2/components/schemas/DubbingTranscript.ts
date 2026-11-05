import type { DubbingTranscriptUtterance } from "./DubbingTranscriptUtterance.js";
export type DubbingTranscript = {
  language: string;
  utterances: Array<DubbingTranscriptUtterance>;
};
