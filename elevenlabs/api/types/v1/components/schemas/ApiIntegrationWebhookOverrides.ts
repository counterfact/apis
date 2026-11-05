import type { ConstantSchemaOverride } from "./ConstantSchemaOverride.js";
import type { DynamicVariableSchemaOverride } from "./DynamicVariableSchemaOverride.js";
import type { LLMSchemaOverride } from "./LLMSchemaOverride.js";
import type { OmitSchemaOverride } from "./OmitSchemaOverride.js";
import type { ResponseFilterMode } from "./ResponseFilterMode.js";
import type { ConvAIDynamicVariable } from "./ConvAIDynamicVariable.js";
export type ApiIntegrationWebhookOverrides = {
  schema_overrides?: {
    [key: string]:
      | (ConstantSchemaOverride & { source: "constant" })
      | (DynamicVariableSchemaOverride & { source: "dynamic_variable" })
      | (LLMSchemaOverride & { source: "llm" })
      | (OmitSchemaOverride & { source: "omit" });
  } | null;
  response_filter_mode?: ResponseFilterMode | null;
  response_filters?: Array<string> | null;
  request_headers?: { [key: string]: string | ConvAIDynamicVariable } | null;
};
