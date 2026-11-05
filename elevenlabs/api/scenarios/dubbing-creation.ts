import type { Scenario } from "../types/index.js";
/** Only declared synthetic URLs resolve; uploads/URL inputs never cause network access. */
export const resetDubbingCreation: Scenario = ($) => {
  const legacy = $.loadContext("/dubbing"),
    project = $.loadContext("/dubbing/project"),
    audio = $.loadContext("/text-to-speech").audio;
  const defaults = {
    timestamp: "2025-01-03T00:00:00Z",
    maxBytes: 8 * 1024 * 1024,
    maxDuration: 60,
    autoLanguage: "en",
    sourceText: "Synthetic simulator source.",
  };
  for (const c of [legacy, project]) {
    c.defaults = structuredClone(defaults);
    c.sources = new Map([
      [
        "https://simulator.invalid/dubbing-source.mp3",
        {
          data: new Uint8Array(audio),
          size: audio.length,
          filename: "dubbing-source.mp3",
          contentType: "audio/mpeg",
        },
      ],
    ]);
  }
  legacy.nextCreation = 0;
  legacy.resources = () => $.loadContext("/dubbing/resource");
  project.nextProjectId = 0;
};
/** Populate synthetic source text and media directly, without transcription/translation. */
export const completeDubbingCreation: Scenario = ($) => {
  const legacy = $.loadContext("/dubbing"),
    resources = $.loadContext("/dubbing/resource"),
    audio = $.loadContext("/text-to-speech").audio;
  const defaults = legacy.defaults;
  if (!defaults) throw new Error("Run startup or reset");
  for (const [id, r] of legacy.records) {
    if (!r.input || r.metadata.status !== "dubbing") continue;
    const source = r.metadata.source_language ?? defaults.autoLanguage,
      duration = r.input.duration;
    r.metadata.source_language = source;
    const languages = [...new Set([source, ...r.metadata.target_languages])];
    const sourceText = defaults.sourceText;
    for (const language of languages)
      r.transcripts[language] = {
        language,
        utterances: [
          {
            text:
              language === source
                ? sourceText
                : `[synthetic ${language}] ${sourceText}`,
            speaker_id: "synthetic-speaker",
            start_s: 0,
            end_s: duration,
          },
        ],
      };
    legacy.audio.set(
      id,
      Object.fromEntries(
        languages.map((language) => [language, new Uint8Array(audio)]),
      ),
    );
    r.metadata.status = "dubbed";
    r.metadata.media_metadata = {
      content_type: "audio/mpeg",
      duration: 23040 / 44100,
    };
    if (r.metadata.editable) {
      const media = {
        src: id,
        content_type: r.input.file.contentType,
        bucket_name: "synthetic",
        random_path_slug: id,
        duration_secs: duration,
        is_audio: true,
        url: `https://simulator.invalid/dubbing-inputs/${id}`,
      };
      resources.resources.set(id, {
        id,
        version: 1,
        source_language: source,
        target_languages: [...r.metadata.target_languages],
        input: media,
        background: null,
        foreground: null,
        speaker_tracks: {
          "synthetic-speaker": {
            id: "synthetic-speaker",
            media_ref: structuredClone(media),
            speaker_name: "Synthetic speaker",
            voices: Object.fromEntries(
              languages.map((language) => [language, "track-clone"]),
            ),
            segments: ["synthetic-segment"],
          },
        },
        speaker_segments: {
          "synthetic-segment": {
            id: "synthetic-segment",
            start_time: 0,
            end_time: duration,
            text: sourceText,
            subtitles: [],
            dubs: Object.fromEntries(
              r.metadata.target_languages.map((language) => [
                language,
                {
                  start_time: 0,
                  end_time: duration,
                  text: `[synthetic ${language}] ${sourceText}`,
                  subtitles: [],
                  audio_stale: false,
                  media_ref: {
                    ...structuredClone(media),
                    content_type: "audio/mpeg",
                    duration_secs: 23040 / 44100,
                    url: `https://simulator.invalid/dubbing/${id}/${language}.mp3`,
                  },
                },
              ]),
            ),
          },
        },
        renders: {},
      });
    }
  }
  const project = $.loadContext("/dubbing/project");
  for (const p of project.projects.values()) {
    if (!p.input || !["queued", "preparing"].includes(p.metadata.status))
      continue;
    const d = project.defaults!;
    p.metadata.source_language ??= d.autoLanguage;
    p.metadata.media = {
      filename: p.input.file.filename,
      duration_s: p.input.duration,
      has_video: false,
      mime_type: p.input.file.contentType,
    };
    const count = Math.ceil(p.input.duration / 25),
      span = p.input.duration / count;
    p.segments = new Map(
      Array.from({ length: count }, (_, i) => {
        const id = `synthetic-source-segment-${i + 1}`;
        return [
          id,
          {
            id,
            text: d.sourceText,
            speaker_id: "synthetic-speaker",
            start_s: i * span,
            end_s: (i + 1) * span,
          },
        ];
      }),
    );
    p.metadata.status = "ready";
    p.metadata.updated_at = d.timestamp;
  }
};
