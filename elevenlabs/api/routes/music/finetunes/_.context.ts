import type { MusicFinetuneResponseModel as Finetune } from "../../../types/v1/components/schemas/MusicFinetuneResponseModel.js";
export class FinetuneError extends Error {
  override name = "FinetuneError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const fail = (status: number, code: string): never => {
  throw new FinetuneError(status, code);
};
const invalid = (): never => fail(400, "invalid_finetune_request");
const object = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
export class Context {
  records = new Map<string, Finetune>();
  private record(id: string) {
    return this.records.get(id) ?? fail(404, "finetune_not_found");
  }
  get(id: string) {
    return structuredClone(this.record(id));
  }
  list(q: Record<string, unknown> = {}) {
    const size = q.page_size ?? 50,
      cursor = q.cursor ?? "0";
    if (
      typeof size !== "number" ||
      !Number.isInteger(size) ||
      size < 1 ||
      size > 150 ||
      typeof cursor !== "string" ||
      !/^(0|[1-9]\d*)$/.test(cursor) ||
      !Number.isSafeInteger(Number(cursor))
    )
      return invalid();
    for (const [key, allowed] of Object.entries({
      visibility: ["private", "workspace", "public"],
      created_by: ["self", "workspace", "elevenlabs"],
      sort: ["created_at", "name"],
      sort_direction: ["asc", "desc"],
    })) {
      if (
        q[key] != null &&
        (typeof q[key] !== "string" || !allowed.includes(q[key] as string))
      )
        return invalid();
    }
    const rows = [...this.records.values()].filter(
      (r) =>
        (q.visibility == null || r.visibility === q.visibility) &&
        (q.created_by == null || r.created_by === q.created_by),
    );
    const key = q.sort === "name" ? "name" : "created_at",
      direction = q.sort_direction === "asc" ? 1 : -1;
    rows.sort(
      (a, b) =>
        (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * direction ||
        a.id.localeCompare(b.id),
    );
    const offset = Number(cursor),
      has_more = offset + size < rows.length;
    return {
      finetunes: structuredClone(rows.slice(offset, offset + size)),
      next_cursor: has_more ? String(offset + size) : null,
      has_more,
    };
  }
  update(id: string, body: unknown) {
    const current = this.record(id);
    if (current.created_by !== "self") return fail(403, "finetune_read_only");
    if (
      !object(body) ||
      Object.keys(body).some(
        (k) => !["name", "tags", "primary_genre", "visibility"].includes(k),
      ) ||
      (body.name != null &&
        (typeof body.name !== "string" || !body.name.trim())) ||
      (body.tags != null &&
        (!Array.isArray(body.tags) ||
          body.tags.some((t) => typeof t !== "string"))) ||
      (body.primary_genre != null && typeof body.primary_genre !== "string") ||
      (body.visibility != null &&
        !["private", "workspace"].includes(body.visibility as string))
    )
      return invalid();
    const next = structuredClone(current);
    if (body.name != null) next.name = body.name as string;
    if (body.tags != null) next.tags = structuredClone(body.tags as string[]);
    if (Object.hasOwn(body, "primary_genre"))
      next.primary_genre = body.primary_genre as string | null;
    if (body.visibility != null)
      next.visibility = body.visibility as "private" | "workspace";
    this.records.set(id, next);
    return structuredClone(next);
  }
  delete(id: string) {
    const current = this.record(id);
    if (current.created_by !== "self") return fail(403, "finetune_read_only");
    this.records.delete(id);
    return structuredClone(current);
  }
}
