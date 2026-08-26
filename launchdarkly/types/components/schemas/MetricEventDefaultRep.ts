export type MetricEventDefaultRep = {
  /**
   * Whether to disable defaulting missing unit events when calculating results. Defaults to false
   */
  disabled?: boolean;
  /**
   * The default value applied to missing unit events. Only available when <code>disabled</code> is false. Defaults to 0
   */
  value?: number;
};
