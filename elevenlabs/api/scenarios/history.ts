import type { Scenario } from "../types/index.js";
import { defaultSettings } from "../routes/_.context.js";

/** Historical metadata fixtures only; no audio was generated. */
export const resetHistory: Scenario = ($) => {
  $.loadContext("/history").audio = new Map();
  $.loadContext("/history").history = new Map(
    ["sim-history-1", "sim-history-2"].map((history_item_id, index) => [
      history_item_id,
      {
        history_item_id,
        request_id: `sim-request-${index + 1}`,
        voice_id: index === 0 ? "sim-narrator" : "sim-assistant",
        voice_name: index === 0 ? "Simulator Narrator" : "Simulator Assistant",
        voice_category: "generated",
        model_id: index === 0 ? "eleven_multilingual_v2" : "eleven_flash_v2_5",
        text: index === 0 ? "Hello from the simulator narrator." : "Welcome from the simulator assistant.",
        source: "TTS",
        date_unix: 1_735_689_601 + index,
        character_count_change_from: index * 100,
        character_count_change_to: (index + 1) * 100,
        content_type: "audio/mpeg",
        state: "created",
        settings: defaultSettings(),
      },
    ]),
  );
};

export const emptyHistory: Scenario = ($) => {
  $.loadContext("/history").audio = new Map();
  $.loadContext("/history").history = new Map();
};
