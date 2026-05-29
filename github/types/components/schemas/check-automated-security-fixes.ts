/**
 * Check Dependabot security updates
 */
export type check_automated_security_fixes = {
  /**
   * Whether Dependabot security updates are enabled for the repository.
   * @example true
   */
  enabled: boolean;
  /**
   * Whether Dependabot security updates are paused for the repository.
   * @example false
   */
  paused: boolean;
};
