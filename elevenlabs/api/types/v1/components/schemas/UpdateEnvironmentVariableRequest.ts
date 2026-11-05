import type { EnvironmentVariableSecretValueRequest } from "./EnvironmentVariableSecretValueRequest.js";
import type { EnvironmentVariableAuthConnectionValueRequest } from "./EnvironmentVariableAuthConnectionValueRequest.js";
export type UpdateEnvironmentVariableRequest = {
  /**
   * Values to replace. Set to null to remove the value for an environment (except 'production').
   */
  values: {
    [key: string]:
      | string
      | EnvironmentVariableSecretValueRequest
      | EnvironmentVariableAuthConnectionValueRequest
      | null;
  };
};
