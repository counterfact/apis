export type SayNodePromptMessage_Output = {
  /**
   * @default "prompt"
   */
  type: "prompt";
  /**
   * LLM prompt describing what message should be generated.
   */
  prompt: string;
};
