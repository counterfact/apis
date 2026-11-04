import type { LLM } from "./LLM.js";
import type { LLMDeprecationConfigModel } from "./LLMDeprecationConfigModel.js";
/**
 * @example {"fallback_percentage":0,"is_deprecated":true,"is_in_fallback_period":false,"is_in_warning_period":true,"llm":"gpt-4o-mini","provider_deprecation_date":"2025-06-01T00:00:00Z","replacement_model":"gpt-4o"}
 */
export type LLMDeprecationInfoModel = {
  /**
   * The identifier of the deprecated LLM model.
   */
  llm: LLM;
  /**
   * Whether this model is currently deprecated. True if the model is immediately deprecated or within the warning period.
   */
  is_deprecated: boolean;
  /**
   * Whether this model is currently in the warning period before deprecation.
   * @default false
   */
  is_in_warning_period?: boolean;
  /**
   * Whether traffic is currently being progressively routed to the replacement model.
   * @default false
   */
  is_in_fallback_period?: boolean;
  /**
   * Current percentage of traffic being routed to the replacement model (0-100).
   * @default 0
   */
  fallback_percentage?: number;
  /**
   * The date when the model provider will deprecate this model. Null for immediately deprecated models.
   */
  provider_deprecation_date?: string | null;
  /**
   * The model that replaces this deprecated model. Traffic will be automatically routed to this model.
   */
  replacement_model?: LLM | null;
  /**
   * Custom deprecation timing configuration for this model. Null if using the default configuration.
   */
  deprecation_config?: LLMDeprecationConfigModel | null;
};
