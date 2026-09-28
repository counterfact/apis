import type { DependentFlag } from "./DependentFlag.js";
import type { Link } from "./Link.js";

export type DependentFlagsByEnvironment = {
  /**
   * A list of dependent flags, which are flags that use the requested flag as a prerequisite
   */
  items: Array<DependentFlag>;
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
