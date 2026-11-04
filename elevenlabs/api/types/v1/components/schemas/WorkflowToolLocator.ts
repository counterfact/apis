import type { ConstantSchemaOverride } from "./ConstantSchemaOverride.js";
import type { DynamicVariableSchemaOverride } from "./DynamicVariableSchemaOverride.js";
import type { LLMSchemaOverride } from "./LLMSchemaOverride.js";
import type { OmitSchemaOverride } from "./OmitSchemaOverride.js";
export type WorkflowToolLocator = {
  tool_id: string;
  /**
   * Per-node parameter overrides applied on top of the tool's own configuration. Keys are dotted parameter paths (webhook tools prefix keys with path_params./query_params./request_body.). These take precedence over any overrides already defined on the tool itself.
   */
  schema_overrides?: {
    [key: string]:
      | (ConstantSchemaOverride & { source: "constant" })
      | (DynamicVariableSchemaOverride & { source: "dynamic_variable" })
      | (LLMSchemaOverride & { source: "llm" })
      | (OmitSchemaOverride & { source: "omit" });
  } | null;
};
