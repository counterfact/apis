import type { BigSegmentStoreIntegrationLinks } from "./BigSegmentStoreIntegrationLinks.js";
import type { FormVariableConfig } from "./FormVariableConfig.js";
import type { Access } from "./Access.js";
import type { BigSegmentStoreStatus } from "./BigSegmentStoreStatus.js";

export type BigSegmentStoreIntegration = {
  /**
   * The location and content type of related resources
   */
  _links: BigSegmentStoreIntegrationLinks;
  /**
   * The integration ID
   * @example "12ab3c4d5ef1a2345bcde67f"
   */
  _id: string;
  /**
   * The integration key
   * @example "redis"
   */
  integrationKey: "redis" | "dynamodb";
  /**
   * The project key
   * @example "default"
   */
  projectKey: string;
  /**
   * The environment key
   * @example "development"
   */
  environmentKey: string;
  /**
   * The delivery configuration for the given integration provider. Only included when requesting a single integration by ID. Refer to the <code>formVariables</code> field in the corresponding <code>manifest.json</code> for a full list of fields for each integration.
   */
  config: FormVariableConfig;
  /**
   * Whether the configuration is turned on
   * @example true
   */
  on: boolean;
  /**
   * List of tags for this configuration
   * @example []
   */
  tags: Array<string>;
  /**
   * Name of the configuration
   * @example "Development environment configuration"
   */
  name: string;
  /**
   * Version of the current configuration
   * @example 1
   */
  version: number;
  /**
   * Details on the allowed and denied actions for this configuration
   */
  _access?: Access;
  /**
   * Details on the connection status of the persistent store integration
   */
  _status: BigSegmentStoreStatus;
};
