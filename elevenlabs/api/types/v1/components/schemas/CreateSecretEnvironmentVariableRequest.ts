import type { EnvironmentVariableSecretValueRequest } from "./EnvironmentVariableSecretValueRequest.js";
export type CreateSecretEnvironmentVariableRequest = {
  type: "secret";
  /**
   * Unique label for the environment variable.
   */
  label: string;
  /**
   * Environment-specific secret references. Must include 'production' key.
   */
  values: { [key: string]: EnvironmentVariableSecretValueRequest };
};
