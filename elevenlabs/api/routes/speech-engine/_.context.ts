import type { SpeechEngineResponse as Engine } from "../../types/v1/components/schemas/SpeechEngineResponse.js";
import type { EffectsSpec_Output as Effects } from "../../types/v1/components/schemas/EffectsSpec-Output.js";
type Obj = Record<string, unknown>;
const object = (v: unknown): v is Obj =>
  !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
const fields = [
  "name",
  "speech_engine",
  "asr",
  "tts",
  "turn",
  "vad",
  "conversation",
  "privacy",
  "call_limits",
  "auth",
  "language",
  "cascade_timeout_seconds",
  "tags",
  "overrides",
];
const nested = [
  "speech_engine",
  "asr",
  "tts",
  "turn",
  "vad",
  "conversation",
  "privacy",
  "call_limits",
  "auth",
  "overrides",
];
export class SpeechEngineError extends Error {
  override name = "SpeechEngineError";
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const invalid = (): never => {
  throw new SpeechEngineError(
    400,
    "invalid_speech_engine_request",
    "Invalid local speech engine request",
  );
};
function input(v: unknown, allowed = fields) {
  if (!object(v) || Object.keys(v).some((k) => !allowed.includes(k)))
    return invalid();
  return v;
}
function merge(base: Obj, patch: Obj): Obj {
  const result = structuredClone(base);
  for (const [k, v] of Object.entries(patch))
    result[k] = object(v)
      ? merge(object(result[k]) ? result[k] : {}, v)
      : structuredClone(v);
  return result;
}
export class Context {
  engines = new Map<string, Engine>();
  nextId = 1;
  nextMutation = 0;
  defaults?: {
    configuration: Omit<Engine, "speech_engine_id" | "metadata">;
    time: number;
    effects: Effects;
  };
  private settings() {
    if (!this.defaults)
      throw new Error("Run speech engine startup or reset first");
    return this.defaults;
  }
  private stored(id: string) {
    const e = this.engines.get(id);
    if (!e)
      throw new SpeechEngineError(
        404,
        "speech_engine_not_found",
        "Speech engine not found",
      );
    return e;
  }
  get(id: string) {
    return structuredClone(this.stored(id));
  }
  private validate(b: Obj, create = false) {
    if (
      (b.name != null && !text(b.name)) ||
      (b.language != null && !text(b.language)) ||
      (b.tags != null &&
        (!Array.isArray(b.tags) ||
          b.tags.some((v) => typeof v !== "string"))) ||
      (b.cascade_timeout_seconds != null &&
        (typeof b.cascade_timeout_seconds !== "number" ||
          !Number.isFinite(b.cascade_timeout_seconds) ||
          b.cascade_timeout_seconds < 2 ||
          b.cascade_timeout_seconds > 15))
    )
      return invalid();
    for (const k of nested) if (b[k] != null && !object(b[k])) return invalid();
    if (create && !object(b.speech_engine)) return invalid();
    if (b.speech_engine != null) {
      const config = b.speech_engine as Obj;
      if (!text(config.ws_url)) return invalid();
      try {
        const u = new URL(config.ws_url);
        if (
          !["ws:", "wss:"].includes(u.protocol) ||
          !u.hostname ||
          u.username ||
          u.password
        )
          return invalid();
      } catch {
        return invalid();
      }
      if (config.request_headers != null && !object(config.request_headers))
        return invalid();
    }
  }
  private normalize(candidate: Engine) {
    if (object(candidate.tts.audio_effects))
      candidate.tts.audio_effects = merge(
        this.settings().effects as unknown as Obj,
        candidate.tts.audio_effects,
      ) as Effects;
    return candidate;
  }
  private allocate(
    configuration: Omit<Engine, "speech_engine_id" | "metadata">,
  ) {
    let id: string;
    do {
      id = `sim-speech-engine-created-${this.nextId++}`;
    } while (this.engines.has(id));
    const time = this.settings().time + ++this.nextMutation;
    const engine = this.normalize({
      ...structuredClone(configuration),
      speech_engine_id: id,
      metadata: {
        created_at_unix_secs: time,
        updated_at_unix_secs: time,
        created_from: "api",
        last_updated_from: "api",
      },
    });
    this.engines.set(id, engine);
    return this.get(id);
  }
  create(value: unknown) {
    const b = input(value);
    this.validate(b, true);
    if (Object.values(b).some((v) => v === null)) return invalid();
    return this.allocate(
      merge(this.settings().configuration as unknown as Obj, b) as Omit<
        Engine,
        "speech_engine_id" | "metadata"
      >,
    );
  }
  patch(id: string, value: unknown) {
    const old = this.stored(id),
      b = input(value);
    this.validate(b);
    const changes = Object.fromEntries(
      Object.entries(b).filter(([, v]) => v != null),
    );
    const candidate = this.normalize(
      merge(old as unknown as Obj, changes) as Engine,
    );
    if (JSON.stringify(candidate) !== JSON.stringify(old)) {
      candidate.metadata.updated_at_unix_secs =
        this.settings().time + ++this.nextMutation;
      candidate.metadata.last_updated_from = "api";
      this.engines.set(id, candidate);
    }
    return this.get(id);
  }
  duplicate(id: string, value: unknown) {
    const source = this.stored(id),
      b = value == null ? {} : input(value, ["name"]);
    if (b.name != null && !text(b.name)) return invalid();
    const { speech_engine_id: _, metadata: __, ...config } = source;
    return this.allocate({
      ...structuredClone(config),
      name: (b.name as string) ?? source.name,
    });
  }
  delete(id: string) {
    this.stored(id);
    this.engines.delete(id);
  }
  list(query: Record<string, unknown> = {}) {
    const q = input(query, [
        "page_size",
        "search",
        "sort_direction",
        "sort_by",
        "cursor",
      ]),
      size = q.page_size ?? 30,
      cursor = q.cursor ?? "0";
    if (
      typeof size !== "number" ||
      !Number.isSafeInteger(size) ||
      size < 1 ||
      size > 100 ||
      typeof cursor !== "string" ||
      !/^(0|[1-9][0-9]*)$/.test(cursor) ||
      !Number.isSafeInteger(Number(cursor)) ||
      (q.search != null && typeof q.search !== "string") ||
      (q.sort_by != null &&
        !["name", "created_at", "updated_at"].includes(q.sort_by as string)) ||
      (q.sort_direction != null &&
        !["asc", "desc"].includes(q.sort_direction as string))
    )
      return invalid();
    const rows = [...this.engines.values()].filter(
      (e) =>
        q.search == null ||
        e.name.toLowerCase().includes((q.search as string).toLowerCase()),
    );
    const direction = q.sort_direction === "asc" ? 1 : -1;
    rows.sort(
      (a, b) =>
        direction *
          (q.sort_by === "name"
            ? a.name.localeCompare(b.name)
            : q.sort_by === "updated_at"
              ? a.metadata.updated_at_unix_secs -
                b.metadata.updated_at_unix_secs
              : a.metadata.created_at_unix_secs -
                b.metadata.created_at_unix_secs) ||
        a.speech_engine_id.localeCompare(b.speech_engine_id),
    );
    const offset = Number(cursor),
      has_more = offset + size < rows.length;
    return {
      speech_engines: rows
        .slice(offset, offset + size)
        .map((e) => ({
          speech_engine_id: e.speech_engine_id,
          name: e.name,
          voice_id: e.tts.voice_id ?? "",
          tags: structuredClone(e.tags),
          created_at_unix_secs: e.metadata.created_at_unix_secs,
          updated_at_unix_secs: e.metadata.updated_at_unix_secs,
          access_info: structuredClone(
            e.access_info ?? this.settings().configuration.access_info!,
          ),
        })),
      has_more,
      next_cursor: has_more ? String(offset + size) : null,
    };
  }
}
