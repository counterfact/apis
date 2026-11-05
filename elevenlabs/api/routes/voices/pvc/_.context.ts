import type { Context as Root } from "../../_.context.js";
import { defaultSettings } from "../../_.context.js";
import type { VoiceResponseModel as Voice } from "../../../types/v1/components/schemas/VoiceResponseModel.js";
export class PvcError extends Error {
  override name = "PvcError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const fail = (status: number, code: string): never => {
  throw new PvcError(status, code);
};
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
export class Context {
  root?: () => Root;
  nextVoice = 0;
  createdAt?: number;
  private owner() {
    if (!this.root || this.createdAt === undefined)
      throw new Error("Run startup or reset");
    return this.root();
  }
  private validate(input: unknown, create: boolean) {
    if (
      !object(input) ||
      Object.keys(input).some(
        (key) => !["name", "language", "description", "labels"].includes(key),
      ) ||
      ["name", "language"].some(
        (key) =>
          (create || input[key] !== undefined) &&
          (typeof input[key] !== "string" || !(input[key] as string).trim()),
      ) ||
      (input.description != null && typeof input.description !== "string") ||
      (input.labels != null &&
        (!object(input.labels) ||
          Object.values(input.labels).some(
            (value) => typeof value !== "string",
          )))
    )
      return fail(400, "invalid_pvc_metadata");
    return input;
  }
  private labels(
    body: Record<string, unknown>,
    language: string,
    previous: Record<string, string> = {},
  ) {
    const labels = structuredClone(
      (body.labels ?? previous) as Record<string, string>,
    );
    if (labels.language !== undefined && labels.language !== language) {
      // An explicit label cannot contradict the separately supplied sample language.
      if (body.labels != null) return fail(400, "conflicting_voice_language");
    }
    return { ...labels, language };
  }
  create(input: unknown) {
    const root = this.owner(),
      body = this.validate(input, true);
    const language = body.language as string,
      labels = this.labels(body, language);
    let id: string;
    do {
      id = `sim-pvc-created-${++this.nextVoice}`;
    } while (root.voices.has(id));
    const value: Voice = {
      voice_id: id,
      name: body.name as string,
      category: "professional",
      labels,
      description: (body.description as string | null | undefined) ?? null,
      samples: [],
      available_for_tiers: [],
      high_quality_base_model_ids: [],
      settings: defaultSettings(),
      is_owner: true,
      is_legacy: false,
      created_at_unix: this.createdAt! + this.nextVoice,
      fine_tuning: {
        is_allowed_to_fine_tune: false,
        state: {},
        verification_failures: [],
        verification_attempts_count: 0,
        manual_verification_requested: false,
        language,
      },
    };
    root.voices.set(id, value);
    return { voice_id: id };
  }
  update(id: string, input: unknown) {
    const root = this.owner(),
      previous = root.voices.get(id);
    if (!previous) return fail(404, "voice_not_found");
    if (previous.category !== "professional")
      return fail(409, "voice_not_professional");
    if (previous.is_owner !== true) return fail(403, "voice_not_owned");
    const body = this.validate(input, false);
    const language =
      (body.language as string | undefined) ??
      previous.fine_tuning?.language ??
      previous.labels.language;
    if (!language) return fail(409, "voice_language_unavailable");
    const next = structuredClone(previous);
    next.labels = this.labels(body, language, previous.labels);
    if (body.name !== undefined) next.name = body.name as string;
    if (Object.hasOwn(body, "description"))
      next.description = body.description as string | null;
    if (next.fine_tuning) next.fine_tuning.language = language;
    root.voices.set(id, next);
    return { voice_id: id };
  }
}
