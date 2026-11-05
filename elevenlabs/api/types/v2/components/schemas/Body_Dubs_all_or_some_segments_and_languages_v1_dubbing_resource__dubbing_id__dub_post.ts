export type Body_Dubs_all_or_some_segments_and_languages_v1_dubbing_resource__dubbing_id__dub_post =
  {
    /**
     * Dub only this list of segments.
     */
    segments: Array<string>;
    /**
     * Dub only these languages for each segment.
     */
    languages: Array<string> | null;
  };
