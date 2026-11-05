import type { Scenario } from "../types/index.js";
export const emptyStudioProjects: Scenario = ($) => {
  const c = $.loadContext("/studio/projects");
  c.projects = new Map();
  $.loadContext("/studio/podcasts").studio = () => c;
  c.nextChapterId = 1;
  c.snapshots = new Map();
  c.pending = new Map();
  c.nextSnapshot = 1;
  c.nextProject = 1;
  c.audio = new Uint8Array(417 * 20);
  for (let n = 0; n < 20; n++) c.audio.set([255, 251, 144, 100], n * 417);
  c.time = 1735689900;
  c.duration = 23040 / 44100;
  c.voiceExists = (id) => $.context.voices.has(id);
  c.modelExists = (id) =>
    $.context.models.get(id)?.can_do_text_to_speech === true;
  c.podcastTemplate = undefined;
  c.dictionaryVersion = (id, version) => {
    const dictionary = $.loadContext(
      "/pronunciation-dictionaries",
    ).dictionaries.get(id);
    if (!dictionary) return;
    const versionId = version ?? dictionary.metadata.latest_version_id,
      rules = dictionary.versions.get(versionId);
    if (!rules) return;
    const m = dictionary.metadata;
    return {
      version_id: versionId,
      version_rules_num: rules.length,
      pronunciation_dictionary_id: id,
      dictionary_name: m.name,
      version_name: versionId,
      permission_on_resource: m.permission_on_resource,
      created_by: m.created_by,
      creation_time_unix: m.creation_time_unix,
      archived_time_unix: m.archived_time_unix,
    };
  };
};
export const resetStudioProjects: Scenario = ($) => {
  emptyStudioProjects($);
  const c = $.loadContext("/studio/projects");
  c.projects = new Map([
    [
      "sim-project",
      {
        metadata: {
          project_id: "sim-project",
          name: "Simulator Studio Project",
          create_date_unix: 1735689600,
          created_by_user_id: "sim-member-narrator",
          default_title_voice_ref_id: "sim-narrator",
          default_paragraph_voice_ref_id: "sim-narrator",
          default_title_voice_id: "sim-narrator",
          default_paragraph_voice_id: "sim-narrator",
          default_model_id: "eleven_multilingual_v2",
          can_be_downloaded: false,
          volume_normalization: false,
          state: "default",
          access_level: "admin",
          quality_check_on: false,
          quality_check_on_when_bulk_convert: false,
          quality_preset: "standard",
          pronunciation_dictionary_versions: [],
          pronunciation_dictionary_locators: [],
          apply_text_normalization: "auto",
          assets: [],
          voices: [],
          base_voices: [],
          source_type: "blank",
        },
        chapters: new Map([
          [
            "sim-chapter",
            {
              chapter_id: "sim-chapter",
              name: "Introduction",
              can_be_downloaded: false,
              state: "default",
              voice_ids: ["sim-narrator"],
              content: {
                blocks: [
                  {
                    block_id: "sim-chapter-block-1",
                    nodes: [
                      {
                        type: "tts_node",
                        project_voice_ref_id: "sim-narrator",
                        voice_id: "sim-narrator",
                        text: "Local Studio fixture.",
                      },
                    ],
                  },
                ],
              },
              statistics: {
                characters_unconverted: 21,
                characters_converted: 0,
                paragraphs_converted: 0,
                paragraphs_unconverted: 1,
              },
            },
          ],
        ]),
        muted: new Set(["sim-chapter"]),
      },
    ],
  ]);
  c.podcastTemplate = structuredClone(c.projects.get("sim-project"));
};
export const completeStudioConversions: Scenario = ($) => {
  const c = $.loadContext("/studio/projects");
  for (const [id, job] of c.pending) {
    const live = c.projects.get(id);
    if (!live) {
      c.pending.delete(id);
      continue;
    }
    const selected = [...job.project.chapters.values()].filter(
        (ch) => !job.chapter || ch.chapter_id === job.chapter,
      ),
      seq = c.nextSnapshot++,
      sid = `sim-project-snapshot-${seq}`;
    const alignment = (text: string) => {
      const chars = Array.from(text);
      return {
        characters: chars,
        character_start_times_seconds: chars.map(
          (_, i) => (i * c.duration) / chars.length,
        ),
        character_end_times_seconds: chars.map(
          (_, i) => ((i + 1) * c.duration) / chars.length,
        ),
      };
    };
    const chapters = selected.map((ch, i) => ({
      metadata: {
        chapter_snapshot_id: `sim-chapter-snapshot-${seq}-${i + 1}`,
        project_id: id,
        chapter_id: ch.chapter_id,
        created_at_unix: c.time,
        name: ch.name,
        character_alignments: [
          alignment(
            ch.content.blocks
              .flatMap((b) =>
                b.nodes.map((n) => (n.type === "tts_node" ? n.text : "")),
              )
              .join(""),
          ),
        ],
      },
      audio: new Uint8Array(c.audio),
    }));
    const audio = Buffer.concat(chapters.map((ch) => Buffer.from(ch.audio)));
    const alignments = chapters.flatMap((ch, i) =>
      ch.metadata.character_alignments.map((a) => ({
        ...a,
        character_start_times_seconds: a.character_start_times_seconds.map(
          (t) => t + i * c.duration,
        ),
        character_end_times_seconds: a.character_end_times_seconds.map(
          (t) => t + i * c.duration,
        ),
      })),
    );
    c.snapshots.set(sid, {
      projectwide: !job.chapter,
      metadata: {
        project_snapshot_id: sid,
        project_id: id,
        created_at_unix: c.time,
        name: job.project.metadata.name,
        character_alignments: alignments,
        audio_duration_secs: chapters.length * c.duration,
      },
      audio: new Uint8Array(audio),
      chapters,
    });
    for (const ch of selected) {
      const current = live.chapters.get(ch.chapter_id);
      if (current) {
        current.state = "default";
        current.can_be_downloaded = true;
        current.last_conversion_date_unix = c.time;
        current.conversion_progress = 1;
        current.last_conversion_error = null;
        current.statistics = {
          characters_converted: ch.content.blocks
            .flatMap((b) =>
              b.nodes.map((n) => (n.type === "tts_node" ? n.text : "")),
            )
            .join("").length,
          characters_unconverted: 0,
          paragraphs_converted: ch.content.blocks.length,
          paragraphs_unconverted: 0,
        };
      }
    }
    live.metadata.state = "default";
    live.metadata.can_be_downloaded = [...live.chapters.values()].every(
      (ch) => ch.can_be_downloaded,
    );
    c.pending.delete(id);
  }
};
