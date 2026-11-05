export type AssetTranscriptionData = {
  language_code: string;
  text: string;
  words: Array<string>;
  word_start_times_ms: Array<number>;
  word_end_times_ms: Array<number>;
  word_speaker_ids: Array<string | null>;
};
