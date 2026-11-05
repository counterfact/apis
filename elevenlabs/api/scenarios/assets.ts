import type { Scenario } from "../types/index.js";
export const emptyAssets: Scenario = ($) => {
  const c = $.loadContext("/assets");
  c.records = new Map();
  c.nextUpload = 0;
  c.uploadDefaults = {
    maxBytes: 1_048_576,
    timestamp: 1_735_689_700,
    maxName: 240,
  };
};
export const resetAssets: Scenario = ($) => {
  emptyAssets($);
  $.loadContext("/assets").records = new Map([
    [
      "sim-asset-audio",
      {
        asset_id: "sim-asset-audio",
        name: "Local intro.mp3",
        mime_type: "audio/mpeg",
        created_at_unix: 1735689600,
        content_url: "https://simulator.invalid/assets/local-intro.mp3",
      },
    ],
    [
      "sim-asset-pending",
      {
        asset_id: "sim-asset-pending",
        name: "Local image.png",
        mime_type: "image/png",
        created_at_unix: 1735689601,
        content_url: null,
      },
    ],
  ]);
};
