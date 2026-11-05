import type { AgentSummaryResponseModel } from "./AgentSummaryResponseModel.js";
/**
 * @example {"agents":[{"access_info":{"creator_email":"john@example.com","creator_name":"John Doe","is_creator":true,"role":"admin"},"agent_id":"J3Pbu5gP6NNKBscdCdwB","archived":false,"created_at_unix_secs":1716153600,"name":"My Agent","tags":["Customer Support","Technical Help","Eleven"],"updated_at_unix_secs":1716240000,"voice_id":"UCaNsl8F6Xh4GALkVMLS"}],"has_more":false,"next_cursor":"123"}
 */
export type GetAgentsPageResponseModel = {
  /**
   * A list of agents and their metadata
   */
  agents: Array<AgentSummaryResponseModel>;
  /**
   * The next cursor to paginate through the agents
   */
  next_cursor?: string | null;
  /**
   * Whether there are more agents to paginate through
   */
  has_more: boolean;
};
