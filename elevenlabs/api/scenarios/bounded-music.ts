import type { Scenario } from "../types/index.js";
export const resetBoundedMusic: Scenario = ($) => {
  const c = $.loadContext("/music"),
    speech = $.loadContext("/text-to-speech");
  c.songs = new Map();
  c.plans = new Map();
  c.nextSong = 0;
  c.nextPlan = 0;
  c.stemNames = { two_stems_v1: ["vocals", "instrumental"], six_stems_v1: ["vocals", "drums", "bass", "guitar", "piano", "other"] };
  c.audio = new Uint8Array(147 * 417);
  for (let n = 0; n < 147; n++)
    c.audio.set(speech.audio.subarray(0, 417), n * 417);
  c.modelExists = (id) => $.context.models.has(id);
  c.defaults = {
    durationMs: 3840,
    maxCombinedInputBytes: 8 * 1024 * 1024,
    plan: {
      positive_global_styles: [],
      negative_global_styles: [],
      sections: [
        {
          section_name: "Synthetic silence",
          positive_local_styles: [],
          negative_local_styles: [],
          duration_ms: 3840,
          lines: [],
        },
      ],
    },
    metadata: {
      title: "Synthetic silence",
      description: "Bounded local silence fixture; no music was generated.",
      genres: [],
      languages: [],
      is_explicit: false,
    },
  };
};
