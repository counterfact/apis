import type { MusicPrompt } from "./MusicPrompt.js";
import type { CompositionPlan } from "./CompositionPlan.js";
import type { MusicModelID } from "./MusicModelID.js";
export type Body_Generate_composition_plan_v1_music_plan_post = {
  /**
   * A simple text prompt to compose a plan from.
   */
  prompt: string;
  /**
   * The length of the composition plan to generate in milliseconds. Must be between 3000ms and 600000ms. Optional - if not provided, the model will choose a length based on the prompt.
   */
  music_length_ms?: number | null;
  /**
   * An optional composition plan to use as a source for the new composition plan.
   */
  source_composition_plan?: MusicPrompt | CompositionPlan | null;
  /**
   * The model to use for the generation.
   * @default "music_v1"
   */
  model_id?: MusicModelID;
};
