import type { EnvironmentVariableSecretValue } from "./EnvironmentVariableSecretValue.js";
import type { EnvironmentVariableAuthConnectionValue } from "./EnvironmentVariableAuthConnectionValue.js";
export type EnvironmentVariableResponse = {
  label: string;
  created_at_unix_secs: number;
  updated_at_unix_secs: number;
  created_by_user_id?: string | null;
  type: "string" | "secret" | "auth_connection";
  id: string;
  workspace_id: string;
  values:
    | { [key: string]: string }
    | { [key: string]: EnvironmentVariableSecretValue }
    | { [key: string]: EnvironmentVariableAuthConnectionValue };
};
