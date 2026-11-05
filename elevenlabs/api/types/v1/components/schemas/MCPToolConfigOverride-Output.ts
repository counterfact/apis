import type { PreToolSpeechMode } from "./PreToolSpeechMode.js";
import type { ToolInterruptionMode } from "./ToolInterruptionMode.js";
import type { ToolCallSoundType } from "./ToolCallSoundType.js";
import type { ToolCallSoundBehavior } from "./ToolCallSoundBehavior.js";
import type { ToolExecutionMode } from "./ToolExecutionMode.js";
import type { DynamicVariableAssignment } from "./DynamicVariableAssignment.js";
import type { ConstantSchemaOverride } from "./ConstantSchemaOverride.js";
import type { DynamicVariableSchemaOverride } from "./DynamicVariableSchemaOverride.js";
import type { LLMSchemaOverride } from "./LLMSchemaOverride.js";
import type { OmitSchemaOverride } from "./OmitSchemaOverride.js";
import type { ToolResponseMockConfig_Output } from "./ToolResponseMockConfig-Output.js";
export type MCPToolConfigOverride_Output = {
  /**
   * The name of the MCP tool
   */
  tool_name: string;
  /**
   * DEPRECATED: use `pre_tool_speech` instead. If set, overrides the server's force_pre_tool_speech setting for this tool.
   * @deprecated
   */
  force_pre_tool_speech?: boolean | null;
  /**
   * If set, overrides the server's pre_tool_speech setting for this tool.
   */
  pre_tool_speech?: PreToolSpeechMode | null;
  /**
   * DEPRECATED: use `interruption_mode` instead. If set, overrides the server's disable_interruptions setting for this tool.
   * @deprecated
   */
  disable_interruptions?: boolean | null;
  /**
   * If set, overrides the server's interruption_mode setting for this tool.
   */
  interruption_mode?: ToolInterruptionMode | null;
  /**
   * Overrides the server's tool_call_sound setting for this tool. A sound name plays that sound; 'off' overrides to no sound (silence); null means do not override (inherit the server default).
   */
  tool_call_sound?: ToolCallSoundType | "off" | null;
  /**
   * If set, overrides the server's tool_call_sound_behavior setting for this tool
   */
  tool_call_sound_behavior?: ToolCallSoundBehavior | null;
  /**
   * If set, overrides the server's execution_mode setting for this tool
   */
  execution_mode?: ToolExecutionMode | null;
  /**
   * If set, overrides the server's response timeout for this MCP tool (seconds).
   */
  response_timeout_secs?: number | null;
  /**
   * Dynamic variable assignments for this MCP tool
   */
  assignments?: Array<DynamicVariableAssignment>;
  /**
   * Mapping of json path to input override configuration
   */
  input_overrides?: {
    [key: string]:
      | (ConstantSchemaOverride & { source: "constant" })
      | (DynamicVariableSchemaOverride & { source: "dynamic_variable" })
      | (LLMSchemaOverride & { source: "llm" })
      | (OmitSchemaOverride & { source: "omit" });
  } | null;
  /**
   * Mock responses with optional parameter conditions. Evaluated top-to-bottom; first match wins.
   */
  response_mocks?: Array<ToolResponseMockConfig_Output> | null;
};
