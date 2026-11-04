import type { DubbingMediaReference } from "./DubbingMediaReference.js";
export type SpeakerTrack = {
  id: string;
  media_ref: DubbingMediaReference;
  speaker_name: string;
  voices: { [key: string]: string };
  segments: Array<string>;
};
