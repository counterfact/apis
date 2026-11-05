import type { Scenario } from "../types/index.js";

export const emptyAudioEffects: Scenario = ($) => {
  const context = $.loadContext("/audio-effects");
  context.filterPresets = new Map();
  context.environments = new Map();
  context.backgroundNoises = new Map();
};

export const resetAudioEffects: Scenario = ($) => {
  emptyAudioEffects($);
  const context = $.loadContext("/audio-effects");
  context.filterPresets.set("sim-filter-soft", {
    filter_preset_id: "sim-filter-soft",
    name: "Simulator soft filter",
    description: null,
  });
  context.filterPresets.set("sim-filter-radio", {
    filter_preset_id: "sim-filter-radio",
    name: "Simulator radio",
    description: "Fictional radio-style filter metadata.",
  });
  context.environments.set("sim-environment-room", {
    environment_id: "sim-environment-room",
    name: "Simulator room",
    description: "Fictional small-room reverb metadata.",
  });
  context.backgroundNoises.set("sim-noise-rain", {
    background_noise_id: "sim-noise-rain",
    name: "Simulator rain",
    description: "Fictional rain background metadata.",
  });
};
