import type { ruleset_version } from "./ruleset-version.js";

export type ruleset_version_with_state = ruleset_version & {
  /**
   * The state of the ruleset version
   */
  state: {};
};
