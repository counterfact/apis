import type { Position_Input } from "./Position-Input.js";
import type { ConversationalConfigAPIModelWorkflowOverride_Input } from "./ConversationalConfigAPIModelWorkflowOverride-Input.js";
import type { KnowledgeBaseLocator } from "./KnowledgeBaseLocator.js";
import type { EntryBehavior } from "./EntryBehavior.js";
export type WorkflowOverrideAgentNodeModel_Input = {
  /**
   * @default "override_agent"
   */
  type?: "override_agent";
  /**
   * Position of the node in the workflow.
   */
  position?: Position_Input;
  /**
   * The ids of outgoing edges in the order they should be evaluated.
   */
  edge_order?: Array<string>;
  /**
   * Configuration overrides applied while the subagent is conducting the conversation.
   */
  conversation_config?: ConversationalConfigAPIModelWorkflowOverride_Input;
  /**
   * Specific goal for this subagent. It will be added to the system prompt and can be used to further refine the agent's behavior in this specific context.
   */
  additional_prompt?: string;
  /**
   * Additional knowledge base documents that the subagent has access to. These will be used in addition to the main agent's documents.
   */
  additional_knowledge_base?: Array<KnowledgeBaseLocator>;
  /**
   * IDs of additional tools that the subagent has access to. These will be used in addition to the main agent's tools.
   */
  additional_tool_ids?: Array<string>;
  /**
   * Human-readable label for the node used throughout the UI.
   */
  label: string;
  /**
   * Dictates whether this node should immediately generate a response upon entry or wait for the user input. When set to "auto", the behavior will be decided based on the type of the preceding node: "wait_for_user" after the "say" and "start" nodes and "generate_immediately" otherwise.
   * @default "auto"
   */
  entry_behavior?: EntryBehavior;
};
