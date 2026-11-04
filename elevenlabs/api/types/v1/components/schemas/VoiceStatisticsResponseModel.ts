export type VoiceStatisticsResponseModel = {
  /**
   * The project voice reference ID.
   */
  project_voice_ref_id: string;
  /**
   * The number of unconverted characters for this voice.
   */
  characters_unconverted: number;
  /**
   * The number of converted characters for this voice.
   */
  characters_converted: number;
  /**
   * The number of credits needed to convert the remaining audio for this voice.
   */
  credits_needed_to_convert?: number | null;
  /**
   * The voice ID.
   * @deprecated
   */
  voice_id: string;
};
