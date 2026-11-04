import type { TurnDetectionType } from "./TurnDetectionType.js";
import type { Eagerness } from "./Eagerness.js";
export type OpenAITurnDetection = {
  /**
   * @default "semantic_vad"
   */
  type?: TurnDetectionType;
  /**
   * @default "medium"
   */
  eagerness?: Eagerness;
  /**
   * @default true
   */
  create_response?: boolean;
  /**
   * @default true
   */
  interrupt_response?: boolean;
  threshold?: number | null;
  prefix_padding_ms?: number | null;
  silence_duration_ms?: number | null;
  /**
   * @default -1
   */
  turn_timeout?: number;
};
