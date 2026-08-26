import type { Statement } from "./Statement.js";

export type RelayAutoConfigPost = {
  /**
   * A human-friendly name for the Relay Proxy configuration
   */
  name: string;
  /**
   * A description of what environments and projects the Relay Proxy should include or exclude. To learn more, read [Write an inline policy](https://docs.launchdarkly.com/sdk/relay-proxy/automatic-configuration#write-an-inline-policy).
   */
  policy: Array<Statement>;
};
