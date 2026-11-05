import type { DubOrderItemRequest } from "./DubOrderItemRequest.js";
import type { SubtitleOrderItemRequest } from "./SubtitleOrderItemRequest.js";
import type { TranscriptionOrderItemRequest } from "./TranscriptionOrderItemRequest.js";
export type OrderItemRequest_Output =
  | (DubOrderItemRequest & { kind: "dub" })
  | (SubtitleOrderItemRequest & { kind: "subtitles" })
  | (TranscriptionOrderItemRequest & { kind: "transcription" });
