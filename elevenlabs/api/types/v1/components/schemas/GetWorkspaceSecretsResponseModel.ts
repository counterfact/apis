import type { ConvAIWorkspaceStoredSecretConfig } from "./ConvAIWorkspaceStoredSecretConfig.js";
export type GetWorkspaceSecretsResponseModel = {
  secrets: Array<ConvAIWorkspaceStoredSecretConfig>;
  /**
   * Cursor for fetching the next page of secrets
   */
  next_cursor?: string | null;
};
