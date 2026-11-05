import type { Scenario } from "../types/index.js";
export const emptyStudioProjects: Scenario = ($) => {
  const c = $.loadContext("/studio/projects");
  c.projects = new Map();
  c.nextChapterId = 1;
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
};
