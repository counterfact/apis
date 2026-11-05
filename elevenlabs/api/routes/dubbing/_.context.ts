import type { DubbingMetadataResponse } from "../../types/v1/components/schemas/DubbingMetadataResponse.js";
import type { DubbingTranscript } from "../../types/v1/components/schemas/DubbingTranscript.js";
import type { DubbingTranscriptsResponseModel } from "../../types/v1/components/schemas/DubbingTranscriptsResponseModel.js";
export type LegacyDub = {
  metadata: DubbingMetadataResponse;
  model: string;
  creator: "personal" | "others";
  source: string;
  transcripts: Record<string, DubbingTranscript>;
};
export class LegacyDubbingError extends Error {
  override name = "LegacyDubbingError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const fail = (status: number, code: string): never => {
  throw new LegacyDubbingError(status, code);
};
const invalid = (): never => fail(400, "invalid_dubbing_request");
const pick = (v: unknown, allowed: string[], fallback: string) => {
  if (v == null) return fallback;
  if (typeof v !== "string" || !allowed.includes(v)) return invalid();
  return v;
};
const array = (v: unknown, allowed?: string[]) => {
  if (v == null) return undefined;
  if (
    !Array.isArray(v) ||
    v.some((x) => typeof x !== "string" || (allowed && !allowed.includes(x)))
  )
    return invalid();
  return v as string[];
};
const stamp = (seconds: number, separator: string) => {
  const ms = Math.round(seconds * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(Math.floor(ms / 60000) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}${separator}${String(ms % 1000).padStart(3, "0")}`;
};
export class Context {
  audio = new Map<string, Record<string, Uint8Array>>();
  getAudio(id: string, language: string) {
    const r = this.record(id);
    if (r.metadata.status !== "dubbed") return fail(425, "dubbing_not_dubbed");
    const bytes = this.audio.get(id)?.[language === "source" ? r.metadata.source_language! : language];
    if (!bytes) return fail(404, "dubbing_audio_not_found");
    return new Uint8Array(bytes);
  }
  records = new Map<string, LegacyDub>();
  private record(id: string) {
    return this.records.get(id) ?? fail(404, "dubbing_not_found");
  }
  get(id: string) {
    return structuredClone(this.record(id).metadata);
  }
  delete(id: string) {
    this.record(id);
    this.records.delete(id);
    this.audio.delete(id);
    return { status: "ok" };
  }
  list(q: Record<string, unknown>) {
    const size = q.page_size ?? 100;
    if (
      typeof size !== "number" ||
      !Number.isInteger(size) ||
      size < 1 ||
      size > 200
    )
      return invalid();
    const cursor = q.cursor ?? "0";
    if (
      typeof cursor !== "string" ||
      !/^\d+$/.test(cursor) ||
      !Number.isSafeInteger(Number(cursor))
    )
      return invalid();
    const status =
      q.dubbing_status == null
        ? undefined
        : pick(q.dubbing_status, ["dubbing", "dubbed", "failed"], "");
    const statuses = array(q.dubbing_statuses, [
        "queued",
        "preparing",
        "dubbing",
        "dubbed",
        "failed",
      ]),
      models = array(q.dubbing_models, ["dubbing_v1", "dubbing_v2"]),
      languages = array(q.target_language_codes),
      sources = array(q.creation_sources, [
        "flow_node",
        "dubbing_ui",
        "dubbing_api",
      ]);
    const creator = pick(
        q.filter_by_creator,
        ["personal", "others", "all"],
        "all",
      ),
      order = pick(q.order_by, ["created_at", "name"], "created_at"),
      direction = pick(
        q.order_direction,
        ["DESCENDING", "ASCENDING"],
        "DESCENDING",
      );
    const rows = [...this.records.values()].filter(
      (r) =>
        (!status || r.metadata.status === status) &&
        (!statuses || statuses.includes(r.metadata.status)) &&
        (!models || models.includes(r.model)) &&
        (!languages ||
          languages.some((l) => r.metadata.target_languages.includes(l))) &&
        (!sources || sources.includes(r.source)) &&
        (creator === "all" || r.creator === creator),
    );
    rows.sort((a, b) => {
      const x = a.metadata[order as "name" | "created_at"],
        y = b.metadata[order as "name" | "created_at"];
      return (
        (x < y ? -1 : x > y ? 1 : 0) * (direction === "ASCENDING" ? 1 : -1) ||
        a.metadata.dubbing_id.localeCompare(b.metadata.dubbing_id)
      );
    });
    const start = Number(cursor),
      end = start + size;
    return {
      dubs: structuredClone(rows.slice(start, end).map((r) => r.metadata)),
      has_more: end < rows.length,
      next_cursor: end < rows.length ? String(end) : null,
    };
  }
  transcript(
    id: string,
    language: string,
    format: unknown = "srt",
  ): DubbingTranscriptsResponseModel {
    const r = this.record(id);
    const f = pick(format, ["srt", "webvtt", "json"], "srt") as
      "srt" | "webvtt" | "json";
    if (r.metadata.status !== "dubbed") return fail(425, "dubbing_not_dubbed");
    const t =
      r.transcripts[
        language === "source" ? r.metadata.source_language! : language
      ];
    if (!t) return fail(404, "transcript_not_found");
    if (f === "json") return { transcript_format: f, json: structuredClone(t) };
    const body = t.utterances
      .map(
        (u, i) =>
          `${i + 1}\n${stamp(u.start_s ?? 0, f === "srt" ? "," : ".")} --> ${stamp(u.end_s ?? 0, f === "srt" ? "," : ".")}\n${u.text ?? ""}\n`,
      )
      .join("\n");
    return {
      transcript_format: f,
      [f]: f === "webvtt" ? `WEBVTT\n\n${body}` : body,
    };
  }
}
