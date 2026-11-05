/**
 * Overrides for the voice's saved settings, applied to one generation.
 */
export type ElevenFlashV2_5VoiceSettings = {
  /**
   * How consistent the voice stays across generations. Lower values give more expressive, varied speech.
   */
  stability?: number | null;
  /**
   * How closely the output adheres to the original voice.
   */
  similarity_boost?: number | null;
  /**
   * The speed of the generated speech, where 1.0 is the voice's natural pace.
   */
  speed?: number | null;
};
