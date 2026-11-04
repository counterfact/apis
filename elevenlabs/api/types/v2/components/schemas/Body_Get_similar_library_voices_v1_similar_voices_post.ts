export type Body_Get_similar_library_voices_v1_similar_voices_post = {
  /**
   * @format binary
   */
  audio_file?: Uint8Array | string;
  /**
   * Threshold for voice similarity between provided sample and library voices. Values range from 0 to 2. The smaller the value the more similar voices will be returned.
   */
  similarity_threshold?: number | null;
  /**
   * Number of most similar voices to return. If similarity_threshold is provided, less than this number of voices may be returned. Values range from 1 to 100.
   */
  top_k?: number | null;
};
