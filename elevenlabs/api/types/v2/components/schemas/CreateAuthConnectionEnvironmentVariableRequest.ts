import type { EnvironmentVariableAuthConnectionValueRequest } from "./EnvironmentVariableAuthConnectionValueRequest.js";
export type CreateAuthConnectionEnvironmentVariableRequest = {
  type: "auth_connection";
  /**
   * Unique label for the environment variable.
   */
  label: string;
  /**
   * Environment-specific auth connection references. Must include 'production' key.
   */
  values: { [key: string]: EnvironmentVariableAuthConnectionValueRequest };
};
