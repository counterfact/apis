import type { Scenario } from "../types/index.js";
export const emptyMusicFinetunes: Scenario = ($) => {
  $.loadContext("/music/finetunes").records = new Map();
};
export const resetMusicFinetunes: Scenario = ($) => {
  emptyMusicFinetunes($);
  const context = $.loadContext("/music/finetunes");
  context.nextFinetune = 0;
  context.creationDefaults = { createdAt: "2025-01-04T00:00:00Z", status: "completed", progress: 1 };
  context.modelExists = id => $.context.models.has(id);
  context.validateAudio = input => $.loadContext("/music").validateAudio(input);
  for (const [index, [id, name, created_by, visibility]] of (
    [
      ["sim-music-self", "Local finetune", "self", "private"],
      ["sim-music-workspace", "Workspace finetune", "workspace", "workspace"],
      ["sim-music-curated", "Curated finetune", "elevenlabs", "public"],
    ] as const
  ).entries()) {
    context.records.set(id, {
      id,
      name,
      created_by,
      visibility,
      tags: ["local"],
      primary_genre: "ambient",
      model_id: "music_v1",
      created_at: `2025-01-0${index + 1}T00:00:00Z`,
      status: "completed",
      training_progress: 1,
      failure_reason: null,
    });
  }
};
