import type { LLMLiteralJsonSchemaProperty } from "./LLMLiteralJsonSchemaProperty.js";
import type { LLMArrayJsonSchemaProperty_Output } from "./LLMArrayJsonSchemaProperty-Output.js";
import type { LLMAnyOfJsonSchemaProperty_Output } from "./LLMAnyOfJsonSchemaProperty-Output.js";
export type LLMObjectJsonSchemaProperty_Output = {
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
      | LLMObjectJsonSchemaProperty_Output
      | LLMArrayJsonSchemaProperty_Output
      | LLMAnyOfJsonSchemaProperty_Output;
  };
};
