import type { Scenario } from "../types/index.js";
import { defaultSettings } from "../routes/_.context.js";

export const reset: Scenario = ($) => {
  $.context.voices = new Map(
    ["sim-narrator", "sim-assistant"].map((voice_id, index) => [
      voice_id,
      {
        voice_id,
        name: index === 0 ? "Simulator Narrator" : "Simulator Assistant",
        category: "generated",
        labels: {
          language: "en",
          use_case: index === 0 ? "narration" : "conversational",
        },
        description: "Local simulator fixture; no audio is synthesized.",
        available_for_tiers: [],
        high_quality_base_model_ids: ["eleven_multilingual_v2"],
        settings: defaultSettings(),
        is_owner: true,
        is_legacy: false,
        created_at_unix: 1_735_689_600 + index,
      },
    ]),
  );
};
export const startup: Scenario = reset;
