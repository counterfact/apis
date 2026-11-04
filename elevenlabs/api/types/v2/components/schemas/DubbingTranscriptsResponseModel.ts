import type { DubbingTranscript } from "./DubbingTranscript.js";
export type DubbingTranscriptsResponseModel = {
  transcript_format: "srt" | "webvtt" | "json";
  srt?: string | null;
  webvtt?: string | null;
  json?: DubbingTranscript | null;
};
