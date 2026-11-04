import type { LLM } from "./LLM.js";
import type { LLMReasoningEffort } from "./LLMReasoningEffort.js";
import type { LLMServiceTier } from "./LLMServiceTier.js";
import type { BuiltInToolsWorkflowOverride_Output } from "./BuiltInToolsWorkflowOverride-Output.js";
import type { KnowledgeBaseLocator } from "./KnowledgeBaseLocator.js";
import type { CustomLLM } from "./CustomLLM.js";
import type { RagConfigWorkflowOverride_Output } from "./RagConfigWorkflowOverride-Output.js";
import type { BackupLLMDefault } from "./BackupLLMDefault.js";
import type { BackupLLMDisabled } from "./BackupLLMDisabled.js";
import type { BackupLLMOverride } from "./BackupLLMOverride.js";
import type { WebhookToolConfig_Output } from "./WebhookToolConfig-Output.js";
import type { ClientToolConfig_Output } from "./ClientToolConfig-Output.js";
import type { SystemToolConfig_Output } from "./SystemToolConfig-Output.js";
import type { MCPToolConfig_Output } from "./MCPToolConfig-Output.js";
import type { ApiIntegrationWebhookToolConfig_Output } from "./ApiIntegrationWebhookToolConfig-Output.js";
import type { SMBToolConfig } from "./SMBToolConfig.js";
/**
 * @example {"knowledge_base":[],"llm":"gemini-2.0-flash-001","max_tokens":-1,"prompt":"You are a helpful assistant that can answer questions about the topic of the conversation.","temperature":0,"tool_ids":[],"tools":[]}
 */
export type PromptAgentAPIModelWorkflowOverride_Output = {
  /**
   * The prompt for the agent
   */
  prompt?: string | null;
  /**
   * The LLM to query with the prompt and the chat history. If using data residency, the LLM must be supported in the data residency environment
   */
  llm?: LLM | null;
  /**
   * Reasoning effort of the model. Only available for some models.
   */
  reasoning_effort?: LLMReasoningEffort | null;
  /**
   * Service tier of the model, trading a per-token price premium for higher token throughput. Only available for some models.
   */
  service_tier?: LLMServiceTier | null;
  /**
   * Max number of tokens used for thinking. Use 0 to turn off if supported by the model.
   */
  thinking_budget?: number | null;
  /**
   * Enable model reasoning summaries. When disabled, we do not request summaries from provider if possible for faster TTFB. Not ZRM compatible.
   */
  enable_reasoning_summary?: boolean | null;
  /**
   * The temperature for the LLM. Defaults to 0. Set to null to omit the parameter from the LLM request entirely (useful for custom LLMs that reject the temperature field).
   */
  temperature?: number | null;
  /**
   * If greater than 0, maximum number of tokens the LLM can predict
   */
  max_tokens?: number | null;
  /**
   * A list of IDs of tools used by the agent
   */
  tool_ids?: Array<string> | null;
  /**
   * Only applies as a conversation override, allowed whenever tool_ids may be overridden. When true, the overridden tool_ids is the full list of tools allowed in the conversation, including tools on workflow nodes. Ignored when set on the agent.
   */
  tool_ids_strict?: boolean | null;
  /**
   * Built-in system tools to be used by the agent
   */
  built_in_tools?: BuiltInToolsWorkflowOverride_Output | null;
  /**
   * Enable parallel tool calling. When enabled, the agent can execute multiple tools in parallel within a single turn. Not supported by all models.
   */
  enable_parallel_tool_calls?: boolean | null;
  /**
   * A list of MCP server ids to be used by the agent
   */
  mcp_server_ids?: Array<string> | null;
  /**
   * A list of Native MCP server ids to be used by the agent
   */
  native_mcp_server_ids?: Array<string> | null;
  /**
   * A list of knowledge bases to be used by the agent
   */
  knowledge_base?: Array<KnowledgeBaseLocator> | null;
  /**
   * Definition for a custom LLM if LLM field is set to 'CUSTOM_LLM'
   */
  custom_llm?: CustomLLM | null;
  /**
   * Whether to remove the default personality lines from the system prompt
   */
  ignore_default_personality?: boolean | null;
  /**
   * Configuration for RAG
   */
  rag?: RagConfigWorkflowOverride_Output | null;
  /**
   * Timezone for displaying current time in system prompt. If set, the current time will be included in the system prompt using this timezone. Must be a valid timezone name (e.g., 'America/New_York', 'Europe/London', 'UTC'). Recommended for accurate time-aware responses; without this, the agent has no knowledge of the current date/time unless you provide it via dynamic variables or tools, which can lead to incorrect or hallucinated time references.
   */
  timezone?: string | null;
  /**
   * Configuration for backup LLM cascading. Can be disabled, use system defaults, or specify custom order.
   */
  backup_llm_config?:
    BackupLLMDefault | BackupLLMDisabled | BackupLLMOverride | null;
  /**
   * Time in seconds before cascading to backup LLM. Must be between 2 and 15 seconds.
   */
  cascade_timeout_seconds?: number | null;
  /**
   * A list of tools that the agent can use over the course of the conversation, use tool_ids instead
   */
  tools?: Array<
    | (WebhookToolConfig_Output & { type: "webhook" })
    | (ClientToolConfig_Output & { type: "client" })
    | (SystemToolConfig_Output & { type: "system" })
    | (MCPToolConfig_Output & { type: "mcp" })
    | (ApiIntegrationWebhookToolConfig_Output & {
        type: "api_integration_webhook";
      })
    | (SMBToolConfig & { type: "smb" })
  > | null;
};
