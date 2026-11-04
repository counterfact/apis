import type { LLMCategoryUsage } from "./LLMCategoryUsage.js";
import type { PlatformUsage } from "./PlatformUsage.js";
import type { ConversationTTSUsageModel } from "./ConversationTTSUsageModel.js";
import type { ConversationASRUsageModel } from "./ConversationASRUsageModel.js";
import type { AnalysisCharging } from "./AnalysisCharging.js";
export type ConversationChargingCommonModel = {
  /**
   * @default false
   */
  dev_discount?: boolean;
  /**
   * @default false
   */
  is_burst?: boolean;
  tier?: string | null;
  llm_usage?: LLMCategoryUsage;
  llm_price?: number | null;
  llm_charge?: number | null;
  call_charge?: number | null;
  platform_charge?: number | null;
  platform_usage?: PlatformUsage;
  platform_price?: number | null;
  /**
   * @default 0
   */
  free_minutes_consumed?: number;
  /**
   * @default 0
   */
  free_llm_dollars_consumed?: number;
  tts_usage?: ConversationTTSUsageModel | null;
  asr_usage?: ConversationASRUsageModel | null;
  analysis?: AnalysisCharging | null;
  /**
   * Credits charged as the voice actor reward for the Voice Library voices this conversation used. It is not included in `cost`.
   */
  voice_surcharge_charge?: number | null;
};
