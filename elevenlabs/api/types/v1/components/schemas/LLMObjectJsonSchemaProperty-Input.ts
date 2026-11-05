import type { LLMLiteralJsonSchemaProperty } from "./LLMLiteralJsonSchemaProperty.js";
import type { LLMArrayJsonSchemaProperty_Input } from "./LLMArrayJsonSchemaProperty-Input.js";
import type { LLMAnyOfJsonSchemaProperty_Input } from "./LLMAnyOfJsonSchemaProperty-Input.js";
export type LLMObjectJsonSchemaProperty_Input = {
  /**
   * @default "object"
   */
  type?: "object";
  required?: Array<string>;
  /**
   * @default ""
   */
  description?: string;
  properties?: {
    [key: string]:
      | LLMLiteralJsonSchemaProperty
      | LLMObjectJsonSchemaProperty_Input
      | LLMArrayJsonSchemaProperty_Input
      | LLMAnyOfJsonSchemaProperty_Input;
  };
};
