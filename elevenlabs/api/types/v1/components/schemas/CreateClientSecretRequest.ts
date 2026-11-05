import type { OpenAISessionConfig_Input } from "./OpenAISessionConfig-Input.js";
import type { ExpiresAfter } from "./ExpiresAfter.js";
export type CreateClientSecretRequest = {
  session?: OpenAISessionConfig_Input | null;
  expires_after?: ExpiresAfter | null;
};
