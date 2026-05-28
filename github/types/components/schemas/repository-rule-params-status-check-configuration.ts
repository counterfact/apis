/**
 * Required status check
 */
export type repository_rule_params_status_check_configuration = {
  /**
   * The status check context name that must be present on the commit.
   */
  context: string;
  /**
   * The optional integration ID that this status check must originate from.
   */
  integration_id?: number;
};
