import type { SpeechToTextWordResponseModel } from "./SpeechToTextWordResponseModel.js";
import type { AdditionalFormatResponseModel } from "./AdditionalFormatResponseModel.js";
import type { DetectedEntity } from "./DetectedEntity.js";
import type { EditedTranscript } from "./EditedTranscript.js";
import type { TranscriptEditError } from "./TranscriptEditError.js";
/**
 * Chunk-level detail of the transcription with timing information.
 * @example {"language_code":"en","language_probability":0.98,"text":"Hello world!","words":[{"end":0.5,"logprob":-0.124,"speaker_id":"speaker_1","start":0,"text":"Hello","type":"word"},{"end":0.5,"logprob":0,"speaker_id":"speaker_1","start":0.5,"text":" ","type":"spacing"},{"end":1.2,"logprob":-0.089,"speaker_id":"speaker_1","start":0.5,"text":"world!","type":"word"}]}
 */
export type SpeechToTextChunkResponseModel = {
  /**
   * The detected language code (e.g. 'eng' for English).
   */
  language_code: string;
  /**
   * The confidence score of the language detection (0 to 1).
   */
  language_probability: number;
  /**
   * The raw text of the transcription.
   */
  text: string;
  /**
   * List of words with their timing information.
   */
  words: Array<SpeechToTextWordResponseModel>;
  /**
   * The channel index this transcript belongs to (for multichannel audio).
   */
  channel_index?: number | null;
  /**
   * Requested additional formats of the transcript.
   */
  additional_formats?: Array<AdditionalFormatResponseModel | null> | null;
  /**
   * The transcription ID of the response.
   */
  transcription_id?: string | null;
  /**
   * List of detected entities with their text, type, and character positions in the transcript.
   */
  entities?: Array<DetectedEntity> | null;
  /**
   * The duration of the audio that was transcribed in seconds.
   */
  audio_duration_secs?: number | null;
  /**
   * Result of the optional transcript edit: the edited text, or an error if it could not be produced. Absent when no edit was requested. On success, both `text` and `edited_text` hold the edited transcript; compare them with the top-level `text` to see what changed.
   */
  edited_transcript?:
    | (
        | (EditedTranscript & { kind: "transcript" })
        | (TranscriptEditError & { kind: "error" })
      )
    | null;
};
