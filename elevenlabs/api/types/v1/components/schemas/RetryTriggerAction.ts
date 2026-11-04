export type RetryTriggerAction = {
  /**
   * @default "retry"
   */
  type?: "retry";
  /**
   * Custom feedback to inject into the agent when retrying after guardrail trigger.
   * @default "Your response was blocked by a guardrail that blocks content that matches this condition/category: '{{trigger_reason}}' During your next turn you must tell the user \"I'm sorry but I can't answer that question, would you like to know something else?\"."
   */
  feedback?: string;
};
