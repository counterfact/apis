export type LLMLiteralJsonSchemaProperty = {
  type: ("boolean" | "string" | "integer" | "number") | Array<string>;
  description: string;
  /**
   * List of allowed string values for string type parameters
   */
  enum?: Array<string> | null;
};
