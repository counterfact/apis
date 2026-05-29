export type actions_hosted_runner_limits = {
  /**
   * Provides details of static public IP limits for GitHub-hosted Hosted Runners
   */
  public_ips: {
    /**
     * The maximum number of static public IP addresses that can be used for Hosted Runners.
     * @example 50
     */
    maximum: number;
    /**
     * The current number of static public IP addresses in use by Hosted Runners.
     * @example 17
     */
    current_usage: number;
  };
};
