import type { LLMLiteralJsonSchemaProperty } from "./LLMLiteralJsonSchemaProperty.js";
export type ASTLLMNode_Input =
  | {
      /**
       * @default "llm"
       */
      type?: "llm";
      /**
       * JSON schema describing the value that the LLM should extract.
       */
      value_schema: LLMLiteralJsonSchemaProperty;
    }
  | {
      /**
       * @default "llm"
       */
      type?: "llm";
      /**
       * The prompt to evaluate to a boolean value. Deprecated. Use a boolean schema instead.
       * @deprecated
       */
      prompt: string;
    };
