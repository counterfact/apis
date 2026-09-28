import type { Statement } from "./Statement.js";
import type { Access } from "./Access.js";

export type Webhook = {
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * The ID of this webhook
   * @example "57be1db38b75bf0772d11384"
   */
  _id: string;
  /**
   * A human-readable name for this webhook
   * @example "Example hook"
   */
  name?: string;
  /**
   * The URL to which LaunchDarkly sends an HTTP POST payload for this webhook
   * @example "http://www.example.com"
   */
  url: string;
  /**
   * The secret for this webhook
   * @example "frobozz"
   */
  secret?: string;
  /**
   * Represents a Custom role policy, defining a resource kinds filter the webhook responds to.
   */
  statements?: Array<Statement>;
  /**
   * Whether or not this webhook is enabled
   * @example true
   */
  on: boolean;
  /**
   * List of tags for this webhook
   * @example ["examples"]
   */
  tags: Array<string>;
  /**
   * Details on the allowed and denied actions for this webhook
   */
  _access?: Access;
};
