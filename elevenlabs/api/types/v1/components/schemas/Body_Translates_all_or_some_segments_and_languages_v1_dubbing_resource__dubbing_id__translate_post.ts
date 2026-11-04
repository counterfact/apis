export type Body_Translates_all_or_some_segments_and_languages_v1_dubbing_resource__dubbing_id__translate_post =
  {
    /**
     * Translate only this list of segments.
     */
    segments: Array<string>;
    /**
     * Translate only these languages for each segment.
     */
    languages: Array<string> | null;
  };
