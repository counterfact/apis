import type { ToolInterruptionMode } from "./ToolInterruptionMode.js";
import type { PreToolSpeechMode } from "./PreToolSpeechMode.js";
import type { DynamicVariableAssignment } from "./DynamicVariableAssignment.js";
import type { ToolCallSoundType } from "./ToolCallSoundType.js";
import type { ToolCallSoundBehavior } from "./ToolCallSoundBehavior.js";
import type { ToolErrorHandlingMode } from "./ToolErrorHandlingMode.js";
import type { IntegrationType } from "./IntegrationType.js";
import type { ObjectJsonSchemaProperty_Output } from "./ObjectJsonSchemaProperty-Output.js";
import type { MCPApprovalPolicy } from "./MCPApprovalPolicy.js";
import type { ToolExecutionMode } from "./ToolExecutionMode.js";
import type { ConstantSchemaOverride } from "./ConstantSchemaOverride.js";
import type { DynamicVariableSchemaOverride } from "./DynamicVariableSchemaOverride.js";
import type { LLMSchemaOverride } from "./LLMSchemaOverride.js";
import type { OmitSchemaOverride } from "./OmitSchemaOverride.js";
/**
 * An MCP tool configuration that can be used to call MCP servers
 */
export type MCPToolConfig_Output = {
  /**
   * @default "mcp"
   */
  type?: "mcp";
  name: string;
  /**
   * Description of when the tool should be used and what it does.
   */
  description: string;
  /**
   * The maximum time in seconds to wait for the MCP tool call to complete. Must be between 5 and 300 seconds (inclusive).
   * @default 30
   */
  response_timeout_secs?: number;
  /**
   * DEPRECATED: use `interruption_mode` instead. If true, the user will not be able to interrupt the agent while this tool is running.
   * @default false
   * @deprecated
   */
  disable_interruptions?: boolean;
  /**
   * Controls whether the user can interrupt the agent around this tool call. 'allow' (default) lets the user interrupt at any time, 'disable_during_tool' suppresses interruptions only while the tool is running, 'disable_during_tool_and_turn' suppresses interruptions while the tool runs and for the agent response that follows it.
   * @default "allow"
   */
  interruption_mode?: ToolInterruptionMode;
  /**
   * DEPRECATED: use `pre_tool_speech` instead. If true, the agent will speak before the tool call.
   * @default false
   * @deprecated
   */
  force_pre_tool_speech?: boolean;
  /**
   * Controls whether the agent speaks before this tool is called. 'auto' (default) decides based on recent tool latency, 'force' always asks the agent to speak, 'off' fully opts out regardless of latency.
   * @default "auto"
   */
  pre_tool_speech?: PreToolSpeechMode;
  /**
   * Configuration for extracting values from tool responses and assigning them to dynamic variables
   */
  assignments?: Array<DynamicVariableAssignment>;
  /**
   * Predefined tool call sound type to play during tool execution. If not specified, no tool call sound will be played.
   */
  tool_call_sound?: ToolCallSoundType | null;
  /**
   * Determines when the tool call sound should play. 'auto' only plays when there's pre-tool speech, 'always' plays for every tool call.
   * @default "auto"
   */
  tool_call_sound_behavior?: ToolCallSoundBehavior;
  /**
   * Controls how tool errors are processed before being shared with the agent. 'auto' determines handling based on tool type (summarized for native integrations, hide for others), 'summarized' sends an LLM-generated summary, 'passthrough' sends the raw error, 'hide' does not share the error with the agent.
   * @default "auto"
   */
  tool_error_handling_mode?: ToolErrorHandlingMode;
  /**
   * The type of MCP tool
   */
  integration_type: IntegrationType;
  /**
   * Schema for any parameters the LLM needs to provide to the MCP tool.
   */
  parameters?: ObjectJsonSchemaProperty_Output | null;
  /**
   * The approval policy for the MCP tool
   * @default "require_approval_all"
   */
  approval_policy?: MCPApprovalPolicy;
  /**
   * The name of the MCP tool to call
   */
  mcp_tool_name: string;
  /**
   * The description of the MCP tool to call
   */
  mcp_tool_description: string;
  /**
   * The id of the MCP server to call
   */
  mcp_server_id: string;
  /**
   * The name of the MCP server to call
   */
  mcp_server_name: string;
  /**
   * Original inputSchema dict for consistent hashing
   */
  mcp_input_schema?: { [key: string]: unknown } | null;
  /**
   * Determines when and how the tool executes: 'immediate' executes the tool right away when requested by the LLM, 'post_tool_speech' waits for the agent to finish speaking before executing, 'async' runs the tool in the background without blocking - best for long-running operations.
   * @default "immediate"
   */
  execution_mode?: ToolExecutionMode;
  /**
   * Input parameter overrides for this tool
   */
  input_overrides?: {
    [key: string]:
      | (ConstantSchemaOverride & { source: "constant" })
      | (DynamicVariableSchemaOverride & { source: "dynamic_variable" })
      | (LLMSchemaOverride & { source: "llm" })
      | (OmitSchemaOverride & { source: "omit" });
  } | null;
};
