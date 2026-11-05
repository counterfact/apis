import type { LLMLiteralJsonSchemaProperty } from "./LLMLiteralJsonSchemaProperty.js";
import type { LLMObjectJsonSchemaProperty_Output } from "./LLMObjectJsonSchemaProperty-Output.js";
import type { LLMAnyOfJsonSchemaProperty_Output } from "./LLMAnyOfJsonSchemaProperty-Output.js";
export type LLMArrayJsonSchemaProperty_Output = {
  /**
   * @default "array"
   */
  type?: "array";
  /**
   * @default ""
   */
  description?: string;
  items:
    | LLMLiteralJsonSchemaProperty
    | LLMObjectJsonSchemaProperty_Output
    | LLMArrayJsonSchemaProperty_Output
    | LLMAnyOfJsonSchemaProperty_Output;
};
