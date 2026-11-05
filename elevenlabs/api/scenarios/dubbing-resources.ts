import type { Scenario } from "../types/index.js";
export const emptyDubbingResources: Scenario = ($) => {
  const c = $.loadContext("/dubbing/resource");
  c.resources = new Map();
  c.jobs = new Map();
  c.nextRenderId = 1;
  c.candidates = [];
  c.speakerSettings = new Map();
  c.nextSegmentId = 1;
  c.nextSpeakerId = 1;
};
export const resetDubbingResources: Scenario = ($) => {
  emptyDubbingResources($);
  const c = $.loadContext("/dubbing/resource"),
    media = {
      src: "synthetic-source",
      content_type: "audio/mpeg",
      bucket_name: "synthetic",
      random_path_slug: "fixture",
      duration_secs: 10,
      is_audio: true,
      url: "https://simulator.invalid/dubbing-resource/source",
    };
  c.resources.set("sim-dubbing-resource", {
    id: "sim-dubbing-resource",
    version: 1,
    source_language: "en",
    target_languages: ["es"],
    input: media,
    background: null,
    foreground: null,
    speaker_tracks: {
      "sim-dubbing-speaker": {
        id: "sim-dubbing-speaker",
        media_ref: structuredClone(media),
        speaker_name: "Local speaker",
        voices: { en: "track-clone", es: "sim-narrator" },
        segments: ["sim-dubbing-segment"],
      },
    },
    speaker_segments: {
      "sim-dubbing-segment": {
        id: "sim-dubbing-segment",
        start_time: 0,
        end_time: 2,
        text: "Local source",
        subtitles: [],
        dubs: {
          es: {
            start_time: 0,
            end_time: 2,
            text: "Texto local",
            subtitles: [],
            audio_stale: false,
            media_ref: structuredClone(media),
          },
        },
      },
    },
    renders: {},
  });
};
