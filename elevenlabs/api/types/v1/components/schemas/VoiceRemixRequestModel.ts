export type VoiceRemixRequestModel = {
  /**
   * Description of the changes to make to the voice.
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
   * Random number that controls the voice generation. Same seed with same inputs produces same voice.
   */
  seed?: number | null;
  /**
   * Controls how closely the AI follows the prompt. Lower numbers give the AI more freedom to be creative, while higher numbers force it to stick more to the prompt. High numbers can cause voice to sound artificial or robotic. We recommend to use longer, more detailed prompts at lower Guidance Scale.
   * @default 2
   */
  guidance_scale?: number;
  /**
   * Determines whether the Text to Voice previews should be included in the response. If true, only the generated IDs will be returned which can then be streamed via the /v1/text-to-voice/:generated_voice_id/stream endpoint.
   * @default false
   */
  stream_previews?: boolean;
  /**
   * The remixing session id.
   */
  remixing_session_id?: string | null;
  /**
   * The id of the remixing session iteration where these generations should be attached to. If not provided, a new iteration will be created.
   */
  remixing_session_iteration_id?: string | null;
  /**
   * Controls the balance of prompt versus reference audio when generating voice samples. 0 means almost no prompt influence, 1 means almost no reference audio influence. Only supported when using the eleven_ttv_v3 model.
   */
  prompt_strength?: number | null;
};
