import type { GuardrailExecutionMode } from "./GuardrailExecutionMode.js";
import type { EndCallTriggerAction } from "./EndCallTriggerAction.js";
import type { RetryTriggerAction } from "./RetryTriggerAction.js";
/**
 * Single custom guardrail configuration
 */
export type CustomGuardrailConfig = {
  /**
   * @default false
   */
  is_enabled?: boolean;
  /**
   * User-facing name for this guardrail
   */
  name: string;
  /**
   * Instruction describing what to block, e.g. 'don't talk about politics'
   */
  prompt: string;
  /**
   * @default "streaming"
   */
  execution_mode?: GuardrailExecutionMode;
  /**
   * LLM model to use for custom guardrail evaluation
   * @default "gemini-3.1-flash-lite"
   */
  model?:
    | "gemini-2.5-flash-lite"
    | "gemini-2.5-flash"
    | "gemini-3.1-flash-lite"
    | "gemini-3.5-flash"
    | "claude-haiku-4-5"
    | "claude-sonnet-4-6"
    | "gpt-5.4-nano"
    | "gpt-5.4-mini";
  /**
   * How much recent history the guardrail sees before the reply it evaluates, counted in user messages (the agent replies between them are included too). The guardrail always gets a single <conversation_history> transcript ending in the evaluated reply, marked 'AGENT [current reply]:'. 0 (default) adds no prior history (just that line); 1 adds the latest user message onward.
   * @default 0
   */
  history_message_count?: number;
  /**
   * When enabled, the history also renders the agent's tool calls, their input arguments, and the tool results, interleaved with the text, so an action between two agent messages is visible. Off by default: history shows only user and agent text. Tool payloads can be large and can mislead smaller evaluator models, so enabling this raises token cost.
   * @default false
   */
  history_include_tool_calls?: boolean;
  trigger_action?:
    | (EndCallTriggerAction & { type: "end_call" })
    | (RetryTriggerAction & { type: "retry" });
  /**
   * Evaluate once against the complete non-TTS response instead of cumulative partials. Requires blocking mode.
   * @default false
   */
  evaluate_full_response_only?: boolean;
};
