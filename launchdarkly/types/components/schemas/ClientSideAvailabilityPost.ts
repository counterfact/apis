export type ClientSideAvailabilityPost = {
  /**
   * Whether to enable availability for client-side SDKs. Defaults to <code>false</code>.
   * @example true
   */
  usingEnvironmentId: boolean;
  /**
   * Whether to enable availability for mobile SDKs. Defaults to <code>true</code>.
   * @example true
   */
  usingMobileKey: boolean;
};
