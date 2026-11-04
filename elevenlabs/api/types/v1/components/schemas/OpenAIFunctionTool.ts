export type OpenAIFunctionTool = {
  /**
   * @default "function"
   */
  type?: "function";
  name: string;
  /**
   * @default ""
   */
  description?: string;
  parameters?: { [key: string]: unknown };
};
