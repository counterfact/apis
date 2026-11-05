import type { DubbingMediaReference } from "./DubbingMediaReference.js";
import type { SpeakerTrack } from "./SpeakerTrack.js";
import type { SpeakerSegment } from "./SpeakerSegment.js";
import type { Render } from "./Render.js";
export type DubbingResource = {
  id: string;
  version: number;
  source_language: string;
  target_languages: Array<string>;
  input: DubbingMediaReference;
  background: DubbingMediaReference | null;
  foreground: DubbingMediaReference | null;
  speaker_tracks: { [key: string]: SpeakerTrack };
  speaker_segments: { [key: string]: SpeakerSegment };
  renders: { [key: string]: Render };
};
