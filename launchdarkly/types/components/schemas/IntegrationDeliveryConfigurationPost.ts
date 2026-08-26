import type { FormVariableConfig } from "./FormVariableConfig.js";

export type IntegrationDeliveryConfigurationPost = {
  /**
   * Whether the integration configuration is active. Default value is false.
   * @example false
   */
  on?: boolean;
  /**
   * The global integration settings, as specified by the <code>formVariables</code> in the <code>manifest.json</code> for this integration.
   * @example "{\"required\": \"example value for required formVariables property for sample-integration\", \"optional\": \"example value for optional formVariables property for sample-integration\"}"
   */
  config: FormVariableConfig;
  /**
   * Tags to associate with the integration
   * @example ["example-tag"]
   */
  tags?: Array<string>;
  /**
   * Name to identify the integration
   * @example "Sample integration"
   */
  name?: string;
};
