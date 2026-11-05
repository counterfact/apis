import type { Scenario } from "../types/index.js";

export const emptyStoredTranscripts: Scenario = ($) => {
  $.loadContext("/speech-to-text/transcripts").records = new Map();
};

export const resetStoredTranscripts: Scenario = ($) => {
  $.loadContext("/speech-to-text/transcripts").records = new Map([
    [
      "sim-transcript-single",
      {
        transcription_id: "sim-transcript-single",
        language_code: "eng",
        language_probability: 1,
        text: "Local transcript.",
        audio_duration_secs: 2,
        words: [
          {
            text: "Local",
            start: 0,
            end: 0.5,
            type: "word",
            logprob: 0,
            speaker_id: "speaker_0",
            channel_index: null,
            characters: [{ text: "L", start: 0, end: 0.1 }],
          },
          {
            text: " ",
            start: 0.5,
            end: 0.5,
            type: "spacing",
            logprob: 0,
          },
          {
            text: "transcript.",
            start: 0.5,
            end: 2,
            type: "word",
            logprob: 0,
          },
        ],
        additional_formats: [
          {
            requested_format: "txt",
            file_extension: "txt",
            content_type: "text/plain",
            is_base64_encoded: false,
            content: "Local transcript.",
          },
        ],
        entities: [],
      },
    ],
    [
      "sim-transcript-multichannel",
      {
        transcription_id: "sim-transcript-multichannel",
        audio_duration_secs: 1,
        transcripts: [0, 1].map((channel_index) => ({
          language_code: "eng",
          language_probability: 1,
          channel_index,
          text: channel_index === 0 ? "Left" : "Right",
          words: [
            {
              text: channel_index === 0 ? "Left" : "Right",
              start: 0,
              end: 1,
              type: "word" as const,
              logprob: 0,
              channel_index,
            },
          ],
        })),
      },
    ],
  ]);
};
