import type { MediaId } from "./MediaId.js";
/**
 * @example {"instructions":"Use speaker labels where possible.","kind":"transcription","media_ids":["prodmedia_01jgatk6h0fwxrtbjade61yqhx","prodmedia_01jgb2zd68f8f9tfvbb968wb8z"],"source_language":"en","verbatim":false}
 */
export type TranscriptionOrderItemRequest = {
  /**
   * The type of order item.
   * @default "transcription"
   */
  kind?: "transcription";
  /**
   * The IDs of the uploaded media files to transcribe.
   */
  media_ids: Array<MediaId>;
  /**
   * The language code of the source media (e.g. 'en', 'es').
   */
  source_language: string;
  /**
   * Whether to transcribe every word exactly, including filler words.
   * @default false
   */
  verbatim?: boolean;
  /**
   * Optional free-text instructions for the transcription team.
   */
  instructions?: string | null;
};
