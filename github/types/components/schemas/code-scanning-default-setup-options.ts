/**
 * Feature options for code scanning default setup
 */
export type code_scanning_default_setup_options = {
  /**
   * Whether to use labeled runners or standard GitHub runners.
   */
  runner_type?: "standard" | "labeled" | "not_set";
  /**
   * The label of the runner to use for code scanning default setup when runner_type is 'labeled'.
   */
  runner_label?: string;
};
