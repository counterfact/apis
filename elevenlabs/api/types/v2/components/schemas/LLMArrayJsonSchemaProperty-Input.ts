import type { LLMLiteralJsonSchemaProperty } from "./LLMLiteralJsonSchemaProperty.js";
import type { LLMObjectJsonSchemaProperty_Input } from "./LLMObjectJsonSchemaProperty-Input.js";
import type { LLMAnyOfJsonSchemaProperty_Input } from "./LLMAnyOfJsonSchemaProperty-Input.js";
export type LLMArrayJsonSchemaProperty_Input = {
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
    | LLMObjectJsonSchemaProperty_Input
    | LLMArrayJsonSchemaProperty_Input
    | LLMAnyOfJsonSchemaProperty_Input;
};
