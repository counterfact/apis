import type { ConvAISecretLocator } from "./ConvAISecretLocator.js";
import type { ConvAIEnvVarLocator } from "./ConvAIEnvVarLocator.js";
import type { AuthConnectionLocator } from "./AuthConnectionLocator.js";
import type { EnvironmentAuthConnectionLocator } from "./EnvironmentAuthConnectionLocator.js";
import type { ConvAIDynamicVariable } from "./ConvAIDynamicVariable.js";
import type { CustomLLMAPIType } from "./CustomLLMAPIType.js";
export type CustomLLM = {
  /**
   * The URL of the Chat Completions compatible endpoint
   */
  url: string;
  /**
   * The model ID to be used if URL serves multiple models
   */
  model_id?: string | null;
  /**
   * The API key for authentication. Either a workspace secret reference {'secret_id': '...'} or an environment variable reference {'env_var_label': '...'}.
   */
  api_key?: ConvAISecretLocator | ConvAIEnvVarLocator | null;
  /**
   * Optional workspace auth connection for authentication. Only auth connections that produce an Authorization Bearer token are supported; Basic auth, mTLS, custom header, and URL secret auth connections are not supported.
   */
  auth_connection?:
    AuthConnectionLocator | EnvironmentAuthConnectionLocator | null;
  /**
   * Headers that should be included in the request
   */
  request_headers?: {
    [key: string]:
      | string
      | ConvAISecretLocator
      | ConvAIDynamicVariable
      | ConvAIEnvVarLocator;
  };
  /**
   * The API version to use for the request
   */
  api_version?: string | null;
  /**
   * The API type to use (chat_completions, responses or websocket)
   * @default "chat_completions"
   */
  api_type?: CustomLLMAPIType;
};
