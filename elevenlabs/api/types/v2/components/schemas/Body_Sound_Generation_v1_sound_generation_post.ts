import type { SFXModelId } from "./SFXModelId.js";
export type Body_Sound_Generation_v1_sound_generation_post = {
  /**
   * The text that will get converted into a sound effect.
   */
  text: string;
  /**
   * Whether to create a sound effect that loops smoothly.
   * @default false
   */
  loop?: boolean;
  /**
   * The duration of the sound which will be generated in seconds. Must be at least 0.5 and at most 30. If set to None we will guess the optimal duration using the prompt. Defaults to None.
   */
  duration_seconds?: number | null;
  /**
   * A higher prompt influence makes your generation follow the prompt more closely while also making generations less variable. Must be a value between 0 and 1. Defaults to 0.3.
   * @default 0.3
   */
  prompt_influence?: number | null;
  /**
   * The model ID to use for the sound generation.
   * @default "eleven_text_to_sound_v2"
   */
  model_id?: SFXModelId;
};
