import type { GuardrailExecutionMode } from "./GuardrailExecutionMode.js";
import type { ModerationConfig } from "./ModerationConfig.js";
export type ModerationGuardrail_Input = {
  /**
   * @default "streaming"
   */
  execution_mode?: GuardrailExecutionMode;
  config?: ModerationConfig;
};
