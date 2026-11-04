import type { SMBAgentType } from "./SMBAgentType.js";
/**
 * Identifies an agent as part of the SMB product.
 */
export type AgentSMBMetadata = {
  /**
   * Distinguishes between the customer-facing voice agent and the internal assistant agent.
   */
  agent_type: SMBAgentType;
  /**
   * True for pre-signup onboarding agents that have not yet been transferred to a user workspace.
   * @default false
   */
  is_ephemeral?: boolean;
  /**
   * Hash of the SMB data+code inputs this agent was last regenerated against; the conversation-start drift gate. None (unstamped) regenerates once on the next conversation.
   */
  source_fingerprint?: string | null;
};
