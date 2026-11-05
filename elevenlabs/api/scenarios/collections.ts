import type { Scenario } from "../types/index.js";

export const resetCollections: Scenario = ($) => {
  const context = $.loadContext("/voices/collections");
  context.voices = () => $.context.voices;
  context.collections = new Map([["sim-collection", {
    collection_id: "sim-collection", title: "Simulator Favorites", icon: "star", permission_on_resource: "admin",
  }]]);
  context.nextCollectionNumber = 0;
  for (const voice of $.context.voices.values()) {
    voice.collection_ids = voice.voice_id === "sim-narrator" ? ["sim-collection"] : [];
  }
};

export const emptyCollections: Scenario = ($) => {
  const context = $.loadContext("/voices/collections");
  context.voices = () => $.context.voices;
  context.collections = new Map();
  context.nextCollectionNumber = 0;
  for (const voice of $.context.voices.values()) voice.collection_ids = [];
};
