import type { Scenario } from "../types/index.js";
/** Synthetic distances are fixed fixtures; no acoustic comparison or cloning occurs. */
export const resetVoiceUploads: Scenario = ($) => {
  $.context.nextUploadedVoice = 0;
  $.context.nextUploadedSample = 0;
  $.context.uploadCreatedAt = 1_735_689_620;
  $.context.similarVoiceDistances = new Map([
    ["sim-library-american",0.25], ["sim-library-british",0.75], ["sim-library-spanish",1.25],
  ]);
};
