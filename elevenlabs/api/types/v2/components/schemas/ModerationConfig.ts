import type { ThresholdGuardrail } from "./ThresholdGuardrail.js";
export type ModerationConfig = {
  sexual?: ThresholdGuardrail;
  violence?: ThresholdGuardrail;
  violence_graphic?: ThresholdGuardrail;
  harassment?: ThresholdGuardrail;
  harassment_threatening?: ThresholdGuardrail;
  hate?: ThresholdGuardrail;
  hate_threatening?: ThresholdGuardrail;
  self_harm_instructions?: ThresholdGuardrail;
  self_harm?: ThresholdGuardrail;
  self_harm_intent?: ThresholdGuardrail;
  sexual_minors?: ThresholdGuardrail;
};
