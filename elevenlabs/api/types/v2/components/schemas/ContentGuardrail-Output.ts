import type { GuardrailExecutionMode } from "./GuardrailExecutionMode.js";
import type { ContentConfig } from "./ContentConfig.js";
import type { EndCallTriggerAction } from "./EndCallTriggerAction.js";
import type { RetryTriggerAction } from "./RetryTriggerAction.js";
export type ContentGuardrail_Output = {
  /**
   * @default "streaming"
   */
  execution_mode?: GuardrailExecutionMode;
  config?: ContentConfig;
  trigger_action?:
    | (EndCallTriggerAction & { type: "end_call" })
    | (RetryTriggerAction & { type: "retry" });
};
