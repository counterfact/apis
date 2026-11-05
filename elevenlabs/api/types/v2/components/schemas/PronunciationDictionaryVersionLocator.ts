/**
 * A pronunciation dictionary to apply during speech synthesis.
 */
export type PronunciationDictionaryVersionLocator = {
  /**
   * The ID of a pronunciation dictionary created via `POST /v1/pronunciation-dictionaries/add-from-file` or `POST /v1/pronunciation-dictionaries/add-from-rules`.
   */
  pronunciation_dictionary_id: string;
  /**
   * The version of the dictionary to use. Omit to use the latest version.
   */
  version_id?: string | null;
};
