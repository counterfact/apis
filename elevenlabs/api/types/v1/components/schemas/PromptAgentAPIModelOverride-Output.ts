import type { LLM } from "./LLM.js";
import type { KnowledgeBaseLocator } from "./KnowledgeBaseLocator.js";
/**
 * @example {"knowledge_base":[],"llm":"gemini-2.0-flash-001","prompt":"You are a helpful assistant that can answer questions about the topic of the conversation.","tool_ids":[]}
 */
export type PromptAgentAPIModelOverride_Output = {
  /**
   * The prompt for the agent
   */
  prompt?: string | null;
  /**
   * The LLM to query with the prompt and the chat history. If using data residency, the LLM must be supported in the data residency environment
   */
  llm?: LLM | null;
  /**
   * A list of IDs of tools used by the agent
   */
  tool_ids?: Array<string> | null;
  /**
   * Only applies as a conversation override, allowed whenever tool_ids may be overridden. When true, the overridden tool_ids is the full list of tools allowed in the conversation, including tools on workflow nodes. Ignored when set on the agent.
   */
  tool_ids_strict?: boolean | null;
  /**
   * A list of Native MCP server ids to be used by the agent
   */
  native_mcp_server_ids?: Array<string> | null;
  /**
   * A list of knowledge bases to be used by the agent
   */
  knowledge_base?: Array<KnowledgeBaseLocator> | null;
};
