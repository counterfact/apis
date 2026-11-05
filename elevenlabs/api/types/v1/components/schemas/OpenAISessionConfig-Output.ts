import type { RealtimeModel } from "./RealtimeModel.js";
import type { OpenAIAudioConfig_Output } from "./OpenAIAudioConfig-Output.js";
import type { OpenAIFunctionTool } from "./OpenAIFunctionTool.js";
import type { OpenAIMCPTool } from "./OpenAIMCPTool.js";
import type { OpenAIToolChoiceFunction } from "./OpenAIToolChoiceFunction.js";
import type { OpenAITracingConfiguration } from "./OpenAITracingConfiguration.js";
export type OpenAISessionConfig_Output = {
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
  audio?: OpenAIAudioConfig_Output;
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
  tracing?: ("auto" | OpenAITracingConfiguration) | null;
};
