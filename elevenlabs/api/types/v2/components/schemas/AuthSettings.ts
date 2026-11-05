import type { AllowlistItem } from "./AllowlistItem.js";
/**
 * @example {"allowlist":[{"hostname":"https://example.com"}],"enable_auth":true,"require_origin_header":true,"shareable_token":"1234567890"}
 */
export type AuthSettings = {
  /**
   * If set to true, starting a conversation with an agent will require a signed token
   * @default false
   */
  enable_auth?: boolean;
  /**
   * A list of hosts that are allowed to start conversations with the agent
   */
  allowlist?: Array<AllowlistItem>;
  /**
   * When enabled, connections with no origin header will be rejected. If the allowlist is empty, this option has no effect.
   * @default false
   */
  require_origin_header?: boolean;
  /**
   * A shareable token that can be used to start a conversation with the agent
   */
  shareable_token?: string | null;
};
