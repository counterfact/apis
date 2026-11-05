import type { Scenario } from "../types/index.js";
export const emptyVoiceLibrary: Scenario = ($) => {
  const c = $.loadContext("/shared-voices");
  c.records = new Map();
  c.accentRecords = new Map();
  c.modelIds = new Set();
  $.context.voiceLibrary = c;
};
export const resetVoiceLibrary: Scenario = ($) => {
  emptyVoiceLibrary($);
  const c = $.loadContext("/shared-voices");
  c.modelIds = new Set(["eleven_multilingual_v2", "eleven_flash_v2_5"]);
  const rows = [
    {
      id: "american",
      language: "en",
      locale: "en-US",
      accent: "american",
      name: "American",
      use: "narration",
      description: "calm",
      custom: false,
      moderated: false,
      reader: true,
      notice: 30,
      featured: true,
    },
    {
      id: "british",
      language: "en",
      locale: "en-GB",
      accent: "british",
      name: "British",
      use: "characters",
      description: "energetic",
      custom: true,
      moderated: false,
      reader: false,
      notice: 7,
      featured: false,
    },
    {
      id: "spanish",
      language: "es",
      locale: "es-ES",
      accent: "spanish",
      name: "Spanish",
      use: "conversation",
      description: "warm",
      custom: false,
      moderated: true,
      reader: true,
      notice: 0,
      featured: false,
    },
  ];
  for (const [i, r] of rows.entries()) {
    const id = `sim-library-${r.id}`;
    c.records.set(id, {
      readerAppEnabled: r.reader,
      trending: 3 - i,
      value: {
        voice_id: id,
        public_owner_id: i === 0 ? "sim-public-owner" : `sim-public-owner-${i}`,
        date_unix: 1735689600 + i,
        name: `Local ${r.name}`,
        accent: r.accent,
        gender: i === 0 ? "female" : "male",
        age: i === 0 ? "middle_aged" : "young",
        descriptive: r.description,
        use_case: r.use,
        category: "professional",
        language: r.language,
        locale: r.locale,
        description: "Local fictional library voice; no audio exists.",
        usage_character_count_1y: 100 * (i + 1),
        usage_character_count_7d: 10 * (i + 1),
        play_api_usage_character_count_1y: 0,
        cloned_by_count: i < 2 ? 3 : 1,
        rate: r.custom ? 2 : 1,
        fiat_rate: null,
        free_users_allowed: true,
        live_moderation_enabled: r.moderated,
        featured: r.featured,
        notice_period: r.notice,
        verified_languages: [
          {
            language: r.language,
            locale: r.locale,
            accent: r.accent,
            model_id: "eleven_multilingual_v2",
          },
        ],
      },
    });
    const code = `${r.language}-${r.accent}`;
    c.accentRecords.set(code, {
      value: { accent: r.accent, language: r.language, code, name: r.name },
      models:
        i === 0
          ? ["eleven_multilingual_v2", "eleven_flash_v2_5"]
          : ["eleven_multilingual_v2"],
    });
  }
};
