import type { Scenario } from "../types/index.js";
export const resetPvcVoices: Scenario = ($) => {
  const context = $.loadContext("/voices/pvc");
  context.sampleAudio.clear();
  context.separation.clear();
  context.training.clear();
  context.challenge = "Read aloud: this is a synthetic simulator challenge. Verification is available only through the verifiedVoiceSampleFixtures scenario.";
  $.context.voiceSamples = context;
  context.root = () => $.context;
  context.nextVoice = 0;
  context.createdAt = 1_735_689_610;
};
/** Clear only professional voice metadata; other owned voices remain available. */
export const emptyPvcVoices: Scenario = ($) => {
  for (const [id, voice] of $.context.voices)
    if (voice.category === "professional") $.context.deleteVoice(id);
  const context = $.loadContext("/voices/pvc");
  context.nextVoice = 0;
};
