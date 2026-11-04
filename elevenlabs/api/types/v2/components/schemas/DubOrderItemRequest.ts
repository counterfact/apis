import type { MediaId } from "./MediaId.js";
/**
 * @example {"captions_sdh":false,"destination_languages":["hi","fr-FR","de"],"include_captions":true,"include_source_captions":false,"instructions":"Voices don't need to match the originals, prioritize native-sounding voices","kind":"dub","media_id":"prodmedia_01jgatk6h0fwxrtbjade61yqhx","source_language":"en"}
 */
export type DubOrderItemRequest = {
  /**
   * The type of order item.
   * @default "dub"
   */
  kind?: "dub";
  /**
   * The ID of the uploaded media file to dub.
   */
  media_id: MediaId;
  /**
   * The language code of the source media (e.g. 'en', 'es').
   */
  source_language: string;
  /**
   * List of target language codes to dub the media into.
   */
  destination_languages: Array<string>;
  /**
   * Whether to generate captions for the dubbed outputs.
   */
  include_captions: boolean;
  /**
   * Whether to generate captions for the source language.
   */
  include_source_captions: boolean;
  /**
   * Optional free-text instructions for the dubbing team.
   */
  instructions?: string | null;
  /**
   * Whether captions should use SDH format, which includes descriptions for deaf and hard-of-hearing viewers.
   */
  captions_sdh?: boolean | null;
};
