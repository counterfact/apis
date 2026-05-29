/**
 * Provides details of Public IP for a GitHub-hosted larger runners
 */
export type public_ip = {
  /**
   * Whether public IP is enabled.
   * @example true
   */
  enabled?: boolean;
  /**
   * The prefix for the public IP.
   * @example "20.80.208.150"
   */
  prefix?: string;
  /**
   * The length of the IP prefix.
   * @example 28
   */
  length?: number;
};
