import type { Scenario } from "../types/index.js";
export const emptySpeechEngines: Scenario = ($) => {
  const c = $.loadContext("/speech-engine");
  c.engines = new Map();
  c.nextId = 1;
  c.nextMutation = 0;
  c.defaults = {
    time: 1735689600,
    effects: {
      filter_preset_id: null,
      distance: 0,
      environment_id: null,
      background_noise_id: null,
      send_level: 1,
      pan: 0,
    },
    configuration: {
      name: "Speech Engine",
      speech_engine: {
        ws_url: "wss://example.invalid/transcript",
        request_headers: {},
      },
      asr: {
        provider: "scribe_realtime",
        quality: "high",
        user_input_audio_format: "pcm_16000",
        keywords: [],
      },
      tts: {
        voice_id: "sim-narrator",
        model_id: "eleven_flash_v2",
        agent_output_audio_format: "pcm_16000",
        stability: 0.5,
        speed: 1,
        similarity_boost: 0.8,
      },
      turn: {
        mode: "turn",
        turn_timeout: 7,
        turn_eagerness: "normal",
        silence_end_call_timeout: -1,
      },
      vad: { background_voice_detection: false },
      conversation: {
        client_events: [
          "audio",
          "interruption",
          "agent_response",
          "user_transcript",
        ],
        max_duration_seconds: 600,
      },
      privacy: {
        record_voice: true,
        retention_days: -1,
        delete_transcript_and_pii: false,
        delete_audio: false,
        apply_to_existing_conversations: false,
        zero_retention_mode: false,
      },
      call_limits: {
        agent_concurrency_limit: -1,
        daily_limit: 100000,
        bursting_enabled: true,
      },
      auth: { enable_auth: false },
      language: "en",
      cascade_timeout_seconds: 4,
      tags: [],
      overrides: { first_message: false },
      access_info: {
        is_creator: true,
        creator_name: "Narrator",
        creator_email: "narrator@example.invalid",
        role: "admin",
      },
    },
  };
};
export const resetSpeechEngines: Scenario = ($) => {
  emptySpeechEngines($);
  const c = $.loadContext("/speech-engine");
  c.engines = new Map([
    [
      "sim-speech-engine",
      {
        ...structuredClone(c.defaults!.configuration),
        speech_engine_id: "sim-speech-engine",
        name: "Simulator Speech Engine",
        tags: ["local"],
        metadata: {
          created_at_unix_secs: 1735689600,
          updated_at_unix_secs: 1735689600,
          created_from: "api",
          last_updated_from: "api",
        },
      },
    ],
  ]);
};
