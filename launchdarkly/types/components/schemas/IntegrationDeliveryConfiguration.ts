import type { IntegrationDeliveryConfigurationLinks } from "./IntegrationDeliveryConfigurationLinks.js";
import type { FormVariableConfig } from "./FormVariableConfig.js";
import type { Access } from "./Access.js";

export type IntegrationDeliveryConfiguration = {
  /**
   * The location and content type of related resources
   */
  _links: IntegrationDeliveryConfigurationLinks;
  /**
   * The integration ID
   * @example "12ab3c4d5ef1a2345bcde67f"
   */
  _id: string;
  /**
   * The integration key
   * @example "example-integration-key"
   */
  integrationKey: string;
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
};
