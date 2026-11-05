import type { Scenario } from "../types/index.js";
export const resetPvcVoices: Scenario = ($) => {
  const context = $.loadContext("/voices/pvc");
  context.root = () => $.context;
  context.nextVoice = 0;
  context.createdAt = 1_735_689_610;
};
/** Clear only professional voice metadata; other owned voices remain available. */
export const emptyPvcVoices: Scenario = ($) => {
  for (const [id, voice] of $.context.voices)
    if (voice.category === "professional") $.context.voices.delete(id);
  resetPvcVoices($);
};
