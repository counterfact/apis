import type { ConvAIStoredSecretDependencies } from "./ConvAIStoredSecretDependencies.js";
export type ConvAIWorkspaceStoredSecretConfig = {
  type: "stored";
  secret_id: string;
  name: string;
  used_by: ConvAIStoredSecretDependencies;
};
