/**
 * A required reviewing team
 */
export type repository_rule_params_reviewer = {
  /**
   * ID of the reviewer which must review changes to matching files.
   */
  id: number;
  /**
   * The type of the reviewer
   */
  type: "Team";
};
