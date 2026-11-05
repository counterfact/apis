/**
 * @example {"fallback_complete_days":7,"fallback_complete_percentage":100,"fallback_start_days":14,"fallback_start_percentage":25,"warning_start_days":30}
 */
export type LLMDeprecationConfigModel = {
  /**
   * Number of days before the provider deprecation date when warnings start being shown.
   */
  warning_start_days: number;
  /**
   * Number of days before the provider deprecation date when traffic starts being routed to the replacement model.
   */
  fallback_start_days: number;
  /**
   * Number of days before the provider deprecation date when all traffic is routed to the replacement model.
   */
  fallback_complete_days: number;
  /**
   * Percentage of traffic routed to the replacement model when fallback begins.
   */
  fallback_start_percentage: number;
  /**
   * Percentage of traffic routed to the replacement model when fallback is complete.
   */
  fallback_complete_percentage: number;
};
