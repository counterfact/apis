import type { OpenAISessionConfig_Output } from "./OpenAISessionConfig-Output.js";
export type ClientSecretResponse = {
  value: string;
  expires_at: number;
  session?: OpenAISessionConfig_Output | null;
};
