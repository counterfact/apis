import type { Scenario } from "../types/index.js";

export const emptyLlmCatalog: Scenario = ($) => {
  const context = $.loadContext("/convai/llm");
  context.models = new Map();
  context.deprecationConfig = {
    warning_start_days: 30,
    fallback_start_days: 14,
    fallback_complete_days: 7,
    fallback_start_percentage: 25,
    fallback_complete_percentage: 100,
  };
};

export const resetLlmCatalog: Scenario = ($) => {
  emptyLlmCatalog($);
  const context = $.loadContext("/convai/llm");
  context.models = new Map([
    ["gemini-3.5-flash", {
      llm: "gemini-3.5-flash", is_checkpoint: false,
      max_tokens_limit: 1000, max_context_limit: 10000,
      supports_image_input: false, supports_document_input: false,
      supports_parallel_tool_calls: true, available_service_tiers: ["standard"],
      available_reasoning_efforts: null, deprecation_info: null,
      regional_processing_surcharge: null,
    }],
    ["gemini-2.5-flash", {
      llm: "gemini-2.5-flash", is_checkpoint: false,
      max_tokens_limit: 2000, max_context_limit: 20000,
      supports_image_input: true, supports_document_input: true,
      supports_parallel_tool_calls: true, available_service_tiers: ["standard"],
      available_reasoning_efforts: null, deprecation_info: null,
      regional_processing_surcharge: null,
    }],
    ["gpt-4o", {
      llm: "gpt-4o", is_checkpoint: false,
      max_tokens_limit: 3000, max_context_limit: 30000,
      supports_image_input: true, supports_document_input: false,
      supports_parallel_tool_calls: true, available_service_tiers: ["standard"],
      available_reasoning_efforts: null, deprecation_info: null,
      regional_processing_surcharge: null,
    }],
    ["gpt-4o-mini", {
      llm: "gpt-4o-mini", is_checkpoint: false,
      max_tokens_limit: 4000, max_context_limit: 40000,
      supports_image_input: false, supports_document_input: false,
      supports_parallel_tool_calls: false, available_service_tiers: ["standard"],
      available_reasoning_efforts: null,
      deprecation_info: {
        llm: "gpt-4o-mini", is_deprecated: true,
        is_in_warning_period: false, is_in_fallback_period: false,
        fallback_percentage: 0, provider_deprecation_date: null,
        replacement_model: "gpt-4o", deprecation_config: null,
      },
      regional_processing_surcharge: null,
    }],
  ]);
};
