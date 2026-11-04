/**
 * An agent (and optional branch) that participated in the call, in first-seen transcript order.
 */
export type VisitedAgentRef = { agent_id: string; branch_id?: string | null };
