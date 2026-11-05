export type SayNodePromptMessage_Input = {
  /**
   * @default "prompt"
   */
  type?: "prompt";
  /**
   * LLM prompt describing what message should be generated.
   */
  prompt: string;
};
