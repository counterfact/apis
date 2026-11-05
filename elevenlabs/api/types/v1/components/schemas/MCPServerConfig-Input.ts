import type { MCPApprovalPolicy } from "./MCPApprovalPolicy.js";
import type { MCPToolApprovalHash } from "./MCPToolApprovalHash.js";
import type { MCPServerTransport } from "./MCPServerTransport.js";
import type { ConvAISecretLocator } from "./ConvAISecretLocator.js";
import type { ConvAIUserSecretDBModel } from "./ConvAIUserSecretDBModel.js";
import type { ConvAIDynamicVariable } from "./ConvAIDynamicVariable.js";
import type { ConvAIEnvVarLocator } from "./ConvAIEnvVarLocator.js";
import type { AuthConnectionLocator } from "./AuthConnectionLocator.js";
import type { EnvironmentAuthConnectionLocator } from "./EnvironmentAuthConnectionLocator.js";
import type { PreToolSpeechMode } from "./PreToolSpeechMode.js";
import type { ToolInterruptionMode } from "./ToolInterruptionMode.js";
import type { ToolCallSoundType } from "./ToolCallSoundType.js";
import type { ToolCallSoundBehavior } from "./ToolCallSoundBehavior.js";
import type { ToolExecutionMode } from "./ToolExecutionMode.js";
import type { MCPToolConfigOverride_Input } from "./MCPToolConfigOverride-Input.js";
export type MCPServerConfig_Input = {
  /**
   * @default "require_approval_all"
   */
  approval_policy?: MCPApprovalPolicy;
  /**
   * List of tool approval hashes for per-tool approval when approval_policy is REQUIRE_APPROVAL_PER_TOOL
   */
  tool_approval_hashes?: Array<MCPToolApprovalHash>;
  /**
   * The transport type used to connect to the MCP server
   * @default "SSE"
   */
  transport?: MCPServerTransport;
  /**
   * The URL of the MCP server, if this contains a secret please store as a workspace secret, otherwise store as a plain string. Must use https
   */
  url: string | ConvAISecretLocator;
  /**
   * The secret token (Authorization header) stored as a workspace secret or in-place secret
   */
  secret_token?: ConvAISecretLocator | ConvAIUserSecretDBModel | null;
  /**
   * The headers included in the request
   */
  request_headers?: {
    [key: string]:
      | string
      | ConvAISecretLocator
      | ConvAIDynamicVariable
      | ConvAIEnvVarLocator;
  };
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
  };
  /**
   * Optional auth connection to use for authentication with this MCP server
   */
  auth_connection?:
    AuthConnectionLocator | EnvironmentAuthConnectionLocator | null;
  name: string;
  /**
   * @default ""
   */
  description?: string;
  /**
   * DEPRECATED: use `pre_tool_speech` instead. If true, all tools from this MCP server will require pre-tool execution speech.
   * @default false
   * @deprecated
   */
  force_pre_tool_speech?: boolean;
  /**
   * Controls whether the agent speaks before this tool is called. 'auto' (default) decides based on recent tool latency, 'force' always asks the agent to speak, 'off' fully opts out regardless of latency. Applies to every tool from this MCP server unless overridden per tool.
   * @default "auto"
   */
  pre_tool_speech?: PreToolSpeechMode;
  /**
   * DEPRECATED: use `interruption_mode` instead. If true, the user will not be able to interrupt the agent while any tool from this MCP server is running.
   * @default false
   * @deprecated
   */
  disable_interruptions?: boolean;
  /**
   * Controls whether the user can interrupt the agent around this tool call. 'allow' (default) lets the user interrupt at any time, 'disable_during_tool' suppresses interruptions only while the tool is running, 'disable_during_tool_and_turn' suppresses interruptions while the tool runs and for the agent response that follows it. Applies to every tool from this MCP server unless overridden per tool.
   * @default "allow"
   */
  interruption_mode?: ToolInterruptionMode;
  /**
   * Predefined tool call sound type to play during tool execution for all tools from this MCP server
   */
  tool_call_sound?: ToolCallSoundType | null;
  /**
   * Determines when the tool call sound should play for all tools from this MCP server
   * @default "auto"
   */
  tool_call_sound_behavior?: ToolCallSoundBehavior;
  /**
   * Determines when and how all tools from this MCP server execute: 'immediate' executes the tool right away when requested by the LLM, 'post_tool_speech' waits for the agent to finish speaking before executing, 'async' runs the tool in the background without blocking - best for long-running operations.
   * @default "immediate"
   */
  execution_mode?: ToolExecutionMode;
  /**
   * The maximum time in seconds to wait for each MCP tool call to complete. Must be between 5 and 300 seconds (inclusive).
   * @default 30
   */
  response_timeout_secs?: number;
  /**
   * List of per-tool configuration overrides that override the server-level defaults for specific tools
   */
  tool_config_overrides?: Array<MCPToolConfigOverride_Input>;
  /**
   * Whether to disable HTTP compression for this MCP server. Enable this if the server does not support compressed responses.
   * @default false
   */
  disable_compression?: boolean;
};
