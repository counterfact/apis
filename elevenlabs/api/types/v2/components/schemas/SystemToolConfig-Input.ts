import type { ToolInterruptionMode } from "./ToolInterruptionMode.js";
import type { PreToolSpeechMode } from "./PreToolSpeechMode.js";
import type { DynamicVariableAssignment } from "./DynamicVariableAssignment.js";
import type { ToolCallSoundType } from "./ToolCallSoundType.js";
import type { ToolCallSoundBehavior } from "./ToolCallSoundBehavior.js";
import type { ToolErrorHandlingMode } from "./ToolErrorHandlingMode.js";
import type { EndCallToolConfig } from "./EndCallToolConfig.js";
import type { LanguageDetectionToolConfig } from "./LanguageDetectionToolConfig.js";
import type { TransferToAgentToolConfig_Input } from "./TransferToAgentToolConfig-Input.js";
import type { TransferToNumberToolConfig_Input } from "./TransferToNumberToolConfig-Input.js";
import type { SkipTurnToolConfig } from "./SkipTurnToolConfig.js";
import type { PlayDTMFToolConfig } from "./PlayDTMFToolConfig.js";
import type { VoicemailDetectionToolConfig } from "./VoicemailDetectionToolConfig.js";
import type { KnowledgeBaseRagToolConfig } from "./KnowledgeBaseRagToolConfig.js";
import type { KnowledgeBaseToolConfig } from "./KnowledgeBaseToolConfig.js";
import type { StartProcedureToolConfig } from "./StartProcedureToolConfig.js";
import type { EndProcedureToolConfig } from "./EndProcedureToolConfig.js";
/**
 * A system tool is a tool that is used to call a system method in the server
 */
export type SystemToolConfig_Input = {
  /**
   * The type of tool
   * @default "system"
   */
  type?: "system";
  name: string;
  /**
   * Description of when the tool should be used and what it does. Leave empty to use the default description that's optimized for the specific tool type.
   * @default ""
   */
  description?: string;
  /**
   * The maximum time in seconds to wait for the tool call to complete.
   * @default 20
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
  params:
    | (EndCallToolConfig & { system_tool_type: "end_call" })
    | (LanguageDetectionToolConfig & { system_tool_type: "language_detection" })
    | (TransferToAgentToolConfig_Input & {
        system_tool_type: "transfer_to_agent";
      })
    | (TransferToNumberToolConfig_Input & {
        system_tool_type: "transfer_to_number";
      })
    | (SkipTurnToolConfig & { system_tool_type: "skip_turn" })
    | (PlayDTMFToolConfig & { system_tool_type: "play_keypad_touch_tone" })
    | (VoicemailDetectionToolConfig & {
        system_tool_type: "voicemail_detection";
      })
    | (KnowledgeBaseRagToolConfig & { system_tool_type: "knowledge_base_rag" })
    | (KnowledgeBaseToolConfig & { system_tool_type: "knowledge_base" })
    | (StartProcedureToolConfig & { system_tool_type: "start_procedure" })
    | (EndProcedureToolConfig & { system_tool_type: "end_procedure" });
};
