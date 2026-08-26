export type RandomizationUnitInput = {
  /**
   * The unit of randomization. Must match the key of an existing context kind in this project.
   * @example "user"
   */
  randomizationUnit: string;
  /**
   * If true, any experiment iterations created within this project will default to using this randomization unit. A project can only have one default randomization unit.
   * @example true
   */
  default: boolean;
  /**
   * One of LaunchDarkly's fixed set of standard randomization units.
   */
  standardRandomizationUnit:
    | "guest"
    | "guestTime"
    | "organization"
    | "request"
    | "user"
    | "userTime";
};
