import type { Context as Root } from "../_.context.js";
type RequestRecord = { text: string; modelId: string; duration: number; cost: number; createdAt: number; audio: Uint8Array };
const object = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);
export class SoundError extends Error {
  override name = "SoundError";
  constructor(public status: number, public code: string) { super(code); }
}
const fail = (status: number, code: string): never => { throw new SoundError(status, code); };
export class Context {
  requests = new Map<string, RequestRecord>();
  audio = new Uint8Array();
  nextRequest = 0;
  root?: () => Root;
  defaults?: { time: number; duration: number; model: string; format: string; maxCharacters: number };
  generate(input: unknown, query: Record<string, unknown> = {}) {
    if (!object(input) || Object.keys(input).some(k => !["text", "loop", "duration_seconds", "prompt_influence", "model_id"].includes(k)) || typeof input.text !== "string" || !input.text.trim())
      return fail(400, "invalid_sound_request");
    const defaults = this.defaults;
    if (!defaults || !this.root || !this.audio.length) throw new Error("Run startup or reset");
    const cost = Array.from(input.text).length;
    if (cost > defaults.maxCharacters || input.loop != null && input.loop !== false || input.duration_seconds != null && input.duration_seconds !== defaults.duration || input.prompt_influence != null && input.prompt_influence !== 0.3)
      return fail(400, "unsupported_sound_option");
    if (Object.keys(query).some(k => !["output_format", "enable_logging"].includes(k)) || query.enable_logging != null && typeof query.enable_logging !== "boolean")
      return fail(400, "invalid_sound_request");
    if (query.output_format != null && query.output_format !== defaults.format) return fail(400, "unsupported_sound_output_format");
    const modelId = input.model_id ?? defaults.model;
    if (modelId !== defaults.model) return fail(400, "unsupported_sound_model");
    const root = this.root();
    const model = root.models.get(modelId) ?? fail(404, "model_not_found");
    if (cost > model.maximum_text_length_per_request) return fail(400, "invalid_sound_request");
    const account = root.account;
    if (!account) throw new Error("Run startup or reset");
    const usage = account.subscription.character_count + cost;
    if (usage > account.subscription.character_limit) return fail(429, "character_quota_exceeded");
    let n = this.nextRequest, requestId: string;
    do { requestId = `sim-sound-request-${++n}`; } while (this.requests.has(requestId));
    const record: RequestRecord = { text: input.text, modelId, duration: defaults.duration, cost, createdAt: defaults.time + n, audio: new Uint8Array(this.audio) };
    const result = { requestId, cost, audio: new Uint8Array(this.audio) };
    if (query.enable_logging !== false) this.requests.set(requestId, record);
    account.subscription.character_count = usage;
    this.nextRequest = n;
    return result;
  }
}
