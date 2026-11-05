import type { Scenario } from "../types/index.js";
export const emptyLegacyDubbing: Scenario = ($) => {
  $.loadContext("/dubbing").records = new Map();
  $.loadContext("/dubbing").audio = new Map();
  $.loadContext("/dubbing").nextCreation = 0;
};
export const resetLegacyDubbing: Scenario = ($) => {
  emptyLegacyDubbing($);
  const c = $.loadContext("/dubbing");
  for (const [id, status, creator] of [
    ["sim-legacy-dub", "dubbed", "personal"],
    ["sim-legacy-pending", "dubbing", "others"],
  ] as const)
    c.records.set(id, {
      metadata: {
        dubbing_id: id,
        name:
          id === "sim-legacy-dub" ? "Local completed dub" : "Local pending dub",
        status,
        source_language: "en",
        target_languages: ["es"],
        created_at:
          id === "sim-legacy-dub"
            ? "2025-01-01T00:00:00Z"
            : "2025-01-02T00:00:00Z",
        editable: false,
        media_metadata: { content_type: "audio/mpeg", duration: 10 },
        error: null,
      },
      model: "dubbing_v1",
      creator,
      source: "dubbing_api",
      transcripts: {
        en: {
          language: "en",
          utterances: [
            {
              text: "Local source",
              speaker_id: "local-speaker",
              start_s: 0,
              end_s: 2,
            },
          ],
        },
        es: {
          language: "es",
          utterances: [
            {
              text: "Texto local",
              speaker_id: "local-speaker",
              start_s: 0,
              end_s: 2,
            },
          ],
        },
      },
    });
};
