import type { ContentThresholdGuardrail } from "./ContentThresholdGuardrail.js";
export type ContentConfig = {
  sexual?: ContentThresholdGuardrail;
  violence?: ContentThresholdGuardrail;
  harassment?: ContentThresholdGuardrail;
  self_harm?: ContentThresholdGuardrail;
  profanity?: ContentThresholdGuardrail;
  religion_or_politics?: ContentThresholdGuardrail;
  medical_and_legal_information?: ContentThresholdGuardrail;
};
