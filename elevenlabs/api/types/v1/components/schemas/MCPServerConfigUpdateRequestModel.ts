import type { MCPApprovalPolicy } from "./MCPApprovalPolicy.js";
import type { PreToolSpeechMode } from "./PreToolSpeechMode.js";
import type { ToolInterruptionMode } from "./ToolInterruptionMode.js";
import type { ToolCallSoundType } from "./ToolCallSoundType.js";
import type { ToolCallSoundBehavior } from "./ToolCallSoundBehavior.js";
import type { ToolExecutionMode } from "./ToolExecutionMode.js";
import type { ConvAISecretLocator } from "./ConvAISecretLocator.js";
import type { ConvAIDynamicVariable } from "./ConvAIDynamicVariable.js";
import type { ConvAIEnvVarLocator } from "./ConvAIEnvVarLocator.js";
import type { AuthConnectionLocator } from "./AuthConnectionLocator.js";
import type { EnvironmentAuthConnectionLocator } from "./EnvironmentAuthConnectionLocator.js";
/**
 * Unified request model for updating MCP Server configuration.
 */
export type MCPServerConfigUpdateRequestModel = {
  /**
   * The approval mode to set for the MCP server
   */
  approval_policy?: MCPApprovalPolicy | null;
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
   * Predefined tool call sound type to play during tool execution for all tools from this MCP server
   */
  tool_call_sound?: ToolCallSoundType | null;
  /**
   * Determines when the tool call sound should play for all tools from this MCP server
   */
  tool_call_sound_behavior?: ToolCallSoundBehavior | null;
  /**
   * If set, overrides the server's execution_mode setting for this tool
   */
  execution_mode?: ToolExecutionMode | null;
  /**
   * The maximum time in seconds to wait for each MCP tool call to complete.
   */
  response_timeout_secs?: number | null;
  /**
   * The headers to include in requests to the MCP server
   */
  request_headers?: {
    [key: string]:
      | string
      | ConvAISecretLocator
      | ConvAIDynamicVariable
      | ConvAIEnvVarLocator;
  } | null;
  /**
   * Entries sent in the MCP `_meta` field of tools/call requests. Values may be JSON scalars, or references to a workspace secret, dynamic variable, or environment variable resolved per call.
   */
  request_meta?: {
    [key: string]:
      | string
      | number
      | number
      | boolean
      | ConvAISecretLocator
      | ConvAIDynamicVariable
      | ConvAIEnvVarLocator;
  } | null;
  /**
   * Whether to disable HTTP compression for this MCP server
   */
  disable_compression?: boolean | null;
  /**
   * Optional secret token for authentication with this MCP server
   */
  secret_token?: ConvAISecretLocator | null;
  /**
   * Optional auth connection to use for authentication with this MCP server
   */
  auth_connection?:
    AuthConnectionLocator | EnvironmentAuthConnectionLocator | null;
};
