/**
 * Stored in conversation history. Never exposed to customers directly.
 */
export type ConversationErrorType =
  | "unknown"
  | "call_initialization_error"
  | "line_busy"
  | "no_answer"
  | "call_rejected"
  | "blocked_by_user"
  | "agent_configuration_error"
  | "invalid_client_request"
  | "permission_error"
  | "entitlement_exceeded"
  | "client_disconnected"
  | "llm_error"
  | "speech_error"
  | "tool_error"
  | "integration_error"
  | "dependency_error"
  | "guardrail_triggered"
  | "safety_violation"
  | "max_duration_exceeded"
  | "workflow_end_failure"
  | "internal_error"
  | "post_processing_error";
