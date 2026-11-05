import { copyUpload } from "../assets/_.context.js";
import { audioDuration } from "../../support/audio.js";
import type { MultipartFile } from "../../counterfact-types/index.js";
import type { Context as Resources } from "./resource/_.context.js";
import type { DubbingMetadataResponse } from "../../types/v1/components/schemas/DubbingMetadataResponse.js";
import type { DubbingTranscript } from "../../types/v1/components/schemas/DubbingTranscript.js";
import type { DubbingTranscriptsResponseModel } from "../../types/v1/components/schemas/DubbingTranscriptsResponseModel.js";
export type LegacyDub = {
  input?: DubbingInput;
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
export type DubbingInput = { file: MultipartFile; duration: number };
export type CreationDefaults = {
  timestamp: string;
  maxBytes: number;
  maxDuration: number;
  autoLanguage: string;
  sourceText: string;
};
export const creationObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
export function creationLanguage(
  v: unknown,
  optional = true,
): string | undefined {
  if (v == null && optional) return undefined;
  if (typeof v !== "string" || !/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(v))
    return invalid();
  return v.split("-")[0].toLowerCase();
}
export function creationSource(
  v: Record<string, unknown>,
  defaults: CreationDefaults | undefined,
  sources: Map<string, MultipartFile>,
): DubbingInput {
  if (!defaults) throw new Error("Run startup or reset");
  if ((v.file != null) === (v.source_url != null))
    return fail(400, "dubbing_source_required");
  let source = v.file;
  if (v.source_url != null) {
    if (typeof v.source_url !== "string") return invalid();
    source = sources.get(v.source_url);
    if (!source) return fail(400, "unsupported_dubbing_source_url");
  }
  let file: MultipartFile;
  try {
    file = copyUpload(source, defaults.maxBytes, 255);
  } catch {
    return invalid();
  }
  const duration = audioDuration(file.data, file.contentType);
  if (duration == null || duration < 0.1 || duration > defaults.maxDuration)
    return fail(400, "unsupported_dubbing_media");
  return { file, duration };
}
export class Context {
  defaults?: CreationDefaults;
  sources = new Map<string, MultipartFile>();
  resources?: () => Resources;
  nextCreation = 0;
  create(v: unknown) {
    if (!creationObject(v)) return invalid();
    const keys = [
      "file",
      "source_url",
      "name",
      "source_lang",
      "target_lang",
      "num_speakers",
      "watermark",
      "highest_resolution",
      "drop_background_audio",
      "use_profanity_filter",
      "dubbing_studio",
      "disable_voice_cloning",
      "mode",
      "csv_file",
      "foreground_audio_file",
      "background_audio_file",
      "target_accent",
      "start_time",
      "end_time",
      "csv_fps",
    ];
    if (
      Object.keys(v).some((k) => !keys.includes(k)) ||
      (v.name != null && (typeof v.name !== "string" || v.name.length > 500))
    )
      return invalid();
    for (const k of [
      "watermark",
      "highest_resolution",
      "drop_background_audio",
      "use_profanity_filter",
      "disable_voice_cloning",
    ])
      if (v[k] != null && v[k] !== false)
        return fail(400, "unsupported_dubbing_option");
    if (
      (v.mode != null && v.mode !== "automatic") ||
      (v.num_speakers != null &&
        v.num_speakers !== 0 &&
        v.num_speakers !== 1) ||
      [
        "csv_file",
        "foreground_audio_file",
        "background_audio_file",
        "target_accent",
        "start_time",
        "end_time",
        "csv_fps",
      ].some((k) => v[k] != null)
    )
      return fail(400, "unsupported_dubbing_option");
    if (v.dubbing_studio != null && typeof v.dubbing_studio !== "boolean")
      return invalid();
    const sourceLanguage =
        v.source_lang == null || v.source_lang === "auto"
          ? undefined
          : creationLanguage(v.source_lang),
      target = creationLanguage(v.target_lang);
    const input = creationSource(v, this.defaults, this.sources);
    let n = this.nextCreation,
      id: string;
    do {
      id = `sim-dubbing-created-${++n}`;
    } while (this.records.has(id) || this.resources?.().resources.has(id));
    this.records.set(id, {
      input,
      metadata: {
        dubbing_id: id,
        name: (v.name as string | null) ?? input.file.filename,
        status: "dubbing",
        source_language: sourceLanguage ?? null,
        target_languages: target ? [target] : [],
        editable: v.dubbing_studio === true,
        created_at: this.defaults!.timestamp,
        media_metadata: {
          content_type: input.file.contentType,
          duration: input.duration,
        },
        error: null,
      },
      model: "dubbing_v1",
      creator: "personal",
      source: "dubbing_api",
      transcripts: {},
    });
    this.nextCreation = n;
    return { dubbing_id: id, expected_duration_sec: input.duration };
  }
  audio = new Map<string, Record<string, Uint8Array>>();
  getAudio(id: string, language: string) {
    const r = this.record(id);
    if (r.metadata.status !== "dubbed") return fail(425, "dubbing_not_dubbed");
    const bytes =
      this.audio.get(id)?.[
        language === "source" ? r.metadata.source_language! : language
      ];
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
    const record = this.record(id);
    if (record.input && record.metadata.editable)
      this.resources?.().removeCreated(id);
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
