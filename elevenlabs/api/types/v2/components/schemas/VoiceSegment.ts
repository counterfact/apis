export type VoiceSegment = {
  /**
   * The voice ID used for this segment
   */
  voice_id: string;
  /**
   * Start time of this voice segment
   */
  start_time_seconds: number;
  /**
   * End time of this voice segment
   */
  end_time_seconds: number;
  /**
   * Start index in the characters array
   */
  character_start_index: number;
  /**
   * End index in the characters array (exclusive)
   */
  character_end_index: number;
  /**
   * Line of the dialogue (script) that this segment is a part of.
   */
  dialogue_input_index: number;
};
