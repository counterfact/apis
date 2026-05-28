/**
 * Parameters for a targeting a repository property
 */
export type repository_ruleset_conditions_repository_property_spec = {
  /**
   * The name of the repository property to target
   */
  name: string;
  /**
   * The values to match for the repository property
   */
  property_values: Array<string>;
  /**
   * The source of the repository property. Defaults to 'custom' if not specified.
   */
  source?: "custom" | "system";
};
