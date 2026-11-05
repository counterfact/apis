import type { SpeechToTextCharacterResponseModel } from "./SpeechToTextCharacterResponseModel.js";
/**
 * Word-level detail of the transcription with timing information.
 * @example {"characters":[{"end":0.1,"start":0,"text":"H"},{"end":0.2,"start":0.1,"text":"e"},{"end":0.3,"start":0.2,"text":"l"},{"end":0.4,"start":0.3,"text":"l"},{"end":0.5,"start":0.4,"text":"o"}],"end":0.5,"logprob":-0.124,"speaker_id":"speaker_1","start":0,"text":"Hello","type":"word"}
 */
export type SpeechToTextWordResponseModel = {
  /**
   * The word or sound that was transcribed.
   */
  text: string;
  /**
   * The start time of the word or sound in seconds.
   */
  start?: number | null;
  /**
   * The end time of the word or sound in seconds.
   */
  end?: number | null;
  /**
   * The type of the word or sound. 'audio_event' is used for non-word sounds like laughter or footsteps.
   */
  type: "word" | "spacing" | "audio_event";
  /**
   * Unique identifier for the speaker of this word.
   */
  speaker_id?: string | null;
  /**
   * The log of the probability with which this word was predicted. Logprobs are in range [-infinity, 0], higher logprobs indicate a higher confidence the model has in its predictions.
   */
  logprob: number;
  /**
   * The characters that make up the word and their timing information.
   */
  characters?: Array<SpeechToTextCharacterResponseModel> | null;
  /**
   * The channel this word was spoken on (for multichannel audio). Null for single-channel transcriptions.
   */
  channel_index?: number | null;
};
