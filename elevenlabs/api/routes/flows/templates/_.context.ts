import type { ContentSchema } from "../../../types/v1/components/schemas/ContentSchema.js";
import type { TemplateRunCreateRequest } from "../../../types/v1/components/schemas/TemplateRunCreateRequest.js";
import type { TemplateSummary } from "../../../types/v1/components/schemas/TemplateSummary.js";
import type { TemplateVersion } from "../../../types/v1/components/schemas/TemplateVersion.js";
import type { TemplateRunResponse } from "../../../types/v1/components/schemas/TemplateRunResponse.js";

export type StoredTemplate = {
  id: string;
  name: string;
  description: string | null;
  updatedAt: number;
  listable: boolean;
  versions: { value: TemplateVersion; runnable: boolean; completionContent?: Record<string, string> }[];
};
export type StoredRun = {
  value: TemplateRunResponse;
  createdAt: number;
  execution?: {
    request: TemplateRunCreateRequest;
    version: TemplateVersion;
    completionContent: Record<string, string>;
  };
};
const invalidRun = (code = "invalid_template_inputs"): never => {
  throw new TemplateError(400, code);
};
const object = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// Bind the actual selected version's schema, rather than only the wire union.
const accepts = (schema: ContentSchema, value: unknown): boolean => {
  switch (schema.type) {
    case "string": return typeof value === "string" &&
      (schema.enum == null || schema.enum.includes(value));
    case "number": return typeof value === "number" && Number.isFinite(value) &&
      (schema.enum == null || schema.enum.includes(value));
    case "integer": return typeof value === "number" && Number.isInteger(value);
    case "boolean": return typeof value === "boolean";
    case "array": return Array.isArray(value) && value.every(item => accepts(schema.items, item));
    default: return false; // Reference/media resolution and object binding are unsupported locally.
  }
};
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
  nextRunId = 1;
  runClock = 0;
  createRun(templateId: string, input: unknown): TemplateRunResponse {
    const template = this.template(templateId);
    if (!object(input) || !object(input.inputs) ||
      (input.version_id != null && typeof input.version_id !== "string")) return invalidRun();
    if (input.webhook != null) return invalidRun("unsupported_template_webhook");
    const requested = input.version_id ?? "latest";
    const selected = requested === "latest"
      ? template.versions.find(version => version.value.is_latest)
      : template.versions.find(version => version.value.version_id === requested);
    if (!selected) throw new TemplateError(404, "template_version_not_found");
    if (!selected.runnable) return invalidRun("template_version_unavailable");
    const version = selected.value;
    const inputs = input.inputs;
    if (Object.keys(inputs).length !== version.inputs.length ||
      !version.inputs.every(port => Object.hasOwn(inputs, port.id) && accepts(port.content_schema, inputs[port.id])))
      return invalidRun();
    // Only scenario-backed text output execution is provided by this local subset.
    const completion = selected.completionContent;
    if (!completion || version.outputs.some(port => port.content_schema.type !== "string" ||
      !Object.hasOwn(completion, port.id) || !accepts(port.content_schema, completion[port.id])))
      return invalidRun("unsupported_template_outputs");
    const id = `sim-template-created-${this.nextRunId}`;
    const outputs: TemplateRunResponse["outputs"] = Object.fromEntries(version.outputs.map(port => [port.id, {
      id: `${id}-${port.id}`, type: "string" as const, status: "pending" as const,
    }]));
    const value: TemplateRunResponse = { id, template_id: templateId,
      version_id: version.version_id, status: version.outputs.length ? "pending" : "completed", outputs };
    this.records.set(id, { value, createdAt: this.runClock,
      execution: structuredClone({ request: input as TemplateRunCreateRequest, version, completionContent: completion }),
    });
    this.nextRunId++;
    this.runClock++;
    return structuredClone(value);
  }
  completeRun(runId: string, content: Record<string, string>) {
    const record = this.records.get(runId);
    if (!record) throw new TemplateError(404, "template_run_not_found");
    if (["completed", "failed"].includes(record.value.status)) return;
    const version = record.execution?.version;
    if (!version || Object.keys(content).length !== version.outputs.length ||
      !version.outputs.every(port => Object.hasOwn(content, port.id) && accepts(port.content_schema, content[port.id])))
      return invalidRun("invalid_template_outputs");
    const outputs: TemplateRunResponse["outputs"] = Object.fromEntries(version.outputs.map(port => [port.id, {
      id: record.value.outputs[port.id].id, type: "string" as const,
      status: "completed" as const, content: content[port.id],
    }]));
    record.value = { ...record.value, status: "completed", outputs };
  }
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
