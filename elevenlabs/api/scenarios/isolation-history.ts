import type { Scenario } from "../types/index.js";
export const emptyIsolationHistory: Scenario = ($) => {
  $.loadContext("/audio-isolation/history").records = new Map();
};
export const resetIsolationHistory: Scenario = ($) => {
  $.loadContext("/audio-isolation/history").records = new Map([
    [
      "sim-isolation-podcast",
      {
        text: "Synthetic interview metadata",
        item: {
          id: "sim-isolation-podcast",
          title: "Local podcast",
          created_at_unix: 1735689600,
          format: "mp3",
          duration_seconds: 20,
          download_url: "https://simulator.invalid/isolation/podcast.mp3",
          icon_url: null,
          source_video_url: null,
          supports_video: false,
          processing: false,
          video_processing_failed: false,
          preview_b64: null,
        },
      },
    ],
    [
      "sim-isolation-pending",
      {
        text: "Synthetic lecture metadata",
        item: {
          id: "sim-isolation-pending",
          title: "Local lecture",
          created_at_unix: 1735689601,
          format: "mp3",
          duration_seconds: null,
          download_url: null,
          icon_url: null,
          source_video_url: null,
          supports_video: false,
          processing: true,
          video_processing_failed: false,
          preview_b64: null,
        },
      },
    ],
  ]);
};
