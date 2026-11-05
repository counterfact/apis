export type AlertingMonitorConfig = {
  /**
   * Whether this monitor is enabled and can notify
   */
  enabled?: boolean | null;
  /**
   * Failure rate threshold at which this monitor can notify.
   */
  threshold?: number | null;
  /**
   * Relative increase over the trailing baseline at which this monitor can notify (0.2 = 20% above baseline, 0 = any failure). For conversation_volume_drop it is the share of the usual volume that must be missing, between 0.1 and 0.9 (0.5 = half).
   */
  relative_increase_threshold?: number | null;
  /**
   * Minimum failures in the window before this monitor can fire.
   */
  min_failure_count?: number | null;
  /**
   * Minimum trailing buckets with traffic before spike detection can fire.
   */
  min_history_bucket_count?: number | null;
  /**
   * Minimum samples in the window before this monitor can fire.
   */
  min_sample_count?: number | null;
  /**
   * How many suspect buckets within the lookback window are required to promote a suspect to an alert.
   */
  suspect_trigger_threshold?: number | null;
  /**
   * How many minutes an alert can stay inactive before it is auto-resolved.
   */
  auto_resolve_after_inactive_minutes?: number | null;
};
