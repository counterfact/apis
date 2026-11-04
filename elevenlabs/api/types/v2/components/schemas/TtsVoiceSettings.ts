/**
 * Overrides for the voice's saved settings, applied to one generation.
 */
export type TtsVoiceSettings = {
  /**
   * How consistent the voice stays across generations. Lower values give more expressive, varied speech.
   */
  stability?: number | null;
  /**
   * How closely the output adheres to the original voice.
   */
  similarity_boost?: number | null;
  /**
   * How strongly the speaking style is exaggerated.
   */
  style?: number | null;
  /**
   * Whether to boost similarity to the original speaker, at some latency cost.
   */
  use_speaker_boost?: boolean | null;
  /**
   * The speed of the generated speech, where 1.0 is the voice's natural pace.
   */
  speed?: number | null;
};
