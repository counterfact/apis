import type { LLM } from "./LLM.js";
import type { LLMReasoningEffort } from "./LLMReasoningEffort.js";
import type { LLMServiceTier } from "./LLMServiceTier.js";
import type { LLMDeprecationInfoModel } from "./LLMDeprecationInfoModel.js";
import type { RegionalProcessingSurchargeInfo } from "./RegionalProcessingSurchargeInfo.js";
/**
 * @example {"available_service_tiers":["standard"],"is_checkpoint":false,"llm":"gemini-2.5-flash","max_context_limit":1048576,"max_tokens_limit":8192,"supports_document_input":true,"supports_image_input":true,"supports_parallel_tool_calls":true}
 */
export type LLMInfoModel = {
  /**
   * The model identifier.
   */
  llm: LLM;
  /**
   * Whether this is a pinned checkpoint version of a model rather than a top-level alias.
   */
  is_checkpoint: boolean;
  /**
   * Maximum number of output tokens the model can generate.
   */
  max_tokens_limit: number;
  /**
   * Maximum number of input context tokens the model supports.
   */
  max_context_limit: number;
  /**
   * Whether the model supports image file inputs during conversations.
   */
  supports_image_input: boolean;
  /**
   * Whether the model supports document (PDF) file inputs during conversations.
   */
  supports_document_input: boolean;
  /**
   * Whether the model supports calling multiple tools in parallel.
   */
  supports_parallel_tool_calls: boolean;
  /**
   * Available reasoning effort levels for this model. Null if the model does not support configurable reasoning.
   */
  available_reasoning_efforts?: Array<LLMReasoningEffort> | null;
  /**
   * Available service tiers for this model. Always includes at least the standard tier.
   */
  available_service_tiers: Array<LLMServiceTier>;
  /**
   * Deprecation information if this model is deprecated or scheduled for deprecation. Null if the model is not affected.
   */
  deprecation_info?: LLMDeprecationInfoModel | null;
  /**
   * Regional processing surcharge details if this model has additional costs in the current deployment region. Null if no surcharge applies.
   */
  regional_processing_surcharge?: RegionalProcessingSurchargeInfo | null;
};
