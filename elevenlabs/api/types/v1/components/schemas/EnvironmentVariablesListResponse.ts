import type { EnvironmentVariableResponse } from "./EnvironmentVariableResponse.js";
export type EnvironmentVariablesListResponse = {
  environment_variables: Array<EnvironmentVariableResponse>;
  next_cursor?: string | null;
  has_more: boolean;
};
