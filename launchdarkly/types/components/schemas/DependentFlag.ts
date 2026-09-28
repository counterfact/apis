import type { Link } from "./Link.js";

export type DependentFlag = {
  /**
   * The flag name
   * @example "Example dependent flag"
   */
  name?: string;
  /**
   * The flag key
   * @example "dependent-flag-key-123abc"
   */
  key: string;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * Details on how to access the dependent flag in the LaunchDarkly UI
   * @example "{ \"href\": \"/example-project/example-environment/features/example-dependent-flag\", \"type\": \"text/html\" }"
   */
  _site: Link;
};
