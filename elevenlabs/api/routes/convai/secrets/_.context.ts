import type { ConvAIStoredSecretDependencies as Dependencies } from "../../../types/v1/components/schemas/ConvAIStoredSecretDependencies.js";
import type { ConvAIWorkspaceStoredSecretConfig as Secret } from "../../../types/v1/components/schemas/ConvAIWorkspaceStoredSecretConfig.js";
import type { PostWorkspaceSecretResponseModel as Summary } from "../../../types/v1/components/schemas/PostWorkspaceSecretResponseModel.js";
import type { GetWorkspaceSecretsResponseModel as Page } from "../../../types/v1/components/schemas/GetWorkspaceSecretsResponseModel.js";
import type { GetSecretDependenciesResponseModel as DependencyPage } from "../../../types/v1/components/schemas/GetSecretDependenciesResponseModel.js";
import type { HTTP_GET_Query as Query } from "../../../types/v1/paths/convai/secrets.types.js";
type Error = "invalid_secret" | "invalid_secret_query" | "secret_not_found";
type Result<T> = { value: T; error?: never } | { error: Error; value?: never };
const emptyDependencies = (): Dependencies => ({ tools: [], agents: [], phone_numbers: [], others: [] });
const validSize = (size: number, minimum = 1) => Number.isInteger(size) && size >= minimum && size <= 100;
const validCursor = (cursor: string) => /^(0|[1-9][0-9]*)$/.test(cursor) && Number.isSafeInteger(Number(cursor));
function validInput(input: unknown, type: string): input is { name: string; value: string } {
  return input !== null && typeof input === "object" && !Array.isArray(input) && Object.keys(input).length === 3 && Object.keys(input).every(key => ["type", "name", "value"].includes(key)) && "type" in input && input.type === type && "name" in input && typeof input.name === "string" && !!input.name.trim() && "value" in input && typeof input.value === "string" && input.value.length > 0;
}
export class Context {
  secrets = new Map<string, { secret_id: string; name: string; value: string }>();
  dependencies = new Map<string, Dependencies>();
  nextSecretNumber = 0;
  referencedByEnvironmentVariable: (id: string) => boolean = () => false;

  private summary(item: { secret_id: string; name: string }): Summary { return { type: "stored", secret_id: item.secret_id, name: item.name }; }
  getSecret(id: string, limit?: number): Secret | undefined {
    const item = this.secrets.get(id);
    if (!item) return undefined;
    const used_by = structuredClone(this.dependencies.get(id) ?? emptyDependencies());
    for (const type of ["tools", "agents", "phone_numbers"] as const) {
      const rows = used_by[type] ?? [];
      const hasMore = limit !== undefined && rows.length > limit;
      Object.assign(used_by, { [type]: rows.slice(0, limit), [`${type}_has_more`]: hasMore });
    }
    return { ...this.summary(item), used_by };
  }
  listSecrets(query: Query = {}): Result<Page> {
    const cursor = query.cursor ?? "0";
    if ((query.page_size != null && !validSize(query.page_size)) || (query.dependency_limit != null && !validSize(query.dependency_limit)) || !validCursor(cursor) || (query.search != null && typeof query.search !== "string")) return { error: "invalid_secret_query" };
    const rows = [...this.secrets.values()].filter(item => query.search == null || item.name.startsWith(query.search));
    const size = query.page_size ?? rows.length;
    const offset = Number(cursor);
    return { value: { secrets: rows.slice(offset, offset + size).map(item => this.getSecret(item.secret_id, query.dependency_limit ?? undefined)!), next_cursor: offset + size < rows.length ? String(offset + size) : null } };
  }
  createSecret(input: unknown): Result<Summary> {
    if (!validInput(input, "new")) return { error: "invalid_secret" };
    let secret_id: string;
    do { secret_id = `sim-secret-created-${++this.nextSecretNumber}`; } while (this.secrets.has(secret_id));
    const item = { secret_id, name: input.name, value: input.value };
    this.secrets.set(secret_id, item);
    return { value: this.summary(item) };
  }
  updateSecret(id: string, input: unknown): Result<Summary> {
    if (!this.secrets.has(id)) return { error: "secret_not_found" };
    if (!validInput(input, "update")) return { error: "invalid_secret" };
    const item = { secret_id: id, name: input.name, value: input.value };
    this.secrets.set(id, item);
    return { value: this.summary(item) };
  }
  getDependencies(id: string, type: string, query: { page_size?: number; cursor?: string | null } = {}): Result<DependencyPage> {
    if (!this.secrets.has(id)) return { error: "secret_not_found" };
    const size = query.page_size ?? 100;
    const cursor = query.cursor ?? "0";
    if (!["tools", "agents", "phone_numbers"].includes(type) || !validSize(size) || !validCursor(cursor)) return { error: "invalid_secret_query" };
    const rows = (this.dependencies.get(id) ?? emptyDependencies())[type as "tools" | "agents" | "phone_numbers"] ?? [];
    const offset = Number(cursor);
    return { value: { dependencies: structuredClone(rows.slice(offset, offset + size)) as DependencyPage["dependencies"], next_cursor: offset + size < rows.length ? String(offset + size) : null } };
  }
  deleteSecret(id: string) {
    if (!this.secrets.has(id)) return "secret_not_found";
    const dependencies = this.dependencies.get(id);
    if ((dependencies && Object.values(dependencies).some(value => Array.isArray(value) && value.length > 0)) || this.referencedByEnvironmentVariable(id)) return "secret_in_use";
    this.secrets.delete(id);
    this.dependencies.delete(id);
    return undefined;
  }
}
