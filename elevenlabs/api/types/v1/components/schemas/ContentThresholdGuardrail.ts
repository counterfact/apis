export type ContentThresholdGuardrail = {
  /**
   * @default false
   */
  is_enabled?: boolean;
  /**
   * @default 0.3
   */
  threshold?: number | ("low" | "medium" | "high");
};
