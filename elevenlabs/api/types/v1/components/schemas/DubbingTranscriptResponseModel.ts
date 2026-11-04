import type { DubbingTranscriptUtterance } from "./DubbingTranscriptUtterance.js";
export type DubbingTranscriptResponseModel = {
  language: string;
  utterances: Array<DubbingTranscriptUtterance>;
};
