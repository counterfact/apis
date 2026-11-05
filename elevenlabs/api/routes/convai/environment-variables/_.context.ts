import type { EnvironmentVariableResponse as Variable } from "../../../types/v1/components/schemas/EnvironmentVariableResponse.js";
import type { EnvironmentVariablesListResponse as Page } from "../../../types/v1/components/schemas/EnvironmentVariablesListResponse.js";
import type { HTTP_GET_Query as Query } from "../../../types/v1/paths/convai/environment-variables.types.js";
type ErrorCode = "invalid_environment_variable" | "invalid_environment_variable_query" | "environment_variable_not_found" | "environment_variable_label_conflict";
type Result<T> = { value: T; error?: never } | { error: ErrorCode; value?: never };
const object = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const types = ["string", "secret", "auth_connection"];
function validValue(type: string, value: unknown) {
  if (type === "string") return typeof value === "string" && value.length > 0;
  const field = type === "secret" ? "secret_id" : "auth_connection_id";
  return object(value) && Object.keys(value).length === 1 && typeof value[field] === "string";
}
export class Context {
  variables = new Map<string, Variable>();
  nextVariableNumber = 0;
  creationTimeUnix = 0;
  updateTimeUnix = 0;
  workspaceId = "";
  ownerUserId = "";

  listVariables(query: Query = {}): Result<Page> {
    const size = query.page_size ?? 100;
    const cursor = query.cursor ?? "0";
    if (!Number.isInteger(size) || size < 1 || size > 100 || !/^(0|[1-9][0-9]*)$/.test(cursor) || !Number.isSafeInteger(Number(cursor)) || (query.type != null && !types.includes(query.type))) return { error: "invalid_environment_variable_query" };
    const rows = [...this.variables.values()].filter(item => (query.label == null || item.label === query.label) && (query.type == null || item.type === query.type) && (query.environment == null || Object.hasOwn(item.values, query.environment)));
    const offset = Number(cursor);
    const values = structuredClone(rows.slice(offset, offset + size));
    if (query.environment != null) for (const item of values) item.values = { [query.environment]: item.values[query.environment] } as Variable["values"];
    const has_more = offset + size < rows.length;
    return { value: { environment_variables: values, has_more, next_cursor: has_more ? String(offset + size) : null } };
  }
  getVariable(id: string) { const item = this.variables.get(id); return item ? structuredClone(item) : undefined; }
  createVariable(input: unknown): Result<Variable> {
    if (!object(input) || Object.keys(input).some(key => !["type", "label", "values"].includes(key)) || typeof input.type !== "string" || !types.includes(input.type) || typeof input.label !== "string" || !object(input.values) || !Object.hasOwn(input.values, "production") || !Object.values(input.values).every(value => validValue(input.type as string, value))) return { error: "invalid_environment_variable" };
    if ([...this.variables.values()].some(item => item.label === input.label)) return { error: "environment_variable_label_conflict" };
    let id: string;
    do { id = `sim-environment-variable-created-${++this.nextVariableNumber}`; } while (this.variables.has(id));
    const item: Variable = { id, label: input.label, type: input.type as Variable["type"], values: structuredClone(input.values) as Variable["values"], workspace_id: this.workspaceId, created_by_user_id: this.ownerUserId, created_at_unix_secs: this.creationTimeUnix + this.nextVariableNumber, updated_at_unix_secs: this.creationTimeUnix + this.nextVariableNumber };
    this.variables.set(id, item);
    return { value: structuredClone(item) };
  }
  updateVariable(id: string, input: unknown): Result<Variable> {
    const existing = this.variables.get(id);
    if (!existing) return { error: "environment_variable_not_found" };
    if (!object(input) || Object.keys(input).some(key => key !== "values") || !object(input.values) || !Object.entries(input.values).every(([environment, value]) => value === null ? environment !== "production" : validValue(existing.type, value))) return { error: "invalid_environment_variable" };
    const item = structuredClone(existing);
    for (const [environment, value] of Object.entries(input.values)) {
      if (value === null) delete item.values[environment];
      else Object.defineProperty(item.values, environment, { value: structuredClone(value), enumerable: true, writable: true, configurable: true });
    }
    if (Object.keys(input.values).length) item.updated_at_unix_secs = Math.max(this.updateTimeUnix, item.updated_at_unix_secs + 1);
    this.variables.set(id, item);
    return { value: structuredClone(item) };
  }
  deleteVariable(id: string) { return this.variables.delete(id); }
}
