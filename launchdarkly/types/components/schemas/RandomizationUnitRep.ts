export type RandomizationUnitRep = {
  /**
   * The unit of randomization. Defaults to user.
   * @example "user"
   */
  randomizationUnit?: string;
  /**
   * One of LaunchDarkly's fixed set of standard randomization units.
   * @example "user"
   */
  standardRandomizationUnit?: string;
  /**
   * Whether this randomization unit is the default for experiments
   * @example true
   */
  default?: boolean;
  _hidden?: boolean;
  /**
   * The display name for the randomization unit, displayed in the LaunchDarkly user interface.
   * @example "User"
   */
  _displayName?: string;
};
