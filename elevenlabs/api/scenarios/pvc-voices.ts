import type { Scenario } from "../types/index.js";
export const resetPvcVoices: Scenario = ($) => {
  const context = $.loadContext("/voices/pvc");
  context.nextSample = 0;
  context.captchaRequests.clear();
  context.verificationRequests.clear();
  context.sampleAudio.clear();
  context.separation.clear();
  context.training.clear();
  context.challenge = "Read aloud: this is a synthetic simulator challenge. Submit synthetic audio and run completePvcVerification to grant local simulator permission.";
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

/** Explicit local completion, without voice matching or identity/document validation. */
export const completePvcVerification: Scenario = ($) => {
  const context = $.loadContext("/voices/pvc");
  for (const requests of [context.captchaRequests, context.verificationRequests]) {
    for (const [id, request] of requests) {
      const voice = $.context.voices.get(id);
      if (request.status !== "pending" || !voice?.fine_tuning) continue;
      request.status = "completed";
      voice.fine_tuning.is_allowed_to_fine_tune = true;
      voice.fine_tuning.manual_verification_requested = false;
    }
  }
};
