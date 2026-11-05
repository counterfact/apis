import type { EnvironmentResponse as Environment } from "../../../types/v1/components/schemas/EnvironmentResponse.js";
import type { EnvironmentVariableResponse as Variable } from "../../../types/v1/components/schemas/EnvironmentVariableResponse.js";
type Result = { value: Environment; error?: never } | { error: "invalid_environment" | "environment_conflict"; value?: never };

export class Context {
  environments = new Map<string, Environment>();
  nextEnvironmentNumber = 0;
  creationTimeUnix = 0;
  ownerUserId = "";
  variableStore: () => Map<string, Variable> = () => new Map();

  listEnvironments() {
    const production = this.environments.get("production");
    const others = [...this.environments.values()].filter(item => item.name !== "production");
    return { environments: structuredClone(production ? [production, ...others] : others) };
  }

  createEnvironment(input: unknown): Result {
    if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).some(key => key !== "name") || !("name" in input) || typeof input.name !== "string" || !input.name.trim()) return { error: "invalid_environment" };
    if (this.environments.has(input.name)) return { error: "environment_conflict" };
    const item: Environment = { name: input.name, created_by_user_id: this.ownerUserId, updated_at_unix_secs: this.creationTimeUnix + ++this.nextEnvironmentNumber };
    this.environments.set(item.name, item);
    return { value: structuredClone(item) };
  }

  deleteEnvironment(name: string) {
    if (name === "production") return "protected_environment";
    if (!this.environments.has(name)) return "environment_not_found";
    for (const variable of this.variableStore().values()) delete variable.values[name];
    this.environments.delete(name);
    return undefined;
  }
}
