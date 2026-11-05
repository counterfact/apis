import type { FocusGuardrail } from "./FocusGuardrail.js";
import type { PromptInjectionGuardrail } from "./PromptInjectionGuardrail.js";
import type { ContentGuardrail_Output } from "./ContentGuardrail-Output.js";
import type { ModerationGuardrail_Output } from "./ModerationGuardrail-Output.js";
import type { CustomGuardrail_Output } from "./CustomGuardrail-Output.js";
export type GuardrailsV1_Output = {
  /**
   * @default "1"
   */
  version?: "1";
  focus?: FocusGuardrail;
  prompt_injection?: PromptInjectionGuardrail;
  content?: ContentGuardrail_Output;
  moderation?: ModerationGuardrail_Output | null;
  custom?: CustomGuardrail_Output;
};
