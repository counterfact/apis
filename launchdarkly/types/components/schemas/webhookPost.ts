import type { StatementPostList } from "./StatementPostList.js";

export type webhookPost = {
  /**
   * A human-readable name for your webhook
   * @example "Example hook"
   */
  name?: string;
  /**
   * The URL of the remote webhook
   * @example "http://www.example.com"
   */
  url: string;
  /**
   * If sign is true, and the secret attribute is omitted, LaunchDarkly automatically generates a secret for you.
   * @example "frobozz"
   */
  secret?: string;
  /**
   * Represents a Custom role policy, defining a resource kinds filter the webhook should respond to.
   */
  statements?: StatementPostList;
  /**
   * If sign is false, the webhook does not include a signature header, and the secret can be omitted.
   * @example true
   */
  sign: boolean;
  /**
   * Whether or not this webhook is enabled.
   * @example true
   */
  on: boolean;
  /**
   * List of tags for this webhook
   * @example []
   */
  tags?: Array<string>;
};
