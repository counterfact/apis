export type DefaultClientSideAvailabilityPost = {
  /**
   * Whether to enable availability for client-side SDKs.
   * @example true
   */
  usingEnvironmentId: boolean;
  /**
   * Whether to enable availability for mobile SDKs.
   * @example true
   */
  usingMobileKey: boolean;
};
