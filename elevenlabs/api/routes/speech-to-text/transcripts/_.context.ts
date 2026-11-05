import type { SpeechToTextChunkResponseModel } from "../../../types/v1/components/schemas/SpeechToTextChunkResponseModel.js";
import type { MultichannelSpeechToTextResponseModel } from "../../../types/v1/components/schemas/MultichannelSpeechToTextResponseModel.js";

export type StoredTranscript =
  SpeechToTextChunkResponseModel | MultichannelSpeechToTextResponseModel;

export class TranscriptError extends Error {
  override name = "TranscriptError";
  readonly status = 404;
  readonly code = "transcript_not_found";
  constructor() {
    super("Stored transcript not found");
  }
}

export class Context {
  records = new Map<string, StoredTranscript>();

  get(id: string): StoredTranscript {
    const record = this.records.get(id);
    if (!record) throw new TranscriptError();
    return structuredClone(record);
  }

  delete(id: string) {
    if (!this.records.delete(id)) throw new TranscriptError();
    return { status: "ok" };
  }
}
