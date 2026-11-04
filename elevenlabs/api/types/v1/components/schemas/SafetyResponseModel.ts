export type SafetyResponseModel = {
  /**
   * @default false
   */
  is_blocked_ivc?: boolean;
  /**
   * @default false
   */
  is_blocked_non_ivc?: boolean;
  /**
   * @default false
   */
  ignore_safety_evaluation?: boolean;
};
