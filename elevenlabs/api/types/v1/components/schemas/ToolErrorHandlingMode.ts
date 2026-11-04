/**
 * Controls how tool errors are processed before being shared with the agent.
 * @default "auto"
 */
export type ToolErrorHandlingMode =
  "auto" | "summarized" | "passthrough" | "hide";
