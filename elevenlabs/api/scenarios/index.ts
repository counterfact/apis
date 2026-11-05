import type { Scenario } from "../types/index.js";
import { defaultSettings } from "../routes/_.context.js";
import { resetCollections } from "./collections.js";
export { emptyCollections } from "./collections.js";
import { resetDictionaries } from "./dictionaries.js";
export { emptyDictionaries } from "./dictionaries.js";
import { resetHistory } from "./history.js";
export { emptyHistory } from "./history.js";
import { resetModels } from "./models.js";
import { resetAccount } from "./account.js";
import { resetAuthConnections } from "./auth-connections.js";
export { emptyAuthConnections } from "./auth-connections.js";
import { resetWebhooks } from "./webhooks.js";
export { emptyWebhooks } from "./webhooks.js";
import { resetEnvironmentVariables } from "./environment-variables.js";
export { emptyEnvironmentVariables } from "./environment-variables.js";
import { resetTags } from "./tags.js";
export { emptyTags } from "./tags.js";
import { resetUsage } from "./usage.js";
export { emptyUsage } from "./usage.js";
export { emptyModels } from "./models.js";
export { quotaExhausted } from "./account.js";

export const reset: Scenario = ($) => {
  resetEnvironmentVariables($);
  resetTags($);
  resetAuthConnections($);
  resetWebhooks($);
  resetUsage($);
  resetDictionaries($);
  resetModels($);
  resetHistory($);
  resetAccount($);
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
          gender: index === 0 ? "female" : "male",
          age: index === 0 ? "middle_aged" : "young",
          accent: index === 0 ? "american" : "british",
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
  resetCollections($);
};
export const startup: Scenario = reset;

/** Add discovery examples to the current state; reset removes them. */
export const voiceDiscovery: Scenario = ($) => {
  $.context.voices.set("sim-spanish-narrator", {
    voice_id: "sim-spanish-narrator",
    name: "Simulator Spanish Narrator",
    category: "generated",
    labels: {
      language: "es",
      use_case: "narration",
      gender: "female",
      age: "middle_aged",
      accent: "spanish",
    },
    description:
      "Local Spanish-language discovery fixture; no audio is synthesized.",
    available_for_tiers: [],
    high_quality_base_model_ids: ["eleven_multilingual_v2"],
    settings: defaultSettings(),
    is_owner: true,
    is_legacy: false,
    created_at_unix: 1_735_689_602,
  });
  $.context.voices.set("sim-unlabeled", {
    voice_id: "sim-unlabeled",
    name: "Simulator Unlabeled Voice",
    category: "generated",
    labels: {},
    verified_languages: [
      { language: "en", model_id: "eleven_multilingual_v2" },
    ],
    description:
      "Local fixture without discovery labels; no audio is synthesized.",
    available_for_tiers: [],
    high_quality_base_model_ids: ["eleven_multilingual_v2"],
    settings: defaultSettings(),
    is_owner: true,
    is_legacy: false,
    created_at_unix: 1_735_689_603,
  });
};
