import type { Scenario } from "../types/index.js";

/** A small synthetic catalog, not an authoritative model/pricing inventory. */
export const resetModels: Scenario = ($) => {
  $.context.models = new Map(
    [
      {
        model_id: "eleven_multilingual_v2",
        name: "Simulator Multilingual v2",
        maximum_text_length_per_request: 10000,
        character_cost_multiplier: 1,
      },
      {
        model_id: "eleven_flash_v2_5",
        name: "Simulator Flash v2.5",
        maximum_text_length_per_request: 40000,
        character_cost_multiplier: 0.5,
      },
      {
        model_id: "eleven_v3",
        name: "Simulator v3 Dialogue",
        maximum_text_length_per_request: 2000,
        character_cost_multiplier: 1,
      },
      {model_id:"eleven_multilingual_ttv_v2",name:"Simulator Voice Design v2",maximum_text_length_per_request:1000,character_cost_multiplier:1},
      {model_id:"eleven_ttv_v3",name:"Simulator Voice Design v3",maximum_text_length_per_request:1000,character_cost_multiplier:1},
      {model_id:"eleven_text_to_sound_v2",name:"Simulator Sound Effect v2",maximum_text_length_per_request:2000,character_cost_multiplier:1},
      {model_id:"eleven_english_sts_v2",name:"Simulator Speech Conversion v2",maximum_text_length_per_request:2000,character_cost_multiplier:1},
      {model_id:"scribe_v1",name:"Simulator Scribe v1",maximum_text_length_per_request:2000,character_cost_multiplier:0},
      {model_id:"music_v1",name:"Simulator Music v1",maximum_text_length_per_request:2000,character_cost_multiplier:0},
    ].map((model) => [
      model.model_id,
      {
        model_id: model.model_id,
        name: model.name,
        description: "Local model discovery fixture; no audio is synthesized.",
        can_be_finetuned: false,
        can_do_text_to_speech: model.model_id !== "eleven_english_sts_v2" && !model.model_id.includes("ttv") && model.model_id !== "eleven_text_to_sound_v2" && model.model_id !== "music_v1" && model.model_id !== "scribe_v1",
        can_do_voice_conversion: model.model_id === "eleven_english_sts_v2",
        can_use_style: true,
        can_use_speaker_boost: true,
        serves_pro_voices: false,
        token_cost_factor: 1,
        requires_alpha_access: false,
        max_characters_request_free_user: 2500,
        max_characters_request_subscribed_user: 5000,
        maximum_text_length_per_request: model.maximum_text_length_per_request,
        languages: [
          { language_id: "en", name: "English" },
          { language_id: "es", name: "Spanish" },
        ],
        model_rates: {
          character_cost_multiplier: model.character_cost_multiplier,
          cost_discount_multiplier: 1,
        },
        concurrency_group: `simulator_${model.model_id}`,
      },
    ]),
  );
};

/** Exercise clients' empty model-picker state from the REPL. */
export const emptyModels: Scenario = ($) => {
  $.context.models = new Map();
};
