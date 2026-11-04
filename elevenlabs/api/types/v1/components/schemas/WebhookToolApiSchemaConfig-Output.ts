import type { ConvAISecretLocator } from "./ConvAISecretLocator.js";
import type { ConvAIDynamicVariable } from "./ConvAIDynamicVariable.js";
import type { ConvAIEnvVarLocator } from "./ConvAIEnvVarLocator.js";
import type { LiteralJsonSchemaProperty } from "./LiteralJsonSchemaProperty.js";
import type { QueryParamsJsonSchema_Output } from "./QueryParamsJsonSchema-Output.js";
import type { ObjectJsonSchemaProperty_Output } from "./ObjectJsonSchemaProperty-Output.js";
import type { ResponseFilter } from "./ResponseFilter.js";
import type { AuthConnectionLocator } from "./AuthConnectionLocator.js";
import type { EnvironmentAuthConnectionLocator } from "./EnvironmentAuthConnectionLocator.js";
/**
 * @example {"method":"GET","path_params_schema":{"agent_id":{"type":"string"}},"query_params_schema":{"param1":{"type":"string"}},"request_body_schema":{"param1":{"type":"string"}},"request_headers":{"Authorization":"Bearer {api_key}"},"url":"https://example.com/agents/{agent_id}"}
 */
export type WebhookToolApiSchemaConfig_Output = {
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
   * The URL that the webhook will be sent to. May include path parameters, e.g. https://example.com/agents/{agent_id}
   */
  url: string;
  /**
   * The HTTP method to use for the webhook
   * @default "GET"
   */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /**
   * Schema for path parameters, if any. The keys should match the placeholders in the URL.
   */
  path_params_schema?: { [key: string]: LiteralJsonSchemaProperty };
  /**
   * Schema for any query params, if any. These will be added to end of the URL as query params. Note: properties in a query param must all be literal types
   */
  query_params_schema?: QueryParamsJsonSchema_Output | null;
  /**
   * Schema for the body parameters, if any. Used for POST/PATCH/PUT requests. The schema should be an object which will be sent as the json body
   */
  request_body_schema?: ObjectJsonSchemaProperty_Output | null;
  /**
   * Schema describing the expected response body structure. For documentation only; not surfaced to the LLM.
   */
  response_body_schema?: ObjectJsonSchemaProperty_Output | null;
  /**
   * Optional allow-list filter applied to the response before the LLM sees it, so large responses don't pollute the context. Defaults to the full response.
   */
  response_filter?: ResponseFilter | null;
  /**
   * Content type for the request body. Only applies to POST/PUT/PATCH requests.
   * @default "application/json"
   */
  content_type?: "application/json" | "application/x-www-form-urlencoded";
  /**
   * URL placeholders resolved from the auth connection (e.g. secrets injected via UrlSecretAuthConnection) rather than from path_params_schema.
   */
  auth_resolved_params?: Array<string>;
  /**
   * Optional auth connection to use for authentication with this webhook
   */
  auth_connection?:
    AuthConnectionLocator | EnvironmentAuthConnectionLocator | null;
};
