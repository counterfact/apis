import type { Scenario } from "../types/index.js";
export const emptyDubbingProjects: Scenario = ($) => {
  const c = $.loadContext("/dubbing/project");
  c.projects = new Map();
  c.nextSegmentId = 1;
  c.nextLanguageId = 1;
  c.timestamp = "2025-01-01T00:00:00Z";
};
export const resetDubbingProjects: Scenario = ($) => {
  emptyDubbingProjects($);
  const c = $.loadContext("/dubbing/project"),
    pid = "sim-dubbing-project",
    lid = "sim-dubbing-es",
    sid = "sim-dubbing-segment";
  c.projects.set(pid, {
    metadata: {
      project_id: pid,
      status: "ready",
      reference: "Local fixture",
      source_language: "en",
      model_id: "dubbing_v2",
      media: {
        filename: "local.mp4",
        duration_s: 30,
        has_video: true,
        mime_type: "video/mp4",
      },
      webhook_ids: [],
      revision: 0,
      error: null,
      warnings: [],
      created_at: c.timestamp,
      updated_at: c.timestamp,
    },
    segments: new Map([
      [
        sid,
        {
          id: sid,
          text: "Hello local",
          speaker_id: "speaker-1",
          start_s: 0,
          end_s: 2,
        },
      ],
    ]),
    languages: new Map([
      [
        lid,
        {
          metadata: {
            language_id: lid,
            project_id: pid,
            target_language: "es",
            status: "completed",
            model_id: "dubbing_v2",
            voice_settings: null,
            outputs: {
              lossless_audio: "https://simulator.invalid/dubbing/es.flac",
              subtitles: "https://simulator.invalid/dubbing/es.vtt",
            },
            revision: 0,
            output_revision: 0,
            error: null,
            warnings: [],
            created_at: c.timestamp,
            updated_at: c.timestamp,
          },
          translations: new Map([[sid, "Hola local"]]),
        },
      ],
    ]),
  });
};
export const completeDubbingLanguages: Scenario = ($) => {
  const c = $.loadContext("/dubbing/project");
  for (const p of c.projects.values()) {
    if (p.metadata.status !== "ready") continue;
    for (const l of p.languages.values()) {
      if (!["queued", "processing", "stale"].includes(l.metadata.status))
        continue;
      for (const s of p.segments.values())
        if (!l.translations.has(s.id) || l.translations.get(s.id) === null)
          l.translations.set(
            s.id,
            `[synthetic ${l.metadata.target_language}] ${s.text}`,
          );
      l.metadata.status = "completed";
      l.metadata.output_revision = l.metadata.revision;
      l.metadata.outputs = {
        lossless_audio: `https://simulator.invalid/dubbing/${l.metadata.language_id}.flac`,
        subtitles: `https://simulator.invalid/dubbing/${l.metadata.language_id}.vtt`,
      };
      l.metadata.updated_at = c.timestamp;
    }
  }
};
export const pendingDubbingProject: Scenario = ($) => {
  const c = $.loadContext("/dubbing/project"),
    id = "sim-dubbing-pending";
  c.projects.set(id, {
    metadata: {
      project_id: id,
      status: "queued",
      source_language: null,
      model_id: "dubbing_v2",
      media: null,
      revision: 0,
      created_at: "2024-12-31T00:00:00Z",
      updated_at: "2024-12-31T00:00:00Z",
    },
    segments: new Map(),
    languages: new Map(),
  });
};
