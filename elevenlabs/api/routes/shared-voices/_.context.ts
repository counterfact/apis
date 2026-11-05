import type { LibraryVoiceResponseModel as Voice } from "../../types/v1/components/schemas/LibraryVoiceResponseModel.js";
import type { VoiceAccentResponseModel as Accent } from "../../types/v1/components/schemas/VoiceAccentResponseModel.js";
export type LibraryVoice = {
  value: Voice;
  readerAppEnabled: boolean;
  trending: number;
};
export class LibraryError extends Error {
  override name = "LibraryError";
  constructor(public code: string) {
    super(code);
  }
}
const invalid = (): never => {
  throw new LibraryError("invalid_voice_library_query");
};
const strings = (v: unknown): string[] | undefined => {
  if (v == null) return undefined;
  if (!Array.isArray(v) || v.some((x) => typeof x !== "string"))
    return invalid();
  return v;
};
export class Context {
  canonicalVoices?: () => ReadonlyMap<string, import("../../types/v1/components/schemas/VoiceResponseModel.js").VoiceResponseModel>;
  records = new Map<string, LibraryVoice>();
  accentRecords = new Map<string, { value: Accent; models: string[] }>();
  modelIds = new Set<string>();
  list(q: Record<string, unknown> = {}) {
    const size = q.page_size ?? 30,
      page = q.page ?? 0;
    const scalar = [
      "category",
      "gender",
      "age",
      "accent",
      "language",
      "locale",
      "search",
      "owner_id",
    ];
    if (
      Object.keys(q).some(
        (k) =>
          ![
            ...scalar,
            "page_size",
            "page",
            "use_cases",
            "descriptives",
            "featured",
            "reader_app_enabled",
            "min_notice_period_days",
            "include_custom_rates",
            "include_live_moderated",
            "sort",
          ].includes(k),
      ) ||
      !Number.isInteger(size) ||
      Number(size) < 1 ||
      Number(size) > 100 ||
      !Number.isSafeInteger(page) ||
      Number(page) < 0 ||
      scalar.some((k) => q[k] != null && typeof q[k] !== "string") ||
      [
        "featured",
        "reader_app_enabled",
        "include_custom_rates",
        "include_live_moderated",
      ].some((k) => q[k] != null && typeof q[k] !== "boolean") ||
      (q.min_notice_period_days != null &&
        (!Number.isSafeInteger(q.min_notice_period_days) ||
          Number(q.min_notice_period_days) < 0))
    )
      return invalid();
    const sort = q.sort ?? "created_date";
    if (
      typeof sort !== "string" ||
      ![
        "created_date",
        "usage_character_count_1y",
        "trending",
        "cloned_by_count",
      ].includes(sort)
    )
      return invalid();
    const uses = strings(q.use_cases),
      descriptives = strings(q.descriptives);
    const rows = [...this.records.values()].filter(
      ({ value: v, readerAppEnabled }) =>
        ["category", "gender", "age", "accent", "language", "locale"].every(
          (k) => q[k] == null || v[k as keyof Voice] === q[k],
        ) &&
        (q.owner_id == null || v.public_owner_id === q.owner_id) &&
        (q.search == null ||
          `${v.name}\n${v.description ?? ""}`
            .toLowerCase()
            .includes((q.search as string).toLowerCase())) &&
        (uses === undefined || uses.includes(v.use_case)) &&
        (descriptives === undefined || descriptives.includes(v.descriptive)) &&
        (q.featured !== true || v.featured) &&
        (q.reader_app_enabled !== true || readerAppEnabled) &&
        (q.min_notice_period_days == null ||
          (v.notice_period ?? 0) >= Number(q.min_notice_period_days)) &&
        (q.include_custom_rates !== false ||
          ((v.rate == null || v.rate === 1) && v.fiat_rate == null)) &&
        (q.include_live_moderated !== false || !v.live_moderation_enabled),
    );
    const score = (r: LibraryVoice) =>
      sort === "created_date"
        ? r.value.date_unix
        : sort === "trending"
          ? r.trending
          : r.value[sort as "usage_character_count_1y" | "cloned_by_count"];
    rows.sort(
      (a, b) =>
        score(b) - score(a) || a.value.voice_id.localeCompare(b.value.voice_id),
    );
    const start = Number(page) * Number(size),
      end = start + Number(size),
      values = rows.slice(start, end);
    return {
      voices: structuredClone(values.map((r) => {
        const imported = this.canonicalVoices?.().get(r.value.voice_id);
        return {...r.value, is_added_by_user: imported?.is_owner === false,
          is_bookmarked: imported?.is_owner === false ? imported.is_bookmarked ?? false : false};
      })),
      has_more: end < rows.length,
      total_count: rows.length,
      last_sort_id: values.at(-1)?.value.voice_id ?? null,
    };
  }
  accents(q: Record<string, unknown> = {}) {
    if (
      Object.keys(q).some((k) => !["language", "model_id"].includes(k)) ||
      ["language", "model_id"].some(
        (k) => q[k] != null && typeof q[k] !== "string",
      ) ||
      (q.model_id != null && !this.modelIds.has(q.model_id as string))
    )
      return invalid();
    return {
      accents: structuredClone(
        [...this.accentRecords.values()]
          .filter(
            (r) =>
              (q.language == null || r.value.language === q.language) &&
              (q.model_id == null || r.models.includes(q.model_id as string)),
          )
          .sort((a, b) => a.value.code.localeCompare(b.value.code))
          .map((r) => r.value),
      ),
    };
  }
}
