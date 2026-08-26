import type { MultiEnvironmentDependentFlag } from "./MultiEnvironmentDependentFlag.js";
import type { Link } from "./Link.js";

export type MultiEnvironmentDependentFlags = {
  /**
   * An array of dependent flags with their environment information
   */
  items: Array<MultiEnvironmentDependentFlag>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * Details on how to access the prerequisite flag in the LaunchDarkly UI
   * @example "{ \"href\": \"/example-project/~/features/example-prereq-flag\", \"type\": \"text/html\" }"
   */
  _site: Link;
};
