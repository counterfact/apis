import type { Scenario } from "../types/index.js";

/** A synthetic credit ledger, independent of deletable history and quota UI state. */
export const resetUsage: Scenario = ($) => {
  $.loadContext("/workspace/analytics").legacyCurrentUser = "sim-user";
  $.loadContext("/usage").analytics = () => $.loadContext("/workspace/analytics");
  $.loadContext("/workspace/analytics").usage = [
    {
      time: 1_735_689_630_000, credits: 400, product_type: "text_to_speech",
      model: "eleven_multilingual_v2", voice_id: "sim-narrator", user_id: "sim-user",
    },
    {
      time: 1_735_693_200_000, credits: 600, product_type: "text_to_speech",
      model: "eleven_flash_v2_5", voice_id: "sim-assistant", user_id: "sim-user",
    },
  ];
};

export const emptyUsage: Scenario = ($) => {
  $.loadContext("/workspace/analytics").usage = [];
};

/** Replace the current ledger with a synthetic two-user workspace snapshot. */
export const legacyUsageWorkspace: Scenario = ($) => {
  resetUsage($);
  $.loadContext("/workspace/analytics").usage = [
    ...$.loadContext("/workspace/analytics").usage,
    { time: 1_735_689_600_000, credits: 75, product_type: "text_to_speech",
      model: "eleven_multilingual_v2", voice_id: "sim-narrator", user_id: "sim-other-user" },
  ];
};
