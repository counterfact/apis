export type VoicePreviewsRequestModel = {
  /**
   * Description to use for the created voice.
   */
  voice_description: string;
  /**
   * Text to generate, text length has to be between 100 and 1000.
   */
  text?: string | null;
  /**
   * Whether to automatically generate a text suitable for the voice description.
   * @default false
   */
  auto_generate_text?: boolean;
  /**
   * Controls the volume level of the generated voice. -1 is quietest, 1 is loudest, 0 corresponds to roughly -24 LUFS.
   * @default 0.5
   */
  loudness?: number;
  /**
   * Higher quality results in better voice output but less variety.
   * @default 0.9
   */
  quality?: number;
  /**
   * Random number that controls the voice generation. Same seed with same inputs produces same voice.
   */
  seed?: number | null;
  /**
   * Controls how closely the AI follows the prompt. Lower numbers give the AI more freedom to be creative, while higher numbers force it to stick more to the prompt. High numbers can cause voice to sound artificial or robotic. We recommend to use longer, more detailed prompts at lower Guidance Scale.
   * @default 5
   */
  guidance_scale?: number;
  /**
   * Whether to enhance the voice description using AI to add more detail and improve voice generation quality. When enabled, the system will automatically expand simple prompts into more detailed voice descriptions. Defaults to False
   * @default false
   */
  should_enhance?: boolean;
};
