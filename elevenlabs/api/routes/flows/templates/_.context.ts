import type { TemplateSummary } from "../../../types/v1/components/schemas/TemplateSummary.js";
import type { TemplateVersion } from "../../../types/v1/components/schemas/TemplateVersion.js";
import type { TemplateRunResponse } from "../../../types/v1/components/schemas/TemplateRunResponse.js";

export type StoredTemplate = {
  id: string;
  name: string;
  description: string | null;
  updatedAt: number;
  listable: boolean;
  versions: { value: TemplateVersion; runnable: boolean }[];
};
export type StoredRun = { value: TemplateRunResponse; createdAt: number };
export class TemplateError extends Error {
  override name = "TemplateError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const invalid = (): never => {
  throw new TemplateError(400, "invalid_template_query");
};
const size = (value: unknown, fallback: number, maximum: number) => {
  const result = value ?? fallback;
  if (
    typeof result !== "number" ||
    !Number.isInteger(result) ||
    result < 1 ||
    result > maximum
  )
    return invalid();
  return result;
};
const offset = (value: unknown) => {
  const cursor = value ?? "0";
  if (
    typeof cursor !== "string" ||
    !/^(0|[1-9]\d*)$/.test(cursor) ||
    !Number.isSafeInteger(Number(cursor))
  )
    return invalid();
  return Number(cursor);
};
export class Context {
  templates = new Map<string, StoredTemplate>();
  records = new Map<string, StoredRun>();
  private template(id: string) {
    const result = this.templates.get(id);
    if (!result) throw new TemplateError(404, "template_not_found");
    return result;
  }
  private summary(record: StoredTemplate, limit: number): TemplateSummary {
    const versions = record.versions
      .filter((v) => v.runnable)
      .map((v) => v.value)
      .sort(
        (a, b) =>
          b.published_at_unix - a.published_at_unix ||
          a.version_id.localeCompare(b.version_id),
      );
    return structuredClone({
      id: record.id,
      name: record.name,
      description: record.description,
      versions: versions.slice(0, limit),
      has_more_versions: versions.length > limit,
    });
  }
  get(id: string, query: Record<string, unknown> = {}) {
    const record = this.template(id);
    return this.summary(record, size(query.versions_per_template, 10, 10));
  }
  list(query: Record<string, unknown> = {}) {
    const limit = size(query.page_size, 10, 25),
      versions = size(query.versions_per_template, 3, 10),
      start = offset(query.cursor);
    if (
      query.search != null &&
      (typeof query.search !== "string" || query.search.length > 100)
    )
      return invalid();
    const search =
      typeof query.search === "string" ? query.search.toLowerCase() : "";
    const rows = [...this.templates.values()]
      .filter(
        (t) =>
          t.listable &&
          `${t.name}\n${t.description ?? ""}`.toLowerCase().includes(search),
      )
      .sort((a, b) => b.updatedAt - a.updatedAt || a.id.localeCompare(b.id));
    const end = start + limit,
      has_more = end < rows.length;
    return {
      templates: rows.slice(start, end).map((t) => this.summary(t, versions)),
      has_more,
      next_cursor: has_more ? String(end) : null,
    };
  }
  run(templateId: string, runId: string) {
    this.template(templateId);
    const record = this.records.get(runId);
    if (!record || record.value.template_id !== templateId)
      throw new TemplateError(404, "template_run_not_found");
    return structuredClone(record.value);
  }
  runs(templateId: string, query: Record<string, unknown> = {}) {
    this.template(templateId);
    const limit = size(query.page_size, 30, 100),
      start = offset(query.cursor);
    if (query.version_id != null && typeof query.version_id !== "string")
      return invalid();
    const rows = [...this.records.values()]
      .filter(
        (r) =>
          r.value.template_id === templateId &&
          (query.version_id == null || r.value.version_id === query.version_id),
      )
      .sort(
        (a, b) =>
          b.createdAt - a.createdAt || a.value.id.localeCompare(b.value.id),
      );
    const end = start + limit,
      has_more = end < rows.length;
    return {
      runs: structuredClone(rows.slice(start, end).map((r) => r.value)),
      has_more,
      next_cursor: has_more ? String(end) : null,
    };
  }
}
