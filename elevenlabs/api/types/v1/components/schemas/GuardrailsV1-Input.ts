import type { FocusGuardrail } from "./FocusGuardrail.js";
import type { PromptInjectionGuardrail } from "./PromptInjectionGuardrail.js";
import type { ContentGuardrail_Input } from "./ContentGuardrail-Input.js";
import type { ModerationGuardrail_Input } from "./ModerationGuardrail-Input.js";
import type { CustomGuardrail_Input } from "./CustomGuardrail-Input.js";
export type GuardrailsV1_Input = {
  /**
   * @default "1"
   */
  version?: "1";
  focus?: FocusGuardrail;
  prompt_injection?: PromptInjectionGuardrail;
  content?: ContentGuardrail_Input;
  moderation?: ModerationGuardrail_Input | null;
  custom?: CustomGuardrail_Input;
};
