import type { Link } from "./Link.js";

export type DependentFlagEnvironment = {
  /**
   * The environment name
   * @example "Example environment"
   */
  name?: string;
  /**
   * The environment key
   * @example "environment-key-123abc"
   */
  key: string;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * Details on how to access the dependent flag in this environment in the LaunchDarkly UI
   * @example "{ \"href\": \"/example-project/example-environment/features/example-dependent-flag\", \"type\": \"text/html\" }"
   */
  _site: Link;
};
