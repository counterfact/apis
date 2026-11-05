import type { RealtimeModel } from "./RealtimeModel.js";
import type { OpenAIAudioConfig_Input } from "./OpenAIAudioConfig-Input.js";
import type { OpenAIFunctionTool } from "./OpenAIFunctionTool.js";
import type { OpenAIMCPTool } from "./OpenAIMCPTool.js";
import type { OpenAIToolChoiceFunction } from "./OpenAIToolChoiceFunction.js";
import type { OpenAITurnDetection } from "./OpenAITurnDetection.js";
import type { OpenAITracingConfiguration } from "./OpenAITracingConfiguration.js";
export type OpenAISessionConfig_Input = {
  /**
   * @default "realtime"
   */
  type?: "realtime";
  /**
   * @default "eleven_realtime_v1_mini"
   */
  model?: RealtimeModel;
  /**
   * @default ""
   */
  instructions?: string;
  output_modalities?: Array<string>;
  audio?: OpenAIAudioConfig_Input;
  tools?: Array<
    | (OpenAIFunctionTool & { type: "function" })
    | (OpenAIMCPTool & { type: "mcp" })
  >;
  /**
   * @default "auto"
   */
  tool_choice?: string | OpenAIToolChoiceFunction;
  /**
   * @default 0.7
   */
  temperature?: number;
  /**
   * @default 4096
   */
  max_response_output_tokens?: number | "inf";
  /**
   * Maximum wall-clock duration of the session in seconds. The session is closed with code 1000 once it is exceeded.
   * @default 600
   */
  max_duration_seconds?: number;
  /**
   * @default "__unset__"
   */
  turn_detection?: OpenAITurnDetection | string | null;
  tracing?: ("auto" | OpenAITracingConfiguration) | null;
  include?: Array<string> | null;
  parallel_tool_calls?: boolean | null;
  reasoning?: { [key: string]: unknown } | null;
  truncation?: string | { [key: string]: unknown } | null;
  prompt?: { [key: string]: unknown } | null;
};
