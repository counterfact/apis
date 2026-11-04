import type { LLMInfoModel } from "./LLMInfoModel.js";
import type { LLMDeprecationConfigModel } from "./LLMDeprecationConfigModel.js";
/**
 * @example {"default_deprecation_config":{"fallback_complete_days":7,"fallback_complete_percentage":100,"fallback_start_days":14,"fallback_start_percentage":25,"warning_start_days":30},"llms":[{"available_service_tiers":["standard"],"is_checkpoint":false,"llm":"gemini-2.5-flash","max_context_limit":1048576,"max_tokens_limit":8192,"supports_document_input":true,"supports_image_input":true,"supports_parallel_tool_calls":true}]}
 */
export type LLMListResponseModel = {
  /**
   * List of all available LLM models that can be used with agents.
   */
  llms: Array<LLMInfoModel>;
  /**
   * The default deprecation timing configuration used for models without a custom override.
   */
  default_deprecation_config: LLMDeprecationConfigModel;
};
