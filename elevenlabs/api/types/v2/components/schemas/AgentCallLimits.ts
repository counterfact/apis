/**
 * @example {"agent_concurrency_limit":-1,"bursting_enabled":true,"daily_limit":100000}
 */
export type AgentCallLimits = {
  /**
   * The maximum number of concurrent conversations. -1 indicates that there is no maximum
   * @default -1
   */
  agent_concurrency_limit?: number;
  /**
   * The maximum number of conversations per day
   * @default 100000
   */
  daily_limit?: number;
  /**
   * Whether to enable bursting. If true, exceeding workspace concurrency limit will be allowed up to 3 times the limit. Calls will be charged at double rate when exceeding the limit.
   * @default true
   */
  bursting_enabled?: boolean;
};
