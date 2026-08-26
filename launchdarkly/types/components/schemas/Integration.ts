import type { Statement } from "./Statement.js";
import type { Access } from "./Access.js";
import type { IntegrationSubscriptionStatusRep } from "./IntegrationSubscriptionStatusRep.js";

export type Integration = {
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * The ID for this integration audit log subscription
   * @example "1234a56b7c89d012345e678f"
   */
  _id?: string;
  /**
   * The type of integration
   * @example "datadog"
   */
  kind?: string;
  /**
   * A human-friendly name for the integration
   * @example "Example Datadog integration"
   */
  name?: string;
  /**
   * Details on configuration for an integration of this type. Refer to the <code>formVariables</code> field in the corresponding <code>manifest.json</code> for a full list of fields for each integration.
   */
  config?: { [key: string]: unknown };
  /**
   * Represents a Custom role policy, defining a resource kinds filter the integration audit log subscription responds to.
   */
  statements?: Array<Statement>;
  /**
   * Whether the integration is currently active
   * @example true
   */
  on?: boolean;
  /**
   * An array of tags for this integration
   * @example ["testing"]
   */
  tags?: Array<string>;
  /**
   * Details on the allowed and denied actions for this subscription
   */
  _access?: Access;
  /**
   * Details on the most recent successes and errors for this integration
   */
  _status?: IntegrationSubscriptionStatusRep;
  /**
   * Slack webhook receiver URL. Only used for legacy Slack webhook integrations.
   */
  url?: string;
  /**
   * Datadog API key. Only used for legacy Datadog webhook integrations.
   */
  apiKey?: string;
};
