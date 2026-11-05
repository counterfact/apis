import type { MusicGenerationMode } from "./MusicGenerationMode.js";
import type { MusicPrompt } from "./MusicPrompt.js";
import type { CompositionPlan } from "./CompositionPlan.js";
import type { MusicModelID } from "./MusicModelID.js";
export type Body_Compose_Music_with_a_detailed_response_v1_music_detailed_post =
  {
    /**
     * A simple text prompt to generate a song from. Cannot be used in conjunction with `composition_plan`.
     */
    prompt?: string | null;
    /**
     * Optional generation mode hint for prompt-based music generation. Can only be used with `prompt`.
     */
    generation_mode?: MusicGenerationMode | null;
    /**
     * A music prompt. Deprecated. Use `composition_plan` instead.
     * @deprecated
     */
    music_prompt?: MusicPrompt | null;
    /**
     * The lyrics text to use for the generation.
     */
    lyrics_text?: string | null;
    /**
     * A detailed composition plan to guide music generation. Cannot be used in conjunction with `prompt`.
     */
    composition_plan?: (MusicPrompt | CompositionPlan) | null;
    /**
     * The length of the song to generate in milliseconds. Used only in conjunction with `prompt`. Must be between 3000ms and 600000ms. Optional - if not provided, the model will choose a length based on the prompt.
     */
    music_length_ms?: number | null;
    /**
     * The model to use for the generation.
     * @default "music_v1"
     */
    model_id?: MusicModelID;
    /**
     * Random seed to initialize the music generation process. Providing the same seed with the same parameters can help achieve more consistent results, but exact reproducibility is not guaranteed and outputs may change across system updates. Cannot be used in conjunction with prompt.
     */
    seed?: number | null;
    /**
     * If true, guarantees that the generated song will be instrumental. If false, the song may or may not be instrumental depending on the `prompt`. Can only be used with `prompt`.
     * @default false
     */
    force_instrumental?: boolean;
    /**
     * The ID of the finetune to use for the generation
     */
    finetune_id?: string | null;
    /**
     * How strongly the finetune influences the generation. Defaults to 1.0 (full strength). Lower values soften the influence of the finetune, leaving more room for prompt-level steering. Only meaningful when `finetune_id` is also provided.
     * @default 1
     */
    finetune_strength?: number;
    /**
     * If true, proper names in the prompt will be phonetically spelled in the lyrics for better pronunciation by the music model. The original names will be restored in word timestamps.
     * @default false
     */
    use_phonetic_names?: boolean;
    /**
     * Controls how strictly section durations in the `composition_plan` are enforced. Only used with `composition_plan` and only applies to `music_v1`; for `music_v2` and `music_v2_5` section durations are always enforced and this is ignored. When false for `music_v1`, the model may adjust individual section durations for better quality and latency, while preserving the total song duration from the plan.
     * @default true
     */
    respect_sections_durations?: boolean;
    /**
     * Whether to store the generated song for inpainting.
     * @default false
     */
    store_for_inpainting?: boolean;
    /**
     * Whether to return the timestamps of the words in the generated song.
     * @default false
     */
    with_timestamps?: boolean;
    /**
     * Whether to return the visual waveform of the generated song.
     * @default false
     */
    with_waveform_visual?: boolean;
    /**
     * Whether to sign the generated song with C2PA. Applicable only for mp3 files.
     * @default false
     */
    sign_with_c2pa?: boolean;
    /**
     * @default "music"
     */
    model_style_prefix?: "music" | "sfx";
  };
