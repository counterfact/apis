import type { LLMLiteralJsonSchemaProperty } from "./LLMLiteralJsonSchemaProperty.js";
export type ASTLLMNode_Output = {
  /**
   * @default "llm"
   */
  type: "llm";
  /**
   * JSON schema describing the value that the LLM should extract.
   */
  value_schema: LLMLiteralJsonSchemaProperty;
  /**
   * The prompt to evaluate to a boolean value. Deprecated. Use a boolean schema instead.
   * @deprecated
   */
  prompt: string;
};
