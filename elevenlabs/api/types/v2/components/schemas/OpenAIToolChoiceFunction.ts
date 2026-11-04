import type { OpenAIToolChoiceFunctionInner } from "./OpenAIToolChoiceFunctionInner.js";
export type OpenAIToolChoiceFunction = {
  /**
   * @default "function"
   */
  type?: "function";
  function: OpenAIToolChoiceFunctionInner;
};
