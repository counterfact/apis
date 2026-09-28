export type BooleanDefaults = {
  /**
   * The display name for the true variation, displayed in the LaunchDarkly user interface
   * @example "True"
   */
  trueDisplayName?: string;
  /**
   * The display name for the false variation, displayed in the LaunchDarkly user interface
   * @example "False"
   */
  falseDisplayName?: string;
  /**
   * The description for the true variation
   * @example "serve true"
   */
  trueDescription?: string;
  /**
   * The description for the false variation
   * @example "serve false"
   */
  falseDescription?: string;
  /**
   * The variation index of the flag variation to use for the default targeting behavior when a flag's targeting is on and the target did not match any rules
   * @example 0
   */
  onVariation?: number;
  /**
   * The variation index of the flag variation to use for the default targeting behavior when a flag's targeting is off
   * @example 1
   */
  offVariation?: number;
};
