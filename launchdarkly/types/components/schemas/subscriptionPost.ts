import type { StatementPostList } from "./StatementPostList.js";

export type subscriptionPost = {
  /**
   * A human-friendly name for your audit log subscription.
   * @example "Example audit log subscription."
   */
  name: string;
  /**
   * The set of resources you wish to subscribe to audit log notifications for.
   */
  statements?: StatementPostList;
  /**
   * Whether or not you want your subscription to actively send events.
   * @example false
   */
  on?: boolean;
  /**
   * An array of tags for this subscription.
   * @example ["testing-tag"]
   */
  tags?: Array<string>;
  /**
   * The unique set of fields required to configure an audit log subscription integration of this type. Refer to the <code>formVariables</code> field in the corresponding <code>manifest.json</code> at https://github.com/launchdarkly/integration-framework/tree/main/integrations for a full list of fields for the integration you wish to configure.
   * @example {"optional":"an optional property","required":"the required property","url":"https://example.com"}
   */
  config: { [key: string]: unknown };
  /**
   * Slack webhook receiver URL. Only necessary for legacy Slack webhook integrations.
   */
  url?: string;
  /**
   * Datadog API key. Only necessary for legacy Datadog webhook integrations.
   */
  apiKey?: string;
};
