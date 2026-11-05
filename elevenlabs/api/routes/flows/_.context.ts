import type { MediaGenerationResponse } from "../../types/v1/components/schemas/MediaGenerationResponse.js";
import type { MediaGenerationListResponse } from "../../types/v1/components/schemas/MediaGenerationListResponse.js";
export type Kind = "image" | "video" | "text-to-speech";
export type Generation = {
  kind: Kind;
  modelId: string;
  sequence: number;
  request: Record<string, unknown>;
  response: MediaGenerationResponse;
};
const models: Record<Kind, string[]> = {
  image: [
    "gpt-image-1",
    "gpt-image-1.5",
    "gpt-image-2",
    "gpt-image-2.5-sunburst",
    "gpt-image-2.5-flare",
    "gemini-2.5-flash-image",
    "gemini-3-pro-image",
    "gemini-3.1-flash-image",
    "gemini-3.1-flash-lite-image",
    "bytedance-seedream-5-lite",
    "bytedance-seedream-5-pro",
  ],
  video: [
    "veo-3.1-generate-001",
    "veo-3.1-fast-generate-001",
    "bytedance-seedance-v2",
    "bytedance-seedance-v2-fast",
    "bytedance-seedance-v2-mini",
    "bytedance-seedance-v2.5",
  ],
  "text-to-speech": [
    "eleven_flash_v2_5",
    "eleven_multilingual_v2",
    "eleven_v3",
  ],
};
export class FlowError extends Error {
  override name = "FlowError";
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const invalid = (): never => {
  throw new FlowError(
    400,
    "invalid_flow_request",
    "Invalid or unsupported local Flows request",
  );
};
export class Context {
  generations = new Map<string, Generation>();
  nextId = 1;
  create(kind: Kind, input: unknown) {
    if (!input || typeof input !== "object" || Array.isArray(input))
      return invalid();
    const request = input as Record<string, unknown>;
    if (
      typeof request.model_id !== "string" ||
      !models[kind].includes(request.model_id)
    )
      return invalid();
    const text = kind === "text-to-speech" ? request.text : request.prompt;
    if (
      typeof text !== "string" ||
      !text.trim() ||
      (kind === "text-to-speech" &&
        (typeof request.voice !== "string" || !request.voice.trim()))
    )
      return invalid();
    // These options imply remote notification or media resolution, which local records do not perform.
    for (const key of [
      "webhook",
      "mask",
      "image",
      "audio",
      "start_frame",
      "end_frame",
    ])
      if (request[key] != null) return invalid();
    for (const key of ["images", "videos", "audios"])
      if (
        request[key] != null &&
        (!Array.isArray(request[key]) || request[key].length)
      )
        return invalid();
    const id = `sim-flow-created-${this.nextId}`,
      response = { id, status: "pending" as const };
    this.generations.set(id, {
      kind,
      modelId: request.model_id,
      sequence: this.nextId++,
      request: structuredClone(request),
      response,
    });
    return structuredClone(response);
  }
  get(kind: Kind, id: string) {
    const r = this.generations.get(id);
    if (!r || r.kind !== kind)
      throw new FlowError(
        404,
        "flow_generation_not_found",
        "Generation not found",
      );
    return structuredClone(r.response);
  }
  list(kind: Kind, q: Record<string, unknown>): MediaGenerationListResponse {
    const size = q.page_size ?? 30,
      cursor = q.cursor ?? "0";
    if (
      !Number.isInteger(size) ||
      Number(size) < 1 ||
      Number(size) > 100 ||
      typeof cursor !== "string" ||
      !/^\d+$/.test(cursor) ||
      !Number.isSafeInteger(Number(cursor))
    )
      return invalid();
    if (
      (q.status != null &&
        !["pending", "generating", "completed", "failed"].includes(
          String(q.status),
        )) ||
      (q.model_id != null && typeof q.model_id !== "string")
    )
      return invalid();
    const rows = [...this.generations.values()]
      .filter(
        (r) =>
          r.kind === kind &&
          (q.status == null || r.response.status === q.status) &&
          (q.model_id == null || r.modelId === q.model_id),
      )
      .sort(
        (a, b) =>
          b.sequence - a.sequence || a.response.id.localeCompare(b.response.id),
      );
    const offset = Number(cursor),
      page = rows.slice(offset, offset + Number(size)),
      hasMore = offset + page.length < rows.length;
    return {
      generations: page.map((r) => structuredClone(r.response)),
      has_more: hasMore,
      next_cursor: hasMore ? String(offset + page.length) : null,
    };
  }
}
