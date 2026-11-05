import type { GenerationChunk_Input } from "./GenerationChunk-Input.js";
import type { AudioRefChunk } from "./AudioRefChunk.js";
/**
 * Composition plan for the `music_v2` and `music_v2_5` models. Using this field with any other model will result in an error.
 * @example {"chunks":[{"duration_ms":15000,"positive_styles":["pop","warm synths","steady groove","layered harmonies"],"text":"[Verse]\nCity lights are fading\nWe keep moving through the night"},{"duration_ms":15000,"positive_styles":["uplifting","bigger drums","wide vocals"],"text":"[Chorus]\nHold on to the feeling\n{very loud}Let it rise and come alive"},{"duration_ms":5000,"positive_styles":["gentle ending","soft pads"],"text":"[Instrumental Outro]"}]}
 */
export type CompositionPlan = {
  /**
   * The chunks that make up the generation.
   */
  chunks: Array<GenerationChunk_Input | AudioRefChunk>;
};
