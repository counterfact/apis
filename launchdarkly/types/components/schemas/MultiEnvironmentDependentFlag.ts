import type { DependentFlagEnvironment } from "./DependentFlagEnvironment.js";

export type MultiEnvironmentDependentFlag = {
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
   * A list of environments in which the dependent flag appears
   */
  environments: Array<DependentFlagEnvironment>;
};
